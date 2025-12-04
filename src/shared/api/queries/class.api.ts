/**
 * Class API Functions
 */

import { apiDelete, apiGet, apiPost, apiPut } from "..";
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
 * Create Class
 */
export const createClass = async (data: ClassCreate) => {
  return apiPost<ClassResponse, ClassCreate>({
    endpoint: "/api/v1/classes/",
    data,
  });
};

/**
 * List Classes
 */
export const getClasses = async (params?: ClassListParams) => {
  return apiGet<ClassResponse[], ClassListParams>({
    endpoint: "/api/v1/classes/",
    params,
  });
};

/**
 * List Classes Public
 */
export const getClassesPublic = async (params?: ClassListParams) => {
  return apiGet<ClassResponse[], ClassListParams>({
    endpoint: "/api/v1/classes/public",
    params,
  });
};

/**
 * Get Class By Id
 */
export const getClassById = async (class_id: string) => {
  return apiGet<ClassResponse>({
    endpoint: `/api/v1/classes/${class_id}`,
  });
};

/**
 * Update Class
 */
export const updateClass = async (class_id: string, data: ClassUpdate) => {
  return apiPut<ClassResponse, ClassUpdate>({
    endpoint: `/api/v1/classes/${class_id}`,
    data,
  });
};

/**
 * Delete Class
 */
export const deleteClass = async (class_id: string) => {
  return apiDelete<void>({
    endpoint: `/api/v1/classes/${class_id}`,
  });
};

/**
 * Enroll Class
 */
export const enrollClass = async (class_id: string, data: EnrollmentCreate) => {
  return apiPost<EnrollmentResponse, EnrollmentCreate>({
    endpoint: `/api/v1/classes/${class_id}/enroll`,
    data,
  });
};

/**
 * List My Enrollments
 */
export const getMyEnrollments = async () => {
  return apiGet<EnrollmentResponse[]>({
    endpoint: "/api/v1/classes/enrollments/me",
  });
};

/**
 * Delete Enrollment
 */
export const deleteEnrollment = async (enrollment_id: string) => {
  return apiDelete<void>({
    endpoint: `/api/v1/classes/enrollments/${enrollment_id}`,
  });
};

/**
 * List My Classes Enrollments
 */
export const getMyClassesEnrollments = async () => {
  return apiGet<ClassEnrollmentResponse[]>({
    endpoint: "/api/v1/classes/my-classes/enrollments",
  });
};
