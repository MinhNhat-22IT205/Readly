import { axiosInstance } from "@shared-libs/axios/axios.base";
import type { CartItem } from "@features/cart/api/cart.api";

const ORDERS_ENDPOINT = "/orders/";
const ORDER_DETAILS_ENDPOINT = "/order-details/";

// Kiểu dữ liệu theo BE
export type Order = {
  id: number;
  user_id: number;
  order_date: string;
  total_amount: number;
  payment_method?: string | null;
  payment_status: "pending" | "completed" | "failed";
  recipient_name?: string | null;
  address?: string | null;
  phone?: string | null;
  shipment_status: "pending" | "shipped" | "delivered" | "canceled";
  delivery_date?: string | null;
  shipping_method?: string | null;
};

// Payload FE vẫn giữ như cũ
export type ShippingInfo = {
  fullName: string;
  phone: string;
  email: string; // BE không dùng
  address: string;
  city: string; // BE không dùng
  zipCode: string; // BE không dùng
};

export type PaymentMethod = "cod" | "card" | "bank_transfer";

export type CreateOrderPayload = {
  items: CartItem[]; // cần có price trong item
  total: number;
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
};

export const submitOrder = async (
  payload: CreateOrderPayload
): Promise<Order> => {
  // Đảm bảo total_amount là số nguyên VND (nếu payload.total đã là VND thì giữ nguyên, nếu là USD thì * 1000)
  // Giả sử payload.total đã được tính đúng đơn vị VND ở FE
  const totalAmountVND = Math.round(payload.total);

  // Map payment method: Frontend dùng "cod" | "card" | "bank_transfer", backend nhận str | None
  const validPaymentMethods: PaymentMethod[] = ["cod", "card", "bank_transfer"];
  const paymentMethod =
    validPaymentMethods.includes(payload.paymentMethod)
      ? payload.paymentMethod
      : null;

  // 1) Tạo order
  const orderRes = await axiosInstance.post<Order>(ORDERS_ENDPOINT, {
    total_amount: totalAmountVND,
    payment_method: paymentMethod,
    // payment_status để BE mặc định pending
    recipient_name: payload.shippingInfo.fullName,
    address: payload.shippingInfo.address,
    phone: payload.shippingInfo.phone,
    // delivery_date, shipping_method... nếu có thì map thêm
  });

  const order = orderRes.data;

  // 2) Tạo order details cho từng item
  await Promise.all(
    payload.items.map((it) =>
      axiosInstance.post(ORDER_DETAILS_ENDPOINT, {
        order_id: order.id,
        book_id: it.book_id,
        quantity: it.quantity,
        // BE bắt buộc price: đảm bảo CartItem có price,
        // hoặc fallback từ it.book?.price nếu bạn đã có
        price: (it as any).price ?? (it as any).book?.price,
      })
    )
  );

  return order;
};

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get<Order[]>(ORDERS_ENDPOINT);
  return response.data;
};

export const fetchAdminOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get<Order[]>(`${ORDERS_ENDPOINT}admin`);
  return response.data;
};

export const fetchOrderById = async (
  orderId: string | number
): Promise<Order> => {
  const response = await axiosInstance.get<Order>(
    `${ORDERS_ENDPOINT}${orderId}`
  );
  return response.data;
};

export const fetchAdminOrderById = async (
  orderId: string | number
): Promise<Order> => {
  const response = await axiosInstance.get<Order>(
    `${ORDERS_ENDPOINT}admin/${orderId}`
  );
  return response.data;
};

export type UpdateAdminOrderPayload = Partial<
  Pick<
    Order,
    | "payment_status"
    | "shipment_status"
    | "total_amount"
    | "payment_method"
    | "recipient_name"
    | "address"
    | "phone"
    | "delivery_date"
    | "shipping_method"
  >
>;

export const updateAdminOrder = async (
  orderId: number,
  payload: UpdateAdminOrderPayload
): Promise<Order> => {
  // Validate payment_method nếu có trong payload
  const validPaymentMethods: PaymentMethod[] = ["cod", "card", "bank_transfer"];
  const sanitizedPayload = { ...payload };
  
  if (sanitizedPayload.payment_method !== undefined) {
    sanitizedPayload.payment_method =
      typeof sanitizedPayload.payment_method === "string" &&
      validPaymentMethods.includes(
        sanitizedPayload.payment_method as PaymentMethod
      )
        ? sanitizedPayload.payment_method
        : null;
  }

  const response = await axiosInstance.patch<Order>(
    `${ORDERS_ENDPOINT}admin/${orderId}`,
    sanitizedPayload
  );
  return response.data;
};

// PayOS Payment Session
export type PaymentSessionResponse = {
  checkoutUrl: string;
};

export const createPaymentSession = async (
  orderId: number
): Promise<PaymentSessionResponse> => {
  try {
    console.log("📤 Requesting PayOS session:", { order_id: orderId });
    const response = await axiosInstance.post<PaymentSessionResponse>(
      "/payments/session/",
      { order_id: orderId }
    );
    console.log("✅ PayOS session response:", {
      status: response.status,
      hasCheckoutUrl: !!response.data?.checkoutUrl,
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ PayOS session error:", {
      orderId,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      detail: error?.response?.data?.detail,
    });
    throw error;
  }
};

