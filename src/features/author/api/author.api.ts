import { axiosInstance } from "@shared-libs/axios/axios.base";
import type { Author } from "@shared-types/author.type";

const AUTHORS_ENDPOINT = "/authors/";

export type { Author };

export type CreateAuthorPayload = {
  name: string;
  birth_date?: string | null;
  nationality?: string | null;
  biography?: string | null;
};

export type UpdateAuthorPayload = {
  name?: string;
  birth_date?: string | null;
  nationality?: string | null;
  biography?: string | null;
};

export type AuthorFilters = {
  search?: string;
  nationality?: string;
};

/**
 * Fetch all authors
 */
export const fetchAuthors = async (
  filters?: AuthorFilters
): Promise<Author[]> => {
  const params = new URLSearchParams();

  if (filters?.search) {
    params.append("search", filters.search);
  }
  if (filters?.nationality) {
    params.append("nationality", filters.nationality);
  }

  const queryString = params.toString();
  const url = queryString
    ? `${AUTHORS_ENDPOINT}?${queryString}`
    : AUTHORS_ENDPOINT;

  const response = await axiosInstance.get<Author[]>(url);
  return response.data;
};

/**
 * Fetch author by ID
 */
export const fetchAuthorById = async (authorId: string): Promise<Author> => {
  const response = await axiosInstance.get<Author>(
    `${AUTHORS_ENDPOINT}${authorId}`
  );
  return response.data;
};

/**
 * Create new author
 */
export const createAuthor = async (
  payload: CreateAuthorPayload
): Promise<Author> => {
  const response = await axiosInstance.post<Author>(
    AUTHORS_ENDPOINT,
    payload
  );
  return response.data;
};

/**
 * Update author
 */
export const updateAuthor = async (
  authorId: string,
  payload: UpdateAuthorPayload
): Promise<Author> => {
  const response = await axiosInstance.patch<Author>(
    `${AUTHORS_ENDPOINT}${authorId}`,
    payload
  );
  return response.data;
};

/**
 * Delete author
 */
export const deleteAuthor = async (authorId: string): Promise<void> => {
  await axiosInstance.delete(`${AUTHORS_ENDPOINT}${authorId}`);
};

