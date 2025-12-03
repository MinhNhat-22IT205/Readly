import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { zRegisterInputs, ztRegisterInputs } from '../libs/register.zod';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@app/navigation/AppNavigator';
import { register } from '../api/auth.api';
import type { ServerError } from '@shared-types/server-error.type';
import { isServerError } from '@shared-utils/is-server-error';
import Toast from 'react-native-toast-message';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterForm() {

  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const { control, handleSubmit, formState: { errors } } = useForm<ztRegisterInputs>({
    resolver: zodResolver(zRegisterInputs),
    defaultValues: { name: '', email: '', password: '' },
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: ztRegisterInputs) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      const result = await register(data);

      if (isServerError(result as any)) {
        const errorMessage = (result as ServerError).message ?? 'Unable to complete registration.';
        setApiError(errorMessage);
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: errorMessage,
        });
        return;
      }

      // Registration successful
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Your account has been created. Please log in.',
      });

      // Navigate to Login screen after successful registration
      navigation.replace('Login');
    } catch (error) {
      const errorMessage = 'Something went wrong. Please try again.';
      setApiError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
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

        {/* API Error Message */}
        {apiError && (
          <Text className="text-red-500 text-center mb-3">{apiError}</Text>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-green-200 rounded-md py-3 mb-2"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <Text className="text-neutral-900 text-center font-semibold">
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Text>
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