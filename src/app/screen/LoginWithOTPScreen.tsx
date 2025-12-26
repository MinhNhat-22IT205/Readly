import React from "react";
import { View, Text } from "react-native";
import LoginWithOTPForm from "../../features/authentication/components/LoginWithOTPForm";

export const LoginWithOTPScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-neutral-900 justify-center px-6">
      <Text className="text-white text-3xl font-bold mb-10">Login</Text>
      <LoginWithOTPForm />
    </View>
  );
};






