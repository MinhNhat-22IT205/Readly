import { axiosInstance } from "@shared-libs/axios/axios.base";
import { Book } from "@shared-types/book.type";

const BOOKS_WITHOUT_SUMMARY_ENDPOINT = "/books/available";

export const fetchBooksWithoutSummary = async (): Promise<Book[]> => {
  const response = await axiosInstance.get<Book[]>(
    BOOKS_WITHOUT_SUMMARY_ENDPOINT
  );
  return response.data;
};

