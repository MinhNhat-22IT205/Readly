import useSWR from "swr";
import { axiosInstance } from "@shared-libs/axios/axios.base";
import { Summary } from "@shared-types/summary.type";
import { GET_APPROVED_SUMMARY_API_ENDPOINT } from "../api/summary-endpoints.api";

const fetcher = async (url: string): Promise<Summary[]> => {
  const response = await axiosInstance.get<Summary[]>(url);
  return response.data;
};

export default function useFetchApprovedSummary() {
  const { data, error, isLoading, mutate } = useSWR<Summary[]>(
    GET_APPROVED_SUMMARY_API_ENDPOINT,
    fetcher
  );

  // Filter for approved summaries if backend doesn't filter
  const approvedSummaries =
    data?.filter((summary) => summary.status === "approved") ?? [];

  return {
    summaries: approvedSummaries,
    isLoading,
    isError: error,
    mutate,
  };
}
