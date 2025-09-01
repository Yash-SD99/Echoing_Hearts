import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useTheme } from '../../utils/themeContext';  // adjust path as needed

const Chats = () => {
    const { theme, mode, toggleTheme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.c1 }]}>
          <Text style={[styles.text, { color: theme.c2 }]}>Chats</Text>
    </View>
  );
}

export default Chats;

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