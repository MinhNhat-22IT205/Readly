import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zVerifyOTPInputs, ztVerifyOTPInputs } from "../libs/otp.zod";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@app/navigation/AppNavigator";
import { useNavigation, useRoute } from "@react-navigation/native";
import { verifyOTP, getCurrentUser } from "../api/auth.api";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";
import type { ServerError } from "@shared-types/server-error.type";
import { isServerError } from "@shared-utils/is-server-error";
import Toast from "react-native-toast-message";

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "OTPVerification"
>;

type RouteParams = {
  email: string;
};

export default function OTPVerificationForm() {
  const navigation = useNavigation<OTPVerificationScreenNavigationProp>();
  const route = useRoute();
  const { email } = (route.params as RouteParams) || { email: "" };

  const { setEndUser, setToken } = useAuthStore((state) => state);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60); // 60 seconds cooldown
  const [canResend, setCanResend] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ztVerifyOTPInputs>({
    resolver: zodResolver(zVerifyOTPInputs),
    defaultValues: { email: email || "", otp: "" },
  });

  // Set email when component mounts
  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCooldown]);

  // Initialize cooldown when component mounts
  useEffect(() => {
    setResendCooldown(60);
  }, []);

  const onVerifyOTP = async (data: ztVerifyOTPInputs) => {
    setApiError(null);
    setIsSubmitting(true);

    try {
      const result = await verifyOTP(data);

      if (isServerError(result as any)) {
        const errorMessage =
          (result as ServerError).message ?? "Invalid OTP code.";
        setApiError(errorMessage);
        Toast.show({
          type: "error",
          text1: "Verification Failed",
          text2: errorMessage,
        });
        return;
      }

      const token =
        (result as any)?.access_token || (result as any)?.token;
      if (!token) {
        setApiError("Verification succeeded but no access token was returned.");
        return;
      }

      // Save token
      setToken(token);

      // Fetch current user profile
      const me = await getCurrentUser();
      if ((me as any)?.statusCode) {
        setApiError((me as any)?.message || "Failed to fetch current user");
        return;
      }

      setEndUser(me as any);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
      });

      // AppNavigator will switch to tabs when token+user are present
    } catch (error) {
      const errorMessage = "Something went wrong. Please try again.";
      setApiError(errorMessage);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = () => {
    // Navigate back to login to resend OTP
    navigation.goBack();
  };



  return (
    <View className="bg-neutral-800 rounded-xl p-6">
      <Text className="text-white text-xl font-bold mb-2">
        Enter Verification Code
      </Text>
      <Text className="text-neutral-400 mb-6">
        We've sent a 6-digit code to {email || "your email"}. Please enter it
        below.
      </Text>

      {/* OTP Input */}
      <Controller
        control={control}
        name="otp"
        render={({ field: { value, onChange } }) => (
          <>
            <TextInput
              className="bg-neutral-700 text-white rounded-md px-4 py-3 mb-1"
              placeholder="Enter 6-digit code"
              placeholderTextColor="#aaa"
              value={value}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, "").slice(0, 6);
                onChange(numericText);
              }}
              keyboardType="number-pad"
              maxLength={6}
            />
            {errors.otp && (
              <Text className="text-red-500 mb-2">{errors.otp.message}</Text>
            )}
          </>
        )}
      />

      {apiError && (
        <Text className="text-red-500 text-center mb-3">{apiError}</Text>
      )}

      {/* Verify Button */}
      <TouchableOpacity
        className="bg-green-200 rounded-md py-3 mb-3"
        onPress={handleSubmit(onVerifyOTP)}
        disabled={isSubmitting}
      >
        <Text className="text-neutral-900 text-center font-semibold">
          {isSubmitting ? "Verifying..." : "Verify & Login"}
        </Text>
      </TouchableOpacity>

      {/* Resend OTP */}
      <View className="flex-row justify-center items-center">
        <Text className="text-neutral-400">Didn't receive the code? </Text>
        {canResend ? (
          <Pressable onPress={handleResendOTP}>
            <Text className="text-green-200 font-semibold">Resend</Text>
          </Pressable>
        ) : (
          <Text className="text-neutral-500">
            Resend in {resendCooldown}s
          </Text>
        )}
      </View>

      {/* Back to Login */}
      <Pressable
        onPress={() => navigation.goBack()}
        className="mt-4"
      >
        <Text className="text-green-200 text-center">Back to Login</Text>
      </Pressable>
    </View>
  );
}

