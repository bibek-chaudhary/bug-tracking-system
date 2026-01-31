import { jwtDecode } from "jwt-decode";

export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => localStorage.getItem("token");

export const getUserRole = (): string | null => {
  const token = getToken();
  if (!token) return null;
  const decoded: any = jwtDecode(token);
  const roles =
    decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  return roles || null;
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
