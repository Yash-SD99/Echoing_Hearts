import React, { useState, useContext,useRef,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert } from 'react-native';
import { useRouter,useLocalSearchParams } from 'expo-router';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import{auth} from '../utils/firebaseConfig'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { signInWithPhoneNumber } from 'firebase/auth';

export default function PhoneOtp() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  const recaptchaVerifier = useRef(null);
  const { phone } = useLocalSearchParams();  
  const [phoneNumber, setPhoneNumber] = useState(phone || '')
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null)

  const styles = isDarkMode ? darkStyles : lightStyles;

  const sendOtp = async () => {
    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.current
      );
      setConfirmationResult(confirmation);
      Alert.alert('OTP sent!');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };
  
  const verifyOtp = async () => {
    try {
      if (!confirmationResult) {
        Alert.alert('Error', 'First request OTP!');
        return;
      }
      await confirmationResult.confirm(otp); 
      Alert.alert('Success', 'Phone authentication successful!');
      router.push('/home'); 
    } catch (err) {
      Alert.alert('Invalid OTP', err.message);
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      sendOtp();
    }
  }, []);


  return (
    <View style={styles.container}>
      
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      />
      <ThemeToggle />

      <View style={styles.titleBox}>
        <Text style={styles.title}>Mystery Makers</Text>
      </View>

      <Text style={styles.subtitle}>Enter the OTP</Text>
      <Text style={styles.info}>Please enter the OTP received on your mobile number to continue</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
        placeholderTextColor={isDarkMode ? '#AAA' : '#555'}
      />

      <TouchableOpacity onPress={sendOtp}>
        <Text style={styles.resendText}>Didn't receive it? Click here</Text>
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