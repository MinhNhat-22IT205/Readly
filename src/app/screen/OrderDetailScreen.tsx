import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchOrderById, type Order, retryPayment, fetchOrderDetails, type OrderDetail } from "@features/order/api/order.api";
import { fetchBookById } from "@features/book/api/book.api";
import type { BookPopulated } from "@shared-types/book.type";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import type { HomeStackParamList } from "../navigation/HomeStack";

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "OrderDetail"
>;

type RouteParams = {
  orderId: number;
  orderData?: Order; // Optional: pass order data directly to avoid 404
};

const OrderDetailScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { orderId, orderData: initialOrderData } = (route.params as RouteParams) || {};

  const [order, setOrder] = useState<Order | null>(initialOrderData || null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [booksMap, setBooksMap] = useState<Map<number, BookPopulated>>(new Map());
  const [isLoading, setIsLoading] = useState(!initialOrderData);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isRetryingPayment, setIsRetryingPayment] = useState(false);

  const loadOrder = async () => {
    if (initialOrderData) {
      setOrder(initialOrderData);
      setIsLoading(false);
    } else {
      try {
        setIsLoading(true);
        const data = await fetchOrderById(orderId);
        setOrder(data);
      } catch (error: any) {
        console.error("Error fetching order:", error);
        // If 404, use initial data if available
        if (error?.response?.status === 404 && initialOrderData) {
          setOrder(initialOrderData);
          Toast.show({
            type: "info",
            text1: "Thông tin đơn hàng",
            text2: "Đang hiển thị thông tin từ danh sách đơn hàng",
          });
        } else {
          Alert.alert(
            "Lỗi",
            "Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.",
            [
              {
                text: "Quay lại",
                onPress: () => navigation.goBack(),
              },
            ]
          );
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const loadOrderDetails = async () => {
    if (!orderId) return;
    
    try {
      setIsLoadingDetails(true);
      const details = await fetchOrderDetails(orderId);
      
      // Double-check: filter by order_id to ensure we only show items for this order
      const filteredDetails = details.filter(
        (item) => item.order_id === Number(orderId)
      );
      
      console.log(`Order ${orderId}: Received ${details.length} items, filtered to ${filteredDetails.length}`);
      
      setOrderDetails(filteredDetails);

      // Fetch book information for items that don't have book data
      const booksToFetch = new Map<number, BookPopulated>();
      const fetchPromises = filteredDetails
        .filter((item) => !item.book?.title && item.book_id)
        .map(async (item) => {
          try {
            const book = await fetchBookById(String(item.book_id));
            booksToFetch.set(item.book_id, book);
          } catch (error) {
            console.error(`Failed to fetch book ${item.book_id}:`, error);
          }
        });

      await Promise.all(fetchPromises);
      
      if (booksToFetch.size > 0) {
        setBooksMap((prev) => {
          const newMap = new Map(prev);
          booksToFetch.forEach((book, bookId) => {
            newMap.set(bookId, book);
          });
          return newMap;
        });
      }
    } catch (error: any) {
      console.error("Error fetching order details:", error);
      // Don't show error alert, just log it - order details might not be available
      setOrderDetails([]);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  useEffect(() => {
    if (order) {
      loadOrderDetails();
    }
  }, [order]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getPaymentStatusInfo = (status: Order["payment_status"]) => {
    switch (status) {
      case "completed":
        return {
          icon: "checkmark-circle" as const,
          color: "#34d399",
          text: "Đã thanh toán",
        };
      case "failed":
        return {
          icon: "close-circle" as const,
          color: "#f87171",
          text: "Thanh toán thất bại",
        };
      case "pending":
        return {
          icon: "time-outline" as const,
          color: "#fbbf24",
          text: "Chờ thanh toán",
        };
      default:
        return {
          icon: "help-circle-outline" as const,
          color: "#6b7280",
          text: "Không xác định",
        };
    }
  };

  const getShipmentStatusInfo = (status: Order["shipment_status"]) => {
    switch (status) {
      case "delivered":
        return {
          icon: "checkmark-done-circle" as const,
          color: "#34d399",
          text: "Đã giao hàng",
        };
      case "shipped":
        return {
          icon: "car-outline" as const,
          color: "#60a5fa",
          text: "Đang giao hàng",
        };
      case "canceled":
        return {
          icon: "close-circle" as const,
          color: "#f87171",
          text: "Đã hủy",
        };
      case "pending":
        return {
          icon: "hourglass-outline" as const,
          color: "#fbbf24",
          text: "Đang xử lý",
        };
      default:
        return {
          icon: "help-circle-outline" as const,
          color: "#6b7280",
          text: "Không xác định",
        };
    }
  };

  const getPaymentMethodText = (method: string | null | undefined) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng (COD)";
      case "card":
        return "Thẻ tín dụng/Ghi nợ";
      case "bank_transfer":
        return "Chuyển khoản ngân hàng";
      default:
        return "Chưa xác định";
    }
  };

  // Check if order can retry payment
  const canRetryPayment = order && 
    (order.payment_status === "pending" || order.payment_status === "failed") &&
    order.payment_method !== "cod";

  const handleRetryPayment = async () => {
    if (!order || isRetryingPayment) return;

    try {
      setIsRetryingPayment(true);
      
      const sessionResponse = await retryPayment(order.id);
      const checkoutUrl = sessionResponse.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("Không nhận được checkout URL từ PayOS");
      }

      if (Platform.OS === "web") {
        if (typeof window !== "undefined") {
          window.location.href = checkoutUrl;
        }
      } else {
        navigation.navigate("PayOSPayment", {
          checkoutUrl,
          orderId: order.id,
        });
      }
    } catch (error: any) {
      console.error("Retry payment error:", error);
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "Không thể tạo lại phiên thanh toán. Vui lòng thử lại.";
      
      Alert.alert("Lỗi", errorMessage);
      Toast.show({
        type: "error",
        text1: "Thanh toán lại thất bại",
        text2: errorMessage,
      });
    } finally {
      setIsRetryingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-950">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-800">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-neutral-900 items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Chi tiết đơn hàng</Text>
          <View className="w-10 h-10" />
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#34d399" />
          <Text className="text-white mt-4">Đang tải thông tin...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-950">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-800">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-neutral-900 items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Chi tiết đơn hàng</Text>
          <View className="w-10 h-10" />
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle" size={64} color="#f87171" />
          <Text className="text-white text-lg font-semibold mt-4 text-center">
            Không tìm thấy đơn hàng
          </Text>
          <TouchableOpacity
            className="bg-emerald-500 rounded-full px-8 py-3 mt-6"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-center text-black font-semibold text-lg">
              Quay lại
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const paymentStatus = getPaymentStatusInfo(order.payment_status);
  const shipmentStatus = getShipmentStatusInfo(order.shipment_status);

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-800">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-900 items-center justify-center"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">
          Đơn hàng #{order.id}
        </Text>
        <View className="w-10 h-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {/* Order Summary */}
        <View className="bg-neutral-900 rounded-2xl p-4 mb-4">
          <Text className="text-neutral-400 text-xs mb-3">THÔNG TIN ĐƠN HÀNG</Text>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-neutral-400">Mã đơn hàng</Text>
            <Text className="text-white font-semibold">#{order.id}</Text>
          </View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-neutral-400">Ngày đặt hàng</Text>
            <Text className="text-white">{formatDate(order.order_date)}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-neutral-400">Tổng tiền</Text>
            <Text className="text-emerald-400 font-bold text-lg">
              {formatCurrency(order.total_amount)}
            </Text>
          </View>
        </View>

        {/* Order Items */}
        <View className="bg-neutral-900 rounded-2xl p-4 mb-4">
          <Text className="text-neutral-400 text-xs mb-3">SẢN PHẨM TRONG ĐƠN HÀNG</Text>
          {isLoadingDetails ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#34d399" />
              <Text className="text-neutral-400 text-sm mt-2">Đang tải sản phẩm...</Text>
            </View>
          ) : orderDetails.length === 0 ? (
            <Text className="text-neutral-400 text-sm py-4 text-center">
              Không tìm thấy thông tin sản phẩm
            </Text>
          ) : (
            <>
              {orderDetails.map((item, index) => {
                // Get book info from item.book or booksMap
                const bookFromMap = booksMap.get(item.book_id);
                const bookInfo = item.book?.title 
                  ? item.book 
                  : bookFromMap;
                
                const bookTitle = bookInfo?.title || `Sách #${item.book_id}`;
                const bookImage = bookInfo?.cover_image || item.book?.cover_image;
                
                // Handle authors - BookPopulated has authors array, item.book might have author string
                let authorNames: string | null = null;
                if (bookFromMap?.authors && Array.isArray(bookFromMap.authors) && bookFromMap.authors.length > 0) {
                  authorNames = bookFromMap.authors
                    .map((a: any) => a.name || a.full_name || `${a.first_name || ''} ${a.last_name || ''}`.trim())
                    .filter(Boolean)
                    .join(', ');
                } else if (item.book?.author) {
                  authorNames = item.book.author;
                }

                return (
                  <View
                    key={item.id || index}
                    className={`pb-3 ${index < orderDetails.length - 1 ? "border-b border-neutral-800 mb-3" : ""}`}
                  >
                    <View className="flex-row">
                      {/* Book Image */}
                      {bookImage ? (
                        <View className="w-16 h-20 rounded-lg overflow-hidden mr-3 bg-neutral-800">
                          <Image
                            source={{ uri: bookImage }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        </View>
                      ) : (
                        <View className="w-16 h-20 rounded-lg bg-neutral-800 items-center justify-center mr-3">
                          <Ionicons name="book-outline" size={24} color="#6b7280" />
                        </View>
                      )}

                      {/* Book Info */}
                      <View className="flex-1">
                        <Text className="text-white font-semibold mb-1" numberOfLines={2}>
                          {bookTitle}
                        </Text>
                        {authorNames && (
                          <Text className="text-neutral-400 text-xs mb-2">
                            {authorNames}
                          </Text>
                        )}
                        <View className="flex-row justify-between items-center">
                          <Text className="text-neutral-400 text-sm">
                            Số lượng: {item.quantity}
                          </Text>
                          <Text className="text-emerald-400 font-semibold">
                            {formatCurrency(item.price * item.quantity)}
                          </Text>
                        </View>
                        <Text className="text-neutral-500 text-xs mt-1">
                          {formatCurrency(item.price)} / sản phẩm
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
              <View className="border-t border-neutral-800 pt-3 mt-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-white font-semibold">Tổng cộng</Text>
                  <Text className="text-emerald-400 font-bold text-lg">
                    {formatCurrency(
                      orderDetails.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                    )}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Payment Status */}
        <View className="bg-neutral-900 rounded-2xl p-4 mb-4">
          <Text className="text-neutral-400 text-xs mb-3">TRẠNG THÁI THANH TOÁN</Text>
          <View className="flex-row items-center mb-3">
            <Ionicons name={paymentStatus.icon} size={24} color={paymentStatus.color} />
            <Text className="text-white font-semibold ml-3" style={{ color: paymentStatus.color }}>
              {paymentStatus.text}
            </Text>
          </View>
          <View className="mt-2">
            <Text className="text-neutral-400 text-xs mb-1">Phương thức thanh toán</Text>
            <Text className="text-white" numberOfLines={2}>
              {getPaymentMethodText(order.payment_method)}
            </Text>
          </View>
        </View>

        {/* Shipment Status */}
        <View className="bg-neutral-900 rounded-2xl p-4 mb-4">
          <Text className="text-neutral-400 text-xs mb-3">TRẠNG THÁI VẬN CHUYỂN</Text>
          <View className="flex-row items-center mb-3">
            <Ionicons name={shipmentStatus.icon} size={24} color={shipmentStatus.color} />
            <Text className="text-white font-semibold ml-3" style={{ color: shipmentStatus.color }}>
              {shipmentStatus.text}
            </Text>
          </View>
          {order.delivery_date && (
            <View className="flex-row justify-between items-center">
              <Text className="text-neutral-400">Ngày giao hàng dự kiến</Text>
              <Text className="text-white">{formatDate(order.delivery_date)}</Text>
            </View>
          )}
          {order.shipping_method && (
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-neutral-400">Phương thức vận chuyển</Text>
              <Text className="text-white">{order.shipping_method}</Text>
            </View>
          )}
        </View>

        {/* Recipient Info */}
        {order.recipient_name && (
          <View className="bg-neutral-900 rounded-2xl p-4 mb-4">
            <Text className="text-neutral-400 text-xs mb-3">THÔNG TIN NGƯỜI NHẬN</Text>
            <View className="mb-2">
              <Text className="text-neutral-400 text-xs mb-1">Họ tên</Text>
              <Text className="text-white font-semibold">{order.recipient_name}</Text>
            </View>
            {order.phone && (
              <View className="mb-2">
                <Text className="text-neutral-400 text-xs mb-1">Số điện thoại</Text>
                <Text className="text-white">{order.phone}</Text>
              </View>
            )}
            {order.address && (
              <View>
                <Text className="text-neutral-400 text-xs mb-1">Địa chỉ</Text>
                <Text className="text-white">{order.address}</Text>
              </View>
            )}
          </View>
        )}

        {/* Retry Payment Button */}
        {canRetryPayment && (
          <TouchableOpacity
            className="bg-emerald-500 rounded-full py-4 mb-4"
            onPress={handleRetryPayment}
            disabled={isRetryingPayment}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons
                name="card-outline"
                size={20}
                color="#000"
                style={{ marginRight: 8 }}
              />
              <Text className="text-black font-semibold text-lg">
                {isRetryingPayment ? "Đang xử lý..." : "Thanh toán lại"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailScreen;

