import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminDashboardScreen from "@app/screen/AdminDashboardScreen";
import AdminSummaryListScreen from "@app/screen/AdminSummaryListScreen";
import AdminSummaryDetailScreen from "@app/screen/AdminSummaryDetailScreen";
import AdminManageSummariesScreen from "@app/screen/AdminManageSummariesScreen";
import UserManagementScreen from "@app/screen/UserManagementScreen";
import BookManagementScreen from "@app/screen/BookManagementScreen";
import AuthorManagementScreen from "@app/screen/AuthorManagementScreen";
import PublisherManagementScreen from "@app/screen/PublisherManagementScreen";
import CategoryManagementScreen from "@app/screen/CategoryManagementScreen";

export type AdminStackParamList = {
  AdminDashboard: undefined;
  AdminSummaryList: undefined;
  AdminSummaryDetail: { summaryId: string };
  AdminManageSummaries: undefined;
  UserManagement: undefined;
  BookManagement: undefined;
  AuthorManagement: undefined;
  PublisherManagement: undefined;
  CategoryManagement: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
      />
      <Stack.Screen
        name="AdminSummaryList"
        component={AdminSummaryListScreen}
      />
      <Stack.Screen
        name="AdminSummaryDetail"
        component={AdminSummaryDetailScreen}
      />
      <Stack.Screen
        name="AdminManageSummaries"
        component={AdminManageSummariesScreen}
      />
      <Stack.Screen
        name="UserManagement"
        component={UserManagementScreen}
      />
      <Stack.Screen
        name="BookManagement"
        component={BookManagementScreen}
      />
      <Stack.Screen
        name="AuthorManagement"
        component={AuthorManagementScreen}
      />
      <Stack.Screen
        name="PublisherManagement"
        component={PublisherManagementScreen}
      />
      <Stack.Screen
        name="CategoryManagement"
        component={CategoryManagementScreen}
      />
    </Stack.Navigator>
  );
}

