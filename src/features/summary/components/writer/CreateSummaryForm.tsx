import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SlideUpModal } from "@shared-components/SlideUpModal";

interface CreateSummaryFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    book_athor: string;
    book_cover_path: string;
    category_id: string;
  }) => void;
}

export const CreateSummaryForm = ({
  visible,
  onClose,
  onSubmit,
}: CreateSummaryFormProps) => {
  const [title, setTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookCoverPath, setBookCoverPath] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !bookAuthor.trim() || !bookCoverPath.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    onSubmit({
      title: title.trim(),
      book_athor: bookAuthor.trim(),
      book_cover_path: bookCoverPath.trim(),
      category_id: categoryId.trim() || "default",
    });

    // Reset form
    setTitle("");
    setBookAuthor("");
    setBookCoverPath("");
    setCategoryId("");
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setBookAuthor("");
    setBookCoverPath("");
    setCategoryId("");
    onClose();
  };

  return (
    <SlideUpModal
      visible={visible}
      onClose={handleClose}
      title="Create New Summary"
      maxHeight={600}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Title Input */}
        <View className="mb-4">
          <Text className="text-white font-semibold text-sm mb-2">
            Book Title *
          </Text>
          <TextInput
            placeholder="Enter book title"
            placeholderTextColor="#6B7280"
            value={title}
            onChangeText={setTitle}
            className="bg-gray-800 text-white rounded-lg px-4 py-3 text-base"
            style={{ color: "#FFFFFF" }}
          />
        </View>

        {/* Author Input */}
        <View className="mb-4">
          <Text className="text-white font-semibold text-sm mb-2">
            Book Author *
          </Text>
          <TextInput
            placeholder="Enter author name"
            placeholderTextColor="#6B7280"
            value={bookAuthor}
            onChangeText={setBookAuthor}
            className="bg-gray-800 text-white rounded-lg px-4 py-3 text-base"
            style={{ color: "#FFFFFF" }}
          />
        </View>

        {/* Book Cover URL Input */}
        <View className="mb-4">
          <Text className="text-white font-semibold text-sm mb-2">
            Book Cover Image URL *
          </Text>
          <TextInput
            placeholder="https://example.com/image.jpg"
            placeholderTextColor="#6B7280"
            value={bookCoverPath}
            onChangeText={setBookCoverPath}
            className="bg-gray-800 text-white rounded-lg px-4 py-3 text-base"
            style={{ color: "#FFFFFF" }}
            autoCapitalize="none"
            keyboardType="url"
          />
        </View>

        {/* Category Input */}
        <View className="mb-6">
          <Text className="text-white font-semibold text-sm mb-2">
            Category ID
          </Text>
          <TextInput
            placeholder="Enter category ID (optional)"
            placeholderTextColor="#6B7280"
            value={categoryId}
            onChangeText={setCategoryId}
            className="bg-gray-800 text-white rounded-lg px-4 py-3 text-base"
            style={{ color: "#FFFFFF" }}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-indigo-600 rounded-xl p-4 flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          <Text className="text-white font-semibold text-base ml-2">
            Create Summary
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SlideUpModal>
  );
};
