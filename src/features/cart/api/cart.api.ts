import { axiosInstance } from "@shared-libs/axios/axios.base";
import type { BookPopulated } from "@shared-types/book.type";

const CART_ENDPOINT = "/carts";
const CART_ITEMS_ENDPOINT = "/cart-items";

export type CartItem = {
  id: number;
  cart_id: number;
  book_id: number;
  quantity: number;
  price: number;
  book?: BookPopulated;
};

export const fetchCartItems = async (): Promise<CartItem[]> => {
  const res = await axiosInstance.get<CartItem[]>(`${CART_ITEMS_ENDPOINT}/me`);
  return res.data;
};

export const addCartItem = async (
  bookId: number,
  quantity = 1,
  price: number
) => {
  const res = await axiosInstance.post<CartItem>(`${CART_ITEMS_ENDPOINT}/`, {
    book_id: bookId,
    quantity,
    price,
  });
  return res.data;
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  const res = await axiosInstance.put<CartItem>(
    `${CART_ITEMS_ENDPOINT}/${itemId}`,
    {
      quantity,
    }
  );
  return res.data;
};

export const removeCartItem = async (itemId: number) => {
  await axiosInstance.delete(`${CART_ITEMS_ENDPOINT}/${itemId}`);
};

export const clearCart = async () => {
  const { data: cart } = await axiosInstance.get<{ id: number }>(
    `${CART_ENDPOINT}/me`
  );
  await axiosInstance.delete(`${CART_ENDPOINT}/${cart.id}`);
};

