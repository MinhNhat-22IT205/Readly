import useSWR from "swr";
import { ContentSection } from "@shared-types/content_section.type";
import { fetchSummarySections } from "../api/summary.api";

export default function useFetchSummarySectionList(
  summaryId: string | number | null
) {
  const { data, error, isLoading, mutate } = useSWR<ContentSection[]>(
    summaryId ? [`summary-sections`, summaryId] : null,
    ([, id]) => fetchSummarySections(id as string | number)
  );

  return {
    sections: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
