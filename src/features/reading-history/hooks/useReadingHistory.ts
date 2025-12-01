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

export function useReadingHistory(summaryId: number | null) {
  const [history, setHistory] = useState<ReadingHistoryPopulated | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<ReadingHistoryPopulated | null>(
    summaryId ? [`reading-history`, summaryId] : null,
    ([, id]) => getReadingHistoryBySummary(id as number)
  );

  useEffect(() => {
    if (data) {
      setHistory(data);
    } else {
      setHistory(null);
    }
  }, [data]);

  const updateProgress = async (
    progressPercent: number,
    lastSectionId?: number | null,
    timeSpent?: number
  ) => {
    if (!summaryId || isUpdating) return;

    setIsUpdating(true);
    try {
      if (history) {
        // Update existing history
        const updatePayload: UpdateReadingHistoryPayload = {
          progress_percent: progressPercent,
          last_section_id: lastSectionId,
          time_spent: timeSpent
            ? history.time_spent + timeSpent
            : history.time_spent,
        };
        const updated = await updateReadingHistory(history.id, updatePayload);
        setHistory(updated);
        mutate(updated, false);
      } else {
        // Create new history
        const createPayload: CreateReadingHistoryPayload = {
          summary_id: summaryId,
          progress_percent: progressPercent,
          last_section_id: lastSectionId,
          time_spent: timeSpent || 0,
          device_type: Platform.OS,
        };
        const created = await createReadingHistory(createPayload);
        setHistory(created);
        mutate(created, false);
      }
    } catch (error) {
      console.error("Error updating reading history:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    history,
    isLoading,
    isError: error,
    updateProgress,
    isUpdating,
  };
}

