import useSWR from "swr";
import { SummaryPopulated } from "@shared-types/summary.type";
import { fetchPendingSummaries } from "../api/summary.api";

export default function useFetchPendingSummaryList() {
  const { data, error, isLoading, mutate } = useSWR<SummaryPopulated[]>(
    "pending-summaries",
    fetchPendingSummaries
  );

  return {
    summaries: data,
    isLoading,
    isError: error,
    mutate,
  };
}

