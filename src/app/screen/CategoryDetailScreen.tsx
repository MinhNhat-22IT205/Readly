import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
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
import type {
  Category,
  UpdateCategoryPayload,
  CreateCategoryPayload,
} from "@features/category/api/category.api";
import {
  updateCategory,
  createCategory,
  deleteCategory,
  fetchCategoryById,
} from "@features/category/api/category.api";
import Toast from "react-native-toast-message";
import { UserFormField } from "@features/user/components/UserFormField";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && SCREEN_WIDTH >= 768;

type CategoryDetailScreenRouteProp = RouteProp<
  AdminStackParamList,
  "CategoryDetail"
>;
type CategoryDetailScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "CategoryDetail"
>;

export default function CategoryDetailScreen() {
  const route = useRoute<CategoryDetailScreenRouteProp>();
  const navigation = useNavigation<CategoryDetailScreenNavigationProp>();
  const { categoryId } = route.params;

  const isNewCategory = categoryId === "new";
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<UpdateCategoryPayload>({});
  const [isLoading, setIsLoading] = useState(!isNewCategory);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNewCategory) {
      loadCategory();
    } else {
      setFormData({ category_name: "" });
      setIsLoading(false);
    }
  }, [categoryId]);

  const loadCategory = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCategoryById(categoryId);
      setCategory(data);
      setFormData({ category_name: data.category_name || "" });
      setErrors({});
    } catch (error: any) {
      console.error("Failed to load category:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi tải dữ liệu",
        text2: "Không thể tải thông tin danh mục",
      });
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.category_name || formData.category_name.trim() === "") {
      newErrors.category_name = "Tên danh mục không được để trống";
    } else if (formData.category_name.length < 2) {
      newErrors.category_name = "Tên danh mục phải có ít nhất 2 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
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
      if (isNewCategory) {
        await createCategory(formData as CreateCategoryPayload);
        Toast.show({
          type: "success",
          text1: "Tạo thành công",
          text2: "Danh mục mới đã được tạo",
        });
      } else {
        await updateCategory(categoryId, formData);
        Toast.show({
          type: "success",
          text1: "Cập nhật thành công",
          text2: "Thông tin danh mục đã được cập nhật",
        });
      }
      navigation.goBack();
    } catch (error: any) {
      console.error("Save category error:", error);
      Toast.show({
        type: "error",
        text1: isNewCategory ? "Lỗi tạo" : "Lỗi cập nhật",
        text2:
          error?.response?.data?.detail ||
          `Không thể ${isNewCategory ? "tạo" : "cập nhật"} danh mục`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!category || isNewCategory) return;

    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa danh mục "${category.category_name}"? Hành động này không thể hoàn tác.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteCategory(category.id.toString());
              Toast.show({
                type: "success",
                text1: "Xóa thành công",
                text2: "Danh mục đã được xóa",
              });
              navigation.goBack();
            } catch (error: any) {
              console.error("Delete category error:", error);
              Toast.show({
                type: "error",
                text1: "Lỗi xóa",
                text2: error?.response?.data?.detail || "Không thể xóa danh mục",
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
          <Text className="text-gray-400 mt-4">Đang tải thông tin danh mục...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text className="text-xl font-bold text-white">
            {isNewCategory ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}
          </Text>
          {!isNewCategory && category && (
            <Text className="text-gray-400 text-xs mt-1">ID: {category.id}</Text>
          )}
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
          nestedScrollEnabled={true}
        >
          {/* Form Fields */}
          <View
            className={`px-4 py-6 gap-5 ${
              IS_DESKTOP ? "max-w-4xl mx-auto w-full" : ""
            }`}
          >
            {/* Category Name */}
            <UserFormField
              label="Tên danh mục"
              value={formData.category_name}
              onChange={(text) =>
                setFormData({ ...formData, category_name: text })
              }
              placeholder="Nhập tên danh mục"
              error={errors.category_name}
              required
            />
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View
          className={`px-4 py-4 border-t border-gray-800 gap-3 bg-gray-900 ${
            IS_DESKTOP ? "flex-row max-w-4xl mx-auto w-full" : ""
          }`}
        >
          <TouchableOpacity
            onPress={handleSave}
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
                <Ionicons
                  name={isNewCategory ? "add-circle" : "checkmark-circle"}
                  size={20}
                  color="#FFFFFF"
                />
                <Text className="text-white font-semibold ml-2">
                  {isNewCategory ? "Tạo mới" : "Lưu thay đổi"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {!isNewCategory && category && (
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
                    Xóa danh mục
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

