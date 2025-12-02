import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../navigation/AdminStack";
import type { User, UpdateUserPayload } from "@features/user/api/user.api";
import { updateUser, deleteUser, fetchUserById } from "@features/user/api/user.api";
import Toast from "react-native-toast-message";
import { validateImageUri } from "@shared-utils/validate-image-uri";
import { UserFormField } from "@features/user/components/UserFormField";
import { UserAvatarSection } from "@features/user/components/UserAvatarSection";
import { UserRoleSelector } from "@features/user/components/UserRoleSelector";
import { UserPasswordFields } from "@features/user/components/UserPasswordFields";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && SCREEN_WIDTH >= 768;

type UserDetailScreenRouteProp = RouteProp<AdminStackParamList, "UserDetail">;
type UserDetailScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "UserDetail"
>;

export default function UserDetailScreen() {
  const route = useRoute<UserDetailScreenRouteProp>();
  const navigation = useNavigation<UserDetailScreenNavigationProp>();
  const { userId } = route.params;

  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UpdateUserPayload>({});
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUserById(userId);
      setUser(data);
      setFormData({
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        bio: data.bio || "",
        is_active: data.is_active ?? true,
        role: data.role || "reader",
      });
      setErrors({});
    } catch (error: any) {
      console.error("Failed to load user:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi tải dữ liệu",
        text2: "Không thể tải thông tin user",
      });
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

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

    // Validate password if provided
    if (passwordData.newPassword || passwordData.confirmPassword) {
      if (!passwordData.newPassword || passwordData.newPassword.trim() === "") {
        newErrors.newPassword = "Mật khẩu mới không được để trống";
      } else if (passwordData.newPassword.length < 8) {
        newErrors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
      } else if (!/[A-Z]/.test(passwordData.newPassword)) {
        newErrors.newPassword = "Mật khẩu phải có ít nhất 1 chữ hoa";
      } else if (!/[a-z]/.test(passwordData.newPassword)) {
        newErrors.newPassword = "Mật khẩu phải có ít nhất 1 chữ thường";
      } else if (!/[0-9]/.test(passwordData.newPassword)) {
        newErrors.newPassword = "Mật khẩu phải có ít nhất 1 số";
      } else if (!/[#?!@$%^&*-]/.test(passwordData.newPassword)) {
        newErrors.newPassword = "Mật khẩu phải có ít nhất 1 ký tự đặc biệt (#?!@$%^&*-)";
      }

      if (!passwordData.confirmPassword || passwordData.confirmPassword.trim() === "") {
        newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống";
      } else if (passwordData.newPassword !== passwordData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
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
      const updatePayload = { ...formData };
      
      // Only include password if it's provided
      if (passwordData.newPassword && passwordData.newPassword.trim() !== "") {
        updatePayload.password = passwordData.newPassword;
      }
      
      await updateUser(user.id, updatePayload);
      Toast.show({
        type: "success",
        text1: "Cập nhật thành công",
        text2: passwordData.newPassword 
          ? "Thông tin user và mật khẩu đã được cập nhật"
          : "Thông tin user đã được cập nhật",
      });
      navigation.goBack();
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
              navigation.goBack();
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-400 mt-4">Đang tải thông tin user...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-white text-lg font-semibold mt-4 text-center">
            Không tìm thấy user
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mt-6 bg-emerald-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const avatarUri = validateImageUri(
    user.profile_image,
    "https://velle.vn/wp-content/uploads/2025/04/avatar-mac-dinh-4-2.jpg"
  );


  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4 p-2 rounded-full bg-gray-800 active:bg-gray-700"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-white">Chỉnh sửa User</Text>
          <Text className="text-gray-400 text-xs mt-1">ID: {user.id}</Text>
        </View>
        <View className="w-10" />
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
        //   keyboardShouldPersistTaps="handled"
        //   keyboardDismissMode="none"
          nestedScrollEnabled={true}
        >
          {/* Avatar Section */}
          <UserAvatarSection user={user} avatarUri={avatarUri} />

          {/* Form Fields */}
          <View className={`px-4 py-6 gap-5 ${IS_DESKTOP ? "max-w-4xl mx-auto w-full" : ""}`}>
            {/* Row 1: Username & Email (Desktop) or stacked (Mobile) */}
            <View className={IS_DESKTOP ? "flex-row gap-4" : "gap-5"}>
              <UserFormField
                label="Username"
                value={formData.username}
                onChange={(text) =>
                  setFormData({ ...formData, username: text })
                }
                placeholder="Nhập username"
                error={errors.username}
                required
              />
              <UserFormField
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
            <UserFormField
              label="Số điện thoại"
              value={formData.phone}
              onChange={(text) => setFormData({ ...formData, phone: text })}
              placeholder="0123456789"
              keyboardType="phone-pad"
              error={errors.phone}
            />

            {/* Row 3: Bio */}
            <UserFormField
              label="Giới thiệu"
              value={formData.bio}
              onChange={(text) => setFormData({ ...formData, bio: text })}
              placeholder="Nhập giới thiệu về user..."
              multiline
            />

            {/* Row 4: Role Selection */}
            <UserRoleSelector
              selectedRole={formData.role || "reader"}
              onRoleChange={(role) => setFormData({ ...formData, role })}
            />

            {/* Row 5: Password Section */}
            <UserPasswordFields
              newPassword={passwordData.newPassword}
              confirmPassword={passwordData.confirmPassword}
              onNewPasswordChange={(text) =>
                setPasswordData({ ...passwordData, newPassword: text })
              }
              onConfirmPasswordChange={(text) =>
                setPasswordData({ ...passwordData, confirmPassword: text })
              }
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              onToggleShowPassword={() => setShowPassword(!showPassword)}
              onToggleShowConfirmPassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              newPasswordError={errors.newPassword}
              confirmPasswordError={errors.confirmPassword}
            />

            {/* Row 6: Active Status */}
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

          {/* Footer Actions */}
          <View
            className={`px-4 py-4 border-t border-gray-800 gap-3 bg-gray-900 ${
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

