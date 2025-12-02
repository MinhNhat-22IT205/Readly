import { axiosInstance } from "@shared-libs/axios/axios.base";
import { BookPopulated } from "@shared-types/book.type";
import { Category } from "@shared-types/catagory.type";

const BOOKS_ENDPOINT = "/books";
const CATEGORY_ENDPOINT = "/categories";
const BOOKS_WITHOUT_SUMMARY_ENDPOINT = "/books/available";

export const fetchBooks = async (): Promise<BookPopulated[]> => {
  const response = await axiosInstance.get<BookPopulated[]>(BOOKS_ENDPOINT);
  return response.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>(CATEGORY_ENDPOINT);
  return response.data;
};

export const fetchBooksWithoutSummary = async (): Promise<BookPopulated[]> => {
  const response = await axiosInstance.get<BookPopulated[]>(
    BOOKS_WITHOUT_SUMMARY_ENDPOINT
  );
  return response.data;
};

export const fetchBookById = async (bookId: string): Promise<BookPopulated> => {
  const response = await axiosInstance.get<BookPopulated>(
    `${BOOKS_ENDPOINT}/${bookId}`
  );
  return response.data;
};