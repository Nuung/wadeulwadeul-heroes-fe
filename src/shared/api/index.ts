import axios from "axios";
import { env } from "@/shared/config";

export const baseClient = axios.create({
  baseURL: env.baseUrl,
});
