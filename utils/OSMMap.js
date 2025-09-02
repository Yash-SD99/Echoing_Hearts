import React, { forwardRef, useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import markerImage from '../assets/marker.png';

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

const createHtml = (isDarkMode, userLocation, markerIconBase64) => `
<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /><link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<style>html, body, #map { height: 100%; margin: 0; padding: 0; position: relative;} ${
  isDarkMode ? `
  #greyOverlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(7,7,7,0.32);
    pointer-events: none;
    z-index: 1000;
  }
  `: ''}</style></head><body><div id="map"></div>${isDarkMode ? '<div id="greyOverlay"></div>' : ''}
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script>
  const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const initialLat = ${userLocation?.latitude ?? 37.78825};
  const initialLng = ${userLocation?.longitude ?? -122.4324};
  window.map = L.map('map', { zoomControl: false }).setView([initialLat, initialLng], 18);
  L.tileLayer(tileLayerUrl, { maxZoom: 19, attribution: '© OpenStreetMap contributors' }).addTo(window.map);
  const longPressDuration = 1000;
  let pressTimer;
  const markers = [];
  function addMarker(lat, lng) {
    const marker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: '${markerIconBase64 || 'https://cdn-icons-png.flaticon.com/512/64/64113.png'}',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      })
    }).addTo(window.map);
    marker.bindPopup("<b>Selected Location</b>").openPopup();
    markers.push(marker);
  }
  const mapContainer = document.getElementById('map');
  mapContainer.addEventListener('touchstart', (e) => {
    pressTimer = setTimeout(() => {
      const touch = e.touches[0];
      const point = window.map.containerPointToLatLng([touch.clientX, touch.clientY]);
      addMarker(point.lat, point.lng);
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ lat: point.lat, lng: point.lng }));
      }
    }, longPressDuration);
  });
  ['touchend', 'touchcancel'].forEach(eventName => {
    mapContainer.addEventListener(eventName, () => {
      clearTimeout(pressTimer);
    });
  });
  ${
    userLocation ? `const userMarker = L.marker([${userLocation.latitude}, ${userLocation.longitude}],{
      icon: L.icon({
        iconUrl: '${markerIconBase64 || 'https://cdn-icons-png.flaticon.com/512/64/64113.png'}',
        iconSize: [30,30],
        iconAnchor: [15,30]
      })
    }).addTo(window.map);
    userMarker.bindPopup("<b>Your Location</b>").openPopup();` : ''
  }
</script>
</body></html>
`;

const OSMMap = forwardRef(({ mode = 'light', userLocation }, ref) => {
  const markerIconBase64 = useMarkerIconBase64();

  return (
    <WebView
      key={mode + (markerIconBase64 ? '1' : '0')} // reload when icon loaded
      ref={ref}
      originWhitelist={['*']}
      source={{ html: createHtml(mode === 'dark', userLocation, markerIconBase64) }}
      style={{ flex: 1 }}
      onMessage={event => {
        const data = JSON.parse(event.nativeEvent.data);
        console.log('User placed marker at:', data.lat, data.lng);
        // You can update React Native state, call API, etc.
      }}
    />
  );
});

export default OSMMap;
