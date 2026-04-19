import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const toTargetOrigin = (rawUrl: string | undefined, fallback: string) => {
  const sanitized = (rawUrl ?? "").trim().replace(/^["']|["']$/g, "");

  if (!sanitized) {
    return fallback;
  }

  try {
    return new URL(sanitized).origin;
  } catch {
    return fallback;
  }
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/auth-api": {
          target: toTargetOrigin(env.VITE_AUTH_API_URL, "http://localhost:8081"),
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth-api/, "")
        },
        "/accounts-api": {
          target: toTargetOrigin(env.VITE_ACCOUNTS_API_URL, "http://localhost:8080"),
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/accounts-api/, "")
        }
      }
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.test.{ts,tsx}"],
      exclude: ["tests/e2e/**"],
      coverage: {
        provider: "v8",
        reporter: ["text", "lcov"],
        exclude: ["src/test/**", "src/types/**", "src/utils/**"]
      }
    }
  };
});
