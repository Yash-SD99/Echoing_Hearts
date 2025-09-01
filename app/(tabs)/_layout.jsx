import React from 'react'
import { Tabs } from 'expo-router'
import { useTheme } from '../../utils/themeContext';

const _Layout = () => {
      const { theme, mode, toggleTheme } = useTheme();
    return (
        <Tabs 
            screenOptions={{
                tabBarItemStyle: {
                    flex : 1,
                    width: '100%',
                    height: '100%',
                    justifyContents: 'center',
                    alignItems: 'center'
                },
                tabBarStyle: {
                    backgroundColor: theme.c2,
                    borderRadius: 50,
                    marginhorizontal: 10,
                    marginBottom: 36,
                    height: '75',
                    position: 'absolute',
                    borderWidth: 1,
                    overflow: 'hidden'
                }
            }}
        > 
            <Tabs.Screen
                name = "index"
                options={{
                    title: "Home",
                    headerShown: false,
                }}
            />

            <Tabs.Screen 
                name = "map"
                options={{
                    title: "Map",
                    headerShown: false
                }}
            />

            <Tabs.Screen 
                name = "chats"
                options={{
                    title: "Chats",
                    headerShown: false
                }}
            />

            <Tabs.Screen 
                name = "profile"
                options={{
                    title: "Profile",
                    headerShown: false
                }}
            />
        </Tabs>
    )
}

export default _Layout;