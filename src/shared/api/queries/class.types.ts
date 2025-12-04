/**
 * Class Domain Types
 */

import type { PaginationParams } from "../common.types";
import type { UserInfoResponse } from "./user.types";

/**
 * Template data structure for class experience plan
 */
export interface ClassTemplateData {
  "체험 제목": string;
  "클래스 소개": string;
  난이도: string;
  로드맵: string;
  오프닝: string;
  "준비 단계": string;
  "핵심 체험": string;
  마무리: string;
  준비물: string;
  "특별 안내사항": string;
}

export interface ClassCreate {
  category: string;
  location: string;
  duration_minutes: number;
  capacity: number;
  years_of_experience: string;
  job_description: string;
  materials: string;
  price_per_person: string;
  template: ClassTemplateData | null;
}

export interface ClassInfoResponse {
  category: string;
  location: string;
  duration_minutes: number;
  capacity: number;
  years_of_experience: string;
  job_description: string;
  materials: string;
  price_per_person: string;
  template: ClassTemplateData | null;
}

export interface ClassResponse {
  category: string;
  location: string;
  duration_minutes: number;
  capacity: number;
  years_of_experience: string;
  job_description: string;
  materials: string;
  price_per_person: string;
  template: ClassTemplateData | null;
  id: string;
  creator_id: string;
}

export interface ClassUpdate {
  category?: string | null;
  location?: string | null;
  duration_minutes?: number | null;
  capacity?: number | null;
  years_of_experience?: string | null;
  job_description?: string | null;
  materials?: string | null;
  price_per_person?: string | null;
  template: ClassTemplateData | null;
}

export interface EnrollmentCreate {
  applied_date: string;
  headcount: number;
}

export interface EnrollmentResponse {
  id: string;
  class_id: string;
  user_id: string;
  applied_date: string;
  headcount: number;
}

export interface EnrollmentWithUserResponse {
  enrollment_id: string;
  applied_date: string;
  headcount: number;
  user_info: UserInfoResponse;
}

export interface ClassEnrollmentResponse {
  class_id: string;
  class_info: ClassInfoResponse;
  enrollments: EnrollmentWithUserResponse[];
}

export type ClassListParams = PaginationParams;
