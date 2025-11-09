import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WriterSummaryEditorHeaderProps {
  title: string;
  onClose: () => void;
}

export const WriterSummaryEditorHeader = ({
  title,
  onClose,
}: WriterSummaryEditorHeaderProps) => (
  <View className="px-4 py-4 border-b border-gray-800 flex-row items-center justify-between">
    <View className="flex-1">
      <Text className="text-white text-xl font-bold" numberOfLines={1}>
        {title}
      </Text>
      <Text className="text-gray-400 text-sm mt-1">Edit Content Sections</Text>
    </View>
    <TouchableOpacity
      onPress={onClose}
      className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
    >
      <Ionicons name="close" size={24} color="#fff" />
    </TouchableOpacity>
  </View>
);

