import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Order } from "../api/order.api";

interface PaymentStatusPieChartProps {
  orders: Order[];
}

export const PaymentStatusPieChart: React.FC<PaymentStatusPieChartProps> = ({
  orders,
}) => {
  // Tính toán doanh thu theo payment status
  // Chỉ tính từ các đơn đã hoàn tất (đã thanh toán VÀ đã giao hàng) cho phần "Đã thanh toán"
  // Các phần khác tính từ tất cả các đơn có payment_status tương ứng
  const revenueByStatus = {
    completed: orders
      .filter(
        (o) =>
          o.payment_status === "completed" &&
          o.shipment_status === "delivered"
      )
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0),
    pending: orders
      .filter((o) => o.payment_status === "pending")
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0),
    failed: orders
      .filter((o) => o.payment_status === "failed")
      .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0),
  };

  const totalRevenue = Object.values(revenueByStatus).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );

  const data = [
    {
      label: "Đã thanh toán",
      value: revenueByStatus.completed,
      color: "#22c55e",
    },
    {
      label: "Chờ thanh toán",
      value: revenueByStatus.pending,
      color: "#fbbf24",
    },
    {
      label: "Thanh toán thất bại",
      value: revenueByStatus.failed,
      color: "#f97373",
    },
  ].filter((item) => item.value > 0); // Chỉ hiển thị các phần có giá trị

  // Kiểm tra nếu không có dữ liệu hoặc totalRevenue = 0
  const hasValidData = totalRevenue > 0 && data.length > 0;
  
  if (!hasValidData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Doanh thu theo trạng thái thanh toán</Text>
        <Text style={styles.subtitle}>
          (Chỉ tính từ các đơn đã hoàn tất)
        </Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
        </View>
      </View>
    );
  }

  // Tính toán phần trăm cho mỗi item
  const items = data.map((item) => {
    const value = Number(item.value) || 0;
    const total = Number(totalRevenue) || 0;
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return {
      ...item,
      value: value,
      percentage: isNaN(percentage) ? "0.0" : percentage.toFixed(1),
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doanh thu theo trạng thái thanh toán</Text>
      <Text style={styles.subtitle}>
        (Chỉ tính từ các đơn đã hoàn tất)
      </Text>
      
      {/* Hiển thị tổng doanh thu */}
      <View style={styles.totalRevenueContainer}>
        <Text style={styles.totalRevenueLabel}>Tổng doanh thu</Text>
        <Text style={styles.totalRevenueValue}>
          {Number(totalRevenue || 0).toLocaleString("vi-VN")} đ
        </Text>
      </View>

      {/* Hiển thị danh sách các trạng thái với số và phần trăm */}
      <View style={styles.list}>
        {items.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <View
              style={[
                styles.listItemColor,
                { backgroundColor: item.color },
              ]}
            />
            <View style={styles.listItemContent}>
              <Text style={styles.listItemLabel}>{item.label}</Text>
              <View style={styles.listItemValues}>
                <Text style={styles.listItemPercentage}>
                  {item.percentage}%
                </Text>
                <Text style={styles.listItemValue}>
                  {Number(item.value || 0).toLocaleString("vi-VN")} đ
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 16,
    textAlign: "center",
  },
  totalRevenueContainer: {
    width: "100%",
    backgroundColor: "#111827",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  totalRevenueLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 4,
  },
  totalRevenueValue: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    width: "100%",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#111827",
    borderRadius: 8,
  },
  listItemColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  listItemContent: {
    flex: 1,
  },
  listItemLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  listItemValues: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  listItemPercentage: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600",
  },
  listItemValue: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  emptyContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "#111827",
    borderRadius: 8,
    alignItems: "center",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
});
