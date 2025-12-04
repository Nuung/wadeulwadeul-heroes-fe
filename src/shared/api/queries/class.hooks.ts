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
  deleteEnrollment,
  enrollClass,
  getClassById,
  getClasses,
  getClassesPublic,
  getMyClassesEnrollments,
  getMyEnrollments,
  updateClass,
} from "./class.api";
import type {
  ClassCreate,
  ClassEnrollmentResponse,
  ClassListParams,
  ClassResponse,
  ClassUpdate,
  EnrollmentCreate,
  EnrollmentResponse,
} from "./class.types";

/**
 * Query Keys
 */
export const classKeys = {
  all: ["class"] as const,
  lists: () => [...classKeys.all, "list"] as const,
  list: (params?: ClassListParams) => [...classKeys.lists(), params] as const,
  publicLists: () => [...classKeys.all, "publicList"] as const,
  publicList: (params?: ClassListParams) =>
    [...classKeys.publicLists(), params] as const,
  details: () => [...classKeys.all, "detail"] as const,
  detail: (id: string) => [...classKeys.details(), id] as const,
  enrollments: () => [...classKeys.all, "enrollments"] as const,
  myEnrollments: () => [...classKeys.enrollments(), "me"] as const,
  myClassesEnrollments: () => [...classKeys.enrollments(), "myClasses"] as const,
} as const;

/**
 * List Classes Query
 */
export const useClassesQuery = (
  params?: ClassListParams,
  options?: Omit<
    UseQueryOptions<ClassResponse[], Error>,
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
 * List Public Classes Query
 */
export const usePublicClassesQuery = (
  params?: ClassListParams,
  options?: Omit<
    UseQueryOptions<ClassResponse[], Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: classKeys.publicList(params),
    queryFn: () => getClassesPublic(params),
    ...options,
  });
};

/**
 * Get Class By ID Query
 */
export const useClassByIdQuery = (
  class_id: string,
  options?: Omit<UseQueryOptions<ClassResponse, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: classKeys.detail(class_id),
    queryFn: () => getClassById(class_id),
    enabled: !!class_id,
    ...options,
  });
};

/**
 * Create Class Mutation
 */
export const useCreateClassMutation = (
  options?: Omit<
    UseMutationOptions<ClassResponse, Error, ClassCreate>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createClass,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: classKeys.publicLists() });
      await queryClient.invalidateQueries({ queryKey: classKeys.myClassesEnrollments() });
    },
  });
};

/**
 * Update Class Mutation
 */
export const useUpdateClassMutation = (
  options?: Omit<
    UseMutationOptions<
      ClassResponse,
      Error,
      { class_id: string; data: ClassUpdate }
    >,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ class_id, data }) => updateClass(class_id, data),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: classKeys.detail(variables.class_id),
      });
      await queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: classKeys.publicLists() });
      await queryClient.invalidateQueries({ queryKey: classKeys.myClassesEnrollments() });
    },
  });
};

/**
 * Delete Class Mutation
 */
export const useDeleteClassMutation = (
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn" | "onSuccess">
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: deleteClass,
    onSuccess: async (data, class_id) => {
      queryClient.removeQueries({ queryKey: classKeys.detail(class_id) });
      await queryClient.invalidateQueries({ queryKey: classKeys.lists() });
      await queryClient.invalidateQueries({ queryKey: classKeys.publicLists() });
      await queryClient.invalidateQueries({ queryKey: classKeys.myClassesEnrollments() });
    },
  });
};

/**
 * Enroll Class Mutation
 */
export const useEnrollClassMutation = (
  options?: Omit<
    UseMutationOptions<EnrollmentResponse, Error, { class_id: string; data: EnrollmentCreate }>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: ({ class_id, data }) => enrollClass(class_id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: classKeys.myEnrollments() });
      await queryClient.invalidateQueries({ queryKey: classKeys.myClassesEnrollments() });
    },
  });
};

/**
 * List My Enrollments Query
 */
export const useMyEnrollmentsQuery = (
  options?: Omit<UseQueryOptions<EnrollmentResponse[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: classKeys.myEnrollments(),
    queryFn: getMyEnrollments,
    ...options,
  });
};

/**
 * Delete Enrollment Mutation
 */
export const useDeleteEnrollmentMutation = (
  options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn" | "onSuccess">
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: deleteEnrollment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: classKeys.myEnrollments() });
      await queryClient.invalidateQueries({ queryKey: classKeys.myClassesEnrollments() });
    },
  });
};

/**
 * List My Classes Enrollments Query
 */
export const useMyClassesEnrollmentsQuery = (
  options?: Omit<UseQueryOptions<ClassEnrollmentResponse[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: classKeys.myClassesEnrollments(),
    queryFn: getMyClassesEnrollments,
    ...options,
  });
};
