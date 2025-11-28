import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { ContentSection } from "@shared-types/content_section.type";
import {
  createSection as createSectionAPI,
  updateSection as updateSectionAPI,
  deleteSection as deleteSectionAPI,
  reorderSections as reorderSectionsAPI,
  CreateSectionPayload,
  UpdateSectionPayload,
} from "../api/summary.api";

export const useSummarySectionManager = (
  summaryId: string | number,
  onMutate?: () => void
) => {
  const [saving, setSaving] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState<Set<number>>(new Set());

  const createSection = useCallback(
    async (sectionOrder: number): Promise<ContentSection | null> => {
      try {
        const payload: CreateSectionPayload = {
          summary_id: Number(summaryId),
          section_order: sectionOrder,
          title: null,
          content: null,
          audio_segment_url: null,
        };

        const result = await createSectionAPI(payload);
        onMutate?.();
        return result;
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create section";
        console.error("Failed to create section:", {
          error,
          status: error?.response?.status,
          data: error?.response?.data,
          url: error?.config?.url,
          baseURL: error?.config?.baseURL,
        });
        Alert.alert("Error", errorMessage);
        return null;
      }
    },
    [summaryId, onMutate]
  );

  const updateSection = useCallback(
    async (
      sectionId: number,
      index: number,
      updates: UpdateSectionPayload
    ): Promise<ContentSection | null> => {
      try {
        setSaving((prev) => new Set(prev).add(index));

        const result = await updateSectionAPI(sectionId, updates);
        onMutate?.();
        return result;
      } catch (error) {
        Alert.alert("Error", "Failed to update section");
        console.error("Failed to update section:", error);
        return null;
      } finally {
        setSaving((prev) => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
      }
    },
    [onMutate]
  );

  const deleteSection = useCallback(
    async (sectionId: number, index: number): Promise<boolean> => {
      try {
        setDeleting((prev) => new Set(prev).add(index));

        await deleteSectionAPI(sectionId);
        onMutate?.();
        return true;
      } catch (error) {
        Alert.alert("Error", "Failed to delete section");
        console.error("Failed to delete section:", error);
        return false;
      } finally {
        setDeleting((prev) => {
          const next = new Set(prev);
          next.delete(index);
          return next;
        });
      }
    },
    [onMutate]
  );

  const reorderSections = useCallback(
    async (sectionIds: number[]): Promise<boolean> => {
      try {
        await reorderSectionsAPI({ order: sectionIds });
        onMutate?.();
        return true;
      } catch (error) {
        Alert.alert("Error", "Failed to reorder sections");
        console.error("Failed to reorder sections:", error);
        return false;
      }
    },
    [onMutate]
  );

  return {
    createSection,
    updateSection,
    deleteSection,
    reorderSections,
    saving,
    deleting,
  };
};
