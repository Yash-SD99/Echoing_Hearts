import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '../../utils/themeContext';
import { Text, Image, ImageBackground } from 'react-native';

const TabIcon = ({ focused, icon }) => {
  return (
    <ImageBackground
      style={{
        opacity: focused ? 1 : 0.5, // slightly dim when not focused
      }}
    >
      <Image
        source={icon}
        style={{ width: 72, height: 72, resizeMode: 'contain' }}
      />
    </ImageBackground>
  );
};

const _Layout = () => {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'center',  // corrected typo
          alignItems: 'center',
        },
        tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,      // Remove top border line
            elevation: 0,           // Remove shadow on Android
            shadowOpacity: 0,       // Remove iOS shadow
            shadowOffset: {
                height: 0,
            },
            shadowRadius: 0,
            marginHorizontal: 10,
            marginBottom: 25,
            height: 75,
            position: 'absolute',
            overflow: 'visible',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={require('../../assets/home.png')} />,
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={require('../../assets/map.png')} />,
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={require('../../assets/chat.png')} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={require('../../assets/profile.png')} />,
        }}
      />
    </Tabs>
  );
};

export default _Layout;