// LoginScreen.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { zLoginInputs, ztLoginInputs } from '../libs/login.zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app/navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<ztLoginInputs>({
    resolver: zodResolver(zLoginInputs),
    defaultValues: { email: '', password: '' },
  });
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const onLogin = (data: ztLoginInputs) => {
    console.log('Login Data:', data);
    // Handle login logic here
  };

  return (
    <View className="flex-1 bg-neutral-900 justify-center px-6">
      <Text className="text-white text-3xl font-bold mb-10">Log in</Text>
      <View className="bg-neutral-800 rounded-xl p-6">
        {/* Email Field */}
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <>
              <TextInput
                className="bg-neutral-700 text-white rounded-md px-4 py-3 mb-1"
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text className="text-red-500 mb-2">{errors.email.message}</Text>}
            </>
          )}
        />

        {/* Password Field */}
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <>
              <TextInput
                className="bg-neutral-700 text-white rounded-md px-4 py-3 mb-1"
                placeholder="Password"
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChange}
                secureTextEntry
              />
              {errors.password && <Text className="text-red-500 mb-2">{errors.password.message}</Text>}
            </>
          )}
        />

        {/* Login Button */}
        <TouchableOpacity
          className="bg-green-200 rounded-md py-3 mb-3"
          onPress={handleSubmit(onLogin)}
        >
          <Text className="text-neutral-900 text-center font-semibold">Continue</Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <Pressable>
          <Text className="text-green-200 text-center mb-3">Forgot password?</Text>
        </Pressable>

        {/* Divider */}
        <View className="flex-row items-center mb-3">
          <View className="flex-1 h-px bg-neutral-700" />
          <Text className="mx-4 text-neutral-400">Or</Text>
          <View className="flex-1 h-px bg-neutral-700" />
        </View>

        {/* Social Login Buttons */}
        <TouchableOpacity className="flex-row items-center bg-neutral-700 rounded-md py-3 mb-3 px-4">
          {/* <FacebookLogo size={20} /> */}
          <Text className="text-white ml-3">Login with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-neutral-700 rounded-md py-3 mb-3 px-4">
          {/* <GoogleLogo size={20} /> */}
          <Text className="text-white ml-3">Login with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center bg-neutral-700 rounded-md py-3 mb-3 px-4">
          {/* <AppleLogo size={20} /> */}
          <Text className="text-white ml-3">Login with Apple</Text>
        </TouchableOpacity>

        {/* Sign Up */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-neutral-400">Don’t have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text className="text-green-200 font-semibold">Sign up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
