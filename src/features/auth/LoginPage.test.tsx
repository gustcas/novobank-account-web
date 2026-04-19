import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse, delay } from "msw";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import { server } from "../../test/mocks/server";
import { LoginPage } from "./LoginPage";

describe("LoginPage", () => {
  it("should_render_email_and_password_fields", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByLabelText(/correo electronico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contrasena/i)).toBeInTheDocument();
  });

  it("should_show_validation_error_when_email_is_invalid", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByLabelText(/correo electronico/i), "invalid");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/correo valido/i)).toBeInTheDocument();
  });

  it("should_show_validation_error_when_password_is_too_short", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByLabelText(/correo electronico/i), "usuario@novobanco.com");
    await user.type(screen.getByLabelText(/contrasena/i), "123");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/al menos 8 caracteres/i)).toBeInTheDocument();
  });

  it("should_call_auth_service_with_credentials_on_submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByLabelText(/correo electronico/i), "usuario@novobanco.com");
    await user.type(screen.getByLabelText(/contrasena/i), "Password123!");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));
    await waitFor(() => expect(sessionStorage.getItem("novobank_refresh_token")).toBe("refresh-token"));
  });

  it("should_show_error_alert_when_login_fails_with_401", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByLabelText(/correo electronico/i), "usuario@novobanco.com");
    await user.type(screen.getByLabelText(/contrasena/i), "incorrecta");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText(/credenciales invalidas/i)).toBeInTheDocument();
  });

  it("should_redirect_to_dashboard_after_successful_login", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    );
    await user.type(screen.getByLabelText(/correo electronico/i), "usuario@novobanco.com");
    await user.type(screen.getByLabelText(/contrasena/i), "Password123!");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
  });

  it("should_disable_submit_button_while_loading", async () => {
    server.use(
      http.post("http://localhost:8081/api/v1/auth/login", async () => {
        await delay(200);
        return HttpResponse.json({
          accessToken: "access-token",
          refreshToken: "refresh-token",
          expiresIn: 300,
          user: {
            id: "user-1",
            email: "usuario@novobanco.com",
            fullName: "Juan Perez",
            customerId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
          }
        });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);
    await user.type(screen.getByLabelText(/correo electronico/i), "usuario@novobanco.com");
    await user.type(screen.getByLabelText(/contrasena/i), "Password123!");
    await user.click(screen.getByRole("button", { name: /ingresar/i }));
    await waitFor(() => expect(screen.getByRole("button", { name: /ingresar/i })).toBeDisabled());
  });
});
