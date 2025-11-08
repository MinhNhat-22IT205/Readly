// LoginScreen.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import LoginForm from '../../features/authentication/components/LoginForm';


export const LoginScreen: React.FC = () => {
  
  return (
    <View className="flex-1 bg-neutral-900 justify-center px-6">
      <Text className="text-white text-3xl font-bold mb-10">Log in</Text>
      <LoginForm/>
    </View>
  );
};
