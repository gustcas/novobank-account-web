import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import { RegisterPage } from "./RegisterPage";

describe("RegisterPage", () => {
  it("should_render_registration_fields", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electronico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password123!")).toBeInTheDocument();
  });

  it("should_redirect_to_login_after_successful_registration", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/login" element={<div>Login listo</div>} />
      </Routes>
    );

    await user.type(screen.getByLabelText(/nombre completo/i), "Juan Perez");
    await user.type(screen.getByLabelText(/correo electronico/i), "juan.perez@novobanco.com");
    await user.type(screen.getByPlaceholderText("Password123!"), "Password123!");
    await user.click(screen.getByRole("button", { name: /registrarme/i }));

    expect(await screen.findByText("Login listo")).toBeInTheDocument();
  });
});
