import React, { useEffect, useRef } from "react";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "@app/screen/LoginScreen";
import { RegisterScreen } from "@app/screen/RegisterScreen";
import { ForgotPasswordScreen } from "@app/screen/RecoverPasswordScreen";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";
import AppTabs from "./AppTabs";
import { getCurrentUser } from "@features/authentication/api/auth.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined; // This is where user goes after login
};

// Navigation ref for programmatic navigation
// Sử dụng createRef thay vì useRef vì cần export để dùng ở nơi khác
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export default function AppNavigator() {
  const access_token = useAuthStore((state) => state.access_token);
  const endUser = useAuthStore((state) => state.endUser);
  const setEndUser = useAuthStore((state) => state.setEndUser);
  const setToken = useAuthStore((state) => state.setToken);

  const isLoggedIn = Boolean(
    access_token && endUser && Object.keys(endUser).length > 0
  );
  // const isLoggedIn = true;

  // Load token from storage on app start (web: localStorage, native: AsyncStorage)
  useEffect(() => {
    const loadToken = async () => {
      try {
        let savedToken: string | null = null;
        if (Platform.OS === "web") {
          savedToken =
            typeof window !== "undefined" && window.localStorage
              ? window.localStorage.getItem("auth_token")
              : null;
        } else {
          savedToken = await AsyncStorage.getItem("auth_token");
        }
        if (savedToken) setToken(savedToken);
      } catch {}
    };
    loadToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist token whenever it changes
  useEffect(() => {
    const persistToken = async () => {
      try {
        if (Platform.OS === "web") {
          if (typeof window !== "undefined" && window.localStorage) {
            if (access_token)
              window.localStorage.setItem("auth_token", access_token);
            else window.localStorage.removeItem("auth_token");
          }
        } else {
          if (access_token)
            await AsyncStorage.setItem("auth_token", access_token);
          else await AsyncStorage.removeItem("auth_token");
        }
      } catch {}
    };
    persistToken();
  }, [access_token]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (!access_token) return;
        if (endUser && Object.keys(endUser).length > 0) return;
        const me = await getCurrentUser();
        if ((me as any)?.id || (me as any)?.username) {
          setEndUser(me as any);
        }
      } catch {}
    };
    bootstrap();
  }, [access_token]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        // Navigation is ready - context đã sẵn sàng cho tất cả screens
        // Có thể remove console.log trong production
        if (__DEV__) {
          console.log("NavigationContainer is ready");
        }
      }}
      onStateChange={() => {
        // Optional: Handle navigation state changes
        // const currentRoute = navigationRef.current?.getCurrentRoute();
        // console.log("Current route:", currentRoute?.name);
      }}
    >
      {isLoggedIn ? (
        <AppTabs />
      ) : (
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
