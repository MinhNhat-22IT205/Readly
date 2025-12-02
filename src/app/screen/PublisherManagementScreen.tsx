import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../navigation/AdminStack";
import { PublisherList } from "@features/publisher/components/PublisherList";
import { PublisherSearchBar } from "@features/publisher/components/PublisherSearchBar";
import {
  fetchPublishers,
  deletePublisher,
  type Publisher,
  type PublisherFilters,
} from "@features/publisher/api/publisher.api";
import Toast from "react-native-toast-message";

type PublisherManagementScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "PublisherManagement"
>;

export default function PublisherManagementScreen() {
  const navigation = useNavigation<PublisherManagementScreenNavigationProp>();
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [filteredPublishers, setFilteredPublishers] = useState<Publisher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadPublishers = useCallback(async () => {
    try {
      setIsError(false);
      const filters: PublisherFilters = {};

      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      const data = await fetchPublishers(filters);

      // Sort by name alphabetically
      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
      setPublishers(sorted);
      setFilteredPublishers(sorted);
    } catch (error) {
      console.error("Failed to fetch publishers:", error);
      setIsError(true);
      Toast.show({
        type: "error",
        text1: "Lỗi tải dữ liệu",
        text2: "Không thể tải danh sách nhà xuất bản",
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadPublishers();
  }, [loadPublishers]);

  const isInitialMount = useRef(true);
  useFocusEffect(
    React.useCallback(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      loadPublishers();
    }, [loadPublishers])
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPublishers(publishers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = publishers.filter((publisher) =>
      publisher.name.toLowerCase().includes(query)
    );

    setFilteredPublishers(filtered);
  }, [searchQuery, publishers]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPublishers();
  };

  const handlePublisherPress = (publisher: Publisher) => {
    navigation.navigate("PublisherDetail", { publisherId: publisher.id.toString() });
  };

  const handlePublisherDelete = async (publisher: Publisher) => {
    try {
      await deletePublisher(publisher.id.toString());
      Toast.show({
        type: "success",
        text1: "Xóa thành công",
        text2: `Nhà xuất bản "${publisher.name}" đã được xóa`,
      });
      loadPublishers();
    } catch (error: any) {
      console.error("Delete publisher error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi xóa",
        text2: error?.response?.data?.detail || "Không thể xóa nhà xuất bản",
      });
    }
  };

  const handleAddPublisher = () => {
    navigation.navigate("PublisherDetail", { publisherId: "new" });
  };

  const stats = useMemo(() => {
    const total = publishers.length;
    return { total };
  }, [publishers]);

  if (isLoading && publishers.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Publisher Management</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-400 mt-4">Đang tải danh sách nhà xuất bản...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && publishers.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Publisher Management</Text>
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-white text-lg font-semibold mt-4 text-center">
            Không thể tải dữ liệu
          </Text>
          <Text className="text-gray-400 text-sm mt-2 text-center">
            Vui lòng kiểm tra kết nối và thử lại
          </Text>
          <TouchableOpacity
            onPress={loadPublishers}
            className="mt-6 bg-emerald-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white flex-1">Publisher Management</Text>
        <TouchableOpacity
          onPress={handleAddPublisher}
          className="mr-2 p-2 rounded-full bg-emerald-500 active:bg-emerald-600"
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-gray-400 text-sm">
          {filteredPublishers.length} publishers
        </Text>
      </View>

      {/* Stats Bar */}
      <View className="px-4 py-3 bg-gray-800/50 border-b border-gray-800">
        <View className="flex-row flex-wrap gap-2">
          <View className="bg-gray-700/50 px-3 py-2 rounded-lg min-w-[80px]">
            <Text className="text-gray-400 text-xs">Tổng</Text>
            <Text className="text-white font-bold text-sm">{stats.total}</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <PublisherSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Publisher List */}
      <PublisherList
        publishers={filteredPublishers}
        isLoading={isLoading && publishers.length > 0}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onPublisherPress={handlePublisherPress}
        onPublisherDelete={handlePublisherDelete}
      />
    </SafeAreaView>
  );
}
