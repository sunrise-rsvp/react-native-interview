import Colors from '@constants/Colors';
import {
  CoinsDollarIcon,
  Home13Icon,
  Mail01Icon,
  Notification01Icon,
  Search01Icon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { type BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { isNative } from '@sunrise-ui/primitives';
import { headerOptionsCreator } from '@utils/screenOptions';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const screenOptions: BottomTabNavigationOptions = {
    tabBarActiveTintColor: Colors.dark.yellow0,
    tabBarStyle: {
      shadowColor: Colors.dark.yellow0,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,
      shadowRadius: isNative ? 5 : 10,
      elevation: 10, // Needed for Android
    },
    tabBarShowLabel: false,
    ...headerOptionsCreator(),
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="events"
        options={{
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={Home13Icon} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={UserCircleIcon} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
