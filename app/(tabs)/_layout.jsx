// app/_layout.js
import React from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '../../utils/themeContext';
import { Image, ImageBackground } from 'react-native';

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
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
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
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={require('../../assets/map.png')} />,
        }}
      />

      <Tabs.Screen
        name="whispers"
        options={{
          title: "Whispers",
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={require('../../assets/whisper.png')} />,
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