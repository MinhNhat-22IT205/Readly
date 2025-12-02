import { axiosInstance } from "@shared-libs/axios/axios.base";
import type { Publisher } from "@shared-types/publisher.type";

const PUBLISHERS_ENDPOINT = "/publishers/";

export type { Publisher };

export type CreatePublisherPayload = {
  name: string;
};

export type UpdatePublisherPayload = {
  name?: string;
};

export type PublisherFilters = {
  search?: string;
};

/**
 * Fetch all publishers
 */
export const fetchPublishers = async (
  filters?: PublisherFilters
): Promise<Publisher[]> => {
  const params = new URLSearchParams();

  if (filters?.search) {
    params.append("search", filters.search);
  }

  const queryString = params.toString();
  const url = queryString
    ? `${PUBLISHERS_ENDPOINT}?${queryString}`
    : PUBLISHERS_ENDPOINT;

  const response = await axiosInstance.get<Publisher[]>(url);
  return response.data;
};

/**
 * Fetch publisher by ID
 */
export const fetchPublisherById = async (
  publisherId: string
): Promise<Publisher> => {
  const response = await axiosInstance.get<Publisher>(
    `${PUBLISHERS_ENDPOINT}${publisherId}`
  );
  return response.data;
};

/**
 * Create new publisher
 */
export const createPublisher = async (
  payload: CreatePublisherPayload
): Promise<Publisher> => {
  const response = await axiosInstance.post<Publisher>(
    PUBLISHERS_ENDPOINT,
    payload
  );
  return response.data;
};

/**
 * Update publisher
 */
export const updatePublisher = async (
  publisherId: string,
  payload: UpdatePublisherPayload
): Promise<Publisher> => {
  const response = await axiosInstance.patch<Publisher>(
    `${PUBLISHERS_ENDPOINT}${publisherId}`,
    payload
  );
  return response.data;
};

/**
 * Delete publisher
 */
export const deletePublisher = async (publisherId: string): Promise<void> => {
  await axiosInstance.delete(`${PUBLISHERS_ENDPOINT}${publisherId}`);
};

