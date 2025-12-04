/**
 * Health API
 */
import { apiGet } from "..";

export interface PingResponse {
  status: string;
  message: string;
}

export const getPing = async () => {
  return apiGet<PingResponse>({
    endpoint: "/api/health/ping",
  });
};
