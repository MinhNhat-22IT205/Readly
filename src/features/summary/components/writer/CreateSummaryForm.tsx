import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SlideUpModal } from "@shared-components/SlideUpModal";
import { fetchBooksWithoutSummary } from "@features/book/api/book.api";
import { Book } from "@shared-types/book.type";

interface CreateSummaryFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; book_id: number }) => Promise<void> | void;
}

export const CreateSummaryForm = ({
  visible,
  onClose,
  onSubmit,
}: CreateSummaryFormProps) => {
  const [title, setTitle] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [bookDropdownOpen, setBookDropdownOpen] = useState(false);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedBook = useMemo(
    () => books.find((book) => book.id === selectedBookId) ?? null,
    [books, selectedBookId]
  );

  const resetForm = useCallback(() => {
    setTitle("");
    setSelectedBookId(null);
    setBookDropdownOpen(false);
    setSubmitting(false);
  }, []);

  const loadAvailableBooks = useCallback(async () => {
    setBooksLoading(true);
    setBooksError(null);
    try {
      console.log("Loading available books...");
      const data = await fetchBooksWithoutSummary();
      console.log("Books loaded:", data?.length || 0);
      setBooks(data || []);
      setBooksError(null);

      // Reset selection if the previously selected book is no longer available
      if (!data.some((book) => book.id === selectedBookId)) {
        setSelectedBookId(null);
      }
    } catch (error: any) {
      console.error("Failed to fetch books without summaries:", {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      setBooksError("Unable to load available books. Tap the field to retry.");
      setBooks([]);
    } finally {
      setBooksLoading(false);
    }
  }, [selectedBookId]);

  useEffect(() => {
    if (visible) {
      console.log("CreateSummaryForm opened, loading books...");
      loadAvailableBooks();
    } else {
      console.log("CreateSummaryForm closed, resetting form...");
      resetForm();
    }
  }, [visible, loadAvailableBooks, resetForm]);

  // Hiển thị alert khi không có books sau khi load xong
  useEffect(() => {
    if (visible && !booksLoading && books.length === 0 && !booksError) {
      // Delay một chút để form đã render xong
      const timer = setTimeout(() => {
        Alert.alert(
          "Không có sách mới",
          "Tất cả sách hiện tại đã có summary. Mỗi sách chỉ có thể có một summary. Vui lòng thêm sách mới trước khi tạo summary.",
          [{ text: "Đã hiểu", style: "default" }]
        );
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [visible, booksLoading, books.length, booksError]);

  const handleSubmit = async () => {
    // Kiểm tra nếu không có books available
    if (books.length === 0 && !booksLoading) {
      Alert.alert(
        "No Books Available",
        "All books currently have summaries. Each book can only have one summary. Please add a new book first."
      );
      return;
    }

    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a summary title.");
      return;
    }

    if (!selectedBookId) {
      Alert.alert("Select a book", "Please choose a book to summarize.");
      return;
    }

    setSubmitting(true);
    try {
      await Promise.resolve(
        onSubmit({
          title: title.trim(),
          book_id: selectedBookId,
        })
      );
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to submit summary:", error);
      Alert.alert(
        "Error",
        "Failed to create summary. Please try again in a moment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSelectBook = (bookId: number) => {
    setSelectedBookId(bookId);
    setBookDropdownOpen(false);
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
        {/* Empty State - Hiển thị ngay khi không có books */}
        {!booksLoading && books.length === 0 && !booksError && (
          <View className="mb-6 p-5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl items-center">
            <Ionicons name="information-circle" size={32} color="#F59E0B" />
            <Text className="text-yellow-400 text-base font-semibold mt-3 text-center">
              Không có sách mới
            </Text>
            <Text className="text-yellow-300/80 text-sm text-center mt-2 px-2">
              Tất cả sách hiện tại đã có summary. Mỗi sách chỉ có thể có một summary.
            </Text>
            <Text className="text-yellow-300/60 text-xs text-center mt-2 px-2">
              Vui lòng thêm sách mới trước khi tạo summary.
            </Text>
          </View>
        )}

        {/* Book Selector */}
        <View className="mb-4">
          <Text className="text-white font-semibold text-sm mb-2">Book *</Text>
          <TouchableOpacity
            onPress={() => {
              if (booksLoading) return;
              if (booksError) {
                loadAvailableBooks();
              }
              setBookDropdownOpen((prev) => !prev);
            }}
            className="bg-gray-800 rounded-lg px-4 py-3 flex-row items-center justify-between"
            activeOpacity={0.8}
            disabled={booksLoading}
          >
            <Text className={`text-base flex-1 mr-3 ${
              books.length === 0 && !booksLoading && !selectedBook
                ? "text-gray-500"
                : "text-white"
            }`}>
              {booksLoading
                ? "Loading books..."
                : books.length === 0 && !booksLoading
                  ? "No books available"
                  : selectedBook
                    ? selectedBook.title
                    : "Select a book"}
            </Text>
            <Ionicons
              name={bookDropdownOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          {bookDropdownOpen && (
            <View className="bg-gray-900 border border-gray-800 rounded-xl mt-2">
              {booksLoading ? (
                <View className="py-6 items-center justify-center">
                  <ActivityIndicator color="#A5B4FC" />
                </View>
              ) : books.length === 0 ? (
                <View className="p-6 items-center justify-center">
                  <Ionicons name="book-outline" size={48} color="#6B7280" />
                  <Text className="text-gray-300 text-base font-semibold mt-4 text-center">
                    No Books Available
                  </Text>
                  <Text className="text-gray-400 text-sm text-center mt-2 px-2">
                    All books currently have summaries. Each book can only have one summary.
                  </Text>
                  <Text className="text-gray-500 text-xs text-center mt-2 px-2">
                    Please add a new book first to create a summary.
                  </Text>
                </View>
              ) : (
                <ScrollView style={{ maxHeight: 240 }}>
                  {books.map((book) => {
                    const isSelected = book.id === selectedBookId;
                    return (
                      <TouchableOpacity
                        key={book.id}
                        className={`px-4 py-3 border-b border-gray-800 ${
                          isSelected ? "bg-gray-800" : ""
                        }`}
                        onPress={() => handleSelectBook(book.id)}
                        activeOpacity={0.8}
                      >
                        <Text className="text-white font-semibold">
                          {book.title}
                        </Text>
                        <Text className="text-gray-400 text-xs mt-1">
                          {`Book ID #${book.id}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          )}
          {booksError ? (
            <Text className="text-red-400 text-xs mt-2">{booksError}</Text>
          ) : null}
        </View>

        {/* Title Input */}
        <View className="mb-6">
          <Text className="text-white font-semibold text-sm mb-2">
            Summary Title *
          </Text>
          <TextInput
            placeholder="Enter summary title"
            placeholderTextColor="#6B7280"
            value={title}
            onChangeText={setTitle}
            className="bg-gray-800 text-white rounded-lg px-4 py-3 text-base"
            style={{ color: "#FFFFFF" }}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className={`rounded-xl p-4 flex-row items-center justify-center ${
            books.length === 0 && !booksLoading
              ? "bg-gray-700"
              : "bg-indigo-600"
          }`}
          disabled={submitting || (books.length === 0 && !booksLoading)}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name="checkmark"
                size={20}
                color={books.length === 0 && !booksLoading ? "#9CA3AF" : "#FFFFFF"}
              />
              <Text
                className={`font-semibold text-base ml-2 ${
                  books.length === 0 && !booksLoading
                    ? "text-gray-400"
                    : "text-white"
                }`}
              >
                Create Summary
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SlideUpModal>
  );
};
