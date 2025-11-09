import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SummarySection } from "@shared-types/summary.type";

interface WriterSummarySectionEditorProps {
  section: SummarySection;
  index: number;
  isSaving: boolean;
  canDelete: boolean;
  onUpdate: (index: number, field: "title" | "content", value: string) => void;
  onDelete: (index: number) => void;
}

export const WriterSummarySectionEditor = ({
  section,
  index,
  isSaving,
  canDelete,
  onUpdate,
  onDelete,
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
          {canDelete && (
            <TouchableOpacity
              onPress={handleDelete}
              className="w-8 h-8 rounded-full bg-red-500/20 items-center justify-center"
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
        value={section.title}
        onChangeText={(text) => onUpdate(index, "title", text)}
        className="bg-gray-700 text-white rounded-lg px-4 py-3 mb-3 text-base"
        style={{ color: "#FFFFFF" }}
      />

      {/* Section Content Input */}
      <TextInput
        placeholder="Section Content"
        placeholderTextColor="#6B7280"
        value={section.content}
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

