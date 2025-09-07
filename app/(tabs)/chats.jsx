import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  SafeAreaView,
  Platform
} from 'react-native';
import { useTheme } from '../../utils/themeContext';
import { useRouter } from 'expo-router';

// Mock anonymous profiles data
const mockProfiles = [
  {
    id: '1',
    anonymousName: 'MysteriousTraveler',
    mood: 'Adventurous 🗺️',
    lastMessage: 'Loved your whisper at the park!',
    lastActive: '2 min ago',
    revealLevel: 1,
    connectionDate: 'Connected today'
  },
  {
    id: '2',
    anonymousName: 'SilentDreamer',
    mood: 'Creative 🎨',
    lastMessage: 'The library whisper was poetic...',
    lastActive: '10 min ago',
    revealLevel: 2,
    connectionDate: 'Connected 1 day ago'
  },
  {
    id: '3',
    anonymousName: 'CuriousObserver',
    mood: 'Thoughtful 🤔',
    lastMessage: 'Want to exchange another clue?',
    lastActive: '1 hour ago',
    revealLevel: 1,
    connectionDate: 'Connected 2 days ago'
  },
  {
    id: '4',
    anonymousName: 'HiddenExplorer',
    mood: 'Mysterious 🔮',
    lastMessage: 'Your notes always make me curious',
    lastActive: '3 hours ago',
    revealLevel: 3,
    connectionDate: 'Connected 3 days ago'
  }
];

export default function AnonymousProfilesList() {
  const { theme } = useTheme();
  const router = useRouter();
  const [profiles, setProfiles] = useState(mockProfiles);

  const renderProfileItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.profileCard, { backgroundColor: theme.c1, borderColor: theme.c6 }]}
      onPress={() => router.push({
        pathname: '/chat',
        params: { profileId: item.id, profileName: item.anonymousName }
      })}
    >
      <View style={styles.profileHeader}>
        <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.anonymousName) }]}>
          <Text style={styles.avatarText}>
            {item.anonymousName.charAt(0)}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.text }]}>
            {item.anonymousName}
          </Text>
          <Text style={[styles.profileMood, { color: theme.primary }]}>
            {item.mood}
          </Text>
        </View>
        <Text style={[styles.lastActive, { color: theme.c3 }]}>
          {item.lastActive}
        </Text>
      </View>

      <Text style={[styles.lastMessage, { color: theme.c4 }]} numberOfLines={1}>
        {item.lastMessage}
      </Text>

      <View style={styles.revealProgress}>
        <Text style={[styles.revealText, { color: theme.c3 }]}>
          Anonymity Level: 
        </Text>
        <View style={styles.revealDots}>
          {[1, 2, 3, 4].map(level => (
            <View 
              key={level}
              style={[
                styles.dot, 
                { 
                  backgroundColor: level <= item.revealLevel ? theme.primary : theme.c5,
                  borderColor: theme.c6
                }
              ]}
            />
          ))}
        </View>
      </View>

      <Text style={[styles.connectionDate, { color: theme.c3 }]}>
        {item.connectionDate}
      </Text>
    </TouchableOpacity>
  );

  const getAvatarColor = (name) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F9A826', '#6C5CE7', '#FD79A8'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.c1 }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Anonymous Connections
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.c3 }]}>
          {profiles.length} mysterious conversations
        </Text>
      </View>

      {/* Profiles List - Added padding at bottom for tab bar */}
      <FlatList
        data={profiles}
        renderItem={renderProfileItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Platform.OS === 'ios' ? 100 : 120 } // Extra padding for tab bar
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.c3 }]}>
              No anonymous connections yet...
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.c4 }]}>
              Find whispers on the map to start chatting!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  listContent: {
    padding: 16,
  },
  profileCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  profileMood: {
    fontSize: 12,
    fontWeight: '500',
  },
  lastActive: {
    fontSize: 11,
    opacity: 0.7,
  },
  lastMessage: {
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.9,
  },
  revealProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  revealText: {
    fontSize: 12,
  },
  revealDots: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  connectionDate: {
    fontSize: 11,
    opacity: 0.6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
});