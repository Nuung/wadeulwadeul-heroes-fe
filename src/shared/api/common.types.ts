/**
 * Common API Types
 */

export interface HTTPValidationError {
  detail: ValidationError[];
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface PaginationParams {
  skip?: number;
  limit?: number;
}
