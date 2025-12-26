import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zRequestOTPInputs, ztRequestOTPInputs } from "../libs/otp.zod";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@app/navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { requestOTP } from "../api/auth.api";
import type { ServerError } from "@shared-types/server-error.type";
import { isServerError } from "@shared-utils/is-server-error";
import Toast from "react-native-toast-message";

type LoginWithOTPScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LoginWithOTP"
>;

export default function LoginWithOTPForm() {
  const navigation = useNavigation<LoginWithOTPScreenNavigationProp>();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ztRequestOTPInputs>({
    resolver: zodResolver(zRequestOTPInputs),
    defaultValues: { email: "" },
  });

  const onRequestOTP = async (data: ztRequestOTPInputs) => {
    setApiError(null);
    setIsRequestingOTP(true);

    try {
      const otpResult = await requestOTP(data);

      if (isServerError(otpResult as any)) {
        const errorMessage =
          (otpResult as ServerError).message ??
          "Unable to send OTP code.";
        setApiError(errorMessage);
        Toast.show({
          type: "error",
          text1: "OTP Request Failed",
          text2: errorMessage,
        });
        return;
      }

      // OTP sent successfully, navigate to OTP verification screen
      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: "Please check your email for the verification code.",
      });

      navigation.navigate("OTPVerification", { email: data.email });
    } catch (error) {
      const errorMessage = "Something went wrong. Please try again.";
      setApiError(errorMessage);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    } finally {
      setIsRequestingOTP(false);
    }
  };

  return (
    <View className="bg-neutral-800 rounded-xl p-6">
      <Text className="text-white text-xl font-bold mb-2">
        Login with OTP
      </Text>
      <Text className="text-neutral-400 mb-6">
        Enter your email address and we'll send you a 6-digit verification code.
      </Text>

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
            {errors.email && (
              <Text className="text-red-500 mb-2">{errors.email.message}</Text>
            )}
          </>
        )}
      />

      {apiError && (
        <Text className="text-red-500 text-center mb-3">{apiError}</Text>
      )}

      {/* Send OTP Button */}
      <TouchableOpacity
        className="bg-green-200 rounded-md py-3 mb-3"
        onPress={handleSubmit(onRequestOTP)}
        disabled={isRequestingOTP}
      >
        <Text className="text-neutral-900 text-center font-semibold">
          {isRequestingOTP ? "Sending OTP..." : "Send OTP Code"}
        </Text>
      </TouchableOpacity>

      {/* Back to Password Login */}
      <View className="flex-row justify-center mt-4">
        <Text className="text-neutral-400">Prefer password login? </Text>
        <Pressable onPress={() => navigation.navigate("Login")}>
          <Text className="text-green-200 font-semibold">Login with Password</Text>
        </Pressable>
      </View>

      {/* Sign Up */}
      <View className="flex-row justify-center mt-4">
        <Text className="text-neutral-400">Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text className="text-green-200 font-semibold">Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}






