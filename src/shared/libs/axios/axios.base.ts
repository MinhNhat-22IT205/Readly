import { BASE_API_URL } from "@shared-constants/base-api-path";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";
import axios from "axios";

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.1.220:8000";

// Log baseURL để debug (chỉ trong development)
if (__DEV__) {
  console.log("🔗 API Base URL:", BASE_URL);
  console.log(
    "📝 Environment variable:",
    process.env.EXPO_PUBLIC_API_BASE_URL || "NOT SET (using fallback)"
  );
}

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // Tăng timeout để tránh lỗi timeout sớm với các API xử lý lâu (như /orders/)
  timeout: 30000,
});

axiosInstance.interceptors.request.use((config) => {
  const access_token = useAuthStore.getState().access_token;
  if (access_token && config.headers) {
    config.headers["Authorization"] = `Bearer ${access_token}`;
    
    // Debug logging in development
    if (__DEV__) {
      console.log("🔐 Request interceptor:", {
        url: config.url,
        method: config.method,
        hasAuth: !!access_token,
        authHeader: config.headers["Authorization"]?.substring(0, 30) + "...",
      });
    }
  } else if (__DEV__) {
    console.warn("⚠️ No access token found for request:", config.url);
  }
  return config;
});
