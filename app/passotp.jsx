import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function PassOtp() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const [otp, setOtp] = useState('');
  const styles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <ThemeToggle />

      <View style={styles.titleBox}>
        <Text style={styles.title}>Mystery Makers</Text>
      </View>

      <Text style={styles.subtitle}>Enter the OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← BACK</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => {/* OTP verification logic */}}>
          <Text style={styles.buttonText}>LOGIN →</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => {/* Resend OTP logic */}}>
        <Text style={styles.resendText}>Didn't receive it? Click here</Text>
      </TouchableOpacity>
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
  container: { flex: 1, paddingTop: 60, backgroundColor: '#FFE4E1', paddingHorizontal: 20 },
  titleBox: {
    alignSelf: 'center',
    backgroundColor: '#FF6F91',
    borderRadius: 30,
    paddingVertical: 35,
    paddingHorizontal: 20,
    marginBottom: 30,
    width: '85%',
    elevation: 2,
  },
  title: { fontSize: 48, fontWeight: 'bold', color: '#FFECEC', textAlign: 'center', letterSpacing: 2 },
  subtitle: { fontSize: 24, fontWeight: 'bold', color: '#FF6F91', marginBottom: 20, textAlign: 'left' },
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
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  button: { ...commonButton, backgroundColor: '#FF6F91', marginHorizontal: 6, flex: 1 },
  backButton: { backgroundColor: '#FFE4E1', borderWidth: 1, borderColor: '#FF6F91' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  resendText: { color: '#FF6F91', textAlign: 'center', marginTop: 15, textDecorationLine: 'underline', fontSize: 14 },
});

const darkStyles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, backgroundColor: '#222229', paddingHorizontal: 20 },
  titleBox: {
    alignSelf: 'center',
    backgroundColor: '#B03A3A',
    borderRadius: 30,
    paddingVertical: 35,
    paddingHorizontal: 20,
    marginBottom: 30,
    width: '85%',
    elevation: 2,
  },
  title: { fontSize: 48, fontWeight: 'bold', color: '#FFECEC', textAlign: 'center', letterSpacing: 2 },
  subtitle: { fontSize: 24, fontWeight: 'bold', color: '#D65151', marginBottom: 20, textAlign: 'left' },
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
  button: { ...commonButton, backgroundColor: '#B03A3A', marginHorizontal: 6, flex: 1 },
  backButton: { backgroundColor: '#222229', borderWidth: 1, borderColor: '#D65151' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  resendText: { color: '#D65151', textAlign: 'center', marginTop: 15, textDecorationLine: 'underline', fontSize: 14 },
});
