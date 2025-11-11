import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@app/screen/HomeScreen";
import SummaryDetailsScreen from "@app/screen/SummaryDetailsScreen";

export type HomeStackParamList = {
  Home: undefined;
  SummaryDetails: { bookId: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SummaryDetails" component={SummaryDetailsScreen} />
    </Stack.Navigator>
  );
}
