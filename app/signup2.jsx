import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { db, auth } from '../utils/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';

export default function SignupStep2() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const { username,email} = useLocalSearchParams();
  
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [stateCountry, setStateCountry] = useState('');
  const [address, setAddress] = useState('');

  const styles = isDarkMode ? darkStyles : lightStyles;
  const handleSignup = async () => {
  if (!gender || !city || !stateCountry) {
    alert("Please fill all required fields");
    return;
  }

  try {
    const userId = auth.currentUser.uid;
    await setDoc(doc(db, "users", userId), {
      username, 
      email,
      gender,
      city,
      stateCountry,
      address,
    }, { merge: true });

    alert("Signup successful!");
    router.replace('/email'); // navigate to home/dashboard
  } catch (error) {
    alert("Error: " + error.message);
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
        placeholder="Gender*"
        value={gender}
        onChangeText={setGender}
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />
      <TextInput
        style={styles.input}
        placeholder="City*"
        value={city}
        onChangeText={setCity}
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />
      <TextInput
        style={styles.input}
        placeholder="State, Country*"
        value={stateCountry}
        onChangeText={setStateCountry}
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        multiline
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← BACK</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>SIGN UP</Text>
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