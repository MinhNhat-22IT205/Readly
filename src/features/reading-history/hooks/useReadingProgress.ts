import { ContentSection } from "@shared-types/content_section.type";
import { ReadingHistoryPopulated } from "@shared-types/reading-history.type";
import { useEffect, useState } from "react";

/**
 * Props cho hook useReadingProgress:
 *  - sections: danh sách các section nội dung của summary
 *  - history: thông tin lịch sử đọc (có thể null nếu chưa bắt đầu)
 *  - summaryId: id của summary
 *  - updateProgress: hàm dùng để cập nhật tiến trình đọc từ bên ngoài (API)
 */
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
 * Hook quản lý giao diện & logic tiến trình đọc cho summary:
 * - Quản lý các section đang mở ra để đọc
 * - Quản lý các section đã được đánh dấu là đã đọc
 * - Tự động đồng bộ lại khi có thay đổi trong lịch sử đọc (history)
 * - Khi mở section mới sẽ tự động cập nhật progress nếu section chưa từng đọc
 */
export function useReadingProgress({
  sections,
  history,
  summaryId,
  updateProgress,
}: UseReadingProgressProps) {
  // State lưu các section đang open (bằng set của order)
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());

  // State lưu các section đã đọc (bằng set của order)
  const [readSections, setReadSections] = useState<Set<number>>(new Set());

  /**
   * Khi dữ liệu history thay đổi, đồng bộ lại các section đã đọc
   * - Nếu có history.last_section_id thì đánh dấu tất cả các section từ đầu đến đó là đã đọc
   */
  useEffect(() => {
    if (!history?.last_section_id || sections.length === 0) {
      // Nếu chưa có data hoặc history chưa đọc gì thì không làm gì
      return;
    }

    // Lấy last_section_id từ history (id thực tế của section)
    const lastSectionId = history.last_section_id;
    // Tìm vị trí order (thứ tự) tương ứng với id section cuối cùng đã đọc
    const lastSectionOrder = sections.find(
      (s) => s.id === lastSectionId
    )?.section_order;

    if (!lastSectionOrder) {
      // Không thấy thì dừng
      return;
    }

    // Đánh dấu tất cả section có order <= lastSectionOrder là đã đọc
    const initializedReadSections = new Set<number>();
    sections.forEach((section) => {
      if (section.section_order <= lastSectionOrder) {
        initializedReadSections.add(section.section_order);
      }
    });

    setReadSections(initializedReadSections);
  }, [history, sections]);

  /**
   * Hàm mở/đóng một section:
   * - Nếu đang mở, khi gọi lại thì sẽ đóng section
   * - Nếu đang đóng, sẽ mở section. Nếu section này chưa bao giờ được đọc:
   *   - Đánh dấu đã đọc
   *   - Gọi updateProgress để cập nhật backend tiến trình đọc
   */
  const toggleSection = async (order: number) => {
    // Tạo copy mới của tập openSections để thao tác
    const newOpenSections = new Set(openSections);
    const isCurrentlyOpen = newOpenSections.has(order);

    if (isCurrentlyOpen) {
      // Nếu section đã mở, thì đóng lại
      newOpenSections.delete(order);
    } else {
      // Nếu section đang đóng, mở ra
      newOpenSections.add(order);

      // Nếu trước đây section này chưa được đánh dấu đã đọc thì xử lý thêm
      const newReadSections = new Set(readSections);
      if (!newReadSections.has(order)) {
        // Đánh dấu đã đọc
        newReadSections.add(order);

        // Cập nhật tiến trình lên server nếu có summaryId xác định
        if (summaryId) {
          // Tìm chính xác section với order này
          const section = sections.find((s) => s.section_order === order);
          const totalSections = sections.length;
          const readCount = newReadSections.size; // số section đã đọc
          // Tính phần trăm đã đọc (làm tròn)
          const progressPercent = Math.round((readCount / totalSections) * 100);

          // Gọi updateProgress với section id và tỉ lệ
          await updateProgress(progressPercent, section?.id || null);
        }
        // Update lại state đã đọc
        setReadSections(newReadSections);
      }
    }
    // Update lại state mở/đóng section
    setOpenSections(newOpenSections);
  };

  // Giá trị trả về của hook: các section đang mở, các section đã đọc, hàm toggle section
  return {
    openSections,
    readSections,
    toggleSection,
  };
}
