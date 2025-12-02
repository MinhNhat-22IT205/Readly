import React from "react";
import { View, Text, TextInput, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const IS_DESKTOP = Platform.OS === "web";

interface UserFormFieldProps {
  label: string;
  value: string | undefined;
  onChange: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  multiline?: boolean;
  error?: string;
  required?: boolean;
}

export const UserFormField: React.FC<UserFormFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = "default",
  multiline = false,
  error,
  required = false,
}) => {
  return (
    <View className={IS_DESKTOP ? "flex-1" : "w-full"}>
      <View className="flex-row items-center mb-2">
        <Text className="text-gray-300 text-sm font-medium">{label}</Text>
        {required && <Text className="text-red-400 ml-1">*</Text>}
      </View>
      <TextInput
        value={value || ""}
        onChangeText={onChange}
        placeholder={placeholder || `Nhập ${label.toLowerCase()}`}
        placeholderTextColor="#6B7280"
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
        autoCorrect={false}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? "top" : "center"}
        returnKeyType={multiline ? "default" : "next"}
        blurOnSubmit={false}
        onSubmitEditing={() => {}}
        className={`bg-gray-800 text-white px-4 rounded-xl border ${
          error ? "border-red-500" : "border-gray-700"
        } ${multiline ? "py-3 min-h-[100px]" : "py-3.5"}`}
        style={{
          fontSize: Platform.OS === "web" ? 14 : 16,
        }}
      />
      {error && (
        <View className="flex-row items-center mt-1.5">
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text className="text-red-400 text-xs ml-1">{error}</Text>
        </View>
      )}
    </View>
  );
};

