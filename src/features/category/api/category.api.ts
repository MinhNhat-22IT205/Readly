import { axiosInstance } from "@shared-libs/axios/axios.base";
import type { Category } from "@shared-types/catagory.type";

const CATEGORIES_ENDPOINT = "/categories/";

export type { Category };

export type CreateCategoryPayload = {
  category_name: string;
};

export type UpdateCategoryPayload = {
  category_name?: string;
};

export type CategoryFilters = {
  search?: string;
};

/**
 * Fetch all categories
 */
export const fetchCategories = async (
  filters?: CategoryFilters
): Promise<Category[]> => {
  const params = new URLSearchParams();

  if (filters?.search) {
    params.append("search", filters.search);
  }

  const queryString = params.toString();
  const url = queryString
    ? `${CATEGORIES_ENDPOINT}?${queryString}`
    : CATEGORIES_ENDPOINT;

  const response = await axiosInstance.get<Category[]>(url);
  return response.data;
};

/**
 * Fetch category by ID
 */
export const fetchCategoryById = async (
  categoryId: string
): Promise<Category> => {
  const response = await axiosInstance.get<Category>(
    `${CATEGORIES_ENDPOINT}${categoryId}`
  );
  return response.data;
};

/**
 * Create new category
 */
export const createCategory = async (
  payload: CreateCategoryPayload
): Promise<Category> => {
  const response = await axiosInstance.post<Category>(
    CATEGORIES_ENDPOINT,
    payload
  );
  return response.data;
};

/**
 * Update category
 */
export const updateCategory = async (
  categoryId: string,
  payload: UpdateCategoryPayload
): Promise<Category> => {
  const response = await axiosInstance.patch<Category>(
    `${CATEGORIES_ENDPOINT}${categoryId}`,
    payload
  );
  return response.data;
};

/**
 * Delete category
 */
export const deleteCategory = async (categoryId: string): Promise<void> => {
  await axiosInstance.delete(`${CATEGORIES_ENDPOINT}${categoryId}`);
};




