import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type FilterType = "all" | "reader" | "writer" | "admin";
type StatusFilter = "all" | "active" | "inactive";

interface UserFiltersProps {
  roleFilter: FilterType;
  statusFilter: StatusFilter;
  onRoleFilterChange: (role: FilterType) => void;
  onStatusFilterChange: (status: StatusFilter) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  roleFilter,
  statusFilter,
  onRoleFilterChange,
  onStatusFilterChange,
}) => {
  return (
    <View className="px-4 py-3 border-b border-gray-800 gap-3">
      {/* Role Filter */}
      <View>
        <Text className="text-gray-400 text-xs mb-2">Lọc theo Role</Text>
        <View className="flex-row gap-2">
          {(["all", "reader", "writer", "admin"] as FilterType[]).map(
            (role) => (
              <TouchableOpacity
                key={role}
                onPress={() => onRoleFilterChange(role)}
                className={`px-4 py-2 rounded-lg border ${
                  roleFilter === role
                    ? "bg-emerald-500/20 border-emerald-500"
                    : "bg-gray-800 border-gray-700"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    roleFilter === role
                      ? "text-emerald-400"
                      : "text-gray-400"
                  }`}
                >
                  {role === "all" ? "Tất cả" : role.toUpperCase()}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>

      {/* Status Filter */}
      <View>
        <Text className="text-gray-400 text-xs mb-2">Lọc theo Trạng thái</Text>
        <View className="flex-row gap-2">
          {(["all", "active", "inactive"] as StatusFilter[]).map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => onStatusFilterChange(status)}
              className={`px-4 py-2 rounded-lg border ${
                statusFilter === status
                  ? "bg-emerald-500/20 border-emerald-500"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  statusFilter === status
                    ? "text-emerald-400"
                    : "text-gray-400"
                }`}
              >
                {status === "all"
                  ? "Tất cả"
                  : status === "active"
                  ? "Hoạt động"
                  : "Đã khóa"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};




