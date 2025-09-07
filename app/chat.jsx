import React, { useState, useRef } from 'react';
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

// Mock messages
const getMockMessages = (profileId) => {
  const commonMessages = {
    '1': [
      { id: '1', text: 'Found your whisper near the library! 📚', sender: 'MysteriousTraveler', timestamp: new Date(Date.now() - 3600000) },
      { id: '2', text: 'Glad you found it! What brought you there?', sender: 'You', timestamp: new Date(Date.now() - 3500000) },
      { id: '3', text: 'Just looking for a quiet place to read. Your note made me smile :)', sender: 'MysteriousTraveler', timestamp: new Date(Date.now() - 3400000) },
    ],
    '2': [
      { id: '1', text: 'The park whisper was beautiful today 🌸', sender: 'SilentDreamer', timestamp: new Date(Date.now() - 7200000) },
      { id: '2', text: 'Nature inspires me too!', sender: 'You', timestamp: new Date(Date.now() - 7100000) },
    ]
  };
  return commonMessages[profileId] || [];
};

export default function ChatScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { profileId, profileName } = params;
  const [messages, setMessages] = useState(getMockMessages(profileId));
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const turnCount = countFullTurns(messages);

  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'You',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    setTimeout(() => {
      const replies = [
        'Interesting thought! 🤔',
        'I feel the same way sometimes.',
        'What made you think of that?',
      ];
      const replyMsg = {
        id: (Date.now() + 1).toString(),
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: profileName,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1000 + Math.random() * 1000);
  };

  const goToProgressPage = () => {
    router.push({
      pathname: '/progress',
      params: {
        profileId,
        profileName,
        messageCount: turnCount
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

  function countFullTurns(messages) {
    let turns = 0;
    // Iterate through messages and count pairs of alternating senders
    for (let i = 1; i < messages.length; i++) {
      const prevSender = messages[i - 1].sender;
      const currSender = messages[i].sender;
      if (prevSender !== currSender) {
        turns++;
        i++; // skip next message because it's counted with this pair
      }
    }
    return turns;
  }


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header with Progress Button */}
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
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onLayout={() => flatListRef.current?.scrollToEnd()}
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  backText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  progressButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  progressButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingTop: 10,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  currentUserContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.7,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.6,
  },
  inputContainer: {
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
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
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});