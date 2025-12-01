import {
  ReadingHistoryPopulated,
  ReadingHistory,
} from "@shared-types/reading-history.type";
import { axiosInstance } from "@shared-libs/axios/axios.base";

export const fetchMyReadingHistory =
  async (): Promise<ReadingHistoryPopulated[]> => {
    const response = await axiosInstance.get<ReadingHistoryPopulated[]>(
      "/reading-history/me"
    );
    return response.data;
  };

export const getReadingHistoryBySummary = async (
  summaryId: number
): Promise<ReadingHistoryPopulated | null> => {
  try {
    const response = await axiosInstance.get<ReadingHistoryPopulated>(
      `/reading-history/summary/${summaryId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export interface CreateReadingHistoryPayload {
  summary_id: number;
  last_section_id?: number | null;
  progress_percent: number;
  time_spent: number;
  device_type: string;
}

export const createReadingHistory = async (
  payload: CreateReadingHistoryPayload
): Promise<ReadingHistoryPopulated> => {
  const response = await axiosInstance.post<ReadingHistoryPopulated>(
    "/reading-history/",
    payload
  );
  return response.data;
};

export interface UpdateReadingHistoryPayload {
  last_section_id?: number | null;
  progress_percent?: number;
  time_spent?: number;
  device_type?: string;
}

export const updateReadingHistory = async (
  historyId: number,
  payload: UpdateReadingHistoryPayload
): Promise<ReadingHistoryPopulated> => {
  const response = await axiosInstance.patch<ReadingHistoryPopulated>(
    `/reading-history/${historyId}`,
    payload
  );
  return response.data;
};

