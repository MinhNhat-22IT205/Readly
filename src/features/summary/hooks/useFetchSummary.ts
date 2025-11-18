import useSWR from "swr";
import { SummaryPopulated } from "@shared-types/summary.type";
import { fetchSummary } from "../api/summary.api";

export default function useFetchSummary(summaryId: string | number | null) {
  const { data, error, isLoading, mutate } = useSWR<SummaryPopulated>(
    summaryId ? [`summary`, summaryId] : null,
    ([, id]) => fetchSummary(id as string | number)
  );

  return {
    summary: data,
    isLoading,
    isError: error,
    mutate,
  };
}

