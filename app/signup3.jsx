import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../utils/themeContext';
import ThemeToggle from '../components/ThemeToggle';
import { auth, db } from '../utils/firebaseConfig';
import { doc, setDoc, updateDoc } from 'firebase/firestore';


export default function SignupStep3() {
  const router = useRouter();
  const { mode } = useTheme();
const isDarkMode = mode === 'dark';


  const [displayName, setDisplayName] = useState('');
  const [pincode, setpincode] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');

  const styles = isDarkMode ? darkStyles : lightStyles;
  const handleNext = async() => {
  if (!displayName.trim()) {
    alert("Name is required");
    return;
  }

  const ageNumber = parseInt(age);
  if (!age || isNaN(ageNumber)) {
    alert("Age is required and must be a number");
    return;
  }

  if (ageNumber < 18) {
    alert("You must be at least 18 years old");
    return;
  }

  try {
    const user = auth.currentUser;
    if (!user) {
      alert("No user logged in");
      return;
    }
  

    // Reference to this user's document
    const userRef = doc(db, "users", user.uid);

    // Save/Update data in Firestore
    await setDoc(userRef, {
      Name: displayName,
      pincode:pincode || null,
      Age: ageNumber,
      height: height || null,
    }, { merge: true }); // merge:true prevents overwriting existing data

    console.log("User profile saved!");
    router.push('/signup4');
  } catch (error) {
    console.error("Error saving profile:", error);
    alert("Something went wrong while saving your profile");
  }
};

  return (
    <View style={styles.container}>
      <ThemeToggle />

      <Image source={require('../assets/logo.png')} style={[{height:300}, {width:300}, {alignSelf: 'center'}, {borderRadius: 50}]}></Image>

      <Text style={styles.subtitle}>Set up your profile</Text>
      <Text style={styles.info}>Tell us more about yourself</Text>

      <TextInput
        style={styles.input}
        placeholder="Name you would like to go by"
        value={displayName}
        onChangeText={setDisplayName}
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />
      <TextInput
        style={styles.input}
        placeholder="pincode(optional)"
        value={pincode}
        onChangeText={setpincode}
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />
      <TextInput
        style={styles.input}
        placeholder="Height(cm) (optional)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next →</Text>
      </TouchableOpacity>
    </View>
  );
}

const lightStyles = StyleSheet.create({
  container: { flex: 1, paddingTop: 70, paddingHorizontal: 10, backgroundColor: '#FFECEC' },
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
  subtitle: { fontSize: 36, fontWeight: 'bold', marginBottom: 5, color: '#FF383C', textAlign: 'left', opacity: 0.6 },
  info: { fontSize: 16, marginBottom: 17, color: '#FF6F91', textAlign: 'left', opacity: 0.9 },
  input: {
    backgroundColor: '#FFECEC',
    height: 50,
    borderRadius: 20,
    marginBottom: 13,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FF6F91',
    fontSize: 16,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#FF6F91',
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 15,
    elevation: 2,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFECEC',
    letterSpacing: 1,
  },
});

const darkStyles = StyleSheet.create({
  container: { flex: 1, paddingTop: 70, paddingHorizontal: 10, backgroundColor: '#3C3C43' },

  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 57,
  },
  subtitle: { fontSize: 36, fontWeight: 'bold', marginBottom: 5, color: '#FFECEC', textAlign: 'left', opacity: 0.7 },
  info: { fontSize: 16, marginBottom: 17, color: '#F5F5F5', textAlign: 'left', opacity: 0.6 },
  input: {
    backgroundColor: '#444448',
    height: 50,
    borderRadius: 20,
    marginBottom: 13,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#B03A3A',
    fontSize: 16,
    color: '#eee',
  },
  nextButton: {
    backgroundColor: '#D65151',
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 15,
    elevation: 2,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFECEC',
    letterSpacing: 1,
  },
});
