import { axiosInstance } from "@shared-libs/axios/axios.base";
import type { Book, BookPopulated } from "@shared-types/book.type";

const BOOKS_ENDPOINT = "/books/";

export type { Book, BookPopulated };

export type CreateBookPayload = {
  title: string;
  publisher_id?: number | null;
  publish_date?: string | null;
  cover_image?: string | null;
  price: number;
  stock_quantity: number;
  author_ids?: number[];
  category_ids?: number[];
};

export type UpdateBookPayload = {
  title?: string;
  publisher_id?: number | null;
  publish_date?: string | null;
  cover_image?: string | null;
  price?: number;
  stock_quantity?: number;
  author_ids?: number[];
  category_ids?: number[];
};

export type BookFilters = {
  search?: string;
  publisher_id?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
};

/**
 * Fetch all books (admin)
 */
export const fetchAdminBooks = async (
  filters?: BookFilters
): Promise<BookPopulated[]> => {
  const params = new URLSearchParams();

  if (filters?.search) {
    params.append("search", filters.search);
  }
  if (filters?.publisher_id) {
    params.append("publisher_id", filters.publisher_id.toString());
  }
  if (filters?.min_price) {
    params.append("min_price", filters.min_price.toString());
  }
  if (filters?.max_price) {
    params.append("max_price", filters.max_price.toString());
  }
  if (filters?.in_stock !== undefined) {
    params.append("in_stock", filters.in_stock.toString());
  }

  const queryString = params.toString();
  const url = queryString
    ? `${BOOKS_ENDPOINT}?${queryString}`
    : BOOKS_ENDPOINT;

  const response = await axiosInstance.get<BookPopulated[]>(url);
  return response.data;
};

/**
 * Fetch book by ID
 */
export const fetchBookById = async (bookId: string): Promise<BookPopulated> => {
  const response = await axiosInstance.get<BookPopulated>(
    `${BOOKS_ENDPOINT}${bookId}`
  );
  return response.data;
};

/**
 * Create new book
 */
export const createBook = async (
  payload: CreateBookPayload
): Promise<BookPopulated> => {
  const response = await axiosInstance.post<BookPopulated>(
    BOOKS_ENDPOINT,
    payload
  );
  return response.data;
};

/**
 * Update book
 */
export const updateBook = async (
  bookId: string,
  payload: UpdateBookPayload
): Promise<BookPopulated> => {
  const response = await axiosInstance.patch<BookPopulated>(
    `${BOOKS_ENDPOINT}${bookId}`,
    payload
  );
  return response.data;
};

/**
 * Delete book
 */
export const deleteBook = async (bookId: string): Promise<void> => {
  await axiosInstance.delete(`${BOOKS_ENDPOINT}${bookId}`);
};




