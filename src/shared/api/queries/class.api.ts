/**
 * Class API 함수
 */

import { apiDelete, apiGet, apiPost, apiPut } from "..";
import type {
  Class,
  ClassListParams,
  ClassListResponse,
  CreateClassDto,
  UpdateClassDto,
} from "./class.types";

/**
 * 클래스 목록 조회
 */
export const getClasses = async (params?: ClassListParams) => {
  return apiGet<ClassListResponse, ClassListParams>({
    endpoint: "/class",
    params,
  });
};

/**
 * 클래스 상세 조회
 */
export const getClass = async (id: number) => {
  return apiGet<Class>({
    endpoint: `/class/${id}`,
  });
};

/**
 * 클래스 생성
 */
export const createClass = async (data: CreateClassDto) => {
  return apiPost<Class, CreateClassDto>({
    endpoint: "/class",
    data,
  });
};

/**
 * 클래스 수정
 */
export const updateClass = async (id: number, data: UpdateClassDto) => {
  return apiPut<Class, UpdateClassDto>({
    endpoint: `/class/${id}`,
    data,
  });
};

/**
 * 클래스 삭제
 */
export const deleteClass = async (id: number) => {
  return apiDelete<void>({
    endpoint: `/class/${id}`,
  });
};
