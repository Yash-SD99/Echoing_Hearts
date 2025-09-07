import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView
} from 'react-native';
import { useTheme } from '../utils/themeContext';
import { useRouter } from 'expo-router';

export default function SelectInterests() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [selectedInterests, setSelectedInterests] = useState([]);

  const interests = [
    'Sports', 'Movies', 'Food', 'Video Games', 'Go-Karting',
    'Travelling', 'Coffee dates', 'Singing', 'Dancing', 'Clubbing',
    'Reading', 'Music', 'Sleep', 'Art'
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(item => item !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleContinue = () => {
    // Save selected interests to your backend if needed
    console.log('Selected interests:', selectedInterests);
    
    // Navigate to the main app tabs
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    // Navigate to the main app tabs
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background || '#FFECEC' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.appName, { color: theme.text || '#FF383C' }]}>Mystery Makers</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.text || '#FF383C' }]}>
          Select your interests
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: theme.secondaryText || '#C78C97' }]}>
          Select any tags to show people the stuff you are interested in or like to do in your free time! 
          Let them know the kind of person you are.
        </Text>

        {/* Interests Grid */}
        <View style={styles.interestsGrid}>
          {interests.map((interest, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.interestButton,
                { 
                  backgroundColor: selectedInterests.includes(interest) 
                    ? (theme.primary || '#FF6F91') 
                    : (theme.cardBackground || '#FFDDE4'),
                  borderColor: theme.borderColor || '#FF6F91'
                }
              ]}
              onPress={() => toggleInterest(interest)}
            >
              <Text style={[
                styles.interestText,
                { 
                  color: selectedInterests.includes(interest) 
                    ? '#FFFFFF' 
                    : (theme.text || '#FF6F91')
                }
              ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Interest Input */}
        <View style={styles.customInputContainer}>
          <TextInput
            style={[
              styles.customInput,
              { 
                backgroundColor: theme.cardBackground || '#FFDDE4',
                borderColor: theme.borderColor || '#FF6F91',
                color: theme.text || '#FF6F91'
              }
            ]}
            placeholder="Any Other Interests"
            placeholderTextColor={theme.placeholderColor || '#C78C97'}
          />
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.skipButton, { borderColor: theme.primary || '#FF6F91' }]}
          onPress={handleSkip}
        >
          <Text style={[styles.skipText, { color: theme.primary || '#FF6F91' }]}>
            Skip
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.continueButton, 
            { 
              backgroundColor: theme.primary || '#FF6F91'
            }
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>
            I'm Ready!
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    opacity: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 25,
  },
  interestButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  interestText: {
    fontSize: 14,
    fontWeight: '600',
  },
  customInputContainer: {
    marginBottom: 20,
  },
  customInput: {
    borderWidth: 2,
    borderRadius: 25,
    padding: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(255, 236, 236, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#FFDDE4',
  },
  skipButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 2,
    minWidth: 120,
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});