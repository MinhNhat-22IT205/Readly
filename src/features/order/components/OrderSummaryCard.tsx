import React, { ReactNode } from "react";
import { View, Text } from "react-native";

type Props = {
  subtotal: number;
  shipping?: number;
  children?: ReactNode;
};

export const OrderSummaryCard = ({
  subtotal,
  shipping = 3.5,
  children,
}: Props) => {
  const total = subtotal + shipping;

  return (
    <View className="bg-neutral-900 rounded-2xl p-4 mt-4">
      <Text className="text-white font-semibold text-lg mb-3">
        Tóm tắt đơn hàng
      </Text>
      <View className="flex-row justify-between mb-2">
        <Text className="text-neutral-400">Tạm tính</Text>
        <Text className="text-white font-semibold">
          ${subtotal.toFixed(2)}
        </Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-neutral-400">Vận chuyển</Text>
        <Text className="text-white font-semibold">${shipping.toFixed(2)}</Text>
      </View>
      <View className="h-[1px] bg-neutral-800 my-2" />
      <View className="flex-row justify-between items-center">
        <Text className="text-white font-bold text-lg">Tổng cộng</Text>
        <Text className="text-emerald-400 font-bold text-lg">
          ${total.toFixed(2)}
        </Text>
      </View>
      {children && <View className="mt-4">{children}</View>}
    </View>
  );
};


