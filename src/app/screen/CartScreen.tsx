import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCart } from "@features/cart/libs/useCart";
import { CartItemCard } from "@features/cart/components/CartItemCard";
import { CartEmptyState } from "@features/cart/components/CartEmptyState";
import { useBookCatalog } from "@features/book/libs/useBookCatalog";
import { OrderSummaryCard } from "@features/order/components/OrderSummaryCard";
import type { HomeStackParamList } from "../navigation/HomeStack";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "Cart">;

const CartScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { items, updateItem, removeItem, isEmpty } = useCart();
  const { books } = useBookCatalog();

  const bookMap = useMemo(() => {
    const map = new Map<number, (typeof books)[number]>();
    books.forEach((book) => map.set(book.id, book));
    return map;
  }, [books]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const book = bookMap.get(item.book_id);
      if (!book) return sum;
      return sum + book.price * item.quantity;
    }, 0);
  }, [bookMap, items]);

  const handleCheckout = () => {
    navigation.navigate("Checkout");
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-900 items-center justify-center"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Giỏ hàng</Text>
        <View className="w-10 h-10" />
      </View>

      {isEmpty ? (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <CartEmptyState />
          <TouchableOpacity
            className="mx-8 bg-emerald-500 rounded-full py-3"
            onPress={() => navigation.navigate("BookStore")}
          >
            <Text className="text-center font-semibold text-black">
              Khám phá cửa hàng
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => {
            const book = bookMap.get(item.book_id);
            if (!book) return null;
            return (
              <CartItemCard
                key={item.id}
                book={book}
                item={item}
                onIncrement={() => updateItem(item.id, item.quantity + 1)}
                onDecrement={() =>
                  item.quantity > 1 && updateItem(item.id, item.quantity - 1)
                }
                onRemove={() => removeItem(item.id)}
              />
            );
          })}

          <OrderSummaryCard subtotal={subtotal}>
            <TouchableOpacity
              className="bg-emerald-500 rounded-full py-3"
              onPress={handleCheckout}
            >
              <Text className="text-center text-black font-semibold uppercase">
                Tiếp tục thanh toán
              </Text>
            </TouchableOpacity>
          </OrderSummaryCard>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;


