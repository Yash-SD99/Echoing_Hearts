// import React, { forwardRef } from 'react';
// import { WebView } from 'react-native-webview';

// const createHtml = (isDarkMode, userLocation) => `
// <!DOCTYPE html>
// <html>
// <head>
// <meta name="viewport" content="width=device-width, initial-scale=1.0">
// <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
// <style>
//   html, body, #map { height: 100%; margin: 0; padding: 0; }
// </style>
// </head>
// <body>
// <div id="map"></div>
// <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
// <script>
//   const tileLayerUrl = "${isDarkMode ? 
//     'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' : 
//     'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}";

//   const initialLat = ${userLocation ? userLocation.latitude : 37.78825};
//   const initialLng = ${userLocation ? userLocation.longitude : -122.4324};

//   window.map = L.map('map', { zoomControl: false }).setView([initialLat, initialLng], 13);

//   L.tileLayer(tileLayerUrl, {
//     maxZoom: 19,
//     attribution: '© OpenStreetMap contributors'
//   }).addTo(window.map);

//   ${userLocation ? `
//     const userMarker = L.marker([${userLocation.latitude}, ${userLocation.longitude}], {
//       icon: L.icon({
//         iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
//         iconSize: [30, 30],
//         iconAnchor: [15, 30],
//       })
//     }).addTo(window.map);
//     userMarker.bindPopup("<b>Your Location</b>").openPopup();
//   ` : ''}
// </script>
// </body>
// </html>
// `;

// const OSMMap = forwardRef(({ mode = 'light', userLocation }, ref) => {
//   const isDarkMode = mode === 'dark';

//   return (
//     <WebView
//       key={mode} // reload HTML on mode change
//       ref={ref}
//       originWhitelist={['*']}
//       source={{ html: createHtml(isDarkMode, userLocation) }}
//       style={{ flex: 1 }}
//     />
//   );
// });

// export default OSMMap;

import React, { forwardRef } from 'react';
import { WebView } from 'react-native-webview';

const createHtml = (isDarkMode, userLocation) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; position: relative; }
  
  /* Grey overlay to darken map in dark mode */
  ${isDarkMode ? `
  #greyOverlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(7, 7, 7, 0.32);
    pointer-events: none; /* Allow interactions through overlay */
    z-index: 1000; /* Above map tiles */
  }
  ` : ''}
</style>
</head>
<body>
  <div id="map"></div>
  ${isDarkMode ? `<div id="greyOverlay"></div>` : ''}
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script>
    const tileLayerUrl = "${ 
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}";

    const initialLat = ${userLocation ? userLocation.latitude : 37.78825};
    const initialLng = ${userLocation ? userLocation.longitude : -122.4324};

    window.map = L.map('map', { zoomControl: false }).setView([initialLat, initialLng], 13);

    L.tileLayer(tileLayerUrl, {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(window.map);

    ${userLocation ? `
      const userMarker = L.marker([${userLocation.latitude}, ${userLocation.longitude}], {
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        })
      }).addTo(window.map);
      userMarker.bindPopup("<b>Your Location</b>").openPopup();
    ` : ''}
  </script>
</body>
</html>
`;

const OSMMap = forwardRef(({ mode = 'light', userLocation }, ref) => {
  const isDarkMode = mode === 'dark';

  return (
    <WebView
      key={mode} // reloads HTML when mode changes
      ref={ref}
      originWhitelist={['*']}
      source={{ html: createHtml(isDarkMode, userLocation) }}
      style={{ flex: 1 }}
    />
  );
});

export default OSMMap;
