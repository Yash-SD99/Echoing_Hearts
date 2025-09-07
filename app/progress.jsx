import React, { useEffect, useRef } from 'react';
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


const PROFILE_DATA = {
  anonName: 'BlueTiger42',
  interests: 'Movies 🎬, Football ⚽, Cooking 🍳',
  traits: 'Night owl 🌙, Extrovert 🎉, Loves traveling ✈️',
  firstName: 'Riya',
  shortBio: 'A design student who loves coffee ☕',
  fullProfileExtras: {
    longBio: 'Passionate about art, design, and exploring new cafes in town.',
    favoriteSong: '“Imagine” by John Lennon 🎵',
    cityRegion: 'Bangalore, India 🌍',
    voiceNoteAvailable: true,
    mysteryFact: 'I once backpacked across 5 countries alone!',
  },
};

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
  const turnCount = parseInt(params.turnCount ?? params.messageCount, 10) || 0;
  const unlockLevel = getUnlockLevel(turnCount);

  const rectangles = [
    { title: 'Anonymous Name', content: PROFILE_DATA.anonName },
    { title: 'Interests & Hobbies', content: PROFILE_DATA.interests },
    { title: 'Personality Traits', content: PROFILE_DATA.traits },
    { title: 'First Name & Short Bio', content: `${PROFILE_DATA.firstName}\n\n${PROFILE_DATA.shortBio}` },
    {
      title: 'Full Profile Extras',
      content: `${PROFILE_DATA.fullProfileExtras.longBio}\n\nFavorite Song: ${PROFILE_DATA.fullProfileExtras.favoriteSong}\n\nCity/Region: ${PROFILE_DATA.fullProfileExtras.cityRegion}\n\nMystery Fact: ${PROFILE_DATA.fullProfileExtras.mysteryFact}`,
    },
  ];

  // Create animated values for opacity and translateY for each rectangle
  const animations = rectangles.map(() => useRef(new Animated.Value(1)).current);

  useEffect(() => {
    // Set opacity 1 for locked, 0 for unlocked (to animate unlocked)
    animations.forEach((anim, idx) => {
      anim.setValue(idx < unlockLevel ? 0 : 1);
    });

    // Animate unlocked rectangles from 0 to 1 opacity & translateY
    const animationsToRun = animations
      .map((anim, idx) =>
        idx < unlockLevel
          ? Animated.timing(anim, { toValue: 1, duration: 600, useNativeDriver: true })
          : null
      )
      .filter(Boolean);

    Animated.stagger(200, animationsToRun).start();
  }, [unlockLevel]);

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
