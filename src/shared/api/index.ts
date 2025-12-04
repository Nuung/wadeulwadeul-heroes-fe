import axios, { type AxiosRequestConfig } from "axios";

export const BASE_URL = "/wadeul";
export const baseClient = axios.create({
  baseURL: BASE_URL,
});
export const USER_STORAGE_KEY = "wadeulwadeul-user";

/**
 * API 요청 옵션 타입
 */
export interface ApiRequestOptions<TParams = unknown> {
  /** API 엔드포인트 경로 (예: '/users', '/posts/123') */
  endpoint: string;
  /** URL 쿼리 파라미터 (예: { page: 1, limit: 10 }) */
  params?: TParams;
  /** Axios 추가 설정 */
  config?: AxiosRequestConfig;
}

/**
 * POST/PUT/PATCH 요청 옵션 타입
 */
export interface ApiMutationOptions<TData = unknown, TParams = unknown>
  extends ApiRequestOptions<TParams> {
  /** 요청 바디 데이터 */
  data?: TData;
}

/**
 * GET 요청 유틸
 * @example
 * const users = await apiGet<User[]>({ endpoint: '/users', params: { page: 1 } });
 */
export const apiGet = async <TResponse = unknown, TParams = unknown>(
  options: ApiRequestOptions<TParams>
): Promise<TResponse> => {
  const { endpoint, params, config } = options;
  const response = await baseClient.get<TResponse>(endpoint, {
    params,
    ...config,
  });
  return response.data;
};

/**
 * POST 요청 유틸
 * @example
 * const newUser = await apiPost<User, CreateUserDto>({
 *   endpoint: '/users',
 *   data: { name: 'John', email: 'john@example.com' }
 * });
 */
export const apiPost = async <
  TResponse = unknown,
  TData = unknown,
  TParams = unknown,
>(
  options: ApiMutationOptions<TData, TParams>
): Promise<TResponse> => {
  const { endpoint, data, params, config } = options;
  const response = await baseClient.post<TResponse>(endpoint, data, {
    params,
    ...config,
  });
  return response.data;
};

/**
 * PUT 요청 유틸 (전체 업데이트)
 * @example
 * const updatedUser = await apiPut<User, UpdateUserDto>({
 *   endpoint: '/users/123',
 *   data: { name: 'Jane', email: 'jane@example.com' }
 * });
 */
export const apiPut = async <
  TResponse = unknown,
  TData = unknown,
  TParams = unknown,
>(
  options: ApiMutationOptions<TData, TParams>
): Promise<TResponse> => {
  const { endpoint, data, params, config } = options;
  const response = await baseClient.put<TResponse>(endpoint, data, {
    params,
    ...config,
  });
  return response.data;
};

/**
 * PATCH 요청 유틸 (부분 업데이트)
 * @example
 * const updatedUser = await apiPatch<User, Partial<UpdateUserDto>>({
 *   endpoint: '/users/123',
 *   data: { name: 'Jane' }
 * });
 */
export const apiPatch = async <
  TResponse = unknown,
  TData = unknown,
  TParams = unknown,
>(
  options: ApiMutationOptions<TData, TParams>
): Promise<TResponse> => {
  const { endpoint, data, params, config } = options;
  const response = await baseClient.patch<TResponse>(endpoint, data, {
    params,
    ...config,
  });
  return response.data;
};

/**
 * DELETE 요청 유틸
 * @example
 * await apiDelete({ endpoint: '/users/123' });
 * await apiDelete<DeleteResponse>({ endpoint: '/users/123', params: { force: true } });
 */
export const apiDelete = async <TResponse = unknown, TParams = unknown>(
  options: ApiRequestOptions<TParams>
): Promise<TResponse> => {
  const { endpoint, params, config } = options;
  const response = await baseClient.delete<TResponse>(endpoint, {
    params,
    ...config,
  });
  return response.data;
};
