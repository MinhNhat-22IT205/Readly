import React from "react";
import { View, Text } from "react-native";
import OTPVerificationForm from "../../features/authentication/components/OTPVerificationForm";

export const OTPVerificationScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-neutral-900 justify-center px-6">
      <Text className="text-white text-3xl font-bold mb-10">
        Verify Your Email
      </Text>
      <OTPVerificationForm />
    </View>
  );
};


