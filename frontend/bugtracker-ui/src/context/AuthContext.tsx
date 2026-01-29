import { createContext, useContext, useState } from "react";
import { getUserRoleFromToken } from "../utils/jwt";

type AuthContextType = {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const role = getUserRoleFromToken(token);
  console.log("role from token", token)
  console.log("role from suth", role)

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, role, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext must be used within AuthProvider");
  return ctx;
};
