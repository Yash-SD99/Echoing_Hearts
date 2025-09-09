import React, { useState, useContext } from 'react';

import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert, Image} from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { auth } from '../utils/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function EmailLogin() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const styles = isDarkMode ? darkStyles : lightStyles;


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully!");
      router.replace('/(tabs)'); // redirect to home/dashboard
    } catch (error) {
      let msg = error.code === "auth/user-not-found"
        ? "No account found with this email."
        : error.code === "auth/wrong-password"
        ? "Incorrect password."
        : error.message;
      Alert.alert("Login failed", msg);
    }
  }


  return (
    <View style={styles.container}>
      <ThemeToggle />

      <Image source={require('../assets/logo.png')} style={[{height:300}, {width:300}, {alignSelf: 'center'}, {borderRadius: 50}]}></Image>

      <Text style={styles.subtitle}>Login</Text>
      <Text style={styles.info}>Please sign in using your email to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="EMAIL"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />
      <TextInput
        style={styles.input}
        placeholder="PASSWORD"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />

      {/* Buttons in horizontal row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← BACK</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>

          <Text style={styles.buttonText}>LOGIN →</Text>
        </TouchableOpacity>
      </View>

      {/* Forgot password below buttons, right side */}
      <View style={styles.forgotContainer}>
        <Text style={styles.forgotText}>
          Forgot Password? <Text style={styles.forgotLink} onPress={() => router.push('/forgotpass')}>Click here</Text>
        </Text>
      </View>
    </View>
  );
}

const commonButton = {
  height: 44,
  borderRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 120,
  paddingHorizontal: 16,
  marginVertical: 10,
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
  forgotContainer: { alignItems: 'flex-end', marginTop: 6, marginRight: 10 },
  forgotText: { fontSize: 15, color: '#FF6F91' },
  forgotLink: { fontWeight: 'bold', color: '#FF6F91', textDecorationLine: 'underline' },
});



const darkStyles = StyleSheet.create({
  container: { flex: 1, paddingTop: 70,paddingLeft:10,paddingRight:10, backgroundColor: '#3C3C43',lineHeight:57 },
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
  forgotContainer: { alignItems: 'flex-end', marginTop: 6, marginRight: 10 },
  forgotText: { fontSize: 15, color: '#F5F5F5' },
  forgotLink: { fontWeight: 'bold', color: '#D65151', textDecorationLine: 'underline' },

});

