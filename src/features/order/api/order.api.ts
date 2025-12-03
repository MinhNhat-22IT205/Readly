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

// Order Detail (Order Item) type
export type OrderDetail = {
  id: number;
  order_id: number;
  book_id: number;
  quantity: number;
  price: number;
  book?: {
    id: number;
    title: string;
    author?: string;
    cover_image?: string;
    price?: number;
  };
};

// Fetch order details (items) for an order
export const fetchOrderDetails = async (
  orderId: string | number
): Promise<OrderDetail[]> => {
  const orderIdNum = Number(orderId);
  
  try {
    // Try endpoint with order_id in path
    try {
      const response = await axiosInstance.get<OrderDetail[]>(
        `${ORDERS_ENDPOINT}${orderId}/details`
      );
      // Filter to ensure only items for this order
      const filtered = (response.data || []).filter(
        (item) => item.order_id === orderIdNum
      );
      console.log(`✅ Fetched ${filtered.length} items for order ${orderId}`);
      return filtered;
    } catch (pathError: any) {
      // If path-based endpoint fails, try query param
      if (pathError?.response?.status === 404 || pathError?.response?.status === 400) {
        const response = await axiosInstance.get<OrderDetail[]>(
          `${ORDER_DETAILS_ENDPOINT}?order_id=${orderId}`
        );
        // Filter to ensure only items for this order
        const filtered = (response.data || []).filter(
          (item) => item.order_id === orderIdNum
        );
        console.log(`✅ Fetched ${filtered.length} items for order ${orderId} (query param)`);
        return filtered;
      }
      throw pathError;
    }
  } catch (error: any) {
    console.error("Error fetching order details:", error);
    
    // Last resort: fetch all and filter client-side (not ideal but works)
    if (error?.response?.status === 404 || error?.response?.status === 400) {
      try {
        console.log("⚠️ Trying to fetch all order details and filter client-side...");
        const allResponse = await axiosInstance.get<OrderDetail[]>(
          ORDER_DETAILS_ENDPOINT
        );
        // Filter by order_id on client side
        const filtered = (allResponse.data || []).filter(
          (item) => item.order_id === orderIdNum
        );
        console.log(`✅ Filtered ${filtered.length} items for order ${orderId} from all orders`);
        return filtered;
      } catch (fallbackError) {
        console.error("Fallback fetch also failed:", fallbackError);
        return [];
      }
    }
    
    return [];
  }
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

// Retry payment for existing order (PENDING or FAILED)
export const retryPayment = async (
  orderId: number
): Promise<PaymentSessionResponse> => {
  try {
    console.log("🔄 Retrying payment for order:", { order_id: orderId });
    
    // First, verify the order exists and is eligible for retry
    const order = await fetchOrderById(orderId);
    
    if (order.payment_status === "completed") {
      throw new Error("Order has already been paid");
    }

    // Create new payment session
    const sessionResponse = await createPaymentSession(orderId);
    
    console.log("✅ Retry payment session created:", {
      orderId,
      hasCheckoutUrl: !!sessionResponse?.checkoutUrl,
    });
    
    return sessionResponse;
  } catch (error: any) {
    console.error("❌ Retry payment error:", {
      orderId,
      error: error?.message || error,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};

