import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "@app/screen/LoginScreen";
import { RegisterScreen } from "@app/screen/RegisterScreen";
import { ForgotPasswordScreen } from "@app/screen/RecoverPasswordScreen";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";
import AppTabs from "./AppTabs";

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined; // This is where user goes after login
};

export default function AppNavigator() {
  const access_token = useAuthStore((state) => state.access_token);
  const endUser = useAuthStore((state) => state.endUser);

  const isLoggedIn = Boolean(
    access_token && endUser && Object.keys(endUser).length > 0
  );
  // const isLoggedIn = true;

  return (
    <NavigationContainer>
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
