import { authApi } from "./api";
import type { AuthResponse, LoginRequest, RefreshResponse, RegisterRequest, User } from "../types/auth.types";

export const authService = {
  login: async (payload: LoginRequest) => {
    const { data } = await authApi.post<AuthResponse>("/auth/login", payload);
    return data;
  },
  register: async (payload: RegisterRequest) => {
    const { data } = await authApi.post<AuthResponse>("/auth/register", payload);
    return data;
  },
  me: async () => {
    const { data } = await authApi.get<User>("/auth/me");
    return data;
  },
  refresh: async (refreshToken: string) => {
    const { data } = await authApi.post<RefreshResponse>("/auth/refresh", { refreshToken });
    return data;
  },
  logout: async () => {
    await authApi.post("/auth/logout");
  }
};
