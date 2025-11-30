import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "@app/navigation/AdminStack";
import { useNavigation } from "@react-navigation/native";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type AdminDashboardScreenNavigationProp =
  NativeStackNavigationProp<AdminStackParamList>;

interface ManagementItem {
  id: number;
  iconName: IconName;
  title: string;
  subtitle: string;
  route: keyof AdminStackParamList;
}

const managementItems: ManagementItem[] = [
  {
    id: 1,
    iconName: "people-outline",
    title: "User",
    subtitle: "Management",
    route: "AdminSummaryList",
  },
  {
    id: 2,
    iconName: "book-outline",
    title: "Book",
    subtitle: "Management",
    route: "AdminSummaryList",
  },
  {
    id: 3,
    iconName: "person-circle-outline",
    title: "Author",
    subtitle: "Management",
    route: "AdminSummaryList",
  },
  {
    id: 4,
    iconName: "business-outline",
    title: "Publisher",
    subtitle: "Management",
    route: "AdminSummaryList",
  },
  {
    id: 5,
    iconName: "bookmark-outline",
    title: "Category",
    subtitle: "Management",
    route: "AdminSummaryList",
  },
  {
    id: 6,
    iconName: "document-text-outline",
    title: "Pending",
    subtitle: "Summaries",
    route: "AdminSummaryList",
  },
];

export default function AdminDashboard() {
  const navigation = useNavigation<AdminDashboardScreenNavigationProp>();

  const handleNavigation = (item: ManagementItem) => {
    navigation.push(item.route as any);
  };

  return (
    <View className="flex-1 bg-[#0f1623]">
      <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
        <View className="max-w-5xl flex-col gap-10 px-2 pt-10 pb-16 sm:px-6 lg:px-8">
          <View className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Text className="text-3xl font-bold text-white sm:text-4xl">
              Admin Dashboard
            </Text>
          </View>

          <View className="mb-6">
            <Text className="text-2xl font-semibold text-white sm:text-3xl">
              Resources
            </Text>
          </View>

          <View className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {managementItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleNavigation(item)}
                className="flex h-fit flex-col rounded-xl border border-[#1f2c3e] bg-[#192233] p-4 text-left shadow-lg shadow-black/10 "
                activeOpacity={0.8}
              >
                <View className="flex flex-row items-center gap-3 text-[#c5d0e6]">
                  <View className="rounded-2xl bg-white/5 p-3">
                    <Ionicons name={item.iconName} size={24} color="#fff" />
                  </View>
                  <Text className="text-xs uppercase tracking-[0.25em] text-[#8c9bb5]">
                    {item.subtitle}
                  </Text>
                </View>
                <Text className="mt-5 text-2xl font-semibold text-white">
                  {item.title}
                </Text>
                <Text className="mt-2 text-sm text-[#9faec5]">
                  Manage {item.title.toLowerCase()} data, permissions, and
                  activity.
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
