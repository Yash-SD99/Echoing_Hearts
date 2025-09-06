
// pages/Login.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../utils/themeContext'; // Adjust path as needed

import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const router = useRouter();

  const { theme, mode } = useTheme();

  const isDarkMode = mode === 'dark';

  const styles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>

      <ThemeToggle style={styles.themeToggle} />

      <Text style={styles.title}>Mystery Makers</Text>

      <Image
        source={require('../assets/images/globe.png')}
        style={styles.globe}
      />

      <Text style={styles.subtitle}>Let's meet new people around us!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/phone')}
      >
        <Text style={styles.buttonText}>Login with Phone</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/email')}
      >

        <Text style={styles.buttonText}>Login with Email</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/signup1')}>
        <Text style={styles.signupLink}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}


// Shared button styles for both themes

const commonButton = {
  padding: 14,
  marginVertical: 10,
  borderRadius: 30,
  width: 250,
  alignItems: 'center',
};

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFE4E1',
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    left: 30,
    zIndex: 10,
  },

  globe: { width: 250, height: 250, marginBottom: 20 },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF383C',
    opacity: 0.5,
    textAlign: 'center',
    lineHeight: 57,
  },
  subtitle: {
    fontSize: 28,
    color: '#000000',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: { backgroundColor: '#FF383c', ...commonButton, opacity: 0.5 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  signupLink: {
    marginTop: 15,
    color: '#FF6F91',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});


const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#222229',
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    left: 30,
    zIndex: 10,
  },

  globe: { width: 250, height: 250, marginBottom: 20 },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF383C',
    opacity: 0.5,
    textAlign: 'center',
    lineHeight: 57,
  },
  subtitle: {
    fontSize: 28,
    color: '#B03A3A',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: { backgroundColor: '#B03A3A', ...commonButton },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  signupLink: {
    marginTop: 15,
    color: '#D65151',
    textDecorationLine: 'underline',
    fontSize: 16,
  },

  toggleIcon: {
    width: 20,
    height: 20,
  },
});