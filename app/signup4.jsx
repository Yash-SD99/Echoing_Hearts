import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useTheme } from '../utils/themeContext';
import { useRouter } from 'expo-router';
import profilePics from '../constants/profilePics'; // ✅ default export
import { auth, db } from '../utils/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default function SelectProfile() {
  const { mode } = useTheme();
  const isDarkMode = mode === 'dark';
  const styles = isDarkMode ? darkStyles : lightStyles;

  const [displayName, setDisplayName] = useState('');
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  // ✅ Save profile to Firestore
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
            profilePic: selected, // store "male" or "female"
          },
          { merge: true }
        );
        router.push('/email');
      } else {
        alert('User not logged in');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1A1A1A' : '#FFECEC' }]}>

      <Image source={require('../assets/logo.png')} style={[{height:300}, {width:300}, {alignSelf: 'center'}, {borderRadius: 50}]}></Image>

      <Text style={[styles.subtitle, { color: isDarkMode ? '#FFB3C6' : '#FF6F91' }]}>Select a profile picture</Text>

      <Text style={[styles.helper, { color: isDarkMode ? '#FFDDE4' : '#C78C97' }]}>

        Choose one of the avatars and a display name (not your real name) that
        really captures your vib
      </Text>

      {/* ✅ Avatar choices */}
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

      {/* ✅ Display name input */}
      <View style={styles.inputWrap}>
        <TextInput
  style={[
    styles.input,
    {
      backgroundColor: isDarkMode ? '#33272A' : '#FFDDE4',
      borderColor: '#FF6F91',
      color: '#FF6F91',
    }
  ]}
  placeholder="Enter display name"
  placeholderTextColor={isDarkMode ? '#FFDDE4' : '#C78C97'}
  value={displayName}
  onChangeText={setDisplayName}
/>

      </View>

      {/* ✅ Save button */}
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
