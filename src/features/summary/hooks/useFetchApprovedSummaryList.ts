import useSWR from "swr";
import { SummaryPopulated } from "@shared-types/summary.type";
import { fetchApprovedSummaries } from "../api/summary.api";

export default function useFetchApprovedSummaryList() {
  const { data, error, isLoading, mutate } = useSWR<SummaryPopulated[]>(
    "approved-summaries",
    fetchApprovedSummaries
  );

  return {
    summaries: data,
    isLoading,
    isError: error,
    mutate,
  };
}
