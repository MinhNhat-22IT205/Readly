import useSWR from "swr";
import { SummaryPopulated } from "@shared-types/summary.type";
import {
  fetchApprovedSummaries,
  fetchRecommendedSummaries,
} from "../api/summary.api";

export default function useFetchApprovedSummaryList() {
  const { data, error, isLoading, mutate } = useSWR<SummaryPopulated[]>(
    "approved-summaries",
    fetchRecommendedSummaries
  );

  return {
    summaries: data,
    isLoading,
    isError: error,
    mutate,
  };
}
