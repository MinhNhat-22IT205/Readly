import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchOrders, type Order } from "@features/order/api/order.api";
import type { HomeStackParamList } from "../navigation/HomeStack";

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "OrderManagement"
>;

const OrderManagementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders();
      // Sắp xếp theo ngày đặt hàng mới nhất trước
      const sortedOrders = data.sort(
        (a, b) =>
          new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-950">
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-neutral-900 items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Đơn hàng của tôi</Text>
          <View className="w-10 h-10" />
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#34d399" />
          <Text className="text-white mt-4">Đang tải đơn hàng...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-800">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-900 items-center justify-center"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Đơn hàng của tôi</Text>
        <View className="w-10 h-10" />
      </View>

      {orders.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="receipt-outline" size={80} color="#6b7280" />
          <Text className="text-white text-lg font-semibold mt-4 text-center">
            Bạn chưa có đơn hàng nào
          </Text>
          <Text className="text-neutral-400 text-center mt-2">
            Hãy khám phá cửa hàng và đặt hàng ngay!
          </Text>
          <TouchableOpacity
            className="bg-emerald-500 rounded-full px-6 py-3 mt-6"
            onPress={() => navigation.navigate("BookStore")}
          >
            <Text className="text-black font-semibold">Khám phá cửa hàng</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#34d399"
            />
          }
        >
          {orders.map((order) => {
            const paymentStatus = getPaymentStatusInfo(order.payment_status);
            const shipmentStatus = getShipmentStatusInfo(order.shipment_status);

            return (
              <TouchableOpacity
                key={order.id}
                className="bg-neutral-900 rounded-2xl p-4 mb-4"
                onPress={() => {
                  // Có thể navigate đến chi tiết đơn hàng nếu cần
                  navigation.navigate("OrderResult", { orderId: order.id });
                }}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg">
                      Đơn hàng #{order.id}
                    </Text>
                    <Text className="text-neutral-400 text-sm mt-1">
                      {formatDate(order.order_date)}
                    </Text>
                  </View>
                  <Text className="text-emerald-400 font-bold text-lg">
                    {formatCurrency(order.total_amount)}
                  </Text>
                </View>

                <View className="border-t border-neutral-800 pt-3 mt-3">
                  <View className="flex-row items-center mb-2">
                    <Ionicons
                      name={paymentStatus.icon}
                      size={18}
                      color={paymentStatus.color}
                    />
                    <Text
                      className="text-sm ml-2"
                      style={{ color: paymentStatus.color }}
                    >
                      {paymentStatus.text}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons
                      name={shipmentStatus.icon}
                      size={18}
                      color={shipmentStatus.color}
                    />
                    <Text
                      className="text-sm ml-2"
                      style={{ color: shipmentStatus.color }}
                    >
                      {shipmentStatus.text}
                    </Text>
                  </View>
                </View>

                {order.recipient_name && (
                  <View className="mt-3 pt-3 border-t border-neutral-800">
                    <Text className="text-neutral-400 text-xs">
                      Người nhận: {order.recipient_name}
                    </Text>
                    {order.address && (
                      <Text className="text-neutral-400 text-xs mt-1">
                        Địa chỉ: {order.address}
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default OrderManagementScreen;

