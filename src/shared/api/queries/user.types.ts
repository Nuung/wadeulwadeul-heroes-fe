import type { PaginationParams } from "../common.types";

/**
 * User Domain Types
 */

export type UserTypeEnum = "young" | "old";

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  type: UserTypeEnum;
}

export interface UserCreate {
  name: string;
  email: string;
  type?: UserTypeEnum;
}

export interface UserUpdate {
  name?: string | null;
  email?: string | null;
  type?: UserTypeEnum | null;
}

export interface UserInfoResponse {
  user_id: string;
  name: string;
  email: string | null;
}

export type UserListParams = PaginationParams;
