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

  const currentUid = auth.currentUser?.uid; // logged-in user UID
  const chatId = makeChatId(currentUid, profileId);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // --- Load messages from Firestore ---
  useEffect(() => {
  let unsubMessages = null;

  const unsubAuth = onAuthStateChanged(auth, (user) => {
    // If user logs out, stop everything
    if (!user || !profileId) {
      setMessages([]);
      if (unsubMessages) {
        unsubMessages(); // stop Firestore listener
        unsubMessages = null;
      }
      return;
    }

    // Build chatId only if logged in
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

      // Ensure chat doc exists
     // Ensure chat doc exists (initialize only participants + createdAt)
// ❌ removed lastMessage + lastUpdated + messageCounts to avoid reset
  await setDoc(chatRef, {
    participants: [currentUid, profileId].sort(),
    createdAt: serverTimestamp(),
  }, { merge: true });

  // Add message to messages subcollection
  await addDoc(messagesRef, {
    senderId: currentUid,
    text,
    createdAt: serverTimestamp(),
    participants: [currentUid, profileId].sort(),
  });

  // Update last message + increment only sender's message count
  await updateDoc(chatRef, {
    lastMessage: text,
    lastUpdated: serverTimestamp(),
    [`messageCounts.${currentUid}`]: increment(1),
  });


    } catch (err) {
      console.error('sendMessage error', err);
    }
  };

  // --- Go to progress page with messageCounts info ---
  const goToProgressPage = () => {
    router.push({
      pathname: '/progress',
      params: {
        profileId,
        profileName,
        chatId,
        userId:currentUid
        // we don’t have turns here; progress page should read messageCounts from Firestore
      }
    });
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      })
    ]).start(() => {
      goToProgressPage();
    });
  };

  // --- Render each message bubble ---
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender === 'You';
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer
      ]}>
        {!isCurrentUser && (
          <Text style={[styles.senderName, { color: theme.c4 }]}>
            {item.sender}
          </Text>
        )}
        <View style={[
          styles.messageBubble,
          { 
            backgroundColor: isCurrentUser ? theme.primary : theme.c5,
            borderColor: theme.c6
          }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isCurrentUser ? '#FFFFFF' : theme.text }
          ]}>
            {item.text}
          </Text>
        </View>
        <Text style={[styles.timestamp, { color: theme.c3 }]}>
          {item.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.c1 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.primary }]}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>{profileName}</Text>
          <Text style={[styles.headerSubtitle, { color: theme.c3 }]}>Anonymous Connection</Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity 
            style={[styles.progressButton, { backgroundColor: theme.primary }]}
            onPress={animateButton}
          >
            <Text style={styles.progressButtonText}>Progress</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={[
          styles.messagesContent,
          { paddingBottom: Platform.OS === 'android' ? 100 : 80 }
        ]}
      />

      {/* Message Input */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 100}
        style={[
          styles.inputContainer, 
          { 
            backgroundColor: theme.c1,
            paddingBottom: Platform.OS === 'android' ? 25 : 0
          }
        ]}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.textInput, 
              { 
                backgroundColor: theme.c2, 
                color: theme.text,
                borderColor: theme.c6
              }
            ]}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type your anonymous message..."
            placeholderTextColor={theme.c3}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { backgroundColor: newMessage.trim() ? theme.primary : theme.c4 }
            ]} 
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
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: { marginRight: 16, padding: 4 },
  backText: { fontSize: 24, fontWeight: 'bold' },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '600', marginBottom: 2 },
  headerSubtitle: { fontSize: 12, opacity: 0.8 },
  progressButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginLeft: 10 },
  progressButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },
  messagesList: { flex: 1 },
  messagesContent: { padding: 16, paddingTop: 10 },
  messageContainer: { marginBottom: 16, maxWidth: '80%' },
  currentUserContainer: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  otherUserContainer: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  senderName: { fontSize: 12, marginBottom: 4, opacity: 0.7 },
  messageBubble: { padding: 12, borderRadius: 20, borderWidth: 1 },
  messageText: { fontSize: 16 },
  timestamp: { fontSize: 10, marginTop: 4, opacity: 0.6 },
  inputContainer: { paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  sendButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});
