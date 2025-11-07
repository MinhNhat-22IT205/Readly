import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  zEmailInputs, ztEmailInputs,
  zCodeInputs, ztCodeInputs,
  zNewPasswordInputs, ztNewPasswordInputs
} from '../libs/forgotPassword.zod';

type Step = 'email' | 'code' | 'password' | 'done';

export const ForgotPasswordScreen: React.FC = () => {
  const [step, setStep] = useState<Step>('email');
  const [sentEmail, setSentEmail] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Email entry
  const { control: emailControl, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors } } =
    useForm<ztEmailInputs>({ resolver: zodResolver(zEmailInputs), defaultValues: { email: '' } });

  // Code entry
  const { control: codeControl, handleSubmit: handleCodeSubmit, formState: { errors: codeErrors } } =
    useForm<ztCodeInputs>({ resolver: zodResolver(zCodeInputs), defaultValues: { code: '' } });

  // New password entry
  const { control: passControl, handleSubmit: handlePassSubmit, formState: { errors: passErrors } } =
    useForm<ztNewPasswordInputs>({
      resolver: zodResolver(zNewPasswordInputs),
      defaultValues: { newPassword: '', confirmPassword: '' },
    });

  // Simulated API actions
  const sendEmail = (data: ztEmailInputs) => {
    setSentEmail(data.email);
    setStep('code');
    // TODO: trigger API request for code
  };
  const verifyCode = (_: ztCodeInputs) => setStep('password');
  const setPassword = (_: ztNewPasswordInputs) => setStep('done');

  return (
    <View className="flex-1 bg-neutral-900 justify-center px-6">
      {step === 'email' && (
        <View>
          <Text className="text-white text-3xl font-bold mb-10">Recover Password</Text>
          <View className="bg-neutral-800 rounded-xl p-6">
            <Text className="text-neutral-400 mb-4">
              Forgot your password? Don’t worry, enter your email to reset your current password.
            </Text>
            <Controller
              control={emailControl}
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
                  {emailErrors.email && <Text className="text-red-500 mb-2">{emailErrors.email.message}</Text>}
                </>
              )}
            />
            <TouchableOpacity className="bg-green-200 rounded-md py-3 mb-2"
              onPress={handleEmailSubmit(sendEmail)}>
              <Text className="text-neutral-900 text-center font-semibold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 'code' && (
        <View>
          <Text className="text-white text-3xl font-bold mb-10">Verify Code</Text>
          <View className="bg-neutral-800 rounded-xl p-6">
            <Text className="text-neutral-400 mb-4">
              An authentication code has been sent to {sentEmail || 'your email'}.
            </Text>
            <Controller
              control={codeControl}
              name="code"
              render={({ field: { value, onChange } }) => (
                <>
                  <TextInput
                    className="bg-neutral-700 text-white rounded-md px-4 py-3 mb-1"
                    placeholder="Enter Code"
                    placeholderTextColor="#aaa"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                  {codeErrors.code && <Text className="text-red-500 mb-2">{codeErrors.code.message}</Text>}
                </>
              )}
            />
            <TouchableOpacity className="bg-green-200 rounded-md py-3 mb-2"
              onPress={handleCodeSubmit(verifyCode)}>
              <Text className="text-neutral-900 text-center font-semibold">Verify</Text>
            </TouchableOpacity>
            <View className="flex-row justify-center mt-3">
              <Text className="text-neutral-400">Don’t receive a code? </Text>
              <Pressable>
                <Text className="text-green-200 font-semibold">Resend</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {step === 'password' && (
        <View>
          <Text className="text-white text-3xl font-bold mb-10">Set Password</Text>
          <View className="bg-neutral-800 rounded-xl p-6 items-center">
            <View className="rounded-full bg-green-200 mb-3 p-3">
              <Text style={{ fontSize: 28 }} className="text-green-900">✔️</Text>
            </View>
            <Text className="text-white text-base mb-4">Code verified</Text>

            <Controller
              control={passControl}
              name="newPassword"
              render={({ field: { value, onChange } }) => (
                <>
                  <View className="flex-row items-center bg-neutral-700 rounded-md mb-1">
                    <TextInput
                      className="flex-1 text-white px-4 py-3"
                      placeholder="Enter new password"
                      placeholderTextColor="#aaa"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPass}
                    />
                    <TouchableOpacity onPress={() => setShowPass(p => !p)}>
                      <Text className="px-4 text-neutral-400">
                        {showPass ? '🙈' : '👁️'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {passErrors.newPassword && (
                    <Text className="text-red-500 mb-2">{passErrors.newPassword.message}</Text>
                  )}
                </>
              )}
            />
            <Controller
              control={passControl}
              name="confirmPassword"
              render={({ field: { value, onChange } }) => (
                <>
                  <View className="flex-row items-center bg-neutral-700 rounded-md mb-1">
                    <TextInput
                      className="flex-1 text-white px-4 py-3"
                      placeholder="Re-type new password"
                      placeholderTextColor="#aaa"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showConfirm}
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(p => !p)}>
                      <Text className="px-4 text-neutral-400">
                        {showConfirm ? '🙈' : '👁️'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {passErrors.confirmPassword && (
                    <Text className="text-red-500 mb-2">{passErrors.confirmPassword.message}</Text>
                  )}
                </>
              )}
            />
            <Text className="text-neutral-400 text-xs mt-1 mb-3">
              At-least 8 characters
            </Text>
            <TouchableOpacity className="bg-green-200 rounded-md py-3 mb-2 w-full"
              onPress={handlePassSubmit(setPassword)}>
              <Text className="text-neutral-900 text-center font-semibold">Set Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step === 'done' && (
        <View className="items-center justify-center">
          <Text className="text-white text-3xl font-bold mb-6">Password Reset!</Text>
          <Text className="text-neutral-400 mb-4">Your password has been changed successfully.</Text>
          <TouchableOpacity className="bg-green-200 rounded-md py-3 mb-2 w-full">
            <Text className="text-neutral-900 text-center font-semibold">Go to Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
