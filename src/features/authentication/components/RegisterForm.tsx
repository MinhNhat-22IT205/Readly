import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { zRegisterInputs, ztRegisterInputs } from '../libs/register.zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@app/navigation/AppNavigator';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterForm() {

  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const { control, handleSubmit, formState: { errors } } = useForm<ztRegisterInputs>({
    resolver: zodResolver(zRegisterInputs),
    defaultValues: { name: '', email: '', password: '' },
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = (data: ztRegisterInputs) => {
    console.log("Sign Up Data:", data);
    // TODO: call your API or signup logic
    // After successful signup, redirect to Login
    navigation.replace('Login');
  };

  return (
    <View className="bg-neutral-800 rounded-xl p-6">
        <Text className="text-neutral-400 mb-4">
          Looks like you don’t have an account. Let’s create a new account for you.
        </Text>

        {/* Name Field */}
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <>
              <TextInput
                className="bg-neutral-700 text-white rounded-md px-4 py-3 mb-1"
                placeholder="Name"
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChange}
              />
              {errors.name && <Text className="text-red-500 mb-2">{errors.name.message}</Text>}
            </>
          )}
        />

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
              <View className="flex-row items-center bg-neutral-700 rounded-md mb-1">
                <TextInput
                  className="flex-1 text-white px-4 py-3"
                  placeholder="Password"
                  placeholderTextColor="#aaa"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(p => !p)}>
                  <Text className="px-4 text-neutral-400">
                    {passwordVisible ? '🙈' : '👁️'}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 mb-2">{errors.password.message}</Text>
              )}
            </>
          )}
        />

        <Text className="text-neutral-400 text-xs mt-1 mb-3">
          By selecting Create Account below, I agree to
          <Text className="font-bold"> Terms of Service & Privacy Policy</Text>
        </Text>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-green-200 rounded-md py-3 mb-2"
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-neutral-900 text-center font-semibold">Create Account</Text>
        </TouchableOpacity>

        {/* Redirect to Login */}
        <View className="flex-row justify-center mt-3">
          <Text className="text-neutral-400">Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text className="text-green-200 font-semibold">Log in</Text>
          </Pressable>
        </View>
      </View>
  )
}