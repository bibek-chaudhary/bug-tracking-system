import type { LoginRequest, RegisterRequest } from "../types/auth.types";
import api from "./axios";

export const authApi = {
  login: (payload: LoginRequest) => api.post<string>("/auth/login", payload),

  register: (payload: RegisterRequest) => api.post("/auth/register", payload),
};
