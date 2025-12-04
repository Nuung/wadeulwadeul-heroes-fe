/**
 * User API Functions
 */

import { apiDelete, apiGet, apiPost, apiPut } from "..";
import type {
  UserCreate,
  UserListParams,
  UserResponse,
  UserUpdate,
} from "./user.types";

/**
 * Get Current User Info
 */
export const getCurrentUser = async () => {
  // Note: Requires 'wadeulwadeul-user' header, handled by interceptor or client config usually.
  return apiGet<UserResponse>({
    endpoint: "/api/v1/users/me",
  });
};

/**
 * List Users
 */
export const getUsers = async (params?: UserListParams) => {
  return apiGet<UserResponse[], UserListParams>({
    endpoint: "/api/v1/users/",
    params,
  });
};

/**
 * Get User
 */
export const getUser = async (id: string) => {
  return apiGet<UserResponse>({
    endpoint: `/api/v1/users/${id}`,
  });
};

/**
 * Create User
 */
export const createUser = async (data: UserCreate) => {
  return apiPost<UserResponse, UserCreate>({
    endpoint: "/api/v1/users/",
    data,
  });
};

/**
 * Update User
 */
export const updateUser = async (id: string, data: UserUpdate) => {
  return apiPut<UserResponse, UserUpdate>({
    endpoint: `/api/v1/users/${id}`,
    data,
  });
};

/**
 * Delete User
 */
export const deleteUser = async (id: string) => {
  return apiDelete<void>({
    endpoint: `/api/v1/users/${id}`,
  });
};
