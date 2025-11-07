import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@features/authentication/components/LoginScreen';
import { RegisterScreen } from '@features/authentication/components/RegisterScreen';
import { ForgotPasswordScreen } from '@features/authentication/components/RecoverPasswordScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    Home: undefined; // This is where user goes after login
  };
  

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
