import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const SummaryActionButtons = () => {
  return (
    <View className="flex-row mx-4 mt-6 gap-2">
      <TouchableOpacity className="flex-1 bg-gray-800 py-3 rounded-lg flex-row items-center justify-center">
        <Ionicons name="book-outline" size={20} color="white" />
        <Text className="text-white ml-2 font-semibold">Read Nexus</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-1 bg-gray-800 py-3 rounded-lg flex-row items-center justify-center">
        <Ionicons name="headset-outline" size={20} color="white" />
        <Text className="text-white ml-2 font-semibold">Play Nexus</Text>
      </TouchableOpacity>
    </View>
  );
};

