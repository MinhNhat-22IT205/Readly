import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SummaryDetailsScreen from "@app/screen/SummaryDetailsScreen";
import MyLibraryScreen from "@app/screen/MyLibraryScreen";
import ProfileScreen from "@app/screen/ProfileScreen";

export type ProfileStackParamList = {
  Library: undefined;
  SummaryDetails: { summaryId: string };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Library" component={MyLibraryScreen} />
      <Stack.Screen name="SummaryDetails" component={SummaryDetailsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
