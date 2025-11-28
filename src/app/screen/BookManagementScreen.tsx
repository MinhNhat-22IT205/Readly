import React from "react";
import { View, Text, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { AdminStackParamList } from "../navigation/AdminStack";

type BookManagementScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "BookManagement"
>;

export default function BookManagementScreen() {
  const navigation = useNavigation<BookManagementScreenNavigationProp>();

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white">Book Management</Text>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-4">
        <Ionicons name="book-outline" size={64} color="#6B7280" />
        <Text className="text-gray-400 text-lg mt-4 text-center">
          Book Management Screen
        </Text>
        <Text className="text-gray-500 text-sm mt-2 text-center">
          This feature is coming soon...
        </Text>
      </View>
    </SafeAreaView>
  );
}

