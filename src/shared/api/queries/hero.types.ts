/**
 * Hero Domain Types
 */

import type { PaginationParams } from "../common.types";

export interface HeroResponse {
  id: string;
  name: string;
  description: string | null;
  level: number;
}

export interface HeroCreate {
  name: string;
  description?: string | null;
  level?: number;
}

export type HeroListParams = PaginationParams;
