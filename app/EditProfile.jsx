import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../utils/themeContext";
import { auth, db } from "../utils/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import profilePics from "../constants/profilePics";
import { router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';


export default function EditProfile() {
  const { theme, mode, toggleTheme } = useTheme();

  const [userData, setUserData] = useState({
    displayName: "",
    username: "",
    gender: "",
    height: "",
    Traits: "",
    About: "",
    profilePic: "male",
    Interests: [],
  });
  const [userInterests, setUserInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = auth.currentUser.uid;
        const docSnap = await getDoc(doc(db, "users", userId));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          setUserInterests(data.Interests || []);
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (key, value) => {
    setUserData((prev) => ({ ...prev, [key]: value }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !userInterests.includes(newInterest.trim())) {
      setUserInterests([...userInterests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest) => {
    setUserInterests(userInterests.filter((i) => i !== interest));
  };

  const handleSave = async () => {
    try {
      const userId = auth.currentUser.uid;
      await setDoc(
        doc(db, "users", userId),
        { ...userData, Interests: userInterests },
        { merge: true }
      );
      alert("Profile updated!");
      router.push("/(tabs)/profile");
    } catch (error) {
      console.log("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <Text style={{ padding: 20 }}>Loading...</Text>;

  const backgroundColor = theme.c1;
  const textColor = theme.c2;
  const cardBackground = mode === "light" ? "#FFFFFF" : "#1E1E1E";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar
        barStyle={mode === "light" ? "dark-content" : "light-content"}
        backgroundColor={mode === "light" ? "#ff7e5f" : "#1A1A1A"}
      />
      <LinearGradient
        colors={mode === "light" ? ["#ff7e5f", "#feb47b"] : ["#1A1A1A", "#2D2D2D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={[styles.headerTitle, { color: "#fff" }]}>Edit Profile</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name={mode === "light" ? "moon" : "sunny"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarWrapper, { borderColor: cardBackground }]}>
            <Image
              source={profilePics[userData.profilePic] || profilePics.male}
              style={styles.avatar}
            />
          </View>
          <Text style={[styles.username, { color: textColor }]}>
            {userData.username || "---"}
          </Text>
        </View>

        <View style={[styles.page, { backgroundColor: cardBackground }]}>
          {/* <Text style={[styles.noticeText, { color: mode === "light" ? "#FF4500" : "#FFA07A" }]}>
            Changes may take a few minutes to update. You might need to restart or login again to see changes.
          </Text> */}

          {/* Display Name */}
          <Text style={[styles.label, { color: textColor }]}>Display Name</Text>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: "#ccc" }]}
            value={userData.displayName}
            onChangeText={(text) => handleChange("displayName", text)}
            placeholder="Enter display name"
            placeholderTextColor={mode === "light" ? "#888" : "#AAA"}
          />

          {/* Gender */}
          <Text style={[styles.label, { color: textColor }]}>Gender</Text>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: "#ccc" }]}
            value={userData.gender}
            onChangeText={(text) => handleChange("gender", text)}
            placeholder="Enter gender"
            placeholderTextColor={mode === "light" ? "#888" : "#AAA"}
          />

          {/* Height */}
          <Text style={[styles.label, { color: textColor }]}>Height in cm</Text>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: "#ccc" }]}
            value={userData.height}
            onChangeText={(text) => handleChange("height", text)}
            placeholder="Enter height"
            placeholderTextColor={mode === "light" ? "#888" : "#AAA"}
          />
          {/* Song */}
            <Text style={[styles.label, { color: textColor }]}>Favorite Song</Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: "#ccc" }]}
              value={userData.song || ""}
              onChangeText={(text) => handleChange("song", text)}
              placeholder="Enter favorite song"
              placeholderTextColor={mode === "light" ? "#888" : "#AAA"}
            />

            {/* Mood */}
            <Text style={[styles.label, { color: textColor }]}>Mood</Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: "#ccc" }]}
              value={userData.mood || ""}
              onChangeText={(text) => handleChange("mood", text)}
              placeholder="Enter your mood"
              placeholderTextColor={mode === "light" ? "#888" : "#AAA"}
            />

            {/* City */}
            <Text style={[styles.label, { color: textColor }]}>City</Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: "#ccc" }]}
              value={userData.city || ""}
              onChangeText={(text) => handleChange("city", text)}
              placeholder="Enter your city"
              placeholderTextColor={mode === "light" ? "#888" : "#AAA"}
            />

            {/* Address */}
            <Text style={[styles.label, { color: textColor }]}>Address</Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: "#ccc" }]}
              value={userData.address || ""}
              onChangeText={(text) => handleChange("address", text)}
              placeholder="Enter your address"
              placeholderTextColor={mode === "light" ? "#888" : "#AAA"}
            />

            {/* Fact */}
            <Text style={[styles.label, { color: textColor }]}>Fact</Text>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: "#ccc", height: 60, textAlignVertical: "top" }]}
              value={userData.fact || ""}
              onChangeText={(text) => handleChange("fact", text)}
              placeholder="Enter a fact about yourself"
              placeholderTextColor={mode === "light" ? "#888" : "#AAA"}
              multiline
            />

          {/* Traits */}
          <Text style={[styles.label, { color: textColor }]}>Traits</Text>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: "#ccc" }]}
            value={userData.Traits}
            onChangeText={(text) => handleChange("Traits", text)}
            placeholder="Enter traits"
            placeholderTextColor={mode === "light" ? "#888" : "#AAA"}
          />

          {/* About */}
          <Text style={[styles.label, { color: textColor }]}>About Me</Text>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: "#ccc", height: 80, textAlignVertical: "top" }]}
            value={userData.About}
            onChangeText={(text) => handleChange("About", text)}
            placeholder="Write about yourself"
            placeholderTextColor={mode === "light" ? "#888" : "#AAA"}
            multiline
          />

          {/* Interests */}
          <Text style={[styles.label, { color: textColor }]}>Interests</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 10 }}>
            {userInterests.map((interest, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: mode === "light" ? "#ffebe8" : "#4A4A4A",
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 20,
                  marginRight: 8,
                  marginBottom: 8,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: textColor, marginRight: 5 }}>{interest}</Text>
                <TouchableOpacity onPress={() => removeInterest(interest)}>
                  <Ionicons name="close-circle" size={16} color={mode === "light" ? "#ff7e5f" : "#FFA07A"} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
            <TextInput
              style={[styles.input, { flex: 1, color: textColor }]}
              placeholder="Add new interest"
              placeholderTextColor={mode === "light" ? "#888" : "#AAA"}
              value={newInterest}
              onChangeText={setNewInterest}
            />
            <TouchableOpacity onPress={addInterest} style={{ marginLeft: 10 }}>
              <Ionicons name="add-circle" size={30} color={mode === "light" ? "#ff7e5f" : "#FFA07A"} />
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: mode === "light" ? "#ff7e5f" : "#4A4A4A" }]}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainScrollView: { flex: 1 },
  header: { width: "100%", paddingVertical: 15, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  avatarContainer: { alignItems: "center", marginVertical: 20 },
  avatarWrapper: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, overflow: "hidden" },
  avatar: { width: "100%", height: "100%" },
  username: { fontSize: 18, fontWeight: "600", marginTop: 10 },
  page: { marginHorizontal: 20, borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  label: { fontWeight: "bold", marginBottom: 5 },
  input: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 15 },
  saveBtn: { paddingVertical: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  noticeText: { fontSize: 12, marginBottom: 10 }
});
