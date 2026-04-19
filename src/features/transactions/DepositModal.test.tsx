import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import { server } from "../../test/mocks/server";
import { DepositModal } from "./DepositModal";

const account = {
  id: "acc-1",
  accountNumber: "1234567890123456",
  type: "SAVINGS" as const,
  balance: 2500.45,
  currency: "USD",
  status: "ACTIVE" as const,
  customerId: "customer-1",
  createdAt: "2026-04-18T14:35:00.000Z"
};

describe("DepositModal", () => {
  it("should_render_amount_input_field", () => {
    renderWithProviders(<DepositModal account={account} isOpen onClose={() => undefined} />);
    expect(screen.getByLabelText(/monto/i)).toBeInTheDocument();
  });

  it("should_show_validation_error_for_zero_amount", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DepositModal account={account} isOpen onClose={() => undefined} />);
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    expect(await screen.findByText(/mayor a cero/i)).toBeInTheDocument();
  });

  it("should_show_confirmation_step_before_submitting", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DepositModal account={account} isOpen onClose={() => undefined} />);
    await user.clear(screen.getByLabelText(/monto/i));
    await user.type(screen.getByLabelText(/monto/i), "100");
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    expect(await screen.findByText(/confirma el depósito/i)).toBeInTheDocument();
  });

  it("should_show_success_message_after_deposit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DepositModal account={account} isOpen onClose={() => undefined} />);
    await user.clear(screen.getByLabelText(/monto/i));
    await user.type(screen.getByLabelText(/monto/i), "100");
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    await user.click(screen.getByRole("button", { name: /confirmar/i }));
    expect(await screen.findByText(/depósito completado/i)).toBeInTheDocument();
  });

  it("should_show_error_detail_from_problem_details_on_422", async () => {
    server.use(
      http.post("http://localhost:8080/api/v1/accounts/:id/transactions/deposits", () =>
        HttpResponse.json({ detail: "Monto inválido desde backend." }, { status: 422 })
      )
    );

    const user = userEvent.setup();
    renderWithProviders(<DepositModal account={account} isOpen onClose={() => undefined} />);
    await user.clear(screen.getByLabelText(/monto/i));
    await user.type(screen.getByLabelText(/monto/i), "100");
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    await user.click(screen.getByRole("button", { name: /confirmar/i }));
    expect(await screen.findByText(/monto inválido desde backend/i)).toBeInTheDocument();
  });
});
