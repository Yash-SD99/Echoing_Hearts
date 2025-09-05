import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db } from "../utils/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function AddWhisper() {
  const { latitude, longitude } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "You must be logged in to post a whisper.");
        return;
      }

      // Create (or find) whisper document for this location
      const whisperDoc = await addDoc(collection(db, "whispers"), {
        Location: { latitude: Number(latitude), longitude: Number(longitude) },
      });

      // Save whisper message under subcollection "w"
      await addDoc(collection(db, "whispers", whisperDoc.id, "w"), {
        title,
        text,
        username: user.displayName || "Anonymous",
        uid: user.uid,
        likes: 0,
        dislikes: 0,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Whisper added!");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save whisper.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Text</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={text}
        onChangeText={setText}
        placeholder="Enter your whisper..."
        multiline
      />

      <Button title="Save Whisper" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
});
