import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../navigation/AdminStack";
import { AdminProtectedScreen } from "@shared-components/AdminProtectedScreen";

type AdminDashboardScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminDashboard"
>;

interface ManagementButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const ManagementButton = ({ icon, label, onPress }: ManagementButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex-row items-center"
    activeOpacity={0.7}
  >
    <Ionicons name={icon} size={24} color="#FFFFFF" />
    <Text className="text-white font-semibold text-base ml-3 flex-1">
      {label}
    </Text>
  </TouchableOpacity>
);

export default function AdminDashboardScreen() {
  const navigation = useNavigation<AdminDashboardScreenNavigationProp>();

  const handleUserManagement = () => {
    navigation.navigate("UserManagement");
  };

  const handleBookManagement = () => {
    navigation.navigate("BookManagement");
  };

  const handleAuthorManagement = () => {
    navigation.navigate("AuthorManagement");
  };

  const handlePublisherManagement = () => {
    navigation.navigate("PublisherManagement");
  };

  const handleCategoryManagement = () => {
    navigation.navigate("CategoryManagement");
  };

  const handleOrderManagement = () => {
    navigation.navigate("AdminOrderList");
  };

  const handlePendingSummaries = () => {
    navigation.navigate("AdminSummaryList");
  };

  const handleManageSummaries = () => {
    navigation.navigate("AdminManageSummaries");
  };

  const handleSettings = () => {
    // TODO: Navigate to Settings screen
    console.log("Navigate to Settings");
  };

  return (
    <AdminProtectedScreen>
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4">
          <Text className="text-2xl font-bold text-white">Admin Dashboard</Text>
          <TouchableOpacity
            onPress={handleSettings}
            className="p-2"
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        >
          {/* Management Section */}
          <Text className="text-white text-xl font-bold mb-4">Management</Text>

          <View>
            {/* Row 1 */}
            <View className="flex-row justify-between mb-3">
              <View className="flex-1 mr-2">
                <ManagementButton
                  icon="people-outline"
                  label="User Management"
                  onPress={handleUserManagement}
                />
              </View>
              <View className="flex-1 ml-2">
                <ManagementButton
                  icon="book-outline"
                  label="Book Management"
                  onPress={handleBookManagement}
                />
              </View>
            </View>

            {/* Row 2 */}
            <View className="flex-row justify-between mb-3">
              <View className="flex-1 mr-2">
                <ManagementButton
                  icon="person-outline"
                  label="Author Management"
                  onPress={handleAuthorManagement}
                />
              </View>
              <View className="flex-1 ml-2">
                <ManagementButton
                  icon="business-outline"
                  label="Publisher Management"
                  onPress={handlePublisherManagement}
                />
              </View>
            </View>

            {/* Row 3 */}
            <View className="flex-row justify-between mb-3">
              <View className="flex-1 mr-2">
                <ManagementButton
                  icon="bookmark-outline"
                  label="Category Management"
                  onPress={handleCategoryManagement}
                />
              </View>
              <View className="flex-1 ml-2">
                <ManagementButton
                  icon="document-text-outline"
                  label="Pending Summaries"
                  onPress={handlePendingSummaries}
                />
              </View>
            </View>

            {/* Row 4 */}
            <View className="flex-row justify-between">
              <View className="flex-1 mr-2">
                <ManagementButton
                  icon="list-outline"
                  label="Manage Summaries"
                  onPress={handleManageSummaries}
                />
              </View>
              <View className="flex-1 ml-2">
                <ManagementButton
                  icon="receipt-outline"
                  label="Order Management"
                  onPress={handleOrderManagement}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AdminProtectedScreen>
  );
}

