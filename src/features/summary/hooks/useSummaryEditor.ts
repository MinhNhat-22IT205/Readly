import { useCallback, useMemo } from "react";
import useFetchSummary from "./useFetchSummary";
import useFetchSummarySectionList from "./useFetchSummarySectionList";
import { useSummarySectionManager } from "./useSummarySectionManager";

export const useSummaryEditor = (summaryId: string) => {
  const {
    summary,
    isLoading: summaryLoading,
    mutate: mutateSummary,
  } = useFetchSummary(summaryId);
  const {
    sections,
    isLoading: sectionsLoading,
    mutate: mutateSections,
  } = useFetchSummarySectionList(summaryId);

  const refreshData = useCallback(() => {
    mutateSummary();
    mutateSections();
  }, [mutateSummary, mutateSections]);

  const {
    createSection,
    updateSection,
    deleteSection,
    reorderSections,
    saving,
    deleting,
  } = useSummarySectionManager(summaryId, refreshData);

  const loading = summaryLoading || sectionsLoading;

  const sortedSections = useMemo(() => {
    return [...sections].sort((a, b) => a.section_order - b.section_order);
  }, [sections]);

  const handleAddSection = useCallback(async () => {
    const newOrder = sortedSections.length + 1;
    await createSection(newOrder);
  }, [sortedSections, createSection]);

  const handleUpdateSectionField = useCallback(
    async (index: number, field: "title" | "content", value: string) => {
      const section = sortedSections[index];
      if (!section) return;

      const updates: { title?: string | null; content?: string | null } = {};
      updates[field] = value || null;

      await updateSection(section.id, index, updates);
    },
    [sortedSections, updateSection]
  );

  const handleDeleteSection = useCallback(
    async (index: number) => {
      const section = sortedSections[index];
      if (!section) return;

      const success = await deleteSection(section.id, index);
      if (success) {
        // After deletion, reorder remaining sections
        const remainingSections = sortedSections.filter((_, i) => i !== index);
        const sectionIds = remainingSections.map((s) => s.id);
        if (sectionIds.length > 0) {
          await reorderSections(sectionIds);
        }
      }
    },
    [sortedSections, deleteSection, reorderSections]
  );

  const handleReorderSections = useCallback(
    async (fromIndex: number, toIndex: number) => {
      const newSections = [...sortedSections];
      const [moved] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, moved);

      // Reorder via the reorder endpoint (this will update section_order for all sections)
      const sectionIds = newSections.map((s) => s.id);
      await reorderSections(sectionIds);
    },
    [sortedSections, reorderSections]
  );

  return {
    summary,
    sections: sortedSections,
    loading,
    saving,
    deleting,
    addSection: handleAddSection,
    updateSectionField: handleUpdateSectionField,
    deleteSection: handleDeleteSection,
    reorderSections: handleReorderSections,
  };
};
