import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import { TransferModal } from "./TransferModal";

const accounts = [
  {
    id: "acc-1",
    accountNumber: "1234567890123456",
    type: "SAVINGS" as const,
    balance: 2500.45,
    currency: "USD",
    status: "ACTIVE" as const,
    customerId: "customer-1",
    createdAt: "2026-04-18T14:35:00.000Z"
  },
  {
    id: "acc-2",
    accountNumber: "1111222233334444",
    type: "CHECKING" as const,
    balance: 980.1,
    currency: "USD",
    status: "ACTIVE" as const,
    customerId: "customer-1",
    createdAt: "2026-04-18T14:35:00.000Z"
  }
];

describe("TransferModal", () => {
  it("should_render_source_and_destination_account_selectors", () => {
    renderWithProviders(<TransferModal accounts={accounts} isOpen onClose={() => undefined} />);
    expect(screen.getByLabelText(/cuenta origen/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cuenta destino/i)).toBeInTheDocument();
  });

  it("should_disable_submit_when_source_equals_destination", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TransferModal accounts={accounts} isOpen onClose={() => undefined} />);
    await user.selectOptions(screen.getByLabelText(/cuenta destino/i), "acc-1");
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    expect(await screen.findByText(/deben ser distintas/i)).toBeInTheDocument();
  });

  it("should_close_modal_after_successful_transfer", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<TransferModal accounts={accounts} isOpen onClose={onClose} />);
    await user.selectOptions(screen.getByLabelText(/cuenta origen/i), "acc-1");
    await user.selectOptions(screen.getByLabelText(/cuenta destino/i), "acc-2");
    await user.clear(screen.getByLabelText(/monto/i));
    await user.type(screen.getByLabelText(/monto/i), "150");
    await user.click(screen.getByRole("button", { name: /continuar/i }));
    await user.click(screen.getByRole("button", { name: /confirmar/i }));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
