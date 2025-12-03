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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../navigation/AdminStack";
import type {
  BookPopulated,
  UpdateBookPayload,
  CreateBookPayload,
} from "@features/book/api/book-management.api";
import {
  updateBook,
  createBook,
  deleteBook,
  fetchBookById,
} from "@features/book/api/book-management.api";
import { fetchAuthors } from "@features/author/api/author.api";
import { fetchPublishers } from "@features/publisher/api/publisher.api";
import { fetchCategories } from "@features/category/api/category.api";
import type { Author } from "@features/author/api/author.api";
import type { Publisher } from "@features/publisher/api/publisher.api";
import type { Category } from "@features/category/api/category.api";
import Toast from "react-native-toast-message";
import { UserFormField } from "@features/user/components/UserFormField";
import { validateImageUri } from "@shared-utils/validate-image-uri";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IS_DESKTOP = Platform.OS === "web" && SCREEN_WIDTH >= 768;

type BookDetailScreenRouteProp = RouteProp<AdminStackParamList, "BookDetail">;
type BookDetailScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "BookDetail"
>;

export default function BookDetailScreen() {
  const route = useRoute<BookDetailScreenRouteProp>();
  const navigation = useNavigation<BookDetailScreenNavigationProp>();
  const { bookId } = route.params;

  const isNewBook = bookId === "new";
  const [book, setBook] = useState<BookPopulated | null>(null);
  const [formData, setFormData] = useState<UpdateBookPayload>({});
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(!isNewBook);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadOptions();
    if (!isNewBook) {
      loadBook();
    } else {
      setFormData({
        title: "",
        publisher_id: null,
        publish_date: null,
        cover_image: null,
        price: 0,
        stock_quantity: 0,
        author_ids: [],
        category_ids: [],
      });
      setIsLoading(false);
    }
  }, [bookId]);

  const loadOptions = async () => {
    try {
      const [authorsData, publishersData, categoriesData] = await Promise.all([
        fetchAuthors(),
        fetchPublishers(),
        fetchCategories(),
      ]);
      setAuthors(authorsData);
      setPublishers(publishersData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load options:", error);
    }
  };

  const loadBook = async () => {
    try {
      setIsLoading(true);
      const data = await fetchBookById(bookId);
      setBook(data);
      setFormData({
        title: data.title || "",
        publisher_id: data.publisher_id || null,
        publish_date: data.publish_date || null,
        cover_image: data.cover_image || null,
        price: data.price || 0,
        stock_quantity: data.stock_quantity || 0,
        author_ids: data.authors?.map((a) => a.id) || [],
        category_ids: data.categories?.map((c) => c.id) || [],
      });
      setErrors({});
    } catch (error: any) {
      console.error("Failed to load book:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi tải dữ liệu",
        text2: "Không thể tải thông tin sách",
      });
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || formData.title.trim() === "") {
      newErrors.title = "Tên sách không được để trống";
    } else if (formData.title.length < 2) {
      newErrors.title = "Tên sách phải có ít nhất 2 ký tự";
    }

    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = "Giá sách phải lớn hơn hoặc bằng 0";
    }

    if (formData.stock_quantity === undefined || formData.stock_quantity < 0) {
      newErrors.stock_quantity = "Số lượng tồn kho phải lớn hơn hoặc bằng 0";
    }

    if (formData.publish_date && formData.publish_date.trim() !== "") {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.publish_date)) {
        newErrors.publish_date = "Ngày xuất bản phải có định dạng YYYY-MM-DD";
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
      if (isNewBook) {
        await createBook(formData as CreateBookPayload);
        Toast.show({
          type: "success",
          text1: "Tạo thành công",
          text2: "Sách mới đã được tạo",
        });
      } else {
        await updateBook(bookId, formData);
        Toast.show({
          type: "success",
          text1: "Cập nhật thành công",
          text2: "Thông tin sách đã được cập nhật",
        });
      }
      navigation.goBack();
    } catch (error: any) {
      console.error("Save book error:", error);
      Toast.show({
        type: "error",
        text1: isNewBook ? "Lỗi tạo" : "Lỗi cập nhật",
        text2:
          error?.response?.data?.detail ||
          `Không thể ${isNewBook ? "tạo" : "cập nhật"} sách`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!book || isNewBook) return;

    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc muốn xóa sách "${book.title}"? Hành động này không thể hoàn tác.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteBook(book.id.toString());
              Toast.show({
                type: "success",
                text1: "Xóa thành công",
                text2: "Sách đã được xóa",
              });
              navigation.goBack();
            } catch (error: any) {
              console.error("Delete book error:", error);
              Toast.show({
                type: "error",
                text1: "Lỗi xóa",
                text2: error?.response?.data?.detail || "Không thể xóa sách",
              });
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const toggleAuthor = (authorId: number) => {
    const currentIds = formData.author_ids || [];
    const newIds = currentIds.includes(authorId)
      ? currentIds.filter((id) => id !== authorId)
      : [...currentIds, authorId];
    setFormData({ ...formData, author_ids: newIds });
  };

  const toggleCategory = (categoryId: number) => {
    const currentIds = formData.category_ids || [];
    const newIds = currentIds.includes(categoryId)
      ? currentIds.filter((id) => id !== categoryId)
      : [...currentIds, categoryId];
    setFormData({ ...formData, category_ids: newIds });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="text-gray-400 mt-4">Đang tải thông tin sách...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const coverImage = validateImageUri(
    formData.cover_image || book?.cover_image,
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
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
          <Text className="text-xl font-bold text-white">
            {isNewBook ? "Thêm sách mới" : "Chỉnh sửa sách"}
          </Text>
          {!isNewBook && book && (
            <Text className="text-gray-400 text-xs mt-1">ID: {book.id}</Text>
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
          {/* Cover Image */}
          {coverImage && (
            <View className="items-center py-6 border-b border-gray-800 bg-gray-800/30">
              <Image
                source={{ uri: coverImage }}
                className="w-32 h-48 rounded-lg bg-gray-700"
                resizeMode="cover"
              />
            </View>
          )}

          {/* Form Fields */}
          <View
            className={`px-4 py-6 gap-5 ${
              IS_DESKTOP ? "max-w-4xl mx-auto w-full" : ""
            }`}
          >
            {/* Title */}
            <UserFormField
              label="Tên sách"
              value={formData.title}
              onChange={(text) => setFormData({ ...formData, title: text })}
              placeholder="Nhập tên sách"
              error={errors.title}
              required
            />

            {/* Price & Stock Quantity */}
            <View className={IS_DESKTOP ? "flex-row gap-4" : "gap-5"}>
              <UserFormField
                label="Giá (VND)"
                value={formData.price?.toString() || "0"}
                onChange={(text) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(text) || 0,
                  })
                }
                keyboardType="numeric"
                placeholder="0"
                error={errors.price}
                required
              />
              <UserFormField
                label="Số lượng tồn kho"
                value={formData.stock_quantity?.toString() || "0"}
                onChange={(text) =>
                  setFormData({
                    ...formData,
                    stock_quantity: parseInt(text) || 0,
                  })
                }
                keyboardType="numeric"
                placeholder="0"
                error={errors.stock_quantity}
                required
              />
            </View>

            {/* Publisher */}
            <View>
              <View className="flex-row items-center mb-2">
                <Text className="text-gray-300 text-sm font-medium">
                  Nhà xuất bản
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  onPress={() => setFormData({ ...formData, publisher_id: null })}
                  className={`px-4 py-2 rounded-lg border ${
                    formData.publisher_id === null
                      ? "bg-emerald-500/20 border-emerald-500"
                      : "bg-gray-800 border-gray-700"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      formData.publisher_id === null
                        ? "text-emerald-400"
                        : "text-gray-400"
                    }`}
                  >
                    Không có
                  </Text>
                </TouchableOpacity>
                {publishers.map((publisher) => (
                  <TouchableOpacity
                    key={publisher.id}
                    onPress={() =>
                      setFormData({ ...formData, publisher_id: publisher.id })
                    }
                    className={`px-4 py-2 rounded-lg border ${
                      formData.publisher_id === publisher.id
                        ? "bg-emerald-500/20 border-emerald-500"
                        : "bg-gray-800 border-gray-700"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        formData.publisher_id === publisher.id
                          ? "text-emerald-400"
                          : "text-gray-400"
                      }`}
                    >
                      {publisher.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Authors */}
            <View>
              <View className="flex-row items-center mb-2">
                <Text className="text-gray-300 text-sm font-medium">Tác giả</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {authors.map((author) => {
                  const isSelected =
                    (formData.author_ids || []).includes(author.id);
                  return (
                    <TouchableOpacity
                      key={author.id}
                      onPress={() => toggleAuthor(author.id)}
                      className={`px-4 py-2 rounded-lg border ${
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500"
                          : "bg-gray-800 border-gray-700"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          isSelected ? "text-emerald-400" : "text-gray-400"
                        }`}
                      >
                        {author.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Categories */}
            <View>
              <View className="flex-row items-center mb-2">
                <Text className="text-gray-300 text-sm font-medium">Danh mục</Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {categories.map((category) => {
                  const isSelected = (formData.category_ids || []).includes(
                    category.id
                  );
                  return (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => toggleCategory(category.id)}
                      className={`px-4 py-2 rounded-lg border ${
                        isSelected
                          ? "bg-emerald-500/20 border-emerald-500"
                          : "bg-gray-800 border-gray-700"
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          isSelected ? "text-emerald-400" : "text-gray-400"
                        }`}
                      >
                        {category.category_name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Publish Date */}
            <UserFormField
              label="Ngày xuất bản"
              value={formData.publish_date || ""}
              onChange={(text) =>
                setFormData({
                  ...formData,
                  publish_date: text.trim() === "" ? null : text,
                })
              }
              placeholder="YYYY-MM-DD (ví dụ: 2024-01-15)"
              error={errors.publish_date}
            />

            {/* Cover Image URL */}
            <UserFormField
              label="URL ảnh bìa"
              value={formData.cover_image || ""}
              onChange={(text) =>
                setFormData({
                  ...formData,
                  cover_image: text.trim() === "" ? null : text,
                })
              }
              placeholder="https://example.com/image.jpg"
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
                  name={isNewBook ? "add-circle" : "checkmark-circle"}
                  size={20}
                  color="#FFFFFF"
                />
                <Text className="text-white font-semibold ml-2">
                  {isNewBook ? "Tạo mới" : "Lưu thay đổi"}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {!isNewBook && book && (
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
                    Xóa sách
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




