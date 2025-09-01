import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../utils/themeContext';

export default function Profile() {
  const { theme, mode, toggleTheme } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.c1 }]}>
      <Text style={[styles.text, { color: theme.c2 }]}>Profile Screen</Text>

      <Button
        title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        onPress={toggleTheme}
      />

      {/* Login Button */}
      <View style={styles.loginButton}>
        <Button
          title="Login"
          onPress={() => router.push('/login')}
          color={theme.c2} // optional: adapt color to theme
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
  loginButton: {
    marginTop: 20,
    width: '60%',
  },
});
