import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SlideUpModal } from "@shared-components/SlideUpModal";
import type { User, UpdateUserPayload } from "@features/user/api/user.api";
import { updateUser, deleteUser } from "@features/user/api/user.api";
import Toast from "react-native-toast-message";
import { validateImageUri } from "@shared-utils/validate-image-uri";
import { Image } from "react-native";

interface UserDetailModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  onUpdate: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && SCREEN_WIDTH >= 768;

export const UserDetailModal = ({
  visible,
  user,
  onClose,
  onUpdate,
}: UserDetailModalProps) => {
  const [formData, setFormData] = useState<UpdateUserPayload>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        is_active: user.is_active ?? true,
        role: user.role || "reader",
      });
      setErrors({});
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username || formData.username.trim() === "") {
      newErrors.username = "Username không được để trống";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username phải có ít nhất 3 ký tự";
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email không được để trống";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Email không hợp lệ";
      }
    }

    if (formData.phone && formData.phone.trim() !== "") {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
        newErrors.phone = "Số điện thoại không hợp lệ";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!user) return;

    if (!validateForm()) {
      Toast.show({
        type: "error",
        text1: "Lỗi validation",
        text2: "Vui lòng kiểm tra lại thông tin",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateUser(user.id, formData);
      Toast.show({
        type: "success",
        text1: "Cập nhật thành công",
        text2: "Thông tin user đã được cập nhật",
      });
      onUpdate();
      onClose();
    } catch (error: any) {
      console.error("Update user error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi cập nhật",
        text2: error?.response?.data?.detail || "Không thể cập nhật user",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!user) return;

    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa user "${user.username}"? Hành động này không thể hoàn tác.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteUser(user.id);
              Toast.show({
                type: "success",
                text1: "Xóa thành công",
                text2: "User đã được xóa",
              });
              onUpdate();
              onClose();
            } catch (error: any) {
              console.error("Delete user error:", error);
              Toast.show({
                type: "error",
                text1: "Lỗi xóa",
                text2: error?.response?.data?.detail || "Không thể xóa user",
              });
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (!user) {
    return null;
  }

  const avatarUri = validateImageUri(
    user.profile_image,
    "https://velle.vn/wp-content/uploads/2025/04/avatar-mac-dinh-4-2.jpg"
  );

  const getRoleColor = (role: string | undefined) => {
    if (!role) return "text-gray-400";
    switch (role) {
      case "admin":
        return "text-red-400";
      case "writer":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getRoleBadgeColor = (role: string | undefined) => {
    if (!role) return "bg-gray-500/20 border-gray-500/50";
    switch (role) {
      case "admin":
        return "bg-red-500/20 border-red-500/50";
      case "writer":
        return "bg-blue-500/20 border-blue-500/50";
      default:
        return "bg-gray-500/20 border-gray-500/50";
    }
  };

  const FormField = ({
    label,
    value,
    onChange,
    placeholder,
    keyboardType = "default",
    multiline = false,
    error,
    required = false,
  }: {
    label: string;
    value: string | undefined;
    onChange: (text: string) => void;
    placeholder?: string;
    keyboardType?: "default" | "email-address" | "phone-pad";
    multiline?: boolean;
    error?: string;
    required?: boolean;
  }) => (
    <View className={IS_DESKTOP ? "flex-1" : "w-full"}>
      <View className="flex-row items-center mb-2">
        <Text className="text-gray-300 text-sm font-medium">{label}</Text>
        {required && <Text className="text-red-400 ml-1">*</Text>}
      </View>
      <TextInput
        value={value || ""}
        onChangeText={onChange}
        placeholder={placeholder || `Nhập ${label.toLowerCase()}`}
        placeholderTextColor="#6B7280"
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
        autoCorrect={false}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? "top" : "center"}
        returnKeyType={multiline ? "default" : "next"}
        blurOnSubmit={!multiline}
        className={`bg-gray-800 text-white px-4 rounded-xl border ${
          error ? "border-red-500" : "border-gray-700"
        } ${multiline ? "py-3 min-h-[100px]" : "py-3.5"}`}
        style={{
          fontSize: Platform.OS === "web" ? 14 : 16,
        }}
      />
      {error && (
        <View className="flex-row items-center mt-1.5">
          <Ionicons name="alert-circle" size={14} color="#EF4444" />
          <Text className="text-red-400 text-xs ml-1">{error}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SlideUpModal 
      visible={visible} 
      onClose={onClose} 
      maxHeight={IS_DESKTOP ? 0.95 : 0.9}
      showHandleBar={true}
      showCloseButton={false}
    >
      <View style={{ flex: 1, backgroundColor: "#111827", minHeight: 400 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-800">
          <View className="flex-1">
            <Text className="text-xl font-bold text-white">Chỉnh sửa User</Text>
            <Text className="text-gray-400 text-xs mt-1">
              ID: {user.id}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 rounded-full bg-gray-800 active:bg-gray-700"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
          >
          {/* Avatar Section */}
          <View className="items-center py-6 border-b border-gray-800 bg-gray-800/30">
            <View className="relative">
              <Image
                source={{ uri: avatarUri }}
                className="w-20 h-20 rounded-full bg-gray-700 border-2 border-gray-600"
                resizeMode="cover"
              />
              {!user.is_active && (
                <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-gray-900" />
              )}
            </View>
            <Text className="text-white font-bold text-lg mt-3">
              {user.username}
            </Text>
            <View
              className={`px-3 py-1 rounded-full border mt-2 ${getRoleBadgeColor(
                user.role || "reader"
              )}`}
            >
              <Text
                className={`text-xs font-semibold ${getRoleColor(
                  user.role || "reader"
                )}`}
              >
                {(user.role || "reader").toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Form Fields */}
          <View className={`px-4 py-6 gap-5 ${IS_DESKTOP ? "max-w-4xl mx-auto w-full" : ""}`}>
            {/* Row 1: Username & Email (Desktop) or stacked (Mobile) */}
            <View className={IS_DESKTOP ? "flex-row gap-4" : "gap-5"}>
              <FormField
                label="Username"
                value={formData.username}
                onChange={(text) =>
                  setFormData({ ...formData, username: text })
                }
                placeholder="Nhập username"
                error={errors.username}
                required
              />
              <FormField
                label="Email"
                value={formData.email}
                onChange={(text) => setFormData({ ...formData, email: text })}
                placeholder="example@email.com"
                keyboardType="email-address"
                error={errors.email}
                required
              />
            </View>

            {/* Row 2: Phone */}
            <FormField
              label="Số điện thoại"
              value={formData.phone}
              onChange={(text) => setFormData({ ...formData, phone: text })}
              placeholder="0123456789"
              keyboardType="phone-pad"
              error={errors.phone}
            />

            {/* Row 3: Bio */}
            <FormField
              label="Giới thiệu"
              value={formData.bio}
              onChange={(text) => setFormData({ ...formData, bio: text })}
              placeholder="Nhập giới thiệu về user..."
              multiline
            />

            {/* Row 4: Role Selection */}
            <View>
              <View className="flex-row items-center mb-3">
                <Text className="text-gray-300 text-sm font-medium">Vai trò</Text>
                <Text className="text-red-400 ml-1">*</Text>
              </View>
              <View className={`flex-row gap-2 ${IS_DESKTOP ? "max-w-md" : ""}`}>
                {(["reader", "writer", "admin"] as const).map((role) => {
                  const isSelected = (formData.role || "reader") === role;
                  return (
                    <TouchableOpacity
                      key={role}
                      onPress={() => setFormData({ ...formData, role })}
                      className={`flex-1 py-3.5 rounded-xl border ${
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500"
                          : "bg-gray-800 border-gray-700"
                      }`}
                      activeOpacity={0.7}
                    >
                      <View className="items-center">
                        <Ionicons
                          name={
                            role === "admin"
                              ? "shield-checkmark"
                              : role === "writer"
                              ? "create"
                              : "person"
                          }
                          size={20}
                          color={isSelected ? "#10b981" : "#9CA3AF"}
                        />
                        <Text
                          className={`text-center font-semibold mt-1 ${
                            isSelected ? "text-emerald-400" : "text-gray-400"
                          }`}
                          style={{ fontSize: Platform.OS === "web" ? 12 : 13 }}
                        >
                          {role === "admin"
                            ? "ADMIN"
                            : role === "writer"
                            ? "WRITER"
                            : "READER"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Row 5: Active Status */}
            <View className="flex-row items-center justify-between py-4 px-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <View className="flex-1">
                <Text className="text-gray-300 text-sm font-medium mb-1">
                  Trạng thái tài khoản
                </Text>
                <Text className="text-gray-500 text-xs">
                  {formData.is_active !== undefined && formData.is_active
                    ? "Tài khoản đang hoạt động"
                    : "Tài khoản đã bị khóa"}
                </Text>
              </View>
              <Switch
                value={formData.is_active ?? true}
                onValueChange={(value) =>
                  setFormData({ ...formData, is_active: value })
                }
                trackColor={{ false: "#374151", true: "#10b981" }}
                thumbColor={(formData.is_active ?? true) ? "#FFFFFF" : "#9CA3AF"}
                ios_backgroundColor="#374151"
              />
            </View>
          </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Footer Actions */}
        <View
          className={`px-4 py-4 border-t border-gray-800 gap-3 ${
            IS_DESKTOP ? "flex-row max-w-4xl mx-auto w-full" : ""
          }`}
        >
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={isSubmitting}
            className={`bg-emerald-500 py-3.5 rounded-xl flex-row items-center justify-center ${
              IS_DESKTOP ? "flex-1" : ""
            } ${isSubmitting ? "opacity-50" : ""}`}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text className="text-white font-semibold ml-2">
                  Lưu thay đổi
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            disabled={isDeleting}
            className={`bg-red-500/20 border border-red-500/50 py-3.5 rounded-xl flex-row items-center justify-center ${
              IS_DESKTOP ? "flex-1" : ""
            } ${isDeleting ? "opacity-50" : ""}`}
            activeOpacity={0.8}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text className="text-red-400 font-semibold ml-2">
                  Xóa User
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SlideUpModal>
  );
};
