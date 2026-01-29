import { jwtDecode } from "jwt-decode";

export const getUserRoleFromToken = (token: string | null): string | null => {
  if (!token) return null;

  if (!token) return null;
  const decoded: any = jwtDecode(token);
  const roles =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  return roles || null;
};
