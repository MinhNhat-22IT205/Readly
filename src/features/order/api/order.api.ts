import { axiosInstance } from "@shared-libs/axios/axios.base";
import type { CartItem } from "@features/cart/api/cart.api";

const ORDERS_ENDPOINT = "/orders";

export type ShippingInfo = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
};

export type PaymentMethod = "cod" | "card" | "bank_transfer";

export type CreateOrderPayload = {
  items: CartItem[];
  total: number;
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
};

export type Order = {
  id: string | number;
  items: CartItem[];
  total: number;
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
  status: string;
  createdAt: string;
};

export const submitOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  const response = await axiosInstance.post<Order>(ORDERS_ENDPOINT, payload);
  return response.data;
};

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get<Order[]>(ORDERS_ENDPOINT);
  return response.data;
};

export const fetchOrderById = async (
  orderId: string
): Promise<Order> => {
  const response = await axiosInstance.get<Order>(
    `${ORDERS_ENDPOINT}/${orderId}`
  );
  return response.data;
};


