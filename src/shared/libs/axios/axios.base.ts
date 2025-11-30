import { BASE_API_URL } from "@shared-constants/base-api-path";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 10000,
});
axiosInstance.interceptors.request.use((config) => {
  const access_token = useAuthStore.getState().access_token;
  if (access_token && config.headers)
    config.headers["Authorization"] = `Bearer ${access_token}`;
  return config;
});
