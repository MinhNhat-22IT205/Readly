import useSWR from "swr";
import { fetchBooks, fetchCategories } from "../api/book.api";
import type { BookPopulated } from "@shared-types/book.type";
import type { Category } from "@shared-types/catagory.type";

const BOOKS_CACHE_KEY = "book-store/books";
const CATEGORY_CACHE_KEY = "book-store/categories";

export const useBookCatalog = () => {
  const {
    data: books,
    isLoading: isBooksLoading,
    error: booksError,
    mutate: mutateBooks,
  } = useSWR<BookPopulated[]>(BOOKS_CACHE_KEY, fetchBooks);

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    mutate: mutateCategories,
  } = useSWR<Category[]>(CATEGORY_CACHE_KEY, fetchCategories);

  const refreshCatalog = async () => {
    await Promise.all([mutateBooks(), mutateCategories()]);
  };

  return {
    books: books ?? [],
    categories: categories ?? [],
    isLoading: isBooksLoading || isCategoriesLoading,
    error: booksError ?? categoriesError,
    refreshCatalog,
  };
};

export type UseBookCatalogReturn = ReturnType<typeof useBookCatalog>;


