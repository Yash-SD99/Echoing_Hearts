import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../utils/themeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db, auth } from '../utils/firebaseConfig';

const WhisperDetail = () => {
  const { theme } = useTheme();
  const params = useLocalSearchParams();

  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);

  const likeIcon = require('../assets/likes.png');
  const dislikeIcon = require('../assets/dislikes.png');

  // Load the current likes/dislikes from Firestore
  useEffect(() => {
    async function fetchData() {
      if (!params.id || !params.parentId) return;
      const wDocRef = doc(db, 'whispers', params.parentId, 'w', params.id);
      const docSnap = await getDoc(wDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLikes(data.likes || []);
        setDislikes(data.dislikes || []);
      }
    }
    fetchData();
  }, [params.id, params.parentId]);

  const handleReaction = async (type) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return Alert.alert("Login required to react");

    const wDocRef = doc(db, 'whispers', params.parentId, 'w', params.id);

    if (type === 'like') {
      if (!likes.includes(userId)) {
        await updateDoc(wDocRef, {
          likes: arrayUnion(userId),
          dislikes: arrayRemove(userId),
        });
        setLikes(prev => [...prev, userId]);
        setDislikes(prev => prev.filter(id => id !== userId));
      }
    } else if (type === 'dislike') {
      if (!dislikes.includes(userId)) {
        await updateDoc(wDocRef, {
          dislikes: arrayUnion(userId),
          likes: arrayRemove(userId),
        });
        setDislikes(prev => [...prev, userId]);
        setLikes(prev => prev.filter(id => id !== userId));
      }
    }
  };

  const startChat = () => {
    if (!params.uid) {
      Alert.alert("Please login to Chat");
      return;
    }
    router.push({
      pathname: '/chat',
      params: {
        profileId: params.uid,
        profileName: params.username || 'Anonymous',
      },
    });
  };

  return (
    <SafeAreaView style={[styles.outerContainer, { backgroundColor: theme.c1 }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{params.title}</Text>
        <Text style={styles.message}>{params.message}</Text>
        <Image source={require('../assets/images/globe.png')} style={styles.image} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.c2 }]}>
        <TouchableOpacity style={[styles.button, styles.chatButton]} onPress={startChat}>
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>

        <View style={styles.likeDislikeButtons}>
          <TouchableOpacity style={styles.reactionButton} onPress={() => handleReaction('like')}>
            <Image source={likeIcon} style={styles.footerIcon} />
            <Text>{likes.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactionButton} onPress={() => handleReaction('dislike')}>
            <Image source={dislikeIcon} style={styles.footerIcon} />
            <Text>{dislikes.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WhisperDetail;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  reactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 20,
  },
  reactionButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 10,
  borderRadius: 30, // or 50 if you want
  backgroundColor: '#e0f0ff',
},

  reactionIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  reactionText: {
    fontSize: 18,
    color: '#007aff',
    fontWeight: '600',
  },

  footer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  chatButton: {
    backgroundColor: '#007aff',
    flex: 1,
    marginRight: 10,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  likeDislikeButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    },
    // reactionButton: {
    // padding: 10,
    // borderRadius: 50,
    // backgroundColor: '#e0f0ff',
    // alignItems: 'center',
    // justifyContent: 'center',
    // },
    footerIcon: {
    width: 40,
    height: 40,
    },

  footerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});