import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UserSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const UserSearchBar: React.FC<UserSearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Tìm kiếm theo username, email, phone...",
}) => {
  return (
    <View className="px-4 py-3 border-b border-gray-800">
      <View className="flex-row items-center bg-gray-800 rounded-lg px-3 py-2">
        <Ionicons name="search" size={20} color="#6B7280" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          className="flex-1 ml-2 text-white"
          autoCapitalize="none"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")}>
            <Ionicons name="close-circle" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

