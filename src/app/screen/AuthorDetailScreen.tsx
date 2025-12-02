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
  Author,
  UpdateAuthorPayload,
  CreateAuthorPayload,
} from "@features/author/api/author.api";
import {
  updateAuthor,
  createAuthor,
  deleteAuthor,
  fetchAuthorById,
} from "@features/author/api/author.api";
import Toast from "react-native-toast-message";
import { UserFormField } from "@features/user/components/UserFormField";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && SCREEN_WIDTH >= 768;

type AuthorDetailScreenRouteProp = RouteProp<AdminStackParamList, "AuthorDetail">;
type AuthorDetailScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AuthorDetail"
>;

export default function AuthorDetailScreen() {
  const route = useRoute<AuthorDetailScreenRouteProp>();
  const navigation = useNavigation<AuthorDetailScreenNavigationProp>();
  const { authorId } = route.params;

  const isNewAuthor = authorId === "new";
  const [author, setAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState<UpdateAuthorPayload>({});
  const [isLoading, setIsLoading] = useState(!isNewAuthor);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isNewAuthor) {
      loadAuthor();
    } else {
      setFormData({
        name: "",
        birth_date: null,
        nationality: null,
        biography: null,
      });
      setIsLoading(false);
    }
  }, [authorId]);

  const loadAuthor = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAuthorById(authorId);
      setAuthor(data);
      setFormData({
        name: data.name || "",
        birth_date: data.birth_date || null,
        nationality: data.nationality || null,
        biography: data.biography || null,
      });
      setErrors({});
    } catch (error: any) {
      console.error("Failed to load author:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi tải dữ liệu",
        text2: "Không thể tải thông tin tác giả",
      });
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Tên tác giả không được để trống";
    } else if (formData.name.length < 2) {
      newErrors.name = "Tên tác giả phải có ít nhất 2 ký tự";
    }

    if (formData.birth_date && formData.birth_date.trim() !== "") {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.birth_date)) {
        newErrors.birth_date = "Ngày sinh phải có định dạng YYYY-MM-DD";
      }
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
      if (isNewAuthor) {
        await createAuthor(formData as CreateAuthorPayload);
        Toast.show({
          type: "success",
          text1: "Tạo thành công",
          text2: "Tác giả mới đã được tạo",
        });
      } else {
        await updateAuthor(authorId, formData);
        Toast.show({
          type: "success",
          text1: "Cập nhật thành công",
          text2: "Thông tin tác giả đã được cập nhật",
        });
      }
      navigation.goBack();
    } catch (error: any) {
      console.error("Save author error:", error);
      Toast.show({
        type: "error",
        text1: isNewAuthor ? "Lỗi tạo" : "Lỗi cập nhật",
        text2:
          error?.response?.data?.detail ||
          `Không thể ${isNewAuthor ? "tạo" : "cập nhật"} tác giả`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!author || isNewAuthor) return;

    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa tác giả "${author.name}"? Hành động này không thể hoàn tác.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteAuthor(author.id.toString());
              Toast.show({
                type: "success",
                text1: "Xóa thành công",
                text2: "Tác giả đã được xóa",
              });
              navigation.goBack();
            } catch (error: any) {
              console.error("Delete author error:", error);
              Toast.show({
                type: "error",
                text1: "Lỗi xóa",
                text2: error?.response?.data?.detail || "Không thể xóa tác giả",
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
          <Text className="text-gray-400 mt-4">Đang tải thông tin tác giả...</Text>
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
            {isNewAuthor ? "Thêm tác giả mới" : "Chỉnh sửa tác giả"}
          </Text>
          {!isNewAuthor && author && (
            <Text className="text-gray-400 text-xs mt-1">ID: {author.id}</Text>
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
            {/* Name */}
            <UserFormField
              label="Tên tác giả"
              value={formData.name}
              onChange={(text) => setFormData({ ...formData, name: text })}
              placeholder="Nhập tên tác giả"
              error={errors.name}
              required
            />

            {/* Birth Date */}
            <UserFormField
              label="Ngày sinh"
              value={formData.birth_date || ""}
              onChange={(text) =>
                setFormData({
                  ...formData,
                  birth_date: text.trim() === "" ? null : text,
                })
              }
              placeholder="YYYY-MM-DD (ví dụ: 1990-01-15)"
              error={errors.birth_date}
            />

            {/* Nationality */}
            <UserFormField
              label="Quốc tịch"
              value={formData.nationality || ""}
              onChange={(text) =>
                setFormData({
                  ...formData,
                  nationality: text.trim() === "" ? null : text,
                })
              }
              placeholder="Nhập quốc tịch"
            />

            {/* Biography */}
            <UserFormField
              label="Tiểu sử"
              value={formData.biography || ""}
              onChange={(text) =>
                setFormData({
                  ...formData,
                  biography: text.trim() === "" ? null : text,
                })
              }
              placeholder="Nhập tiểu sử về tác giả..."
              multiline
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
                  name={isNewAuthor ? "add-circle" : "checkmark-circle"}
                  size={20}
                  color="#FFFFFF"
                />
                <Text className="text-white font-semibold ml-2">
                  {isNewAuthor ? "Tạo mới" : "Lưu thay đổi"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {!isNewAuthor && author && (
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
                    Xóa tác giả
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

