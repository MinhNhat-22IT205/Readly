import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const SectionHeader = ({
  title,
  onShowAll,
}: {
  title: string;
  onShowAll: () => void;
}) => (
  <View className="flex-row items-center justify-between px-4 mt-6 mb-3">
    <Text className="text-xl font-bold text-white">{title}</Text>
    <TouchableOpacity
      onPress={onShowAll}
      className="flex-row items-center gap-1"
    >
      <Text className="text-sm text-white">Show all</Text>
      <Ionicons name="chevron-forward" size={16} color="#fff" />
    </TouchableOpacity>
  </View>
);

