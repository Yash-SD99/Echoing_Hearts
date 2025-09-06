import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { useTheme } from '../utils/themeContext';
import { useRouter } from 'expo-router';
import profilePics from '../constants/profilePics';
import { auth, db } from '../utils/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function SelectProfile() {
  const { mode } = useTheme();
  const isDarkMode = mode === 'dark';
  const styles = isDarkMode ? darkStyles : lightStyles;

  const [displayName, setDisplayName] = useState('');
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  // ✅ Fetch existing displayName from Firestore
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.displayName) setDisplayName(data.displayName);
            if (data.profilePic) setSelected(data.profilePic);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    fetchProfile();
  }, []);
  
  const handleSave = async () => {
    if (!displayName.trim()) {
      alert('Enter a display name');
      return;
    }
    if (!selected) {
      alert('Please select a profile picture');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(
          doc(db, 'users', user.uid),
          {
            displayName,
            profilePic: selected,
          },
          { merge: true }
        );
        router.push('/(tabs)/profile');
      } else {
        alert('User not logged in');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>Mystery Makers</Text>
      </View>

      <Text style={styles.subtitle}>Select a profile picture</Text>
      <Text style={styles.helper}>
        Choose one of the avatars 
      </Text>

      {/* Avatar selection */}
      <View style={{ flexDirection: 'row', marginBottom: 20, justifyContent: 'center' }}>
        <TouchableOpacity onPress={() => setSelected('male')} style={{ marginHorizontal: 10 }}>
          <Image
            source={profilePics.male}
            style={[
              styles.avatar,
              { borderColor: selected === 'male' ? '#FF6F91' : '#C8A4A7' },
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelected('female')} style={{ marginHorizontal: 10 }}>
          <Image
            source={profilePics.female}
            style={[
              styles.avatar,
              { borderColor: selected === 'female' ? '#FF6F91' : '#C8A4A7' },
            ]}
          />
        </TouchableOpacity>
      </View>

      {/* Display name input with pre-filled value */}
      <View style={styles.inputWrap}>
        <Text style={[styles.label]}>Display Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter display name"
          placeholderTextColor={styles.placeholderColor.color}
          value={displayName} // ✅ pre-filled value
          onChangeText={setDisplayName}
        />
      </View>

      {/* Save button */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save & Continue</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
}


const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#FFECEC',
    alignItems: 'center',
  },
  titleBox: {
    alignSelf: 'center',
    backgroundColor: '#FF383C',
    borderRadius: 30,
    opacity: 0.5,
    paddingVertical: 35,
    paddingHorizontal: 20,
    marginBottom: 30,
    width: '85%',
    elevation: 2,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFECEC',
    textAlign: 'center',
    lineHeight: 57,
  },
  subtitle: {
    fontSize: 25,
    color: '#FF6F91',
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginTop: 5,
  },
  helper: {
    fontSize: 15,
    color: '#C78C97',
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginBottom: 22,
    maxWidth: '85%',
    lineHeight: 22,
  },
  avatar: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 3, // ✅ base border
  },
  inputWrap: {
    width: '90%',
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#FFDDE4',
    borderRadius: 20,
    height: 45,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: '#FF6F91',
    fontSize: 16,
    color: '#FF6F91',
    marginTop: 5,
    marginBottom: 6,
  },
  placeholderColor: {
    color: '#C78C97',
  },
  button: {
    backgroundColor: '#FF6F91',
    borderRadius: 20,
    paddingVertical: 13,
    paddingHorizontal: 36,
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#FFECEC',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  arrow: {
    fontSize: 18,
    marginLeft: 10,
    color: '#FFECEC',
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 8,
  },
  titleBox: {
    backgroundColor: '#3C2A2E',
    borderRadius: 25,
    paddingVertical: 14,
    width: '90%',
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FF6F91',
    letterSpacing: 1,
    fontFamily: 'Cursive',
  },
  subtitle: {
    fontSize: 25,
    color: '#FFB3C6',
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginTop: 5,
  },
  helper: {
    fontSize: 15,
    color: '#FFDDE4',
    alignSelf: 'flex-start',
    marginLeft: 18,
    marginBottom: 22,
    maxWidth: '85%',
    lineHeight: 22,
  },
  avatar: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 3,
  },
  inputWrap: {
    width: '90%',
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#33272A',
    borderRadius: 20,
    height: 45,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: '#FF6F91',
    fontSize: 16,
    color: '#FF6F91',
    marginTop: 5,
    marginBottom: 6,
  },
  placeholderColor: {
    color: '#FFDDE4',
  },
  button: {
    backgroundColor: '#FF6F91',
    borderRadius: 20,
    paddingVertical: 13,
    paddingHorizontal: 36,
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#FFECEC',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  arrow: {
    fontSize: 18,
    marginLeft: 10,
    color: '#FFECEC',
  },
});
