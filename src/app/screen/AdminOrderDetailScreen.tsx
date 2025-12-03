import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import {
  fetchAdminOrderById,
  type Order,
  updateAdminOrder,
} from "@features/order/api/order.api";
import type { PaymentMethod } from "@features/order/api/order.api";
import type { AdminStackParamList } from "../navigation/AdminStack";

type AdminOrderDetailScreenNavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminOrderDetail"
>;

type AdminOrderDetailScreenRouteProp = RouteProp<
  AdminStackParamList,
  "AdminOrderDetail"
>;

const AdminOrderDetailScreen = () => {
  const navigation = useNavigation<AdminOrderDetailScreenNavigationProp>();
  const route = useRoute<AdminOrderDetailScreenRouteProp>();
  const { orderId } = route.params;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [paymentStatus, setPaymentStatus] =
    useState<Order["payment_status"]>("pending");
  const [shipmentStatus, setShipmentStatus] =
    useState<Order["shipment_status"]>("pending");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [totalAmount, setTotalAmount] = useState<string>("0");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const saveStateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminOrderById(orderId);
      setOrder(data);
      setPaymentStatus(data.payment_status);
      setShipmentStatus(data.shipment_status);
      setPaymentMethod(
        (data.payment_method as PaymentMethod) ?? ("cod" as PaymentMethod)
      );
      setTotalAmount(String(data.total_amount ?? 0));
    } catch (error) {
      console.error("Failed to fetch order:", error);
      Alert.alert("Error", "Failed to load order details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  useEffect(() => {
    return () => {
      if (saveStateTimeoutRef.current) {
        clearTimeout(saveStateTimeoutRef.current);
      }
    };
  }, []);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getPaymentStatusLabel = (status: Order["payment_status"]) => {
    switch (status) {
      case "completed":
        return "Đã thanh toán";
      case "failed":
        return "Thanh toán thất bại";
      case "pending":
      default:
        return "Chờ thanh toán";
    }
  };

  const handleSaveChanges = async () => {
    if (!order) return;
    const parsedAmount = Number(totalAmount);
    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
      Alert.alert("Lỗi", "Tổng tiền không hợp lệ.");
      return;
    }

    setIsUpdating(true);
    setSaveState("saving");
    try {
      const updated = await updateAdminOrder(order.id, {
        payment_status: paymentStatus,
        shipment_status: shipmentStatus,
        payment_method: paymentMethod,
        total_amount: parsedAmount,
      });
      setOrder(updated);
      Alert.alert("Thành công", "Cập nhật đơn hàng thành công.");
      setSaveState("saved");
      if (saveStateTimeoutRef.current) {
        clearTimeout(saveStateTimeoutRef.current);
      }
      saveStateTimeoutRef.current = setTimeout(() => {
        setSaveState("idle");
        saveStateTimeoutRef.current = null;
        // Reload orders list khi quay lại
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error("Failed to update order:", error);
      Alert.alert("Lỗi", "Không thể cập nhật đơn hàng. Vui lòng thử lại.");
      setSaveState("idle");
    } finally {
      setIsUpdating(false);
    }
  };

  const getShipmentStatusLabel = (status: Order["shipment_status"]) => {
    switch (status) {
      case "delivered":
        return "Đã giao hàng";
      case "shipped":
        return "Đang giao hàng";
      case "canceled":
        return "Đã hủy";
      case "pending":
      default:
        return "Đang xử lý";
    }
  };

  if (isLoading || !order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-900">
        <StatusBar barStyle="light-content" />
        <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white flex-1">
            Order Details
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#A5B4FC" />
          <Text className="text-gray-400 mt-4">Loading order...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar barStyle="light-content" />

      <View className="flex-row items-center px-4 py-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white flex-1">
          Order #{order.id}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        <View className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
          <Text className="text-gray-400 text-xs mb-1">Thông tin chính</Text>
          <Text className="text-white font-semibold text-lg mb-1">
            Tổng tiền: {formatCurrency(order.total_amount)}
          </Text>
          <Text className="text-gray-300 text-sm">
            Ngày đặt: {formatDate(order.order_date)}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            User ID: {order.user_id}
          </Text>
        </View>

        <View className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
          <Text className="text-gray-400 text-xs mb-2">Trạng thái</Text>
          <Text className="text-gray-300 text-sm mb-1">Trạng thái thanh toán</Text>
          <View className="flex-row mb-3">
            {(["pending", "completed", "failed"] as Order["payment_status"][]).map(
              (status) => {
                const isActive = paymentStatus === status;
                return (
                  <TouchableOpacity
                    key={status}
                    className={`flex-1 mr-2 px-3 py-2 rounded-lg border ${
                      isActive ? "border-indigo-400 bg-indigo-900" : "border-gray-700"
                    }`}
                    onPress={() => setPaymentStatus(status)}
                  >
                    <Text
                      className="text-center text-xs font-semibold uppercase"
                      style={{
                        color: isActive ? "#c7d2fe" : "#d1d5db",
                      }}
                    >
                      {getPaymentStatusLabel(status)}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>

          <Text className="text-gray-300 text-sm mb-1">Trạng thái giao hàng</Text>
          <View className="flex-row flex-wrap">
            {(["pending", "shipped", "delivered", "canceled"] as Order["shipment_status"][]).map(
              (status) => {
                const isActive = shipmentStatus === status;
                return (
                  <TouchableOpacity
                    key={status}
                    className={`px-3 py-2 rounded-lg border mr-2 mb-2 ${
                      isActive ? "border-emerald-400 bg-emerald-900" : "border-gray-700"
                    }`}
                    onPress={() => setShipmentStatus(status)}
                  >
                    <Text
                      className="text-xs font-semibold uppercase"
                      style={{
                        color: isActive ? "#bbf7d0" : "#d1d5db",
                      }}
                    >
                      {getShipmentStatusLabel(status)}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>

          {order.delivery_date && (
            <View className="mt-1">
              <Text className="text-gray-300 text-sm mb-1">Ngày giao dự kiến</Text>
              <Text className="text-gray-200">
                {formatDate(order.delivery_date)}
              </Text>
            </View>
          )}
          {order.shipping_method && (
            <View className="mt-1">
              <Text className="text-gray-300 text-sm mb-1">Phương thức giao hàng</Text>
              <Text className="text-gray-200">{order.shipping_method}</Text>
            </View>
          )}
        </View>

        <View className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
          <Text className="text-gray-400 text-xs mb-2">Thông tin thanh toán</Text>
          <Text className="text-gray-300 text-sm mb-1">Phương thức</Text>
          <View className="flex-row mb-3">
            {(["cod", "card", "bank_transfer"] as PaymentMethod[]).map((method) => {
              const isActive = paymentMethod === method;
              const labelMap: Record<PaymentMethod, string> = {
                cod: "COD",
                card: "Thẻ",
                bank_transfer: "Chuyển khoản",
              };
              return (
                <TouchableOpacity
                  key={method}
                  className={`flex-1 mr-2 px-3 py-2 rounded-lg border ${
                    isActive ? "border-amber-300 bg-amber-900" : "border-gray-700"
                  }`}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Text
                    className="text-center text-xs font-semibold uppercase"
                    style={{
                      color: isActive ? "#fde68a" : "#d1d5db",
                    }}
                  >
                    {labelMap[method]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text className="text-gray-300 text-sm mb-1">Tổng tiền (VND)</Text>
          <View className="bg-gray-900 rounded-lg px-3 py-2 border border-gray-700">
            <Text className="text-xs text-gray-500 mb-1">Nhập tổng tiền</Text>
            <TextInput
              value={totalAmount}
              onChangeText={setTotalAmount}
              keyboardType="numeric"
              className="text-white text-lg"
              placeholder="0"
              placeholderTextColor="#6b7280"
            />
          </View>
        </View>

        <View className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700">
          <Text className="text-gray-400 text-xs mb-2">Người nhận</Text>
          <Text className="text-white font-semibold">
            {order.recipient_name || "Không có"}
          </Text>
          {order.phone && (
            <Text className="text-gray-300 mt-1">SĐT: {order.phone}</Text>
          )}
          {order.address && (
            <Text className="text-gray-300 mt-1">Địa chỉ: {order.address}</Text>
          )}
        </View>

        <TouchableOpacity
          className={`rounded-xl px-4 py-3 flex-row items-center justify-center ${
            saveState === "saved" ? "bg-emerald-600" : "bg-indigo-600"
          }`}
          onPress={handleSaveChanges}
          disabled={isUpdating || saveState === "saving"}
          activeOpacity={0.8}
        >
          {saveState === "saving" ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text className="text-center text-white font-semibold text-base ml-2">
                Đang lưu...
              </Text>
            </>
          ) : saveState === "saved" ? (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text className="text-center text-white font-semibold text-base ml-2">
                Đã lưu
              </Text>
            </>
          ) : (
            <Text className="text-center text-white font-semibold text-base">
              Lưu thay đổi
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminOrderDetailScreen;


