import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WriterSummaryListScreen from "@app/screen/WriterSummaryListScreen";
import WriterSummaryEditorScreen from "@app/screen/WriterSummaryEditorScreen";
import SummaryDetailsScreen from "@app/screen/SummaryDetailsScreen";

export type WriterStackParamList = {
  WriterSummaryList: undefined;
  WriterSummaryEditor: { summaryId: string };
  SummaryDetails: { bookId: number };
};

const Stack = createNativeStackNavigator<WriterStackParamList>();

export default function WriterStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="WriterSummaryList"
        component={WriterSummaryListScreen}
      />
      <Stack.Screen
        name="WriterSummaryEditor"
        component={WriterSummaryEditorScreen}
      />
      <Stack.Screen name="SummaryDetails" component={SummaryDetailsScreen} />
    </Stack.Navigator>
  );
}

