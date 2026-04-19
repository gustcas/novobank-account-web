import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AccountCard } from "./AccountCard";

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

describe("AccountCard", () => {
  it("should_render_masked_account_number", () => {
    render(
      <MemoryRouter>
        <AccountCard account={account} />
      </MemoryRouter>
    );
    expect(screen.getByText(/3456$/)).toBeInTheDocument();
  });

  it("should_display_balance_formatted_as_currency", () => {
    render(
      <MemoryRouter>
        <AccountCard account={account} />
      </MemoryRouter>
    );
    expect(screen.getByText("$2,500.45")).toBeInTheDocument();
  });

  it("should_render_accent_badge_for_ACTIVE_status", () => {
    render(
      <MemoryRouter>
        <AccountCard account={account} />
      </MemoryRouter>
    );
    expect(screen.getByText("Activa")).toHaveClass("bg-accent/10");
  });
});
