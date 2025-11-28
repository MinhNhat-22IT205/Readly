import useSWR from "swr";
import { SummaryPopulated } from "@shared-types/summary.type";
import { fetchAllSummaries } from "../api/summary.api";

export default function useFetchAllSummaryList() {
  const { data, error, isLoading, mutate } = useSWR<SummaryPopulated[]>(
    "all-summaries",
    fetchAllSummaries
  );

  return {
    summaries: data,
    isLoading,
    isError: error,
    mutate,
  };
}

