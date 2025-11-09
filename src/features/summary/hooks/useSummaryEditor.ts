import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { Summary, SummarySection } from "@shared-types/summary.type";

// Mock function to fetch summary - in real app, use API
const fetchSummary = async (summaryId: string): Promise<Summary> => {
  // Simulate API call
  return {
    _id: summaryId,
    title: "Project Management for the Unofficial Project Manager",
    book_athor: "Kory Kogon, Suzette Blakemore, and James wood",
    book_cover_path:
      "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=800",
    published_date: new Date(),
    category_id: "cat1",
    user: {
      _id: "user1",
      username: "Current User",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    },
    status: "writing",
    read_count: 0,
    content: [
      {
        section_order: 1,
        title: "Introduction",
        content: "Getting started with project management...",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Mock function to update section - in real app, use API
const updateSection = async (
  summaryId: string,
  section: SummarySection
): Promise<void> => {
  // Simulate API call
  console.log("Updating section:", { summaryId, section });
  // In real app: await api.updateSummarySection(summaryId, section);
};

export const useSummaryEditor = (summaryId: string) => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [sections, setSections] = useState<SummarySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadSummary();
  }, [summaryId]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await fetchSummary(summaryId);
      setSummary(data);
      setSections([...data.content]);
    } catch (error) {
      Alert.alert("Error", "Failed to load summary");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addSection = useCallback(() => {
    const newOrder = sections.length + 1;
    const newSection: SummarySection = {
      section_order: newOrder,
      title: "",
      content: "",
    };
    setSections((prev) => [...prev, newSection]);
  }, [sections.length]);

  const updateSectionField = useCallback(
    async (index: number, field: "title" | "content", value: string) => {
      if (!summary) return;

      let updatedSection: SummarySection | null = null;

      setSections((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
        updatedSection = updated[index];
        return updated;
      });

      // Update section via API
      if (
        updatedSection &&
        (updatedSection as SummarySection).title.trim() &&
        (updatedSection as SummarySection).content.trim()
      ) {
        setSaving((prev) => new Set(prev).add(index));
        try {
          await updateSection(summary._id, updatedSection);
          setSaving((prev) => {
            const next = new Set(prev);
            next.delete(index);
            return next;
          });
        } catch (error) {
          Alert.alert("Error", "Failed to update section");
          setSaving((prev) => {
            const next = new Set(prev);
            next.delete(index);
            return next;
          });
        }
      }
    },
    [summary]
  );

  const deleteSection = useCallback((index: number) => {
    setSections((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      const reordered = filtered.map((section, i) => ({
        ...section,
        section_order: i + 1,
      }));
      return reordered;
    });

    // Clean up saving state for deleted section and adjust indices
    setSaving((prev) => {
      const next = new Set<number>();
      prev.forEach((savingIndex) => {
        if (savingIndex < index) {
          // Keep indices before deleted item
          next.add(savingIndex);
        } else if (savingIndex > index) {
          // Shift indices after deleted item
          next.add(savingIndex - 1);
        }
        // Skip the deleted index
      });
      return next;
    });
  }, []);

  return {
    summary,
    sections,
    loading,
    saving,
    addSection,
    updateSectionField,
    deleteSection,
  };
};
