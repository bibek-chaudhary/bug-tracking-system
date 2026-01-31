import api from "../api/axios";
import type { ApiResponse } from "../types/api.types";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth.types";

export const authService = {
  register: async (data: RegisterRequest) => {
    const res = await api.post<ApiResponse<string>>("/auth/register", data);
    return res.data;
  },

  login: async (data: LoginRequest) => {
    const res = await api.post<ApiResponse<LoginResponse>>("/auth/login", data);
    localStorage.setItem("token", res.data.data!.token);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};
