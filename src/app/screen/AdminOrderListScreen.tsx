import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { fetchAdminOrders, type Order } from "@features/order/api/order.api";
import type { AdminStackParamList } from "../navigation/AdminStack";
import { RevenueStats } from "@features/order/components/RevenueStats";
import { PaymentStatusPieChart } from "@features/order/components/PaymentStatusPieChart";

type AdminOrderListScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminOrderList"
>;

const AdminOrderListScreen = () => {
  const navigation = useNavigation<AdminOrderListScreenNavigationProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      setIsError(false);
      const data = await fetchAdminOrders();
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.order_date).getTime() - new Date(a.order_date).getTime()
      );
      setOrders(sorted);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Reload orders khi quay lại màn hình này (sau khi lưu thay đổi ở detail screen)
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Kiểm tra đơn hàng đã hoàn thành (đã thanh toán VÀ đã giao hàng)
  const isOrderCompleted = (order: Order) => {
    return (
      order.payment_status === "completed" &&
      order.shipment_status === "delivered"
    );
  };

  const getPaymentBadge = (status: Order["payment_status"]) => {
    switch (status) {
      case "completed":
        return { label: "Đã thanh toán", color: "#22c55e" };
      case "failed":
        return { label: "Thanh toán lỗi", color: "#f97373" };
      case "pending":
      default:
        return { label: "Chờ thanh toán", color: "#fbbf24" };
    }
  };

  const getShipmentBadge = (status: Order["shipment_status"]) => {
    switch (status) {
      case "delivered":
        return { label: "Đã giao", color: "#22c55e" };
      case "shipped":
        return { label: "Đang giao", color: "#60a5fa" };
      case "canceled":
        return { label: "Đã hủy", color: "#f97373" };
      case "pending":
      default:
        return { label: "Đang xử lý", color: "#e5e7eb" };
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Order Management</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#A5B4FC" />
          <Text className="text-gray-400 mt-4">Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white">Order Management</Text>
        </View>
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-white text-lg font-semibold mt-4 text-center">
            Failed to load orders
          </Text>
          <Text className="text-gray-400 text-sm mt-2 text-center">
            Please check your connection and try again.
          </Text>
          <TouchableOpacity
            onPress={loadOrders}
            className="mt-6 bg-indigo-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isEmpty = orders.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white flex-1">
          Order Management
        </Text>
        <Text className="text-gray-400 text-sm">
          {orders.length} orders
        </Text>
      </View>

      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="receipt-outline" size={64} color="#6B7280" />
          <Text className="text-gray-400 text-lg font-semibold mt-4 text-center">
            No orders found
          </Text>
          <Text className="text-gray-500 text-sm mt-2 text-center">
            New orders will appear here once customers start ordering.
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#A5B4FC"
            />
          }
        >
          {/* Revenue Statistics */}
          <RevenueStats orders={orders} />

          {/* Pie Chart - Doanh thu theo trạng thái thanh toán */}
          <PaymentStatusPieChart orders={orders} />

          {/* Orders List */}
          <View className="mt-4">
            <Text className="text-white text-lg font-bold mb-4">
              Danh sách đơn hàng
            </Text>
            {orders.map((order) => {
            const completed = isOrderCompleted(order);
            const payment = getPaymentBadge(order.payment_status);
            const shipment = getShipmentBadge(order.shipment_status);

            return (
              <TouchableOpacity
                key={order.id}
                className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700"
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("AdminOrderDetail", {
                    orderId: order.id.toString(),
                  })
                }
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-base">
                      Order #{order.id}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">
                      {formatDate(order.order_date)}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      User ID: {order.user_id}
                    </Text>
                  </View>
                  <Text className="text-indigo-300 font-bold text-base ml-2">
                    {formatCurrency(order.total_amount)}
                  </Text>
                </View>

                <View className="flex-row mt-2">
                  {completed ? (
                    // Hiển thị trạng thái "Đã hoàn thành" nếu đơn đã thanh toán VÀ đã giao hàng
                    <View className="flex-row items-center">
                      <View
                        className="w-2 h-2 rounded-full mr-1.5"
                        style={{ backgroundColor: "#22c55e" }}
                      />
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: "#22c55e" }}
                      >
                        Đã hoàn thành
                      </Text>
                    </View>
                  ) : (
                    // Hiển thị các badge riêng biệt nếu chưa hoàn thành
                    <>
                      <View className="flex-row items-center mr-4">
                        <View
                          className="w-2 h-2 rounded-full mr-1.5"
                          style={{ backgroundColor: payment.color }}
                        />
                        <Text
                          className="text-xs"
                          style={{ color: payment.color }}
                        >
                          {payment.label}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <View
                          className="w-2 h-2 rounded-full mr-1.5"
                          style={{ backgroundColor: shipment.color }}
                        />
                        <Text
                          className="text-xs"
                          style={{ color: shipment.color }}
                        >
                          {shipment.label}
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                {order.recipient_name && (
                  <View className="mt-2">
                    <Text className="text-gray-400 text-xs">
                      Recipient: {order.recipient_name}
                    </Text>
                    {order.phone && (
                      <Text className="text-gray-400 text-xs mt-0.5">
                        Phone: {order.phone}
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AdminOrderListScreen;


