import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@features/cart/libs/useCart";
import { useBookCatalog } from "@features/book/libs/useBookCatalog";
import { checkoutSchema, CheckoutFormValues } from "@features/order/libs/checkoutForm.zod";
import { OrderSummaryCard } from "@features/order/components/OrderSummaryCard";
import { submitOrder } from "@features/order/api/order.api";
import type { HomeStackParamList } from "../navigation/HomeStack";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "Checkout">;

const paymentOptions: CheckoutFormValues["paymentMethod"][] = [
  "cod",
  "card",
  "bank_transfer",
];

const CheckoutScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { items, refreshCart, isEmpty } = useCart();
  const { books } = useBookCatalog();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      zipCode: "",
      paymentMethod: "cod",
    },
  });

  const paymentMethod = watch("paymentMethod");

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

  const onSubmit = async (values: CheckoutFormValues) => {
    if (isEmpty) {
      Alert.alert("Giỏ hàng trống", "Hãy thêm sản phẩm trước khi thanh toán.");
      return;
    }

    await submitOrder({
      items,
      total: subtotal + 3.5,
      shippingInfo: {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        city: values.city,
        zipCode: values.zipCode,
      },
      paymentMethod: values.paymentMethod,
    });

    await refreshCart();
    Alert.alert(
      "Đặt hàng thành công",
      "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
      [{ text: "Quay lại trang chủ", onPress: () => navigation.navigate("Home") }]
    );
  };

  const renderInput = (
    name: keyof CheckoutFormValues,
    placeholder: string,
    keyboardType: "default" | "email-address" | "phone-pad" = "default"
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View className="mb-4">
          <TextInput
            className="bg-neutral-900 text-white rounded-2xl px-4 py-3"
            placeholder={placeholder}
            placeholderTextColor="#6b7280"
            value={value}
            onChangeText={onChange}
            keyboardType={keyboardType}
          />
          {errors[name] && (
            <Text className="text-red-400 text-xs mt-1">
              {errors[name]?.message}
            </Text>
          )}
        </View>
      )}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-900 items-center justify-center"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Thanh toán</Text>
        <View className="w-10 h-10" />
      </View>

      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-white text-lg font-semibold mb-4">
            Bạn chưa có sản phẩm nào.
          </Text>
          <TouchableOpacity
            className="bg-emerald-500 rounded-full px-6 py-3"
            onPress={() => navigation.navigate("BookStore")}
          >
            <Text className="text-black font-semibold">Quay lại cửa hàng</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4 mt-4">
            <Text className="text-white font-bold text-xl mb-4">
              Thông tin giao hàng
            </Text>
            {renderInput("fullName", "Họ và tên")}
            {renderInput("phone", "Số điện thoại", "phone-pad")}
            {renderInput("email", "Email", "email-address")}
            {renderInput("address", "Địa chỉ nhận hàng")}
            {renderInput("city", "Thành phố")}
            {renderInput("zipCode", "Mã bưu chính")}
          </View>

          <View className="px-4 mt-2">
            <Text className="text-white font-bold text-xl mb-3">
              Phương thức thanh toán
            </Text>
            <View className="flex-row mb-4">
              {paymentOptions.map((option) => {
                const isActive = paymentMethod === option;
                const labelMap: Record<typeof option, string> = {
                  cod: "COD",
                  card: "Thẻ",
                  bank_transfer: "Chuyển khoản",
                };
                return (
                  <TouchableOpacity
                    key={option}
                    className={`flex-1 mr-2 py-3 rounded-2xl border ${
                      isActive
                        ? "border-emerald-400 bg-neutral-900"
                        : "border-neutral-800 bg-neutral-950"
                    }`}
                    onPress={() => setValue("paymentMethod", option)}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        isActive ? "text-emerald-400" : "text-neutral-400"
                      }`}
                    >
                      {labelMap[option]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View className="px-4">
            <OrderSummaryCard subtotal={subtotal}>
              <TouchableOpacity
                className="bg-emerald-500 rounded-full py-3"
                disabled={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              >
                <Text className="text-center text-black font-semibold uppercase">
                  {isSubmitting ? "ĐANG XỬ LÝ..." : "Đặt hàng"}
                </Text>
              </TouchableOpacity>
            </OrderSummaryCard>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default CheckoutScreen;


