import React from "react";
import { View, Text } from "react-native";

type Props = {
  title?: string;
  subtitle?: string;
};

export const CartEmptyState = ({
  title = "Giỏ hàng trống",
  subtitle = "Hãy thêm vài cuốn sách vào nhé!",
}: Props) => (
  <View className="items-center justify-center py-20">
    <Text className="text-2xl font-bold text-white mb-2">{title}</Text>
    <Text className="text-neutral-400 text-center px-6">{subtitle}</Text>
  </View>
);


