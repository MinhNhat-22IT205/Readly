// RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';

import RegisterForm from '../../features/authentication/components/RegisterForm';


export const RegisterScreen: React.FC = () => {
  

  return (
    <View className="flex-1 bg-neutral-900 justify-center px-6">
      <Text className="text-white text-3xl font-bold mb-10">Sign up</Text>
      <RegisterForm/>
    </View>
  );
};
