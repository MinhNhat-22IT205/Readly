import { useState, useEffect } from "react";
import useSWR from "swr";
import { ReadingHistoryPopulated } from "@shared-types/reading-history.type";
import {
  getReadingHistoryBySummary,
  createReadingHistory,
  updateReadingHistory,
  CreateReadingHistoryPayload,
  UpdateReadingHistoryPayload,
} from "../api/reading-history.api";
import { Platform } from "react-native";

/**
 * Custom hook dùng để lấy và cập nhật lịch sử đọc (reading history) cho một Summary cụ thể.
 * - Quản lý trạng thái lịch sử đọc (history)
 * - Tạo mới hoặc cập nhật lịch sử khi người dùng đọc
 *
 * @param summaryId id của summary đang đọc
 */
export function useReadingHistory(summaryId: number | null) {
  // State lưu trữ dữ liệu lịch sử đọc hiện tại
  const [history, setHistory] = useState<ReadingHistoryPopulated | null>(null);
  // Trạng thái đang cập nhật (để tránh double update)
  const [isUpdating, setIsUpdating] = useState(false);

  // SWR để lấy reading history theo summaryId (nếu có)
  const { data, error, isLoading, mutate } =
    useSWR<ReadingHistoryPopulated | null>(
      summaryId ? [`reading-history`, summaryId] : null,
      ([, id]) => getReadingHistoryBySummary(id as number)
    );

  // Khi data từ SWR thay đổi thì đồng bộ vào state history
  useEffect(() => {
    if (data) {
      setHistory(data);
    } else {
      setHistory(null);
    }
  }, [data]);

  /**
   * updateProgress: Cập nhật/ghi lại tiến trình đọc gồm phần trăm, section cuối, thời gian, v.v.
   * Nếu đã có lịch sử thì gọi API update, chưa có thì tạo mới.
   * @param progressPercent tiến độ đọc
   * @param lastSectionId (optional) id section đang đọc dở
   * @param timeSpent (optional) thời gian đọc thêm trong lần này
   */
  const updateProgress = async (
    progressPercent: number,
    lastSectionId?: number | null,
    timeSpent?: number
  ) => {
    // Nếu chưa có summaryId hoặc đang update thì không làm gì
    if (!summaryId || isUpdating) return;

    setIsUpdating(true);
    try {
      if (history) {
        // Đã có lịch sử: cập nhật (update) tiến trình mới
        const updatePayload: UpdateReadingHistoryPayload = {
          progress_percent: progressPercent,
          last_section_id: lastSectionId,
          // Nếu có timeSpent thì cộng dồn, nếu không thì giữ nguyên
          time_spent: timeSpent
            ? history.time_spent + timeSpent
            : history.time_spent,
        };
        const updated = await updateReadingHistory(history.id, updatePayload);
        setHistory(updated);
        mutate(updated, false); // SWR mutate, không refetch lại vì đã có data
      } else {
        // Chưa có lịch sử: tạo mới (create)
        const createPayload: CreateReadingHistoryPayload = {
          summary_id: summaryId,
          progress_percent: progressPercent,
          last_section_id: lastSectionId,
          time_spent: timeSpent || 0,
          device_type: Platform.OS, // Lưu source thiết bị
        };
        const created = await createReadingHistory(createPayload);
        setHistory(created);
        mutate(created, false);
      }
    } catch (error) {
      // Có lỗi khi cập nhật
      console.error("Error updating reading history:", error);
    } finally {
      setIsUpdating(false); // Luôn set lại isUpdating về false cuối cùng
    }
  };

  return {
    history, // Dữ liệu lịch sử đọc hiện tại (hoặc null nếu chưa có)
    isLoading, // Đang lấy dữ liệu từ server hay không
    isError: error, // Có lỗi không khi lấy dữ liệu
    updateProgress, // Hàm cập nhật hoặc tạo mới lịch sử đọc
    isUpdating, // Đang thực thi update
  };
}
