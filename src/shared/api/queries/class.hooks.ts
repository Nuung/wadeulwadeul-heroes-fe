/**
 * Class TanStack Query Hooks
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  createClass,
  deleteClass,
  getClass,
  getClasses,
  updateClass,
} from "./class.api";
import type {
  Class,
  ClassListParams,
  ClassListResponse,
  CreateClassDto,
  UpdateClassDto,
} from "./class.types";

/**
 * Query Keys
 */
export const classKeys = {
  all: ["class"] as const,
  lists: () => [...classKeys.all, "list"] as const,
  list: (params?: ClassListParams) => [...classKeys.lists(), params] as const,
  details: () => [...classKeys.all, "detail"] as const,
  detail: (id: number) => [...classKeys.details(), id] as const,
} as const;

/**
 * 클래스 목록 조회 Query
 */
export const useClassesQuery = (
  params?: ClassListParams,
  options?: Omit<
    UseQueryOptions<ClassListResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: classKeys.list(params),
    queryFn: () => getClasses(params),
    ...options,
  });
};

/**
 * 클래스 상세 조회 Query
 */
export const useClassQuery = (
  id: number,
  options?: Omit<UseQueryOptions<Class, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: classKeys.detail(id),
    queryFn: () => getClass(id),
    ...options,
  });
};

/**
 * 클래스 생성 Mutation
 */
export const useCreateClassMutation = (
  options?: Omit<
    UseMutationOptions<Class, Error, CreateClassDto>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createClass,
    onSuccess: async (...args) => {
      // 목록 쿼리 무효화
      await queryClient.invalidateQueries({ queryKey: classKeys.lists() });
    },
  });
};

/**
 * 클래스 수정 Mutation
 */
export const useUpdateClassMutation = (
  options?: Omit<
    UseMutationOptions<Class, Error, { id: number; data: UpdateClassDto }>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ id, data }) => updateClass(id, data),
    onSuccess: async (data, variables) => {
      // 해당 상세 쿼리 무효화
      await queryClient.invalidateQueries({
        queryKey: classKeys.detail(variables.id),
      });
      // 목록 쿼리 무효화
      await queryClient.invalidateQueries({ queryKey: classKeys.lists() });
    },
  });
};

/**
 * 클래스 삭제 Mutation
 */
export const useDeleteClassMutation = (
  options?: Omit<
    UseMutationOptions<void, Error, number>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: deleteClass,
    onSuccess: async (data, id) => {
      // 해당 상세 쿼리 제거
      queryClient.removeQueries({ queryKey: classKeys.detail(id) });
      // 목록 쿼리 무효화
      await queryClient.invalidateQueries({ queryKey: classKeys.lists() });
    },
  });
};
