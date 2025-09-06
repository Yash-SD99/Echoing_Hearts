import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../utils/themeContext';
import { useRouter } from "expo-router";
import { auth,db } from '../../utils/firebaseConfig'; // assuming you have firebase auth
import { doc,getDoc } from "firebase/firestore";
import profilePics from "../../constants/profilePics";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 75;
const TAB_BAR_MARGIN_BOTTOM = 25;

const demoInterests = [
  { label: "Sports" },
  { label: "Movies" },
  { label: "Food",  },
  { label: "Video Games" },
  { label: "Go-Karting"},
  { label: "Travelling" },
];

export default function Profile() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const { theme, mode, toggleTheme } = useTheme();

  const [user, setUser] = useState(null); // user state
  const [userData, setUserData] = useState(null); // Firestore user data
  const imageSource = profilePics[userData?.profilePic] || profilePics.male;

  const handleLogout = async () => {
  try {
    await auth.signOut();
    setUser(null); // optional, onAuthStateChanged will update automatically
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
    setUser(currentUser); // set auth user
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data()); // set Firestore data
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      setUserData(null);
    }
  });
  return () => unsubscribe();
}, []);


  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    setPage(Math.round(offsetX / (SCREEN_WIDTH - 40)));
  };

  const backgroundColor = theme.c1;
  const textColor = theme.c2;
  const cardBackground = mode === 'light' ? '#FFFFFF' : '#1E1E1E';
  const borderColor = mode === 'light' ? '#f0f0f0' : '#333333';
  const sectionBackground = mode === 'light' ? '#fff8f7' : '#2A1E1E';

  // If user is logged out, show only Login button
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle={mode === 'light' ? 'dark-content' : 'light-content'} />
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: mode === 'light' ? '#ff7e5f' : '#4A4A4A',
              borderColor: mode === 'light' ? '#ffd6cc' : '#666666'
            }
          ]}
          onPress={() => router.push('/login')}
        >
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }


  // Otherwise, show full profile
  return (
    <View style={[styles.container, { backgroundColor }]}>

//     <SafeAreaView style={[styles.container, { backgroundColor }]}>

      <StatusBar barStyle={mode === 'light' ? 'dark-content' : 'light-content'} backgroundColor={mode === 'light' ? '#ff7e5f' : '#1A1A1A'} />
      
      <LinearGradient 
        colors={mode === 'light' ? ["#ff7e5f", "#feb47b"] : ["#1A1A1A", "#2D2D2D"]} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 0}}
        style={styles.header}
      >
        <Text style={[styles.headerTitle, { color: '#FFFFFF' }]}>Mystery Makers</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Ionicons 
              name={mode === 'light' ? 'moon' : 'sunny'} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsIcon}>
            <Ionicons name="settings" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.mainScrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_MARGIN_BOTTOM + 30 }
        ]}
        showsVerticalScrollIndicator={false}
      >
       <View style={styles.avatarContainer}>
          <View style={[styles.avatarWrapper, { borderColor: cardBackground }]}>
            <Image
              source={imageSource}
              style={styles.avatar}
            />
            <TouchableOpacity style={[styles.editIcon, { backgroundColor: mode === 'light' ? '#ff7e5f' : '#4A4A4A' }]}
            onPress={()=>router.push('../changeprofilepic')}>
              <Ionicons name="create" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.username, { color: textColor }]}>{`@${userData?.username}` || '---'}</Text>
        </View>

        <Text style={[styles.profileTitle, { color: mode === 'light' ? '#ff7e5f' : '#FF9F7F' }]}>{`${userData?.displayName}'s Profile`||'---'}</Text>

        <View style={styles.dotContainer}>
          <View style={[styles.dot, page === 0 && [styles.activeDot, { backgroundColor: mode === 'light' ? '#ff7e5f' : '#FF9F7F' }]]} />
          <View style={[styles.dot, page === 1 && [styles.activeDot, { backgroundColor: mode === 'light' ? '#ff7e5f' : '#FF9F7F' }]]} />
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={[styles.horizScroll, { height: 420 }]}
        >
          {/* Panel 1: Personal Info */}
          <View style={[styles.page, { width: SCREEN_WIDTH - 40, backgroundColor: cardBackground }]}>
            <View style={styles.infoItem}>
              <Ionicons name="person" size={20} color={mode === 'light' ? '#ff7e5f' : '#FF9F7F'} style={styles.infoIcon} />
              <View>
                <Text style={[styles.label, { color: mode === 'light' ? '#888' : '#AAA' }]}>Name</Text>
                <Text style={[styles.value, { color: textColor }]}>{userData?.Name || '---'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="male-female" size={20} color={mode === 'light' ? '#ff7e5f' : '#FF9F7F'} style={styles.infoIcon} />
              <View>
                <Text style={[styles.label, { color: mode === 'light' ? '#888' : '#AAA' }]}>Gender</Text>
                <Text style={[styles.value, { color: textColor }]}>{userData?.gender || '---'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={20} color={mode === 'light' ? '#ff7e5f' : '#FF9F7F'} style={styles.infoIcon} />
              <View>
                <Text style={[styles.label, { color: mode === 'light' ? '#888' : '#AAA' }]}>Age</Text>
                <Text style={[styles.value, { color: textColor }]}>{userData?.Age || '---'}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="resize" size={20} color={mode === 'light' ? '#ff7e5f' : '#FF9F7F'} style={styles.infoIcon} />
              <View>
                <Text style={[styles.label, { color: mode === 'light' ? '#888' : '#AAA' }]}>Height(cm)</Text>
                <Text style={[styles.value, { color: textColor }]}>{userData?.height || '---'}</Text>
              </View>
            </View>
            
            <View style={[styles.sectionDivider, { backgroundColor: mode === 'light' ? '#eee' : '#333' }]} />
            
            <Text style={[styles.sectionTitle, { color: mode === 'light' ? '#ff7e5f' : '#FF9F7F' }]}>Personality Traits</Text>
            <Text style={[styles.sectionSubtitle, { color: mode === 'light' ? '#666' : '#AAA' }]}>
              These describe my traits
            </Text>
            
            <View style={styles.intelContainer}>
              <View style={[styles.intelItem, { backgroundColor: sectionBackground }]}>
                <Text style={[styles.intelLabel, { color: textColor }]}>{userData?.Traits || '---'}</Text>
              </View>
            </View>
          </View>

          {/* Panel 2: Interests */}
          <View style={[styles.page, { width: SCREEN_WIDTH - 40, backgroundColor: cardBackground }]}>
  <Text style={[styles.sectionTitle, { color: mode === 'light' ? '#ff7e5f' : '#FF9F7F' }]}>
    Interests & Hobbies
  </Text>
  <View style={styles.interestsContainer}>
    {(userData?.Interests?.length > 0 ? userData.Interests : []).map((interest, idx) => (
      <View key={idx} style={[styles.badge, { backgroundColor: cardBackground, borderColor }]}>
        <Text style={[styles.badgeText, { color: textColor }]}>
          {typeof interest === 'string' ? interest : JSON.stringify(interest)}
        </Text>
      </View>
    ))}
  </View>
            
            <View style={[styles.sectionDivider, { backgroundColor: mode === 'light' ? '#eee' : '#333' }]} />
            
            <Text style={[styles.sectionTitle, { color: mode === 'light' ? '#ff7e5f' : '#FF9F7F' }]}>About Me</Text>
            <Text style={[styles.aboutText, { color: textColor }]}>
              {userData?.About || '---'}
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: cardBackground, borderColor }]}
        onPress={() => router.push('../EditProfile')}>
          <Ionicons name="create" size={18} color={mode === 'light' ? '#ff7e5f' : '#FF9F7F'} style={styles.btnIcon} />
          <Text style={[styles.settingsBtnText, { color: mode === 'light' ? '#ff7e5f' : '#FF9F7F' }]}>
            Edit Profile 
          </Text>
        </TouchableOpacity>

        {/* Fixed Login Button with Theme-Aware Styles */}
        <TouchableOpacity
          style={[
            styles.btn, 
            { 
              backgroundColor: mode === 'light' ? '#ff7e5f' : '#4A4A4A',
              borderColor: mode === 'light' ? '#ffd6cc' : '#666666'
            }
          ]}
          onPress={handleLogout}
        >
          <Text style={[
            styles.buttonText, 
            { color: '#FFFFFF' } // White text for both light and dark modes
          ]}>
            Logout
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: { 
    flex: 1,
  },
  mainScrollView: {
    flex: 1,
  },
  scrollContent: {
    // paddingBottom is set dynamically
  },
  header: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeToggle: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  settingsIcon: {
    padding: 5,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  avatarWrapper: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatar: { 
    width: "100%", 
    height: "100%",
    borderRadius: 60,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  horizScroll: { 
    flexGrow: 0, 
    marginBottom: 10,
  },
  page: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 12,
  },
  label: { 
    fontSize: 14, 
    fontWeight: "500",
    marginBottom: 2,
  },
  value: { 
    fontSize: 16, 
    fontWeight: "600",
  },
  sectionDivider: {
    height: 1,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 15,
    fontStyle: "italic",
  },
  intelContainer: {
    marginTop: 10,
  },
  intelItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
  },
  intelLabel: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  intelShort: {
    fontSize: 14,
    fontWeight: "bold",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  badge: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    width: (SCREEN_WIDTH - 80) / 2,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  badgeText: { 
    fontSize: 14, 
    fontWeight: "500",
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  activeDot: { 
    width: 20,
  },
  settingsBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    width: "85%",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnIcon: {
    marginRight: 8,
  },
  settingsBtnText: { 
    fontWeight: "600", 
    fontSize: 16,
  },
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    width: "85%",
    alignSelf: "center",
    marginTop: 10, // Reduced margin to fit better
    marginBottom: 10, // Reduced margin to fit better
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontWeight: "600", 
    fontSize: 16,
  }
});
