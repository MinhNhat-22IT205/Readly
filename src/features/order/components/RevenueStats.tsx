import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Order } from "../api/order.api";

interface RevenueStatsProps {
  orders: Order[];
}

export const RevenueStats: React.FC<RevenueStatsProps> = ({ orders }) => {
  // Tính toán các chỉ số
  // Doanh thu chỉ tính từ các đơn đã hoàn tất (đã thanh toán VÀ đã giao hàng)
  const totalRevenue = orders.reduce((sum, order) => {
    if (
      order.payment_status === "completed" &&
      order.shipment_status === "delivered"
    ) {
      return sum + (Number(order.total_amount) || 0);
    }
    return sum;
  }, 0);

  const totalOrders = orders.length;
  const completedOrders = orders.filter(
    (o) =>
      o.payment_status === "completed" &&
      o.shipment_status === "delivered"
  ).length;
  const pendingOrders = orders.filter(
    (o) => o.payment_status === "pending"
  ).length;
  const failedOrders = orders.filter(
    (o) => o.payment_status === "failed"
  ).length;

  const averageOrderValue =
    completedOrders > 0 ? totalRevenue / completedOrders : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const stats = [
    {
      label: "Tổng doanh thu",
      value: formatCurrency(totalRevenue),
      icon: "cash-outline" as const,
      color: "#22c55e",
      bgColor: "#22c55e20",
    },
    {
      label: "Tổng đơn hàng",
      value: totalOrders.toString(),
      icon: "receipt-outline" as const,
      color: "#60a5fa",
      bgColor: "#60a5fa20",
    },
    {
      label: "Đơn đã hoàn tất",
      value: completedOrders.toString(),
      icon: "checkmark-circle-outline" as const,
      color: "#34d399",
      bgColor: "#34d39920",
    },
    {
      label: "Giá trị TB/đơn",
      value: formatCurrency(averageOrderValue),
      icon: "stats-chart-outline" as const,
      color: "#a78bfa",
      bgColor: "#a78bfa20",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thống kê doanh thu</Text>
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: stat.bgColor },
              ]}
            >
              <Ionicons name={stat.icon} size={24} color={stat.color} />
            </View>
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  value: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  label: {
    color: "#9CA3AF",
    fontSize: 12,
    textAlign: "center",
  },
});

