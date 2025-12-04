/**
 * Hero API Functions
 */

import { apiDelete, apiGet, apiPost } from "..";
import type {
  HeroCreate,
  HeroListParams,
  HeroResponse,
} from "./hero.types";

/**
 * List Heroes
 */
export const getHeroes = async (params?: HeroListParams) => {
  return apiGet<HeroResponse[], HeroListParams>({
    endpoint: "/api/v1/heroes/",
    params,
  });
};

/**
 * Get Hero
 */
export const getHero = async (id: string) => {
  return apiGet<HeroResponse>({
    endpoint: `/api/v1/heroes/${id}`,
  });
};

/**
 * Create Hero
 */
export const createHero = async (data: HeroCreate) => {
  return apiPost<HeroResponse, HeroCreate>({
    endpoint: "/api/v1/heroes/",
    data,
  });
};

/**
 * Delete Hero
 */
export const deleteHero = async (id: string) => {
  return apiDelete<void>({
    endpoint: `/api/v1/heroes/${id}`,
  });
};
