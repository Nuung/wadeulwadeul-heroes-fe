import axios from "axios";

export const BASE_URL = "/wadeul";
export const baseClient = axios.create({
  baseURL: BASE_URL,
});
