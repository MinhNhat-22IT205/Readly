import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AddSectionButtonProps {
  onPress: () => void;
}

export const AddSectionButton = ({ onPress }: AddSectionButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-indigo-600 rounded-xl p-4 flex-row items-center justify-center mb-4"
    activeOpacity={0.8}
  >
    <Ionicons name="add" size={24} color="#FFFFFF" />
    <Text className="text-white font-semibold text-base ml-2">
      Add New Section
    </Text>
  </TouchableOpacity>
);

