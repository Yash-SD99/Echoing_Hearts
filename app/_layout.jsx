import React from 'react';
import { View, StatusBar } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme, ThemeProvider } from '../utils/themeContext';

function InnerLayout() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={theme.c1 === '#000000' ? 'light-content' : 'dark-content'}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen name="email"/>
        <Stack.Screen name="forgotpass"/>
        <Stack.Screen name="signup1"/>
        <Stack.Screen name="signup2"/>
        <Stack.Screen name="signup3"/>
      </Stack>

    </>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <InnerLayout />
      </View>
    </ThemeProvider>
  );
}

