import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import * as Location from 'expo-location';
import OSMMap from '../../utils/OSMMap'; // Adjust path
import plusIcon from '../../assets/plus.png';  // Adjust path
import minusIcon from '../../assets/minus.png'; // Adjust path
import { useTheme } from '../../utils/themeContext'; // Adjust path
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebaseConfig';  // Adjust path to your config

export default function Map() {
  const { mode } = useTheme();
  const webviewRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    let subscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }

      // Get initial location
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Watch location updates continuously
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, distanceInterval: 1 },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          setUserLocation({ latitude, longitude });

          // Inject JS to update user live location marker dynamically
          if (webviewRef.current) {
            const jsCode = `
              if (window.updateUserLocation) {
                window.updateUserLocation(${latitude}, ${longitude});
              }
              true;
            `;
            webviewRef.current.injectJavaScript(jsCode);
          }
        }
      );

      async function loadMarkers() {
        try {
          const snapshot = await getDocs(collection(db, 'whispers'));
          const loadedMarkers = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              latitude: data.Location.latitude,
              longitude: data.Location.longitude,
              text: data.text,
              username: data.username,
            };
          });
          setMarkers(loadedMarkers);
        } catch (error) {
          console.error('Error fetching whispers:', error);
        }
      }
      loadMarkers();
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  // Function to place a marker at the current user location on demand
  const placeMarkerAtUserLocation = () => {
    if (!userLocation || !webviewRef.current) return;
    const jsCode = `
      if(window.placeMarkerAtUserLocation) {
        window.placeMarkerAtUserLocation(${userLocation.latitude}, ${userLocation.longitude});
      }
      true;
    `;
    webviewRef.current.injectJavaScript(jsCode);
  };

  const zoomIn = () => {
    webviewRef.current?.injectJavaScript(`window.map.zoomIn(); true;`);
  };

  const zoomOut = () => {
    webviewRef.current?.injectJavaScript(`window.map.zoomOut(); true;`);
  };

  return (
    <View style={styles.container}>
      <OSMMap ref={webviewRef} mode={mode} userLocation={userLocation} markers={markers}/>
      <View style={styles.controls}>
        <TouchableOpacity onPress={zoomIn}>
          <Image source={plusIcon} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={zoomOut}>
          <Image source={minusIcon} style={styles.icon} />
        </TouchableOpacity>
        </View>
        <View style={styles.addWhis}>
        <TouchableOpacity
          onPress={placeMarkerAtUserLocation}
          style={styles.markerButton}
        >
          <Text style={styles.markerButtonText}>Add Marker on My Location</Text>
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
    backgroundColor: 'transparent',
    gap: 10,
  },
  addWhis: {
    position: 'absolute',
    backgroundColor: 'transparent',
    left: 15,
    bottom: 150
  },
  icon: { width: 53, height: 53, marginBottom: 10},
  markerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  markerButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});