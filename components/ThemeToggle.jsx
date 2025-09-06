import React, { useContext } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

import { useTheme } from '../utils/themeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

import { ThemeContext } from '../context/ThemeContext';

// export default function ThemeToggle() {
//   const { theme, toggleTheme } = useContext(ThemeContext);

  const isDarkMode = theme === 'dark';

  return (
    <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      <Image
        source={
          isDarkMode
            ? require('../assets/images/lightmode.png')
            : require('../assets/images/darkmode.png')
        }
        style={styles.toggleIcon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  themeToggle: {
    position: 'absolute',
    top: 40,
    left: 30,
    zIndex: 10,
  },
  toggleIcon: {
    width: 20,
    height: 20,
  },
});
