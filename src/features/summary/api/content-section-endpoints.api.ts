export const GET_SUMMARY_CONTENT_SECTIONS_API_ENDPOINT = (summaryId: string | number) =>
  `/summaries/${summaryId}/content-sections`;

export const CREATE_CONTENT_SECTION_API_ENDPOINT = "/content-sections/";
export const UPDATE_CONTENT_SECTION_API_ENDPOINT = (sectionId: number) =>
  `/content-sections/${sectionId}`;
export const PATCH_CONTENT_SECTION_API_ENDPOINT = (sectionId: number) =>
  `/content-sections/${sectionId}`;
export const DELETE_CONTENT_SECTION_API_ENDPOINT = (sectionId: number) =>
  `/content-sections/${sectionId}`;
export const REORDER_CONTENT_SECTIONS_API_ENDPOINT = "/content-sections/sections-order";

