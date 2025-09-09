import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Animated,
  Easing
} from 'react-native';
import { useTheme } from '../utils/themeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  doc, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';
import { auth, db } from '../utils/firebaseConfig';

// --- helper to make stable chatId ---
const makeChatId = (uid1, uid2) => [uid1, uid2].sort().join('_');

export default function ChatScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { profileId, profileName } = params;

  const currentUid = auth.currentUser?.uid; 
  const chatId = makeChatId(currentUid, profileId);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // --- Load messages from Firestore ---
  useEffect(() => {
    let unsubMessages = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user || !profileId) {
        setMessages([]);
        if (unsubMessages) {
          unsubMessages();
          unsubMessages = null;
        }
        return;
      }

      const chatId = makeChatId(user.uid, profileId);
      const messagesRef = collection(db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));

      unsubMessages = onSnapshot(q, (snap) => {
        const msgs = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            text: data.text,
            sender: data.senderId === user.uid ? "You" : profileName || data.senderId,
            timestamp: data.createdAt?.toDate?.() || new Date(),
          };
        });
        setMessages(msgs);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      });
    });

    return () => {
      if (unsubMessages) unsubMessages();
      unsubAuth();
    };
  }, [profileId, profileName]);

  // --- Send message ---
  const sendMessage = async () => {
    if (newMessage.trim() === '' || !currentUid || !profileId) return;

    const text = newMessage.trim();
    setNewMessage('');

    try {
      const chatRef = doc(db, 'chats', chatId);
      const messagesRef = collection(db, 'chats', chatId, 'messages');

      await setDoc(chatRef, {
        participants: [currentUid, profileId].sort(),
        createdAt: serverTimestamp(),
      }, { merge: true });

      await addDoc(messagesRef, {
        senderId: currentUid,
        text,
        createdAt: serverTimestamp(),
        participants: [currentUid, profileId].sort(),
      });

      await updateDoc(chatRef, {
        lastMessage: text,
        lastUpdated: serverTimestamp(),
        [`messageCounts.${currentUid}`]: increment(1),
      });
    } catch (err) {
      console.error('sendMessage error', err);
    }
  };

  // --- Progress navigation ---
  const goToProgressPage = () => {
    router.push({
      pathname: '/progress',
      params: { profileId, profileName, chatId, userId: currentUid }
    });
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, easing: Easing.ease, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, easing: Easing.ease, useNativeDriver: true })
    ]).start(() => {
      goToProgressPage();
    });
  };

  // --- Render each message bubble ---
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender === 'You';
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer]}>
        {!isCurrentUser && <Text style={styles.senderName}>{item.sender}</Text>}
        <View style={[
          styles.messageBubble,
          { backgroundColor: isCurrentUser ? '#007AFF' : '#E8E8E8' }
        ]}>
          <Text style={{ color: isCurrentUser ? '#FFF' : '#000' }}>{item.text}</Text>
        </View>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{profileName}</Text>
          <Text style={styles.headerSubtitle}>Anonymous Connection</Text>
        </View>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity style={styles.progressButton} onPress={animateButton}>
            <Text style={styles.progressButtonText}>Progress</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={styles.messagesContent}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your anonymous message..."
            placeholderTextColor="#888"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: newMessage.trim() ? '#007AFF' : '#CCC' }]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Text style={styles.sendButtonText}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE' 
  },
  backButton: { marginRight: 16 },
  backText: { fontSize: 24, fontWeight: 'bold', color: '#007AFF' },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  headerSubtitle: { fontSize: 12, color: '#888' },
  progressButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#007AFF' },
  progressButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  messagesContent: { padding: 16, paddingBottom: 80 },
  messageContainer: { marginBottom: 16, maxWidth: '80%' },
  currentUserContainer: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  otherUserContainer: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  senderName: { fontSize: 12, color: '#888', marginBottom: 4 },
  messageBubble: { padding: 12, borderRadius: 20 },
  timestamp: { fontSize: 10, color: '#888', marginTop: 4 },
  inputContainer: { borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FFF', paddingHorizontal: 10, paddingBottom: Platform.OS === 'android' ? 25 : 6 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center' },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 16,
    backgroundColor: '#F0F0F0',
    color: '#000',
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
