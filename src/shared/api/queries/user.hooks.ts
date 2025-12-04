/**
 * User TanStack Query Hooks
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getCurrentUser,
  getUser,
  getUsers,
  updateUser,
} from "./user.api";
import type {
  UserCreate,
  UserListParams,
  UserResponse,
  UserUpdate,
} from "./user.types";

/**
 * Query Keys
 */
export const userKeys = {
  all: ["user"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params?: UserListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  me: () => [...userKeys.all, "me"] as const,
} as const;

/**
 * Get Current User Query
 */
export const useCurrentUserQuery = (
  options?: Omit<UseQueryOptions<UserResponse, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getCurrentUser,
    ...options,
  });
};

/**
 * List Users Query
 */
export const useUsersQuery = (
  params?: UserListParams,
  options?: Omit<
    UseQueryOptions<UserResponse[], Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    ...options,
  });
};

/**
 * Get User Query
 */
export const useUserQuery = (
  id: string,
  options?: Omit<UseQueryOptions<UserResponse, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Create User Mutation
 */
export const useCreateUserMutation = (
  options?: Omit<
    UseMutationOptions<UserResponse, Error, UserCreate>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

/**
 * Update User Mutation
 */
export const useUpdateUserMutation = (
  options?: Omit<
    UseMutationOptions<UserResponse, Error, { id: string; data: UserUpdate }>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // Potentially invalidate 'me' if the updated user is the current user, 
      // but we don't know that easily here.
    },
  });
};

/**
 * Delete User Mutation
 */
export const useDeleteUserMutation = (
  options?: Omit<
    UseMutationOptions<void, Error, string>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: deleteUser,
    onSuccess: async (data, id) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};
