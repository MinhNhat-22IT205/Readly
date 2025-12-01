import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ContentSection } from "@shared-types/content_section.type";
import { RichTextEditor } from "@shared-components/RichTextEditor";

interface WriterSummarySectionEditorProps {
  section: ContentSection;
  index: number;
  isSaving: boolean;
  isDeleting?: boolean;
  canDelete: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onUpdate: (index: number, field: "title" | "content", value: string) => void;
  onDelete: (index: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export const WriterSummarySectionEditor = ({
  section,
  index,
  isSaving,
  isDeleting = false,
  canDelete,
  canMoveUp = false,
  canMoveDown = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: WriterSummarySectionEditorProps) => {
  const [titleValue, setTitleValue] = useState(section.title ?? "");
  const [contentValue, setContentValue] = useState(section.content ?? "");
  const contentUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTitleValue(section.title ?? "");
  }, [section.title]);

  useEffect(() => {
    setContentValue(section.content ?? "");
  }, [section.content]);

  // Auto-save content every 3 seconds after last change
  useEffect(() => {
    // Clear existing timeout
    if (contentUpdateTimeoutRef.current) {
      clearTimeout(contentUpdateTimeoutRef.current);
    }

    // Only set timeout if content has actually changed
    if (contentValue !== (section.content ?? "")) {
      contentUpdateTimeoutRef.current = setTimeout(() => {
        onUpdate(index, "content", contentValue);
      }, 3000);
    }

    // Cleanup on unmount
    return () => {
      if (contentUpdateTimeoutRef.current) {
        clearTimeout(contentUpdateTimeoutRef.current);
      }
    };
  }, [contentValue, section.content, index, onUpdate]);

  // Auto-save title every 3 seconds after last change
  useEffect(() => {
    // Clear existing timeout
    if (titleUpdateTimeoutRef.current) {
      clearTimeout(titleUpdateTimeoutRef.current);
    }

    // Only set timeout if title has actually changed
    if (titleValue !== (section.title ?? "")) {
      titleUpdateTimeoutRef.current = setTimeout(() => {
        onUpdate(index, "title", titleValue);
      }, 3000);
    }

    // Cleanup on unmount
    return () => {
      if (titleUpdateTimeoutRef.current) {
        clearTimeout(titleUpdateTimeoutRef.current);
      }
    };
  }, [titleValue, section.title, index, onUpdate]);

  const handleTitleBlur = () => {
    // Clear any pending timeout and save immediately
    if (titleUpdateTimeoutRef.current) {
      clearTimeout(titleUpdateTimeoutRef.current);
      titleUpdateTimeoutRef.current = null;
    }
    if (titleValue === (section.title ?? "")) {
      return;
    }
    onUpdate(index, "title", titleValue);
  };

  const handleContentBlur = () => {
    // Clear any pending timeout and save immediately
    if (contentUpdateTimeoutRef.current) {
      clearTimeout(contentUpdateTimeoutRef.current);
      contentUpdateTimeoutRef.current = null;
    }
    if (contentValue === (section.content ?? "")) {
      return;
    }
    onUpdate(index, "content", contentValue);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Section",
      "Are you sure you want to delete this section?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(index),
        },
      ]
    );
  };

  return (
    <View className="bg-gray-800 rounded-xl p-4 mb-4">
      {/* Section Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-indigo-600 items-center justify-center mr-3">
            <Text className="text-white text-sm font-bold">
              {section.section_order}
            </Text>
          </View>
          <Text className="text-gray-400 text-sm">
            Section {section.section_order}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          {isSaving && <Ionicons name="sync" size={16} color="#4F46E5" />}
          {isDeleting && (
            <Ionicons name="hourglass-outline" size={16} color="#9CA3AF" />
          )}
          {/* Reorder Buttons */}
          <View className="flex-row items-center gap-1">
            {canMoveUp && onMoveUp && (
              <TouchableOpacity
                onPress={onMoveUp}
                className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center"
                disabled={isSaving || isDeleting}
              >
                <Ionicons name="chevron-up" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            {canMoveDown && onMoveDown && (
              <TouchableOpacity
                onPress={onMoveDown}
                className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center"
                disabled={isSaving || isDeleting}
              >
                <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          {canDelete && (
            <TouchableOpacity
              onPress={handleDelete}
              className="w-8 h-8 rounded-full bg-red-500/20 items-center justify-center"
              disabled={isDeleting}
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Section Title Input */}
      <TextInput
        placeholder="Section Title"
        placeholderTextColor="#6B7280"
        value={titleValue}
        onChangeText={setTitleValue}
        onBlur={handleTitleBlur}
        className="bg-gray-700 text-white rounded-lg px-4 py-3 mb-3 text-base"
        style={{ color: "#FFFFFF" }}
      />

      {/* Section Content Input */}
      <View className="relative">
        {isSaving && (
          <View className="absolute top-2 right-2 z-10 bg-gray-800/80 rounded-full p-2">
            <ActivityIndicator size="small" color="#4F46E5" />
          </View>
        )}
        <RichTextEditor
          initialContent={contentValue}
          placeholder="Nhập nội dung section..."
          onContentChange={(html) => {
            setContentValue(html);
          }}
          onBlur={handleContentBlur}
          disabled={isSaving}
          minHeight={150}
          initialHeight={200}
          containerStyle={{
            backgroundColor: "#374151",
            borderRadius: 8,
          }}
          editorStyle={{
            backgroundColor: "#374151",
            color: "#FFFFFF",
          }}
          toolbarStyle={{
            backgroundColor: "#1F2937",
          }}
        />
      </View>
    </View>
  );
};
