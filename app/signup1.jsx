import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Button,Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import {auth} from '../utils/firebaseConfig';
import { createUserWithEmailAndPassword} from 'firebase/auth';

import { db } from "../utils/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
export default function SignupStep1() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
 
  const [username, setUsername] = useState('');

  const styles = isDarkMode ? darkStyles : lightStyles;

  const handleNext = async () => {
  if (!username||!email || !password || !confPassword ) {
    Alert.alert("Error", "Please fill all fields.");
    return;
  }
  
  if (password !== confPassword) {
    Alert.alert("Error", "Passwords do not match!");
    return;
  }
  const usernameDocRef = doc(db, "usernames", username);
  const usernameDocSnap = await getDoc(usernameDocRef);

  if (usernameDocSnap.exists()) {
    Alert.alert("Error", "Username already taken. Please choose another.");
    return;
  }
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // 2️⃣ Save username mapping
    await setDoc(doc(db, "usernames", username), { uid: userId });
    
    
    // Navigate to SignupStep2 with params
    router.push({
      pathname: '/signup2',
      params: { username,email},
    });
  } catch (error) {
    Alert.alert("Signup Failed", error.message);
  }
};


  return (
    <View style={styles.container}>
      <ThemeToggle />

      <View style={styles.titleBox}>
        <Text style={styles.title}>Mystery Makers</Text>
      </View>

      <Text style={styles.subtitle}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username*"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />

      <TextInput
        style={styles.input}
        placeholder="Email*"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />
      <TextInput
        style={styles.input}
        placeholder="Password*"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password*"
        secureTextEntry
        value={confPassword}
        onChangeText={setConfPassword}
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← BACK</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>NEXT →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const commonButton = {
  height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', minWidth: 120, paddingHorizontal: 16, marginVertical: 10,
};

const lightStyles = StyleSheet.create({
  container: { flex: 1, paddingTop: 70,paddingLeft:10,paddingRight:10, backgroundColor: '#FFECEC' },
  titleBox: {
    alignSelf: 'center',
    backgroundColor: '#FF383C',
    borderRadius: 30,
    opacity:0.5,
    paddingVertical: 35,
    paddingHorizontal: 20,
    marginBottom: 30,
    width: '85%',
    elevation: 2
  },
  title: { fontSize: 48, fontWeight: 'bold', color: '#FFECEC', textAlign: 'center',lineHeight:57 },
  subtitle: { fontSize: 36, fontWeight: 'bold', marginBottom: 8, color: '#FF383C', textAlign: 'left',lineHeight:49 ,opacity:0.5},
  info: { fontSize: 16, marginBottom: 20, color: '#FF6F91', textAlign: 'left', opacity: 0.9 },
  input: {
    backgroundColor: 'white',
    height: 50,
    borderRadius: 20,
    marginBottom: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#FF6F91',
    fontSize: 16,
    color: '#333',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  button: { ...commonButton, backgroundColor: '#FF383C',opacity:0.5, marginHorizontal: 6, flex: 1 },
  backButton: { backgroundColor: '#FF383C', borderWidth: 1, borderColor: '#FF6F91' },
  buttonText: { color: '#FFECEC', fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
  linkText: { color: '#FF6F91', textAlign: 'center', textDecorationLine: 'underline', marginTop: 10, fontSize: 14 },
});



const darkStyles = StyleSheet.create({
  container: { flex: 1, paddingTop: 70,paddingLeft:10,paddingRight:10, backgroundColor: '#3C3C43',lineHeight:57 },
  titleBox: {
    alignSelf: 'center',
    backgroundColor: '#FF383C',
    borderRadius: 30,
    paddingVertical: 35,
    opacity:0.5,
    paddingHorizontal: 20,
    marginBottom: 30,
    width: '85%',
    elevation: 2
  },
  title: { fontSize: 48, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center',lineHeight:57  },
  subtitle: { fontSize: 36, fontWeight: 'bold', marginBottom: 8, color: '#F5F5F5', textAlign: 'left' },
  info: { fontSize: 16, marginBottom: 20, color: '#F5F5F5', textAlign: 'left', opacity: 0.5 },
  input: {
    backgroundColor: '#444448',
    height: 50,
    borderRadius: 20,
    marginBottom: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#B03A3A',
    fontSize: 16,
    color: '#eee',
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  button: { ...commonButton, backgroundColor: '#FF383C',opacity:0.5 ,marginHorizontal: 6, flex: 1 },
  backButton: { backgroundColor: '#FF383C', borderWidth: 1, borderColor: '#D65151' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  linkText: { color: '#D65151', textAlign: 'center', textDecorationLine: 'underline', marginTop: 10, fontSize: 14 },
});