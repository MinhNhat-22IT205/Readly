import { ReadingHistoryPopulated } from "@shared-types/reading-history.type";
import { axiosInstance } from "@shared-libs/axios/axios.base";

export const fetchMyReadingHistory = async (): Promise<ReadingHistoryPopulated[]> => {
  const response = await axiosInstance.get<ReadingHistoryPopulated[]>(
    "/reading-history/me"
  );
  return response.data;
};

