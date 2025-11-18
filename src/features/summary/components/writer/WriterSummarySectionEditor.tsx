import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ContentSection } from "@shared-types/content_section.type";

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
          {isSaving && (
            <Ionicons name="sync" size={16} color="#4F46E5" />
          )}
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
        value={section.title || ""}
        onChangeText={(text) => onUpdate(index, "title", text)}
        className="bg-gray-700 text-white rounded-lg px-4 py-3 mb-3 text-base"
        style={{ color: "#FFFFFF" }}
      />

      {/* Section Content Input */}
      <TextInput
        placeholder="Section Content"
        placeholderTextColor="#6B7280"
        value={section.content || ""}
        onChangeText={(text) => onUpdate(index, "content", text)}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        className="bg-gray-700 text-white rounded-lg px-4 py-3 text-base"
        style={{
          color: "#FFFFFF",
          minHeight: 120,
          maxHeight: 200,
        }}
      />
    </View>
  );
};

