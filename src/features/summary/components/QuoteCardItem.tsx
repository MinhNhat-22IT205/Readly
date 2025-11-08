import React from "react";
import { View, Text, Image } from "react-native";

export interface Quote {
  id: number;
  text: string;
  image: string;
}

export const QuoteCardItem = ({ quote }: { quote: Quote }) => (
  <View className="w-36 h-56 bg-zinc-900 rounded-xl p-3 relative overflow-hidden mr-3">
    <Text className="text-4xl font-bold text-zinc-700 mb-2">❝</Text>
    <Text className="text-xs text-zinc-400 leading-relaxed" numberOfLines={3}>
      {quote.text}
    </Text>
    <Image
      source={{ uri: quote.image }}
      className="absolute bottom-3 left-3 w-12 h-16 rounded"
    />
  </View>
);

