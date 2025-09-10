import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, getDoc,updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';

const getUnlockLevel = (count) => {
  if (count >= 100) return 5;
  if (count >= 50) return 4;
  if (count >= 20) return 3;
  if (count >= 5) return 2;
  return 1;
};

const RECT_HEIGHT = 500;

export default function Progress() {
  // const params = useLocalSearchParams();
  const { profileId, chatId, userId } = useLocalSearchParams();
  const router = useRouter();

  const [profileData, setProfileData] = useState(null);
  const [unlockLevel, setUnlockLevel] = useState(1);
  const [effectiveCount, setEffectiveCount] = useState(0);

  // Animated values
  const animations = Array(5)
    .fill(0)
    .map(() => useRef(new Animated.Value(1)).current);

  // Fetch profile data of the person you are chatting with
  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) return;
      try {
        const docRef = doc(db, 'users', profileId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileData(docSnap.data());
        } else {
          console.warn('No user data found for this UID');
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };
    fetchProfile();
  }, [profileId]);

  // Fetch message counts from chat and determine unlock level
  useEffect(() => {
  const fetchMessageCounts = async () => {
    if (!chatId || !userId) return;
    try {
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        console.warn('No chat found for this chatId');
        return;
      }

      const chatData = chatSnap.data();

      // Ensure keys are strings
      const counts = chatData.messageCounts || {};
      const userCount = Number(counts[String(userId)] || 0);
      const otherUserId = Object.keys(counts).find((id) => id !== String(userId));
      const otherUserCount = otherUserId ? Number(counts[String(otherUserId)] || 0) : 0;

      // Only progress when both users reach the required count
      const effectiveCount = Math.min(userCount, otherUserCount);
      setEffectiveCount(effectiveCount);
      const level = getUnlockLevel(effectiveCount);
      setUnlockLevel(level);
      // ✅ Store the unlock level in Firestore
      await updateDoc(chatRef, { level });
    } catch (err) {
      console.error('Error fetching chat message counts:', err);
    }
  };

  fetchMessageCounts();
}, [chatId, userId]);


  // Animate unlocked rectangles
  useEffect(() => {
    animations.forEach((anim, idx) => anim.setValue(idx < unlockLevel ? 0 : 1));
    const animationsToRun = animations
      .map((anim, idx) =>
        idx < unlockLevel
          ? Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true })
          : null
      )
      .filter(Boolean);

    Animated.stagger(200, animationsToRun).start();
  }, [unlockLevel]);

  // Build rectangles dynamically
  const rectangles = [
    {
    title: 'Anonymous Name',
    content: profileData?.displayName || 'Anonymous',
    gender: profileData?.gender || 'Not specified'   //gender specification
  },
  
    { title: 'Interests & Hobbies', content: profileData?.Interests?.join(', ') || '---' },
    { title: 'Personality Traits', content: profileData?.Traits || '---' },
    {
      title: 'First Name & Short Bio',
      content: `${profileData?.Name || '---'}\n\n${profileData?.About || '---'}`,
    },
    {
      title: 'Full Profile Extras',
      content: `Favorite Song: ${profileData?.song || '---'}\nCity: ${profileData?.city || '---'}\nMystery Fact: ${profileData?.fact || '---'}`,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back to Chat</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {rectangles.map((rect, index) => {
          const unlocked = index + 1 <= unlockLevel;
          const opacity = animations[index];
          const translateY = animations[index].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          });

          return (
            <Animated.View
              key={index}
              style={[
                {
                  opacity,
                  transform: [{ translateY }],
                  borderRadius: 14,
                  marginBottom: 20,
                  height: RECT_HEIGHT,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 16,
                  overflow: 'hidden',
                },
                unlocked ? null : styles.lockedRectangle,
              ]}
            >
              {unlocked && (
                <LinearGradient colors={['#FFECEC', '#FF383C']} style={StyleSheet.absoluteFill} />
              )}
              <Text style={[styles.rectTitle, unlocked ? { color: '#3C3C43' } : styles.lockedText]}>
                {rect.title}
              </Text>
              {unlocked ? (
                <Text style={[styles.rectContent, { color: '#3C3C43' }]}>{rect.content}</Text>
              ) : (
                <Text style={styles.lockedText}>Locked</Text>
              )}
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#3C3C43',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#fdfdfdff',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  lockedRectangle: {
    backgroundColor: '#AAAAAA', // Gray background for locked cards
  },
  rectTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  rectContent: {
    fontSize: 18,
    textAlign: 'center',
  },
  lockedText: {
    color: '#6b7280',
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
