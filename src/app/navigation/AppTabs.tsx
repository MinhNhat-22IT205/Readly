import React from "react";
import { LoginScreen } from "@app/screen/LoginScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Expo includes this
import HomeStack from "./HomeStack";
import WriterStack from "./WriterStack";
import AdminStack from "./AdminStack";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const endUser = useAuthStore((state) => state.endUser);
  const isWriter = endUser.role === "writer";
  const isAdmin = endUser.role === "admin";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#000" },
        tabBarActiveTintColor: "#b0e7b7",
        tabBarInactiveTintColor: "#ccc",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          // Set icon per route
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Explore") iconName = "search-outline";
          else if (route.name === "Library") iconName = "library-outline";
          else if (route.name === "Writer") iconName = "create-outline";
          else if (route.name === "Admin")
            iconName = "shield-checkmark-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Explore" component={LoginScreen} />
      {isWriter && <Tab.Screen name="Writer" component={WriterStack} />}
      {isAdmin && <Tab.Screen name="Admin" component={AdminStack} />}
      <Tab.Screen name="Library" component={LoginScreen} />
    </Tab.Navigator>
  );
}
