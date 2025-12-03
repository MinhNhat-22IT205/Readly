import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExploreScreen from "@app/screen/ExploreScreen";
import SummaryDetailsScreen from "@app/screen/SummaryDetailsScreen";

export type ExploreStackParamList = {
  ExploreHome: undefined;
  SummaryDetails: { summaryId: string };
};

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export default function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExploreHome" component={ExploreScreen} />
      <Stack.Screen name="SummaryDetails" component={SummaryDetailsScreen} />
    </Stack.Navigator>
  );
}


