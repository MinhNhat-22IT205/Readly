import { Summary, SummaryPopulated } from "@shared-types/summary.type";
import { ContentSection } from "@shared-types/content_section.type";
import { axiosInstance } from "@shared-libs/axios/axios.base";
import { SUMMARY_ENDPOINT } from "./summary-endpoints.api";
import {
  GET_SUMMARY_CONTENT_SECTIONS_API_ENDPOINT,
  CREATE_CONTENT_SECTION_API_ENDPOINT,
  PATCH_CONTENT_SECTION_API_ENDPOINT,
  DELETE_CONTENT_SECTION_API_ENDPOINT,
  REORDER_CONTENT_SECTIONS_API_ENDPOINT,
} from "./content-section-endpoints.api";

// Summary API functions
export const fetchSummary = async (
  summaryId: string | number
): Promise<SummaryPopulated> => {
  const response = await axiosInstance.get<SummaryPopulated>(
    `/summaries/${summaryId}`
  );
  return response.data;
};

export const fetchWriterSummaries = async (): Promise<SummaryPopulated[]> => {
  const response = await axiosInstance.get<SummaryPopulated[]>(
    "/summaries/writer/me"
  );
  return response.data;
};

export const fetchApprovedSummaries = async (): Promise<SummaryPopulated[]> => {
  const response = await axiosInstance.get<SummaryPopulated[]>(
    "/summaries/?status_filter=approved"
  );
  return response.data;
};

export interface CreateSummaryPayload {
  title: string;
  book_id: number;
  status?: string;
  audio_url?: string | null;
}

export const createSummary = async (
  payload: CreateSummaryPayload
): Promise<SummaryPopulated> => {
  const response = await axiosInstance.post<SummaryPopulated>(
    SUMMARY_ENDPOINT,
    payload
  );
  return response.data;
};

export const updateSummaryStatus = async (
  summaryId: number | string,
  status: Summary["status"]
): Promise<SummaryPopulated> => {
  const response = await axiosInstance.patch<SummaryPopulated>(
    `/summaries/${summaryId}/status`,
    {
      status,
    }
  );
  return response.data;
};

export const deleteSummary = async (
  summaryId: number | string
): Promise<void> => {
  await axiosInstance.delete(`/summaries/${summaryId}`);
};

// Content Section API functions
export interface CreateSectionPayload {
  summary_id: number;
  section_order: number;
  title?: string | null;
  content?: string | null;
  audio_segment_url?: string | null;
}

export interface UpdateSectionPayload {
  section_order?: number;
  title?: string | null;
  content?: string | null;
  audio_segment_url?: string | null;
}

export interface ReorderSectionsPayload {
  order: number[];
}

export const fetchSummarySections = async (
  summaryId: string | number
): Promise<ContentSection[]> => {
  const response = await axiosInstance.get<ContentSection[]>(
    GET_SUMMARY_CONTENT_SECTIONS_API_ENDPOINT(summaryId)
  );
  return response.data;
};

export const createSection = async (
  payload: CreateSectionPayload
): Promise<ContentSection> => {
  const response = await axiosInstance.post<ContentSection>(
    CREATE_CONTENT_SECTION_API_ENDPOINT,
    payload
  );
  return response.data;
};

export const updateSection = async (
  sectionId: number,
  payload: UpdateSectionPayload
): Promise<ContentSection> => {
  const response = await axiosInstance.patch<ContentSection>(
    PATCH_CONTENT_SECTION_API_ENDPOINT(sectionId),
    payload
  );
  return response.data;
};

export const deleteSection = async (sectionId: number): Promise<void> => {
  await axiosInstance.delete(DELETE_CONTENT_SECTION_API_ENDPOINT(sectionId));
};

export const reorderSections = async (
  payload: ReorderSectionsPayload
): Promise<void> => {
  await axiosInstance.patch(REORDER_CONTENT_SECTIONS_API_ENDPOINT, payload);
};
