import useSWR from "swr";
import {
  fetchCartItems,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
  CartItem,
} from "../api/cart.api";

const CART_CACHE_KEY = "cart/items";

export const useCart = () => {
  const {
    data,
    isLoading,
    error,
    mutate,
  } = useSWR<CartItem[]>(CART_CACHE_KEY, fetchCartItems);

  const refreshCart = async () => {
    await mutate();
  };

  const addItem = async (bookId: number, price: number, quantity = 1) => {
    await addCartItem(bookId, quantity, price);
    await mutate();
  };

  const updateItem = async (itemId: number, quantity: number) => {
    await updateCartItem(itemId, quantity);
    await mutate();
  };

  const removeItem = async (itemId: number) => {
    await removeCartItem(itemId);
    await mutate();
  };

  const clearCart = async () => {
    await clearCartApi();
    await mutate();
  };

  const items = data ?? [];
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    totalItems,
    isEmpty: items.length === 0,
    isLoading,
    error,
    refreshCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
  };
};

export type UseCartReturn = ReturnType<typeof useCart>;


