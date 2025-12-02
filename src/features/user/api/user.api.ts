import { axiosInstance } from "@shared-libs/axios/axios.base";
import type { EndUser } from "@shared-types/enduser.type";

const USERS_ENDPOINT = "/users/";

export type User = EndUser;

export type UpdateUserPayload = {
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
  is_active?: boolean;
  role?: "reader" | "writer" | "admin";
  password?: string;
};

export type UserFilters = {
  role?: "reader" | "writer" | "admin";
  is_active?: boolean;
  search?: string;
};

/**
 * Fetch all users (admin only)
 */
export const fetchUsers = async (
  filters?: UserFilters
): Promise<User[]> => {
  const params = new URLSearchParams();
  
  if (filters?.role) {
    params.append("role", filters.role);
  }
  if (filters?.is_active !== undefined) {
    params.append("is_active", filters.is_active.toString());
  }
  if (filters?.search) {
    params.append("search", filters.search);
  }

  const queryString = params.toString();
  const url = queryString ? `${USERS_ENDPOINT}?${queryString}` : USERS_ENDPOINT;
  
  const response = await axiosInstance.get<User[]>(url);
  return response.data;
};

/**
 * Fetch user by ID
 */
export const fetchUserById = async (userId: string): Promise<User> => {
  const response = await axiosInstance.get<User>(`${USERS_ENDPOINT}${userId}`);
  return response.data;
};

/**
 * Update user (admin only)
 */
export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload
): Promise<User> => {
  const response = await axiosInstance.patch<User>(
    `${USERS_ENDPOINT}${userId}`,
    payload
  );
  return response.data;
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (userId: string): Promise<void> => {
  await axiosInstance.delete(`${USERS_ENDPOINT}${userId}`);
};

/**
 * Toggle user active status
 */
export const toggleUserActive = async (
  userId: string,
  isActive: boolean
): Promise<User> => {
  return updateUser(userId, { is_active: isActive });
};

