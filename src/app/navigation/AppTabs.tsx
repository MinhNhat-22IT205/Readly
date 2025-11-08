import React from "react";
import { LoginScreen } from "@app/screen/LoginScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Expo includes this
import HomeStack from "./HomeStack";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#111827" },
        tabBarActiveTintColor: "#b0e7b7",
        tabBarInactiveTintColor: "#ccc",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          // Set icon per route
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Explore") iconName = "search-outline";
          else if (route.name === "Library") iconName = "library-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Explore" component={LoginScreen} />
      <Tab.Screen name="Library" component={LoginScreen} />
    </Tab.Navigator>
  );
}
