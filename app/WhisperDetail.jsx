import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '../utils/themeContext';  // adjust path as needed
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const WhisperDetail = () => {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const likeIcon = require('../assets/likes.png');
  const dislikeIcon = require('../assets/dislikes.png');
  const startChat = () => {
    if (!params.uid) {
      console.warn("No author UID found for this whisper");
      return;
    }
    router.push({
      pathname: '/chat',
      params: {
        profileId: params.uid,          // 👈 author’s UID
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

      <View style={[styles.footer, {backgroundColor : theme.c2}]}>
        <TouchableOpacity style={[styles.button, styles.chatButton]} onPress={startChat}>
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>

        <View style={styles.likeDislikeButtons}>
            <TouchableOpacity style={styles.reactionButton} onPress={() => {/* handle Like press */}}>
                <Image source={likeIcon} style={styles.footerIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.reactionButton} onPress={() => {/* handle Dislike press */}}>
                <Image source={dislikeIcon} style={styles.footerIcon} />
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#e0f0ff',
    borderRadius: 30,
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
    reactionButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#e0f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    },
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