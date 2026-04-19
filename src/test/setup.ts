import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";
import { vi } from "vitest";
import { server } from "./mocks/server";

vi.stubEnv("VITE_AUTH_API_URL", "http://localhost:8081");
vi.stubEnv("VITE_ACCOUNTS_API_URL", "http://localhost:8080");

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  sessionStorage.clear();
});
afterAll(() => server.close());
