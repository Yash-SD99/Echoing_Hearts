import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../utils/themeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore'; // ← added updateDoc & increment
import { db } from '../../utils/firebaseConfig';

const Whispers = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { latitude, longitude } = params;

  const [whispers, setWhispers] = useState([]);

  // Fetch whispers for this location from Firestore
  useEffect(() => {
    if (!latitude || !longitude) return;

    async function fetchWhispers() {
      try {
        const snapshot = await getDocs(collection(db, 'whispers'));
        let loaded = [];

        for (const docItem of snapshot.docs) {
          const data = docItem.data();
          if (!data?.Location) continue;

          if (parseFloat(data.Location.latitude) === parseFloat(latitude) &&
              parseFloat(data.Location.longitude) === parseFloat(longitude)) {
            
            const wSnap = await getDocs(collection(db, 'whispers', docItem.id, 'w'));
            wSnap.forEach(wDoc => {
              const wData = wDoc.data();
              loaded.push({
                id: wDoc.id,
                parentId: docItem.id, // ← needed to update subcollection
                title: wData.title || 'Untitled',
                lastMessage: wData.text || '',
                username: wData.username || 'Anonymous',
                likes: wData.likes || 0,
                dislikes: wData.dislikes || 0,
                time: wData.createdAt?.toDate?.()?.toLocaleTimeString() || ''
              });
            });
          }
        }

        setWhispers(loaded);
      } catch (err) {
        console.error('Error fetching whispers:', err);
      }
    }

    fetchWhispers();
  }, [latitude, longitude]);

  const openChat = (item) => {
    router.push({
      pathname: '../WhisperDetail',
      params: {
        id: item.id,
        title: item.title,
        message: item.lastMessage,
        likes: item.likes,
        dislikes: item.dislikes,
        username: item.username
      },
    });
  };

  // ← New function: handle like/dislike
  // ----------------------
// Updated handleReaction
// ----------------------
const handleReaction = async (item, type) => {
  const userId = auth.currentUser.uid; // ← NEW: get current user's UID
  const wDocRef = doc(db, 'whispers', item.parentId, 'w', item.id); // ← no change

  if (type === 'like') {
    // ← NEW: only add like if user hasn't liked yet
    if (!item.likes.includes(userId)) {
      await updateDoc(wDocRef, {
        likes: arrayUnion(userId),      // ← NEW: add user to likes array
        dislikes: arrayRemove(userId)   // ← NEW: remove from dislikes if switching
      });

      // ← NEW: update local state with arrays
      setWhispers(prev => prev.map(w => 
        w.id === item.id 
          ? { 
              ...w, 
              likes: [...w.likes, userId], 
              dislikes: w.dislikes.filter(id => id !== userId) 
            } 
          : w
      ));
    }
  } else if (type === 'dislike') {
    // ← NEW: only add dislike if user hasn't disliked yet
    if (!item.dislikes.includes(userId)) {
      await updateDoc(wDocRef, {
        dislikes: arrayUnion(userId),  // ← NEW: add user to dislikes array
        likes: arrayRemove(userId)     // ← NEW: remove from likes if switching
      });

      // ← NEW: update local state with arrays
      setWhispers(prev => prev.map(w => 
        w.id === item.id 
          ? { 
              ...w, 
              dislikes: [...w.dislikes, userId], 
              likes: w.likes.filter(id => id !== userId) 
            } 
          : w
      ));
    }
  }
};


  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.whisperButton} onPress={() => openChat(item)}>
      <Image source={require('../../assets/images/globe.png')} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{item.title} by {item.username}</Text>
        <Text style={styles.message} numberOfLines={1}>{item.lastMessage}</Text>
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          <TouchableOpacity onPress={() => handleReaction(item, 'like')} style={styles.reactionRow}>
            <Image source={require('../../assets/likes.png')} style={styles.reaction} />
            <Text style={styles.reactionText}>{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleReaction(item, 'dislike')} style={[styles.reactionRow, { marginLeft: 16 }]}>
            <Image source={require('../../assets/dislikes.png')} style={styles.reaction} />
            <Text style={styles.reactionText}>{item.dislikes}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[{ flex: 1 }, { backgroundColor: theme.c1 }]}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text>Whispers at this location</Text>
        </View>

        {!latitude || !longitude ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, color: '#555', textAlign: 'center' }}>
              Please select a marker on the map to see whispers.
            </Text>
          </View>
        ) : (
          <FlatList
            data={whispers}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          />
        )}

        <View style={{ height: 80 }} />
      </SafeAreaView>
    </View>
  );
};

export default Whispers;

const styles = StyleSheet.create({
  whisperButton: {
    height: 100,
    width: '100%',
    backgroundColor: '#39bcd3ff',
    borderRadius: 23,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  header: {
    height: 80,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3a6a6ff',
    borderRadius: 16,
    marginBottom: 8,
  },
  container: { flex: 1, justifyContent: 'center', width: '100%', paddingHorizontal: 10 },
  image: { height: 75, width: 75, borderRadius: 75, overflow: 'hidden', marginRight: 10 },
  reactionRow: { flexDirection: 'row', alignItems: 'center' },
  reaction: { height: 20, width: 20, borderRadius: 20 },
  reactionText: { fontSize: 14, color: '#333', marginLeft: 4 },
  content: { flex: 1, marginRight: 10 },
  title: { fontWeight: 'bold', fontSize: 24 },
  message: { fontSize: 18 },
  time: { fontSize: 12, color: '#555' },
});
