import React, { forwardRef, useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system/legacy';
import { Asset } from 'expo-asset';
import markerImage from '../assets/marker.png';
import userMarkerImage from '../assets/cur.png';

function useUserMarkerIconBase64() {
  const [base64, setBase64] = useState(null);

  useEffect(() => {
    async function loadBase64() {
      const asset = Asset.fromModule(userMarkerImage);
      await asset.downloadAsync();
      const base64str = await FileSystem.readAsStringAsync(asset.localUri, { encoding: 'base64' });
       setBase64(`data:image/png;base64,${base64str}`);
    }
    loadBase64();
  }, []);

  return base64;
}

function useMarkerIconBase64() {
  const [base64, setBase64] = useState(null);

  useEffect(() => {
    async function loadBase64() {
      const asset = Asset.fromModule(markerImage);
      await asset.downloadAsync();
      const base64str = await FileSystem.readAsStringAsync(asset.localUri, { encoding: 'base64' });
      setBase64(`data:image/png;base64,${base64str}`);
    }
    loadBase64();
  }, []);

  return base64;
}

const createHtml = (isDarkMode, userLocation, userMarkerIconBase64, markerIconBase64, markers) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; position: relative; }
  ${isDarkMode ? `
    #greyOverlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background-color: rgba(7,7,7,0.32);
      pointer-events: none;
      z-index: 1000;
    }
  ` : ''}
</style>
</head>
<body>
  <div id="map"></div>
  ${isDarkMode ? '<div id="greyOverlay"></div>' : ''}
  
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script>
    const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const initialLat = ${userLocation?.latitude ?? 37.78825};
    const initialLng = ${userLocation?.longitude ?? -122.4324};
    const desiredZoom = 18;

    window.map = L.map('map', { zoomControl: false }).setView([initialLat, initialLng], desiredZoom);
    L.tileLayer(tileLayerUrl, { maxZoom: 19, attribution: '© OpenStreetMap contributors' }).addTo(window.map);

    // Render markers from Firebase
    const markerLocations = ${JSON.stringify(markers)};

    markerLocations.forEach(loc => {
  const marker = L.marker([loc.latitude, loc.longitude], {
    icon: L.icon({
      iconUrl: '${markerIconBase64}',
      iconSize: [30, 41],
      iconAnchor: [15, 41]
    }),
  }).addTo(window.map)
    // .bindPopup(\`
    //   <div style="min-width:150px;">
    //     <b>\${loc.title || "Untitled"}</b><br>
    //     <p>\${loc.text || ""}</p>
    //     <small>by \${loc.username || "Anonymous"}</small><br>
    //     👍 \${loc.likes ?? 0} | 👎 \${loc.dislikes ?? 0}
    //   </div>
    // \`);

  // ✅ Add click listener to send coordinates to React Native
  marker.on('click', function() {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      latitude: loc.latitude,
      longitude: loc.longitude
    }));
  });
});




    // Create user marker variable outside conditional for update support
    let userMarker = null;  
    let firstUpdate = true;  

    if (${userLocation ? 'true' : 'false'}) {
      userMarker = L.marker([${userLocation?.latitude}, ${userLocation?.longitude}], {
        icon: L.icon({
          iconUrl: '${userMarkerIconBase64}',
          iconSize: [37, 37],
          iconAnchor: [18.5, 30],
        }),
        zIndexOffset: 1000
      }).addTo(window.map).bindPopup("<b>Your Location</b>")
        .on('click', function() {
          window.map.setView(this.getLatLng(), desiredZoom);
        });
    }

    window.updateUserLocation = function(lat, lng) {
      if (userMarker) {
        userMarker.setLatLng([lat, lng]);
        if (firstUpdate) {
          window.map.panTo([lat, lng]);
          firstUpdate = false;
        }
      } else {
        userMarker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: '${userMarkerIconBase64}',
            iconSize: [37, 37],
            iconAnchor: [18.5, 37]
          })
        }).addTo(window.map);
        userMarker.bindPopup("<b>Your Location</b>").openPopup();
        window.map.panTo([lat, lng]);
        firstUpdate = false;
      }
    };

  </script>
</body>
</html>
`;

const OSMMap = forwardRef(({ mode = 'light', userLocation, markers = [], onMarkerPress }, ref) => {
  const userMarkerIconBase64 = useUserMarkerIconBase64();
  const markerIconBase64 = useMarkerIconBase64();

  return (
    <WebView
      key={mode + (markerIconBase64 ? '1' : '0') + (markers.length ? '1' : '0')}
      ref={ref}
      originWhitelist={['*']}
      source={{ html: createHtml(mode === 'dark', userLocation, userMarkerIconBase64, markerIconBase64, markers) }}
      style={{ flex: 1 }}
      onMessage={event => {
        const data = JSON.parse(event.nativeEvent.data);
        // ✅ Call parent callback if defined
        if (onMarkerPress) onMarkerPress(data);
      }}
    />
  );
});

export default OSMMap;