import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import { server } from "../../test/mocks/server";
import { WithdrawalModal } from "./WithdrawalModal";

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

describe("WithdrawalModal", () => {
  it("should_show_available_balance_in_form", () => {
    renderWithProviders(<WithdrawalModal account={account} isOpen onClose={() => undefined} />);
    expect(screen.getByText("$2,500.45")).toBeInTheDocument();
  });

  it("should_show_validation_error_when_amount_exceeds_balance", async () => {
    const user = userEvent.setup();
    renderWithProviders(<WithdrawalModal account={account} isOpen onClose={() => undefined} />);
    await user.clear(screen.getByLabelText(/monto/i));
    await user.type(screen.getByLabelText(/monto/i), "3000");
    await user.click(screen.getByRole("button", { name: /confirmar/i }));
    expect(await screen.findByText(/excede el saldo/i)).toBeInTheDocument();
  });

  it("should_show_422_error_from_backend_as_alert", async () => {
    server.use(
      http.post("http://localhost:8080/api/v1/accounts/:id/transactions/withdrawals", () =>
        HttpResponse.json({ detail: "Saldo insuficiente." }, { status: 422 })
      )
    );

    const user = userEvent.setup();
    renderWithProviders(<WithdrawalModal account={account} isOpen onClose={() => undefined} />);
    await user.clear(screen.getByLabelText(/monto/i));
    await user.type(screen.getByLabelText(/monto/i), "100");
    await user.click(screen.getByRole("button", { name: /confirmar/i }));
    expect(await screen.findByText(/saldo insuficiente/i)).toBeInTheDocument();
  });
});
