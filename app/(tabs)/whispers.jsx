import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../utils/themeContext';  // adjust path as needed
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const whispers = [
  { id: '1', title: 'Alice', lastMessage: 'Page 1 Artificial Intelligence (AI) has rapidly transformed from a futuristic concept into a daily reality. What once existed only in the imagination of science fiction writers is now an active part of industries ranging from healthcare and education to finance and entertainment. AI systems are designed to analyze data, recognize patterns, and make decisions at speeds and scales far beyond human capabilities. This ability has opened doors to innovation that seemed impossible just a few decades ago.Page 2One of the most significant impacts of AI is in healthcare. AI-powered algorithms assist doctors in diagnosing diseases with high accuracy, predicting patient outcomes, and even recommending personalized treatment plans. Medical imaging, for instance, has seen remarkable improvements thanks to AI’s ability to detect anomalies that human eyes might miss. Beyond diagnostics, AI is also playing a role in drug discovery, making it faster and more cost-effective to develop new medicines.Page 3Education has also benefited greatly from the rise of AI. Personalized learning platforms use intelligent systems to adapt content to a student’s pace and style of learning. This creates a more engaging experience and helps ensure that students don’t fall behind. Additionally, AI-powered language tools are breaking barriers, allowing people from different parts of the world to communicate seamlessly and access knowledge in ways that were previously inaccessible.Page 4Despite its many benefits, AI brings challenges and ethical considerations. Concerns about job automation, privacy, and algorithmic bias continue to spark debates worldwide. While AI can enhance human capabilities, it must be developed and deployed responsibly. The future of AI will depend not only on technological advancements but also on how societies choose to balance innovation with fairness and accountability. What is certain, however, is that AI will continue to shape the future in profound and lasting ways.', time: '10:15 AM' },
  { id: '2', title: 'Bob', lastMessage: 'Are you coming?', time: '9:45 AM' },
  { id: '3', title: 'Charlie', lastMessage: 'Let’s meet up!', time: 'Yesterday' },
  { id: '4', title: 'Alice', lastMessage: 'Hey, how are you?', time: '10:15 AM' },
  { id: '5', title: 'Bob', lastMessage: 'Are you coming?', time: '9:45 AM' },
  { id: '6', title: 'Charlie', lastMessage: 'Let’s meet up!', time: 'Yesterday' },
  { id: '7', title: 'Alice', lastMessage: 'Hey, how are you?', time: '10:15 AM' },
  { id: '8', title: 'Bob', lastMessage: 'Are you coming?', time: '9:45 AM' },
  { id: '9', title: 'Charlie', lastMessage: 'Let’s meet up!', time: 'Yesterday' },
  { id: '10', title: 'Alice', lastMessage: 'Hey, how are you?', time: '10:15 AM' },
  { id: '11', title: 'Bob', lastMessage: 'Are you coming?', time: '9:45 AM' },
  { id: '12', title: 'Charlie', lastMessage: 'Let’s meet up!', time: 'Yesterday' },
  { id: '13', title: 'Alice', lastMessage: 'Hey, how are you?', time: '10:15 AM' },
  { id: '14', title: 'Bob', lastMessage: 'Are you coming?', time: '9:45 AM' },
  { id: '15', title: 'Charlie', lastMessage: 'Let’s meet up!', time: 'Yesterday' },
];

const Whispers = () => {
  const { theme, mode, toggleTheme } = useTheme();

  const router = useRouter();

  const openChat = (item) => {
    router.push({
      pathname: '../WhisperDetail',
      params: { id: item.id, title: item.title, message: item.lastMessage, image: item.image, likes: item.likes, dislikes: item.dislikes },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.whisperButton} onPress={() => openChat(item)}>
      <Image source={require('../../assets/images/globe.png')} style={styles.image}></Image>

      <View style= {styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
        <Text style={styles.message} numberOfLines={1} ellipsizeMode='tail'>{item.lastMessage}</Text>

        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          {/* Likes */}
          <View style={styles.reactionRow}>
            <Image source={require('../../assets/likes.png')} style={styles.reaction} />
            <Text style={styles.reactionText}>{item.likes}</Text>
          </View>
          {/* Dislikes */}
          <View style={[styles.reactionRow, { marginLeft: 16 }]}>
            <Image source={require('../../assets/dislikes.png')} style={styles.reaction} />
            <Text style={styles.reactionText}>{item.dislikes}</Text>
          </View>
        </View>

      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[{flex: 1} , {backgroundColor: theme.c1}]}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text>Mystery Makers</Text>
        </View>
        <FlatList
          data={whispers} 
          keyExtractor={(item) => item.id} 
          renderItem={renderItem} 
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
        <View style={{height : 80}}></View>
      </SafeAreaView>
    </View>
  );
}

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
      height: 80,            // Set your desired height
      width: '100%',         // Match parent width
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f3a6a6ff', // Optional: for contrast
      borderRadius: 16,        // Optional: rounded header
      marginBottom: 8,         // Space between header and list
    },

    text: {
        fontSize: 20
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 10,
    },

    image: {
      height: 75,
      width: 75,
      borderRadius: 75,
      overflow: 'hidden',
      marginRight: 10,
    },

    reactionRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    reaction: {
      height: 20,
      width: 20,
      borderRadius: 20
    },
    reactionText: {
      fontSize: 14,
      color: '#333',
      marginLeft: 4,
    },

    content: {
      flex: 1,
      marginRight: 10,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 24,
    },

    message: {
      fontSize: 18
    }
});