import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  role?: string | string[];
}

export const getUserRoleFromToken = (token: string | null): string | null => {
  if (!token) return null;

  const decoded = jwtDecode<JwtPayload>(token);

  if (Array.isArray(decoded.role)) {
    return decoded.role[0];
  }

  return decoded.role ?? null;
};
