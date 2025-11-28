import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@app/screen/HomeScreen";
import SummaryDetailsScreen from "@app/screen/SummaryDetailsScreen";
import BookStoreScreen from "@app/screen/BookStoreScreen";
import CartScreen from "@app/screen/CartScreen";
import CheckoutScreen from "@app/screen/CheckoutScreen";

export type HomeStackParamList = {
  Home: undefined;
  SummaryDetails: { summaryId: string };
  BookStore: undefined;
  Cart: undefined;
  Checkout: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SummaryDetails" component={SummaryDetailsScreen} />
      <Stack.Screen name="BookStore" component={BookStoreScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}
