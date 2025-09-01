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
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
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

