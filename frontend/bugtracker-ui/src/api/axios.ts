import axios, { AxiosError } from "axios";
import type { ErrorResponse } from "../types/api.types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      const err = error.response.data;

      const normalizedError = {
        statusCode: err?.statusCode ?? error.response.status,
        message: err?.message ?? "Something went wrong",
        details: err?.details,
      };

      // Optional: global auth handling
      if (normalizedError.statusCode === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      return Promise.reject(normalizedError);
    }

    return Promise.reject({
      statusCode: 0,
      message: "Network error or server not reachable",
    });
  }
);

export default api;
