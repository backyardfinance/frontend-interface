import axios, { type AxiosInstance } from "axios";

const DEFAULT_BASE_URL = (import.meta as any)?.env?.VITE_API_URL ?? "https://68eba79a76b3362414ce4912.mockapi.io/";

export const apiClient: AxiosInstance = axios.create({
  baseURL: DEFAULT_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  // Hook for auth headers or query params when needed
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error normalization can be added here
    return Promise.reject(error);
  }
);

export default apiClient;
