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
  const authTarget = toTargetOrigin(env.VITE_AUTH_API_URL, "http://localhost:8081");
  const accountsTarget = toTargetOrigin(env.VITE_ACCOUNTS_API_URL, "http://localhost:8080");

  const configureProxyOrigin = (target: string) => (proxy: {
    on: (
      event: "proxyReq",
      handler: (proxyReq: { setHeader: (name: string, value: string) => void }) => void
    ) => void;
  }) => {
    proxy.on("proxyReq", (proxyReq) => {
      proxyReq.setHeader("origin", target);
      proxyReq.setHeader("referer", target);
    });
  };

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      allowedHosts: ["meal-roster-prozac-attributes.trycloudflare.com", ".trycloudflare.com"],
      proxy: {
        "/auth-api": {
          target: authTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth-api/, ""),
          configure: configureProxyOrigin(authTarget)
        },
        "/accounts-api": {
          target: accountsTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/accounts-api/, ""),
          configure: configureProxyOrigin(accountsTarget)
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
