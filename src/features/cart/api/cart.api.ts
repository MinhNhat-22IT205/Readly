import { axiosInstance } from "@shared-libs/axios/axios.base";
import type { BookPopulated } from "@shared-types/book.type";

export type CartItem = {
  id: number;
  book_id: number;
  quantity: number;
  book?: BookPopulated;
};

const CART_ENDPOINT = "/cart";

export const fetchCart = async (): Promise<CartItem[]> => {
  const response = await axiosInstance.get<CartItem[]>(CART_ENDPOINT);
  return response.data;
};

export const addCartItem = async (bookId: number, quantity = 1) => {
  const response = await axiosInstance.post<CartItem>(CART_ENDPOINT, {
    book_id: bookId,
    quantity,
  });
  return response.data;
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  const response = await axiosInstance.patch<CartItem>(
    `${CART_ENDPOINT}/${itemId}`,
    { quantity }
  );
  return response.data;
};

export const removeCartItem = async (itemId: number) => {
  await axiosInstance.delete(`${CART_ENDPOINT}/${itemId}`);
};

export const clearCart = async () => {
  await axiosInstance.delete(CART_ENDPOINT);
};


