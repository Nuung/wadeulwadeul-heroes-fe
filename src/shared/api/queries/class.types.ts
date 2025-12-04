/**
 * Class 도메인 타입 정의
 */

export interface Class {
  id: number;
  name: string;
  description: string;
  teacherId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassDto {
  name: string;
  description: string;
  teacherId: number;
}

export interface UpdateClassDto {
  name?: string;
  description?: string;
  teacherId?: number;
}

export interface ClassListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ClassListResponse {
  data: Class[];
  total: number;
  page: number;
  limit: number;
}
