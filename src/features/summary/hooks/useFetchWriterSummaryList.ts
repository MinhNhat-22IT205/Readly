import useSWR from "swr";
import { SummaryPopulated } from "@shared-types/summary.type";
import { fetchWriterSummaries } from "../api/summary.api";

export default function useFetchWriterSummaryList() {
  const { data, error, isLoading, mutate } = useSWR<SummaryPopulated[]>(
    "writer-summaries",
    fetchWriterSummaries
  );

  return {
    summaries: data,
    isLoading,
    isError: error,
    mutate,
  };
}
