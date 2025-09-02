import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import OSMMap from '../../utils/OSMMap'; // Adjust path
import plusIcon from '../../assets/plus.png'; // Adjust path
import minusIcon from '../../assets/minus.png'; // Adjust path
import { useTheme } from '../../utils/themeContext'; // Adjust path

export default function Map() {
  const { mode, toggleTheme } = useTheme();
  const webviewRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const zoomIn = () => {
    webviewRef.current.injectJavaScript(`window.map.zoomIn(); true;`);
  };

  const zoomOut = () => {
    webviewRef.current.injectJavaScript(`window.map.zoomOut(); true;`);
  };

  return (
    <View style={styles.container}>
      <OSMMap ref={webviewRef} mode={mode} userLocation={userLocation} />
      <View style={styles.controls}>
        <TouchableOpacity onPress={zoomIn}>
          <Image source={plusIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomOut}>
          <Image source={minusIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controls: {
    position: 'absolute',
    right: 15,
    bottom: 150,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    gap: 10
  },
  icon: { width: 53, height: 53 },
});
