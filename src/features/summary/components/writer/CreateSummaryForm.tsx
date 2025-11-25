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
    try {
      const data = await fetchBooksWithoutSummary();
      setBooks(data);
      setBooksError(null);

      // Reset selection if the previously selected book is no longer available
      if (!data.some((book) => book.id === selectedBookId)) {
        setSelectedBookId(null);
      }
    } catch (error) {
      console.error("Failed to fetch books without summaries:", error);
      setBooksError("Unable to load available books. Tap the field to retry.");
    } finally {
      setBooksLoading(false);
    }
  }, [selectedBookId]);

  useEffect(() => {
    if (visible) {
      loadAvailableBooks();
    } else {
      resetForm();
    }
  }, [visible, loadAvailableBooks, resetForm]);

  const handleSubmit = async () => {
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
            <Text className="text-white text-base flex-1 mr-3">
              {booksLoading
                ? "Loading books..."
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
                <View className="p-4">
                  <Text className="text-gray-400 text-sm text-center">
                    All books currently have summaries. Please add a new book or
                    check back later.
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
          className="bg-indigo-600 rounded-xl p-4 flex-row items-center justify-center"
          disabled={submitting}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold text-base ml-2">
                Create Summary
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SlideUpModal>
  );
};
