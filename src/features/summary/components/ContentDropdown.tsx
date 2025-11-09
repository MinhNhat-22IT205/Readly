import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SummarySection } from "@shared-types/summary.type";

interface ContentDropdownProps {
  section: SummarySection;
  isOpen: boolean;
  onToggle: () => void;
}

export const ContentDropdown = ({
  section,
  isOpen,
  onToggle,
}: ContentDropdownProps) => (
  <View className="bg-gray-800 rounded-xl mb-4 overflow-hidden shadow-lg">
    <TouchableOpacity
      onPress={onToggle}
      className="p-5 flex-row items-center justify-between bg-gray-800"
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-full bg-gray-700 items-center justify-center mr-4">
          <Text className="text-white text-base font-bold">
            {String(section.section_order).padStart(2, "0")}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-bold text-lg">{section.title}</Text>
        </View>
      </View>
      <Ionicons
        name={isOpen ? "chevron-up" : "chevron-down"}
        size={28}
        color="#fff"
      />
    </TouchableOpacity>
    {isOpen && (
      <View className="px-5 pb-6 pt-4 bg-gray-800">
        <View className="border-t border-gray-700 pt-4">
          <Text className="text-gray-100 text-base leading-7">
            {section.content}
          </Text>
        </View>
      </View>
    )}
  </View>
);

