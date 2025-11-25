import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { WriterStackParamList } from "../navigation/WriterStack";
import { WriterSummarySectionEditor } from "../../features/summary/components/writer/WriterSummarySectionEditor";
import { AddSectionButton } from "../../features/summary/components/writer/AddSectionButton";
import { WriterSummaryEditorHeader } from "../../features/summary/components/writer/WriterSummaryEditorHeader";
import { useSummaryEditor } from "../../features/summary/hooks/useSummaryEditor";

type WriterSummaryEditorScreenRouteProp = RouteProp<
  WriterStackParamList,
  "WriterSummaryEditor"
>;
type WriterSummaryEditorScreenNavigationProp = NativeStackNavigationProp<
  WriterStackParamList,
  "WriterSummaryEditor"
>;

export default function WriterSummaryEditorScreen() {
  const route = useRoute<WriterSummaryEditorScreenRouteProp>();
  const navigation = useNavigation<WriterSummaryEditorScreenNavigationProp>();
  const { summaryId } = route.params;

  const {
    summary,
    sections,
    loading,
    saving,
    deleting,
    addSection,
    updateSectionField,
    deleteSection,
    reorderSections,
  } = useSummaryEditor(summaryId);

  if (loading || !summary) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-1 items-center justify-center">
          <Text className="text-white">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      <WriterSummaryEditorHeader
        title={summary.title}
        onClose={() => navigation.goBack()}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {sections.map((section, index) => {
          const isSavingSection = saving.has(index);
          const isDeletingSection = deleting.has(index);
          const canDelete = sections.length > 1 && !isDeletingSection;
          const canMoveUp = index > 0 && !isSavingSection && !isDeletingSection;
          const canMoveDown =
            index < sections.length - 1 &&
            !isSavingSection &&
            !isDeletingSection;

          return (
            <View key={section.id} className="mb-6">
              <WriterSummarySectionEditor
                section={section}
                index={index}
                isSaving={isSavingSection}
                isDeleting={isDeletingSection}
                canDelete={sections.length > 1}
                canMoveUp={index > 0}
                canMoveDown={index < sections.length - 1}
                onUpdate={updateSectionField}
                onDelete={deleteSection}
                onMoveUp={() => reorderSections(index, index - 1)}
                onMoveDown={() => reorderSections(index, index + 1)}
              />

              <View className="flex-row flex-wrap gap-3 mt-2">
                <TouchableOpacity
                  onPress={() => deleteSection(index)}
                  disabled={!canDelete}
                  className={`px-4 py-2 rounded-lg border ${
                    canDelete ? "border-red-500" : "border-gray-600 opacity-60"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      canDelete ? "text-red-400" : "text-gray-500"
                    }`}
                  >
                    Delete Section
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => reorderSections(index, index - 1)}
                  disabled={!canMoveUp}
                  className={`px-4 py-2 rounded-lg border ${
                    canMoveUp
                      ? "border-indigo-500"
                      : "border-gray-600 opacity-60"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      canMoveUp ? "text-indigo-400" : "text-gray-500"
                    }`}
                  >
                    Move Up
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => reorderSections(index, index + 1)}
                  disabled={!canMoveDown}
                  className={`px-4 py-2 rounded-lg border ${
                    canMoveDown
                      ? "border-indigo-500"
                      : "border-gray-600 opacity-60"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      canMoveDown ? "text-indigo-400" : "text-gray-500"
                    }`}
                  >
                    Move Down
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <AddSectionButton onPress={addSection} />
      </ScrollView>
    </SafeAreaView>
  );
}
