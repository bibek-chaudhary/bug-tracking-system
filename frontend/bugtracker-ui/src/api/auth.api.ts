import type { LoginRequest, RegisterRequest } from "../types/auth.types";
import type { ApiResponse } from "../types/api.types";
import api from "./axios";

export const authApi = {
  login: async (payload: LoginRequest) => {
    const response = await api.post<ApiResponse<{ token: string }>>(
      "/auth/login",
      payload,
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  },

  register: async (payload: RegisterRequest) => {
    const response = await api.post<ApiResponse<null>>(
      "/auth/register",
      payload,
    );

    return response.data;
  },
};
