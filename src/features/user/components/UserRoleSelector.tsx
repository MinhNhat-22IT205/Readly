import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const IS_DESKTOP = Platform.OS === "web";

interface UserRoleSelectorProps {
  selectedRole: "reader" | "writer" | "admin";
  onRoleChange: (role: "reader" | "writer" | "admin") => void;
}

export const UserRoleSelector: React.FC<UserRoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  return (
    <View>
      <View className="flex-row items-center mb-3">
        <Text className="text-gray-300 text-sm font-medium">Vai trò</Text>
        <Text className="text-red-400 ml-1">*</Text>
      </View>
      <View className={`flex-row gap-2 ${IS_DESKTOP ? "max-w-md" : ""}`}>
        {(["reader", "writer", "admin"] as const).map((role) => {
          const isSelected = selectedRole === role;
          return (
            <TouchableOpacity
              key={role}
              onPress={() => onRoleChange(role)}
              className={`flex-1 py-3.5 rounded-xl border ${
                isSelected
                  ? "bg-emerald-500/20 border-emerald-500"
                  : "bg-gray-800 border-gray-700"
              }`}
              activeOpacity={0.7}
            >
              <View className="items-center">
                <Ionicons
                  name={
                    role === "admin"
                      ? "shield-checkmark"
                      : role === "writer"
                      ? "create"
                      : "person"
                  }
                  size={20}
                  color={isSelected ? "#10b981" : "#9CA3AF"}
                />
                <Text
                  className={`text-center font-semibold mt-1 ${
                    isSelected ? "text-emerald-400" : "text-gray-400"
                  }`}
                  style={{ fontSize: Platform.OS === "web" ? 12 : 13 }}
                >
                  {role === "admin"
                    ? "ADMIN"
                    : role === "writer"
                    ? "WRITER"
                    : "READER"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};




