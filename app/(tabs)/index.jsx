import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useTheme } from '../../utils/themeContext';  // adjust path as needed

const Home = () => {
  const { theme, mode, toggleTheme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.c1 }]}>
          <Text style={[styles.text, { color: theme.c2 }]}>Home</Text>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
    text: {
        fontSize: 20
    },

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
    }
});