// app/(tabs)/profile.jsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTheme } from '../../utils/themeContext';


export default function Profile() {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.c1 }]}>
      <Text style={[styles.text, { color: theme.c2 }]}>Profile Screen</Text>
      <Button
        title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        onPress={toggleTheme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});
