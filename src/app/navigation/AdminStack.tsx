import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminSummaryListScreen from "@app/screen/AdminSummaryListScreen";
import AdminSummaryDetailScreen from "@app/screen/AdminSummaryDetailScreen";

export type AdminStackParamList = {
  AdminSummaryList: undefined;
  AdminSummaryDetail: { summaryId: string };
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AdminSummaryList"
        component={AdminSummaryListScreen}
      />
      <Stack.Screen
        name="AdminSummaryDetail"
        component={AdminSummaryDetailScreen}
      />
    </Stack.Navigator>
  );
}

