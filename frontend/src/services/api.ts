import axios from "axios";
import { getAuthorizationHeader } from "../lib/auth-storage";
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const header = getAuthorizationHeader();
  if (header.Authorization) {
    config.headers.Authorization = header.Authorization;
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
export default api;
