import React from "react";
import { LoginScreen } from "@app/screen/LoginScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import HomeStack from "./HomeStack";
import WriterStack from "./WriterStack";
import AdminStack from "./AdminStack";
import ExploreStack from "./ExploreStack";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";
import ProfileStack from "./ProfileStack";
import { validateImageUri } from "@shared-utils/validate-image-uri";

const Tab = createBottomTabNavigator();

const DUMMY_AVATAR =
  "https://velle.vn/wp-content/uploads/2025/04/avatar-mac-dinh-4-2.jpg";

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
        tabBarLabel: route.name === "Profile" ? "" : undefined, // No label for avatar tab
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === "Profile") {
            // Always show an avatar image (real or dummy) for Profile tab
            const avatarUri = endUser?.profile_image
              ? process.env.EXPO_PUBLIC_API_BASE_URL + endUser.profile_image
              : DUMMY_AVATAR;
            return (
              <Image
                source={{ uri: validateImageUri(avatarUri, DUMMY_AVATAR) }}
                style={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: focused ? 2 : 1,
                  borderColor: focused ? "#b0e7b7" : "#aaa",
                  backgroundColor: "#222",
                }}
                resizeMode="cover"
              />
            );
          }

          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Explore") iconName = "search-outline";
          else if (route.name === "Writer") iconName = "create-outline";
          else if (route.name === "Admin")
            iconName = "shield-checkmark-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/*
        Nếu là admin:
        - Chỉ hiển thị tab Admin
        Nếu KHÔNG phải admin:
        - Hiển thị Home, Explore, (Writer nếu là writer) và Profile
      */}
      {!isAdmin && (
        <>
          <Tab.Screen name="Home" component={HomeStack} />
          <Tab.Screen name="Explore" component={ExploreStack} />
          {isWriter && <Tab.Screen name="Writer" component={WriterStack} />}
          <Tab.Screen name="Profile" component={ProfileStack} />
        </>
      )}
      {isAdmin && <Tab.Screen name="Admin" component={AdminStack} />}
    </Tab.Navigator>
  );
}
