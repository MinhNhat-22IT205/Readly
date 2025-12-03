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
import {
  checkoutSchema,
  CheckoutFormValues,
} from "@features/order/libs/checkoutForm.zod";
import { OrderSummaryCard } from "@features/order/components/OrderSummaryCard";
import {
  submitOrder,
  createPaymentSession,
} from "@features/order/api/order.api";
import { Linking, Platform } from "react-native";
import type { HomeStackParamList } from "../navigation/HomeStack";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, "Checkout">;

const paymentOptions: CheckoutFormValues["paymentMethod"][] = [
  "cod",
  "card",
  "bank_transfer",
];

const CheckoutScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { items, refreshCart, clearCart, isEmpty } = useCart();
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
      return sum + Number(item.price ?? 0) * item.quantity;
    }, 0);
  }, [items]);

  // Tính tổng tiền (làm tròn thành số nguyên VND)
  // Giả sử giá sách trong DB đã là VND, nếu là USD thì cần nhân với tỷ giá
  const totalAmount = useMemo(() => {
    const shippingFee = 3500; // Phí ship 3,500 VND (hoặc điều chỉnh theo đơn vị của bạn)
    const total = subtotal + shippingFee;
    return Math.round(total); // Đảm bảo là số nguyên VND
  }, [subtotal]);

  const onSubmit = async (values: CheckoutFormValues) => {
    if (isEmpty) {
      Alert.alert("Giỏ hàng trống", "Hãy thêm sản phẩm trước khi thanh toán.");
      return;
    }

    // Validate số tiền tối thiểu (PayOS yêu cầu >= 2000 VND)
    if (totalAmount < 2000) {
      Alert.alert(
        "Số tiền không hợp lệ",
        "Tổng tiền phải tối thiểu 2,000 VND. Vui lòng thêm sản phẩm vào giỏ hàng."
      );
      return;
    }

    try {
      console.log("🛒 Creating order with:", {
        itemsCount: items.length,
        totalAmount,
        paymentMethod: values.paymentMethod,
      });

      // 1) Tạo Order (pending)
      const order = await submitOrder({
        items,
        total: totalAmount, // Gửi số VND nguyên
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

      console.log("✅ Order created:", {
        orderId: order.id,
        totalAmount: order.total_amount,
      });

      // Xóa giỏ hàng ngay sau khi đơn hàng được tạo thành công (đã chuyển sang đang xử lý)
      await clearCart();

      // 2) Nếu là COD, không cần PayOS
      if (values.paymentMethod === "cod") {
        Alert.alert(
          "Đặt hàng thành công",
          "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
          [{ text: "Quay lại trang chủ", onPress: () => navigation.navigate("Home") }]
        );
        return;
      }

      // 3) Tạo phiên thanh toán PayOS
      console.log("💳 Creating PayOS session for order:", {
        orderId: order.id,
        totalAmount: order.total_amount,
        paymentMethod: values.paymentMethod,
      });
      
      let checkoutUrl: string;
      try {
        const sessionResponse = await createPaymentSession(order.id);
        checkoutUrl = sessionResponse.checkoutUrl;
        
        if (!checkoutUrl) {
          throw new Error("Không nhận được checkout URL từ PayOS");
        }
        
        console.log("✅ PayOS checkout URL received:", checkoutUrl.substring(0, 50) + "...");
      } catch (sessionError: any) {
        // Nếu lỗi khi tạo session, vẫn hiển thị order đã tạo
        console.error("❌ Failed to create PayOS session:", sessionError);
        throw sessionError; // Re-throw để catch bên ngoài xử lý
      }

      // 4) Chuyển sang PayOS (WebView hoặc browser)
      if (Platform.OS === "web") {
        // Web: redirect trực tiếp
        window.location.href = checkoutUrl;
      } else {
        // Mobile: Mở trong WebView trong app
        navigation.navigate("PayOSPayment", {
          checkoutUrl,
          orderId: order.id,
        });
      }
    } catch (error: any) {
      console.error("❌ Payment error:", {
        error,
        response: error?.response,
        data: error?.response?.data,
        status: error?.response?.status,
      });

      // Xử lý lỗi từ backend (có thể có payos_error hoặc error trong detail)
      const errorData = error?.response?.data;
      const statusCode = error?.response?.status;
      let errorMessage = "Đã xảy ra lỗi khi xử lý thanh toán";
      let errorTitle = "Lỗi thanh toán";
      let showRetry = true;

      if (errorData) {
        // Hết hàng / không đủ tồn kho khi tạo order details
        if (
          statusCode === 400 &&
          (errorData.detail === "Not enough stock for this book" ||
            errorData.detail === "Not enough stock")
        ) {
          errorTitle = "Không đủ hàng";
          errorMessage =
            errorData.detail === "Not enough stock for this book"
              ? "Không đủ số lượng sách trong kho cho một sản phẩm trong giỏ."
              : "Không đủ số lượng sách trong kho.";
          showRetry = false;
        }

        // Backend trả về: { detail: { error: "..." } } hoặc { detail: { payos_error: "..." } }
        if (errorData.detail?.error) {
          const payosError = errorData.detail.error;
          errorTitle = "Lỗi PayOS SDK";
          errorMessage = payosError;
          
          // Thêm thông tin hữu ích dựa trên loại lỗi
          if (payosError.includes("Invalid response")) {
            errorMessage += "\n\n💡 Có thể do:\n- PayOS credentials không đúng\n- Môi trường PayOS không khớp\n- orderCode bị trùng\n- returnUrl/cancelUrl không hợp lệ";
          }
        } else if (errorData.detail?.payos_error) {
          errorMessage = `Lỗi PayOS: ${errorData.detail.payos_error}`;
        } else if (errorData.detail) {
          // Nếu detail là object, hiển thị toàn bộ
          const detailStr = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail, null, 2);
          errorMessage = `Lỗi chi tiết:\n${detailStr}`;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }

      // Nếu là lỗi 502 (Bad Gateway), có thể là lỗi từ PayOS
      if (statusCode === 502) {
        errorTitle = "Lỗi kết nối PayOS";
        errorMessage = "Không thể kết nối đến PayOS. Vui lòng thử lại sau.\n\n" + errorMessage;
      }

      Alert.alert(
        errorTitle,
        errorMessage,
        [
          { text: "Đóng", style: "cancel" },
          ...(showRetry ? [{
            text: "Thử lại",
            onPress: () => handleSubmit(onSubmit)(),
          }] : []),
        ]
      );
    }
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
              {totalAmount < 2000 && (
                <Text className="text-yellow-400 text-xs text-center mb-2">
                  ⚠️ Tổng tiền tối thiểu: 2,000 VND
                </Text>
              )}
              <TouchableOpacity
                className="bg-emerald-500 rounded-full py-3"
                disabled={isSubmitting || totalAmount < 2000}
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


