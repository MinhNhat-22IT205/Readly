import React from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface UserPasswordFieldsProps {
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (text: string) => void;
  onConfirmPasswordChange: (text: string) => void;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onToggleShowPassword: () => void;
  onToggleShowConfirmPassword: () => void;
  newPasswordError?: string;
  confirmPasswordError?: string;
}

export const UserPasswordFields: React.FC<UserPasswordFieldsProps> = ({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  showPassword,
  showConfirmPassword,
  onToggleShowPassword,
  onToggleShowConfirmPassword,
  newPasswordError,
  confirmPasswordError,
}) => {
  return (
    <View className="border-t border-gray-800 pt-5">
      <View className="flex-row items-center mb-3">
        <Text className="text-gray-300 text-sm font-medium">Đổi mật khẩu</Text>
        <Text className="text-gray-500 text-xs ml-2">(Tùy chọn)</Text>
      </View>

      <View className="gap-4">
        {/* New Password */}
        <View>
          <View className="flex-row items-center mb-2">
            <Text className="text-gray-300 text-sm font-medium">Mật khẩu mới</Text>
          </View>
          <View className="relative">
            <TextInput
              value={newPassword}
              onChangeText={onNewPasswordChange}
              placeholder="Nhập mật khẩu mới"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
              onSubmitEditing={() => {}}
              className={`bg-gray-800 text-white px-4 py-3.5 rounded-xl border ${
                newPasswordError ? "border-red-500" : "border-gray-700"
              } pr-12`}
              style={{
                fontSize: Platform.OS === "web" ? 14 : 16,
              }}
            />
            <TouchableOpacity
              onPress={onToggleShowPassword}
              className="absolute right-3 top-0 bottom-0 justify-center"
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
          {newPasswordError && (
            <View className="flex-row items-center mt-1.5">
              <Ionicons name="alert-circle" size={14} color="#EF4444" />
              <Text className="text-red-400 text-xs ml-1">{newPasswordError}</Text>
            </View>
          )}
        </View>

        {/* Confirm Password */}
        <View>
          <View className="flex-row items-center mb-2">
            <Text className="text-gray-300 text-sm font-medium">Xác nhận mật khẩu</Text>
          </View>
          <View className="relative">
            <TextInput
              value={confirmPassword}
              onChangeText={onConfirmPasswordChange}
              placeholder="Nhập lại mật khẩu mới"
              placeholderTextColor="#6B7280"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              blurOnSubmit={false}
              onSubmitEditing={() => {}}
              className={`bg-gray-800 text-white px-4 py-3.5 rounded-xl border ${
                confirmPasswordError ? "border-red-500" : "border-gray-700"
              } pr-12`}
              style={{
                fontSize: Platform.OS === "web" ? 14 : 16,
              }}
            />
            <TouchableOpacity
              onPress={onToggleShowConfirmPassword}
              className="absolute right-3 top-0 bottom-0 justify-center"
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
          {confirmPasswordError && (
            <View className="flex-row items-center mt-1.5">
              <Ionicons name="alert-circle" size={14} color="#EF4444" />
              <Text className="text-red-400 text-xs ml-1">{confirmPasswordError}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

