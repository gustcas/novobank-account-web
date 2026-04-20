import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { authService } from "../../services/auth.service";
import { configureApiAuth } from "../../services/api";
import { balanceVisibilityStorage, refreshTokenStorage, selectedAccountStorage } from "../../utils/storage";
import type { LoginRequest, User } from "../../types/auth.types";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const WARNING_TIMEOUT = 4 * 60 * 1000;
const LOGOUT_TIMEOUT = 5 * 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const accessTokenRef = useRef<string | null>(null);
  const warningTimerRef = useRef<number | null>(null);
  const logoutTimerRef = useRef<number | null>(null);

  const resetTimers = () => {
    if (warningTimerRef.current) {
      window.clearTimeout(warningTimerRef.current);
    }
    if (logoutTimerRef.current) {
      window.clearTimeout(logoutTimerRef.current);
    }

    if (!accessToken) {
      return;
    }

    warningTimerRef.current = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("novobank:session-warning"));
    }, WARNING_TIMEOUT);

    logoutTimerRef.current = window.setTimeout(() => {
      void logout();
    }, LOGOUT_TIMEOUT);
  };

  const setAccessToken = (token: string | null) => {
    accessTokenRef.current = token;
    setAccessTokenState(token);
  };

  const logout = async () => {
    try {
      if (accessTokenRef.current) {
        await authService.logout();
      }
    } catch {
      // Logout must always clear local auth state.
    } finally {
      setUser(null);
      setAccessToken(null);
      refreshTokenStorage.clear();
      selectedAccountStorage.clearAll();
      balanceVisibilityStorage.clearAll();
    }
  };

  const login = async (payload: LoginRequest) => {
    const response = await authService.login(payload);
    setUser(response.user);
    setAccessToken(response.accessToken);
    refreshTokenStorage.set(response.refreshToken);
  };

  useEffect(() => {
    configureApiAuth({
      getToken: () => accessTokenRef.current,
      logout: () => {
        void logout();
      },
      setToken: setAccessToken
    });
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      const refreshToken = refreshTokenStorage.get();
      if (!refreshToken) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const refreshed = await authService.refresh(refreshToken);
        setAccessToken(refreshed.accessToken);
        const currentUser = await authService.me();
        setUser(currentUser);
      } catch {
        refreshTokenStorage.clear();
      } finally {
        setIsBootstrapping(false);
      }
    };

    void bootstrap();
  }, []);

  useEffect(() => {
    const handleActivity = () => resetTimers();

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    resetTimers();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [accessToken]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: Boolean(accessToken && user),
      isBootstrapping,
      login,
      logout,
      setAccessToken
    }),
    [user, accessToken, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
