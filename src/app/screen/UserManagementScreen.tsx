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
import { UserList } from "@features/user/components/UserList";
import { UserStatsBar } from "@features/user/components/UserStatsBar";
import { UserSearchBar } from "@features/user/components/UserSearchBar";
import { UserFilters } from "@features/user/components/UserFilters";
import {
  fetchUsers,
  toggleUserActive,
  type User,
  type UserFilters as UserFiltersType,
} from "@features/user/api/user.api";
import Toast from "react-native-toast-message";

type UserManagementScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "UserManagement"
>;

type FilterType = "all" | "reader" | "writer" | "admin";
type StatusFilter = "all" | "active" | "inactive";

export default function UserManagementScreen() {
  const navigation = useNavigation<UserManagementScreenNavigationProp>();
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]); // Tất cả users để tính stats
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Load tất cả users để tính stats (không filter)
  const loadAllUsersForStats = useCallback(async () => {
    try {
      const data = await fetchUsers(); // Load tất cả users không filter
      setAllUsers(data);
    } catch (error) {
      console.error("Failed to load all users for stats:", error);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setIsError(false);
      const filters: UserFiltersType = {};
      
      if (roleFilter !== "all") {
        filters.role = roleFilter;
      }
      
      if (statusFilter !== "all") {
        filters.is_active = statusFilter === "active";
      }
      
      // Note: Search is handled locally for instant filtering
      // If backend supports search, uncomment below:
      // if (searchQuery.trim()) {
      //   filters.search = searchQuery.trim();
      // }

      console.log("🔍 Loading users with filters:", filters);
      
      // Load filtered users for display
      const data = await fetchUsers(filters);
      console.log("✅ Loaded users:", data.length);
      
      // Debug: Log role information for first few users
      if (__DEV__ && data.length > 0) {
        console.log("👥 User roles sample:", data.slice(0, 3).map(u => ({
          id: u.id,
          username: u.username,
          role: u.role,
          roleType: typeof u.role,
        })));
      }
      
      // Sort by username alphabetically
      const sorted = [...data].sort((a, b) =>
        a.username.localeCompare(b.username)
      );
      setUsers(sorted);
      
      // Apply local search filter if exists
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const filtered = sorted.filter(
          (user) =>
            user.username.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            (user.phone && user.phone.includes(query))
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers(sorted);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setIsError(true);
      Toast.show({
        type: "error",
        text1: "Lỗi tải dữ liệu",
        text2: "Không thể tải danh sách users",
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [roleFilter, statusFilter, searchQuery]);

  // Load all users for stats on mount
  useEffect(() => {
    loadAllUsersForStats();
  }, [loadAllUsersForStats]);

  // Load users when filters change (role or status)
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Reload users when screen comes into focus (e.g., returning from UserDetailScreen)
  const isInitialMount = useRef(true);
  useFocusEffect(
    React.useCallback(() => {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
      }
      // Reload both allUsers (for stats) and filtered users when returning to this screen
      loadAllUsersForStats();
      loadUsers();
    }, [loadAllUsersForStats, loadUsers])
  );

  // Filter users locally when search query changes (only for search, not for role/status)
  useEffect(() => {
    // If only search query changes, filter locally
    // If role or status filter changes, we reload from API (handled by above useEffect)
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    // Apply search filter locally
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phone && user.phone.includes(query))
    );

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAllUsersForStats();
    loadUsers();
  };

  const handleUserPress = (user: User) => {
    navigation.navigate("UserDetail", { userId: user.id });
  };

  const handleToggleActive = async (user: User) => {
    try {
      const updatedUser = await toggleUserActive(user.id, !user.is_active);
      // Cập nhật cả users và allUsers
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      setAllUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      // Cập nhật filteredUsers nếu user đó đang được hiển thị
      setFilteredUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );
      Toast.show({
        type: "success",
        text1: "Cập nhật thành công",
        text2: `User đã được ${updatedUser.is_active ? "kích hoạt" : "khóa"}`,
      });
    } catch (error: any) {
      console.error("Toggle active error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi cập nhật",
        text2: error?.response?.data?.detail || "Không thể cập nhật trạng thái",
      });
    }
  };

  const stats = useMemo(() => {
    // Tính stats từ tất cả users (allUsers) để hiển thị tổng số users theo role trong toàn bộ hệ thống
    const total = allUsers.length;
    const active = allUsers.filter((u) => u.is_active).length;
    const readers = allUsers.filter((u) => u.role === "reader").length;
    const writers = allUsers.filter((u) => u.role === "writer").length;
    const admins = allUsers.filter((u) => u.role === "admin").length;

    return { total, active, readers, writers, admins };
  }, [allUsers]);

  if (isLoading && users.length === 0) {
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
          <Text className="text-xl font-bold text-white">User Management</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-400 mt-4">Đang tải danh sách users...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError && users.length === 0) {
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
          <Text className="text-xl font-bold text-white">User Management</Text>
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
            onPress={loadUsers}
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
        <Text className="text-xl font-bold text-white flex-1">User Management</Text>
        <Text className="text-gray-400 text-sm">
          {filteredUsers.length} users
        </Text>
      </View>

      {/* Stats Bar */}
      <UserStatsBar
        total={stats.total}
        active={stats.active}
        readers={stats.readers}
        writers={stats.writers}
        admins={stats.admins}
      />

      {/* Search Bar */}
      <UserSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Filters */}
      <UserFilters
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onRoleFilterChange={setRoleFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* User List */}
      <UserList
        users={filteredUsers}
        isLoading={isLoading && users.length > 0}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onUserPress={handleUserPress}
        onToggleActive={handleToggleActive}
      />
    </SafeAreaView>
  );
}
