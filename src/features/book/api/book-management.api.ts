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
  payload: CreateBookPayload,
  coverImageUri?: string,
  coverImageFile?: File
): Promise<BookPopulated> => {
  // If coverImageUri or coverImageFile is provided, use FormData for file upload
  if (coverImageUri || coverImageFile) {
    const formData = new FormData();
    
    // Add text fields
    formData.append("title", payload.title);
    if (payload.publisher_id !== undefined && payload.publisher_id !== null) {
      formData.append("publisher_id", payload.publisher_id.toString());
    }
    if (payload.publish_date) {
      formData.append("publish_date", payload.publish_date);
    }
    formData.append("price", payload.price.toString());
    formData.append("stock_quantity", payload.stock_quantity.toString());
    
    if (payload.author_ids && payload.author_ids.length > 0) {
      payload.author_ids.forEach((id) => {
        formData.append("author_ids", id.toString());
      });
    }
    if (payload.category_ids && payload.category_ids.length > 0) {
      payload.category_ids.forEach((id) => {
        formData.append("category_ids", id.toString());
      });
    }
    
    // Add image file
    const uriParts = coverImageUri.split("/");
    const filename = uriParts[uriParts.length - 1] || "cover.jpg";
    const extension = filename.split(".").pop()?.toLowerCase() || "jpg";
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };
    const type = mimeTypes[extension] || "image/jpeg";
    
    formData.append("cover_image", {
      uri: coverImageUri,
      type,
      name: filename,
    } as any);
    
    const response = await axiosInstance.post<BookPopulated>(
      BOOKS_ENDPOINT,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
  
  // Otherwise, use JSON payload
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
  payload: UpdateBookPayload,
  coverImageUri?: string,
  coverImageFile?: File
): Promise<BookPopulated> => {
  // If coverImageUri or coverImageFile is provided, use FormData for file upload
  if (coverImageUri || coverImageFile) {
    const formData = new FormData();
    
    // Add text fields
    if (payload.title !== undefined) {
      formData.append("title", payload.title);
    }
    if (payload.publisher_id !== undefined) {
      if (payload.publisher_id !== null) {
        formData.append("publisher_id", payload.publisher_id.toString());
      } else {
        formData.append("publisher_id", "");
      }
    }
    if (payload.publish_date !== undefined) {
      if (payload.publish_date) {
        formData.append("publish_date", payload.publish_date);
      } else {
        formData.append("publish_date", "");
      }
    }
    if (payload.price !== undefined) {
      formData.append("price", payload.price.toString());
    }
    if (payload.stock_quantity !== undefined) {
      formData.append("stock_quantity", payload.stock_quantity.toString());
    }
    
    if (payload.author_ids !== undefined) {
      if (payload.author_ids.length > 0) {
        payload.author_ids.forEach((id) => {
          formData.append("author_ids", id.toString());
        });
      }
    }
    if (payload.category_ids !== undefined) {
      if (payload.category_ids.length > 0) {
        payload.category_ids.forEach((id) => {
          formData.append("category_ids", id.toString());
        });
      }
    }
    
    // Add image file - prefer File object (web), otherwise use URI (mobile)
    if (coverImageFile) {
      formData.append("cover_image", coverImageFile);
    } else if (coverImageUri) {
      const uriParts = coverImageUri.split("/");
      const filename = uriParts[uriParts.length - 1] || "cover.jpg";
      const extension = filename.split(".").pop()?.toLowerCase() || "jpg";
      const mimeTypes: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
      };
      const type = mimeTypes[extension] || "image/jpeg";
      
      formData.append("cover_image", {
        uri: coverImageUri,
        type,
        name: filename,
      } as any);
    }
    
    const response = await axiosInstance.patch<BookPopulated>(
      `${BOOKS_ENDPOINT}${bookId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
  
  // Otherwise, use JSON payload
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




