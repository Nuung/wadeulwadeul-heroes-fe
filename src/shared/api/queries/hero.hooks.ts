/**
 * Hero TanStack Query Hooks
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  createHero,
  deleteHero,
  getHero,
  getHeroes,
} from "./hero.api";
import type {
  HeroCreate,
  HeroListParams,
  HeroResponse,
} from "./hero.types";

/**
 * Query Keys
 */
export const heroKeys = {
  all: ["hero"] as const,
  lists: () => [...heroKeys.all, "list"] as const,
  list: (params?: HeroListParams) => [...heroKeys.lists(), params] as const,
  details: () => [...heroKeys.all, "detail"] as const,
  detail: (id: string) => [...heroKeys.details(), id] as const,
} as const;

/**
 * List Heroes Query
 */
export const useHeroesQuery = (
  params?: HeroListParams,
  options?: Omit<
    UseQueryOptions<HeroResponse[], Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: heroKeys.list(params),
    queryFn: () => getHeroes(params),
    ...options,
  });
};

/**
 * Get Hero Query
 */
export const useHeroQuery = (
  id: string,
  options?: Omit<UseQueryOptions<HeroResponse, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: heroKeys.detail(id),
    queryFn: () => getHero(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Create Hero Mutation
 */
export const useCreateHeroMutation = (
  options?: Omit<
    UseMutationOptions<HeroResponse, Error, HeroCreate>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: createHero,
    onSuccess: async () => {
      // Invalidate lists
      await queryClient.invalidateQueries({ queryKey: heroKeys.lists() });
    },
  });
};

/**
 * Delete Hero Mutation
 */
export const useDeleteHeroMutation = (
  options?: Omit<
    UseMutationOptions<void, Error, string>,
    "mutationFn" | "onSuccess"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: deleteHero,
    onSuccess: async (data, id) => {
      // Remove detail query
      queryClient.removeQueries({ queryKey: heroKeys.detail(id) });
      // Invalidate lists
      await queryClient.invalidateQueries({ queryKey: heroKeys.lists() });
    },
  });
};
