import React, { useState, useContext, useRef,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggle from '../components/ThemeToggle';
import { UserContext } from "../context/UserContext";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig';

export default function PhoneOtp() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const recaptchaVerifier = useRef(null);
  const { userPhone } = useContext(UserContext);

  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const styles = isDarkMode ? darkStyles : lightStyles;
  const auth = getAuth(); // Initialize Firebase Auth

  // Send OTP when user presses button
  const sendOtp = async () => {
    if (!userPhone) return;

    const formattedPhone = userPhone.startsWith('+') ? userPhone : `+91${userPhone}`;

    try {
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier.current);
      setConfirmationResult(confirmation);
      Alert.alert('OTP Sent', `OTP sent to ${formattedPhone}`);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  useEffect(() => {
    if (userPhone) {
      sendOtp();
    }
  }, [userPhone]);

  const verifyOtp = async () => {
    if (!confirmationResult) {
      Alert.alert('Error', 'Please request OTP first');
      return;
    }

    try {
      await confirmationResult.confirm(otp);
      Alert.alert('Success', 'Phone authentication successful!');
      router.push('/(tabs)/index,js'); // navigate after successful login
    } catch (err) {
      Alert.alert('Invalid OTP', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true} // optional
      />

      <ThemeToggle />

      <View style={styles.titleBox}>
        <Text style={styles.title}>Mystery Makers</Text>
      </View>

      <Text style={styles.subtitle}>Enter OTP</Text>
      <Text style={styles.info}>
        Enter the OTP received on your mobile number:{userPhone}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />

      <TouchableOpacity onPress={sendOtp}>
        <Text style={styles.resendText}>Didn't receive OTP? Click here</Text>
      </TouchableOpacity>
        <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← BACK</Text>
        </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>LOGIN →</Text>
      </TouchableOpacity>
    </View>
    
    </View>
  );
  
}

// Styles omitted for brevity (use your previous lightStyles and darkStyles)

// styles here (reuse your current lightStyles & darkStyles)

// Add your lightStyles and darkStyles here (same as your current code)


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
  resendText: { color: '#FF383C',opacity:0.5, textAlign: 'right', textDecorationLine: 'underline', fontSize: 14 },
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
  resendText: { color: '#FF383C',opacity:0.5, textAlign: 'right', textDecorationLine: 'underline', fontSize: 14 },
});
