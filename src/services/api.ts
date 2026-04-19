import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { refreshTokenStorage } from "../utils/storage";
import type { RefreshResponse } from "../types/auth.types";

type GetAccessToken = () => string | null;
type LogoutHandler = () => void;
type SetAccessToken = (token: string | null) => void;

let getAccessToken: GetAccessToken = () => null;
let onLogout: LogoutHandler = () => undefined;
let setAccessToken: SetAccessToken = () => undefined;
let refreshPromise: Promise<string | null> | null = null;

const sanitizeBaseUrl = (rawBaseUrl: string | undefined) =>
  (rawBaseUrl ?? "").trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "");

const normalizeApiBaseUrl = (rawBaseUrl: string | undefined, proxyPrefix: "/auth-api" | "/accounts-api") => {
  const sanitized = sanitizeBaseUrl(rawBaseUrl);

  if (!sanitized) {
    return "";
  }

  const normalized = sanitized.endsWith("/api/v1") ? sanitized : `${sanitized}/api/v1`;

  if (!import.meta.env.DEV || import.meta.env.VITEST) {
    return normalized;
  }

  try {
    const url = new URL(normalized);

    if (["localhost", "127.0.0.1"].includes(url.hostname)) {
      return `${proxyPrefix}${url.pathname}`;
    }
  } catch {
    return normalized;
  }

  return normalized;
};

export const authApi = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_AUTH_API_URL, "/auth-api")
});

export const accountsApi = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_ACCOUNTS_API_URL, "/accounts-api")
});

const attachToken = (config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();

  if (token) {
    config.headers = config.headers ?? new AxiosHeaders();
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
};

const refreshAccessToken = async () => {
  const refreshToken = refreshTokenStorage.get();

  if (!refreshToken) {
    onLogout();
    return null;
  }

  try {
    const { data } = await authApi.post<RefreshResponse>("/auth/refresh", { refreshToken });
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    onLogout();
    return null;
  }
};

const createUnauthorizedHandler =
  (client: typeof authApi | typeof accountsApi) =>
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest || (originalRequest as InternalAxiosRequestConfig & { _retry?: boolean })._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    (originalRequest as InternalAxiosRequestConfig & { _retry?: boolean })._retry = true;

    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });

    const token = await refreshPromise;

    if (!token) {
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? new AxiosHeaders();
    originalRequest.headers.set("Authorization", `Bearer ${token}`);
    return client(originalRequest);
  };

accountsApi.interceptors.request.use(attachToken);
authApi.interceptors.request.use(attachToken);
accountsApi.interceptors.response.use((response) => response, createUnauthorizedHandler(accountsApi));
authApi.interceptors.response.use((response) => response, createUnauthorizedHandler(authApi));

export const configureApiAuth = (handlers: {
  getToken: GetAccessToken;
  logout: LogoutHandler;
  setToken: SetAccessToken;
}) => {
  getAccessToken = handlers.getToken;
  onLogout = handlers.logout;
  setAccessToken = handlers.setToken;
};
