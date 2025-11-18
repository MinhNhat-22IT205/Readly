import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
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
        {sections.map((section, index) => (
          <WriterSummarySectionEditor
            key={section.id}
            section={section}
            index={index}
            isSaving={saving.has(index)}
            isDeleting={deleting.has(index)}
            canDelete={sections.length > 1}
            canMoveUp={index > 0}
            canMoveDown={index < sections.length - 1}
            onUpdate={updateSectionField}
            onDelete={deleteSection}
            onMoveUp={() => reorderSections(index, index - 1)}
            onMoveDown={() => reorderSections(index, index + 1)}
          />
        ))}

        <AddSectionButton onPress={addSection} />
      </ScrollView>
    </SafeAreaView>
  );
}
