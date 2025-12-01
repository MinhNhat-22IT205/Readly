import { ContentSection } from "@shared-types/content_section.type";
import { ReadingHistoryPopulated } from "@shared-types/reading-history.type";
import { useEffect, useState } from "react";

interface UseReadingProgressProps {
  sections: ContentSection[];
  history: ReadingHistoryPopulated | null;
  summaryId: number | null;
  updateProgress: (
    progressPercent: number,
    lastSectionId: number | null
  ) => Promise<void>;
}

/**
 * Hook quản lý logic reading progress UI
 * - Quản lý state mở/đóng sections
 * - Quản lý state sections đã đọc
 * - Tự động khởi tạo từ reading history
 * - Tự động cập nhật progress khi mở section
 */
export function useReadingProgress({
  sections,
  history,
  summaryId,
  updateProgress,
}: UseReadingProgressProps) {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());
  const [readSections, setReadSections] = useState<Set<number>>(new Set());

  /**
   * Khởi tạo read sections từ reading history
   * Đánh dấu tất cả sections từ đầu đến last_section_id là đã đọc
   */
  useEffect(() => {
    if (!history?.last_section_id || sections.length === 0) {
      return;
    }

    const lastSectionId = history.last_section_id;
    const lastSectionOrder = sections.find(
      (s) => s.id === lastSectionId
    )?.section_order;

    if (!lastSectionOrder) {
      return;
    }

    const initializedReadSections = new Set<number>();
    sections.forEach((section) => {
      if (section.section_order <= lastSectionOrder) {
        initializedReadSections.add(section.section_order);
      }
    });

    setReadSections(initializedReadSections);
  }, [history, sections]);

  /**
   * Toggle section (mở/đóng) và cập nhật reading progress
   * - Khi mở section: đánh dấu là đã đọc và cập nhật progress
   * - Khi đóng section: chỉ đóng, không thay đổi trạng thái đọc
   */
  const toggleSection = async (order: number) => {
    const newOpenSections = new Set(openSections);
    const isCurrentlyOpen = newOpenSections.has(order);

    if (isCurrentlyOpen) {
      // Đóng section
      newOpenSections.delete(order);
    } else {
      // Mở section
      newOpenSections.add(order);

      // Đánh dấu section là đã đọc khi mở
      const newReadSections = new Set(readSections);
      if (!newReadSections.has(order)) {
        newReadSections.add(order);

        // Cập nhật reading progress
        if (summaryId) {
          const section = sections.find((s) => s.section_order === order);
          const totalSections = sections.length;
          const readCount = newReadSections.size;
          const progressPercent = Math.round((readCount / totalSections) * 100);

          await updateProgress(progressPercent, section?.id || null);
        }

        setReadSections(newReadSections);
      }
    }

    setOpenSections(newOpenSections);
  };

  return {
    openSections,
    readSections,
    toggleSection,
  };
}
