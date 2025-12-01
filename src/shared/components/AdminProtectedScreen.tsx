import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";

interface AdminProtectedScreenProps {
  children: React.ReactNode;
}

/**
 * Wrapper component để bảo vệ các màn hình admin
 * Chỉ cho phép user có role "admin" truy cập
 */
export const AdminProtectedScreen = ({
  children,
}: AdminProtectedScreenProps) => {
  const navigation = useNavigation();
  const endUser = useAuthStore((state) => state.endUser);
  const isAdmin = endUser?.role === "admin";

  // Redirect nếu không phải admin
  useEffect(() => {
    if (endUser && Object.keys(endUser).length > 0 && !isAdmin) {
      // Navigate về tab Home
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate("Home");
      }
    }
  }, [endUser, isAdmin, navigation]);

  // Hiển thị loading nếu chưa có user data
  if (!endUser || Object.keys(endUser).length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#A5B4FC" />
        </View>
      </SafeAreaView>
    );
  }

  // Hiển thị access denied nếu không phải admin
  if (!isAdmin) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="shield-outline" size={64} color="#EF4444" />
          <Text className="text-white text-xl font-bold mt-4 text-center">
            Access Denied
          </Text>
          <Text className="text-gray-400 text-base mt-2 text-center">
            You don't have permission to access this page.
          </Text>
          <Text className="text-gray-500 text-sm mt-1 text-center">
            Admin access required.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render children nếu là admin
  return <>{children}</>;
};

