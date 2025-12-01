import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchOrderById, type Order } from "@features/order/api/order.api";
import { useCart } from "@features/cart/libs/useCart";
import type { HomeStackParamList } from "../navigation/HomeStack";

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "OrderResult"
>;

type RouteParams = {
  orderId: number;
};

const OrderResultScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { orderId } = (route.params as RouteParams) || {};
  const { refreshCart } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pollCount, setPollCount] = useState(0);
  const maxPolls = 10; // Poll tối đa 10 lần (khoảng 20 giây)

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    const pollOrderStatus = async () => {
      try {
        const orderData = await fetchOrderById(orderId);
        setOrder(orderData);

        // Nếu đã có kết quả (không còn pending), dừng poll
        if (orderData.payment_status !== "pending") {
          setIsLoading(false);
          await refreshCart(); // Clear cart sau khi thanh toán thành công
          return;
        }

        // Nếu vẫn pending và chưa hết số lần poll, tiếp tục
        if (pollCount < maxPolls) {
          setPollCount((prev) => prev + 1);
          setTimeout(() => {
            pollOrderStatus();
          }, 2000); // Poll mỗi 2 giây
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        setIsLoading(false);
      }
    };

    pollOrderStatus();
  }, [orderId, pollCount]);

  const getStatusInfo = () => {
    if (!order) return null;

    const status = order.payment_status;
    if (status === "completed") {
      return {
        icon: "checkmark-circle" as const,
        color: "#34d399",
        title: "Thanh toán thành công",
        message: "Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất.",
      };
    } else if (status === "failed") {
      return {
        icon: "close-circle" as const,
        color: "#f87171",
        title: "Thanh toán thất bại",
        message: "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.",
      };
    } else {
      return {
        icon: "time-outline" as const,
        color: "#fbbf24",
        title: "Đang xử lý",
        message: "Đang kiểm tra trạng thái thanh toán...",
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-900 items-center justify-center"
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons name="home-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Kết quả thanh toán</Text>
        <View className="w-10 h-10" />
      </View>

      <View className="flex-1 items-center justify-center px-6">
        {isLoading ? (
          <>
            <ActivityIndicator size="large" color="#34d399" />
            <Text className="text-white text-lg font-semibold mt-4">
              Đang kiểm tra trạng thái...
            </Text>
          </>
        ) : statusInfo ? (
          <>
            <Ionicons
              name={statusInfo.icon}
              size={80}
              color={statusInfo.color}
              style={{ marginBottom: 24 }}
            />
            <Text className="text-white text-2xl font-bold mb-3 text-center">
              {statusInfo.title}
            </Text>
            <Text className="text-neutral-400 text-center mb-6">
              {statusInfo.message}
            </Text>

            {order && (
              <View className="bg-neutral-900 rounded-2xl p-4 w-full mb-6">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-neutral-400">Mã đơn hàng</Text>
                  <Text className="text-white font-semibold">#{order.id}</Text>
                </View>
                <View className="flex-row justify-between mb-2">
                  <Text className="text-neutral-400">Tổng tiền</Text>
                  <Text className="text-white font-semibold">
                    ${Number(order.total_amount ?? 0).toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-neutral-400">Trạng thái</Text>
                  <Text
                    className="font-semibold"
                    style={{ color: statusInfo.color }}
                  >
                    {order.payment_status === "completed"
                      ? "Hoàn thành"
                      : order.payment_status === "failed"
                      ? "Thất bại"
                      : "Đang xử lý"}
                  </Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              className="bg-emerald-500 rounded-full px-8 py-3 w-full"
              onPress={() => navigation.navigate("Home")}
            >
              <Text className="text-center text-black font-semibold text-lg">
                Về trang chủ
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Ionicons name="alert-circle" size={80} color="#f87171" />
            <Text className="text-white text-lg font-semibold mt-4 text-center">
              Không tìm thấy đơn hàng
            </Text>
            <TouchableOpacity
              className="bg-emerald-500 rounded-full px-8 py-3 w-full mt-6"
              onPress={() => navigation.navigate("Home")}
            >
              <Text className="text-center text-black font-semibold text-lg">
                Về trang chủ
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OrderResultScreen;

