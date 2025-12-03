import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@app/screen/HomeScreen";
import SummaryDetailsScreen from "@app/screen/SummaryDetailsScreen";
import BookStoreScreen from "@app/screen/BookStoreScreen";
import BookStoreDetailScreen from "@app/screen/BookStoreDetailScreen";
import CartScreen from "@app/screen/CartScreen";
import CheckoutScreen from "@app/screen/CheckoutScreen";
import OrderResultScreen from "@app/screen/OrderResultScreen";
import PayOSPaymentScreen from "@app/screen/PayOSPaymentScreen";
import OrderManagementScreen from "@app/screen/OrderManagementScreen";
import OrderDetailScreen from "@app/screen/OrderDetailScreen";

export type HomeStackParamList = {
  Home: undefined;
  SummaryDetails: { summaryId: string };
  BookStore: undefined;
  BookStoreDetail: { bookId: string };
  Cart: undefined;
  Checkout: undefined;
  PayOSPayment: { checkoutUrl: string; orderId: number };
  OrderResult: { orderId: number };
  OrderManagement: undefined;
  OrderDetail: { orderId: number; orderData?: any };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SummaryDetails" component={SummaryDetailsScreen} />
      <Stack.Screen name="BookStore" component={BookStoreScreen} />
      <Stack.Screen name="BookStoreDetail" component={BookStoreDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="PayOSPayment" component={PayOSPaymentScreen} />
      <Stack.Screen name="OrderResult" component={OrderResultScreen} />
      <Stack.Screen name="OrderManagement" component={OrderManagementScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}
