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
import { doc, getDoc } from 'firebase/firestore';
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
  const params = useLocalSearchParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const turnCount = parseInt(params.turnCount ?? params.messageCount, 10) || 0;
  const unlockLevel = getUnlockLevel(turnCount);

  // Animated values
  const animations = Array(5)
    .fill(0)
    .map(() => useRef(new Animated.Value(1)).current);

  // Fetch profile data of the person you are chatting with
  useEffect(() => {
    const fetchProfile = async () => {
      if (!params.profileId) return;
      try {
        const docRef = doc(db, 'users', params.profileId);
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
  }, [params.profileId]);

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

  // Build rectangles dynamically based on fetched data
  const rectangles = [
    { title: 'Anonymous Name', content: profileData?.displayName || 'Anonymous' },
    { title: 'Interests & Hobbies', content: profileData?.Interests?.join(', ') || '---' },
    { title: 'Personality Traits', content: profileData?.Traits || '---' },
    {
      title: 'First Name & Short Bio',
      content: `${profileData?.Name || '---'}\n\n${profileData?.About || '---'}`,
    },
    {
      title: 'Full Profile Extras',
      content: `Favorite Song: ${profileData?.FavoriteSong || '---'}\nCity/Region: ${profileData?.City || '---'}\nMystery Fact: ${profileData?.MysteryFact || '---'}`,
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
            outputRange: [50, 0], // Slide up animation
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
              {unlocked ? (
                <LinearGradient
                  colors={['#FFECEC', '#FF383C']}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
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
