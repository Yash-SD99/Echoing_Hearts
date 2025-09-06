import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../utils/themeContext';

export default function SelectProfile() {
  const { mode } = useTheme();
const isDarkMode = mode === 'dark';

  const styles = isDarkMode ? darkStyles : lightStyles;

  const [displayName, setDisplayName] = useState('');
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square crop
        quality: 1,
      });
      if (!result.cancelled) {
        setImageUri(result.uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>Mystery Makers</Text>
      </View>
      <Text style={styles.subtitle}>Select a profile picture</Text>
      <Text style={styles.helper}>
        Choose a photo (not of yourself) and a display name (not your real name) that really captures your vibe
      </Text>

      <TouchableOpacity style={styles.plusCircle} onPress={pickImage} activeOpacity={0.7}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <Text style={styles.plusIcon}>+</Text>
        )}
      </TouchableOpacity>

      <View style={styles.inputWrap}>
        <TextInput
          style={styles.input}
          placeholder="Enter display name"
          placeholderTextColor={styles.placeholderColor.color}
          value={displayName}
          onChangeText={setDisplayName}
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
}


const commonButton = {
  padding: 14,
  marginVertical: 10,
  borderRadius: 30,
  width: 250,
  alignItems: 'center',
};

const lightStyles = StyleSheet.create({
  container: { flex: 1, paddingTop: 70,paddingLeft:10,paddingRight:10, backgroundColor: '#FFECEC',alignItems:'center'
  },
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
  plusCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#C8A4A7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#B67A7A',
    marginBottom: 26,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  plusIcon: {
    fontSize: 56,
    color: '#B67A7A',
  },
  avatar: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 3,
    borderColor: '#FF6F91',
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
  plusCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#674047',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFB3C6',
    marginBottom: 26,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  plusIcon: {
    fontSize: 56,
    color: '#FFB3C6',
  },
  avatar: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 3,
    borderColor: '#FF6F91',
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
