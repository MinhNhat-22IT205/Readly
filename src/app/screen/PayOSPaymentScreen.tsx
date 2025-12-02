import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { WebView } from "react-native-webview";
import type { WebViewNavigation } from "react-native-webview";
import type { HomeStackParamList } from "../navigation/HomeStack";

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "PayOSPayment"
>;

type RouteParams = {
  checkoutUrl: string;
  orderId: number;
};

const PayOSPaymentScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { checkoutUrl, orderId } = (route.params as RouteParams) || {};
  const [loading, setLoading] = useState(true);

  // Validate checkoutUrl
  if (!checkoutUrl) {
    return (
      <SafeAreaView className="flex-1 bg-neutral-950 items-center justify-center">
        <Text className="text-white text-lg">Lỗi: Không tìm thấy URL thanh toán</Text>
        <TouchableOpacity
          className="mt-4 bg-emerald-500 px-6 py-3 rounded-lg"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-black font-semibold">Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Xử lý khi WebView navigate (detect returnUrl/cancelUrl từ PayOS)
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    
    // PayOS sẽ redirect về returnUrl hoặc cancelUrl sau khi thanh toán
    // Backend nên config returnUrl/cancelUrl về deep link hoặc URL có pattern đặc biệt
    // Ví dụ: myapp://payment/result?orderId=123 hoặc https://yourapp.com/payment/result?orderId=123
    
    // Detect khi đã redirect về returnUrl/cancelUrl (không còn là PayOS domain)
    const isPayOSDomain = url.includes("payos.vn") || url.includes("payos.com");
    
    // Nếu URL chứa pattern thành công/thất bại, hoặc không còn là PayOS domain
    // (có nghĩa là đã redirect về returnUrl/cancelUrl)
    if (
      url.includes("/payment/result") ||
      url.includes("/payment/success") ||
      url.includes("/payment/cancel") ||
      url.includes("payment/result") ||
      (!isPayOSDomain && url !== checkoutUrl && !url.includes("checkout"))
    ) {
      // Navigate sang OrderResult để hiển thị kết quả
      // OrderResultScreen sẽ poll order status từ backend
      // Backend đã cập nhật payment_status qua webhook
      navigation.replace("OrderResult", { orderId });
    }
  };

  // Fallback cho web platform
  if (Platform.OS === "web") {
    if (typeof window !== "undefined" && checkoutUrl) {
      window.location.href = checkoutUrl;
    }
    return (
      <SafeAreaView className="flex-1 bg-neutral-950 items-center justify-center">
        <ActivityIndicator size="large" color="#34d399" />
        <Text className="text-white mt-4">Đang chuyển đến PayOS...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-neutral-800">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-neutral-900 items-center justify-center"
          onPress={() => {
            Alert.alert(
              "Hủy thanh toán?",
              "Bạn có chắc muốn hủy thanh toán?",
              [
                { text: "Tiếp tục thanh toán", style: "cancel" },
                {
                  text: "Hủy",
                  style: "destructive",
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          }}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Thanh toán PayOS</Text>
        <View className="w-10 h-10" />
      </View>

      {loading && (
        <View className="absolute top-20 left-0 right-0 items-center z-10">
          <ActivityIndicator size="large" color="#34d399" />
          <Text className="text-white text-sm mt-2">Đang tải trang thanh toán...</Text>
        </View>
      )}

      <WebView
        source={{ uri: checkoutUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        style={{ flex: 1, backgroundColor: "#000" }}
        // Cho phép JavaScript và các tính năng cần thiết
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // Xử lý lỗi
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView error:", nativeEvent);
          Alert.alert(
            "Lỗi tải trang",
            "Không thể tải trang thanh toán. Vui lòng thử lại.",
            [
              { text: "Quay lại", onPress: () => navigation.goBack() },
              {
                text: "Thử lại",
                onPress: () => {
                  // WebView sẽ tự reload khi state thay đổi
                  setLoading(true);
                },
              },
            ]
          );
        }}
        // Xử lý HTTP errors
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("WebView HTTP error:", nativeEvent);
        }}
      />
    </SafeAreaView>
  );
};

export default PayOSPaymentScreen;

