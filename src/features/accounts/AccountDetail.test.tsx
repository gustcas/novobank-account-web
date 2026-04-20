import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkeletonBlock } from "../../components/ui/Skeleton";
import { AccountDetail } from "./AccountDetail";

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

describe("AccountDetail", () => {
  it("should_render_account_balance_prominently", () => {
    render(<AccountDetail account={account} transactions={{ content: [], page: 0, totalPages: 0 }} onDeposit={() => undefined} onWithdraw={() => undefined} onTransfer={() => undefined} />);
    expect(screen.getByText("$2,500.45")).toBeInTheDocument();
  });

  it("should_render_transaction_history_table", () => {
    render(
      <AccountDetail
        account={account}
        transactions={{
          content: [
            {
              id: "tx-1",
              reference: "DEP-001",
              accountId: "acc-1",
              type: "DEPOSIT",
              amount: 300,
              status: "SUCCESS",
              createdAt: "2026-04-18T14:35:00.000Z"
            }
          ],
          page: 0,
          totalPages: 1
        }}
        onDeposit={() => undefined}
        onWithdraw={() => undefined}
        onTransfer={() => undefined}
      />
    );
    expect(screen.getAllByText("DEP-001").length).toBeGreaterThan(0);
  });

  it("should_show_skeleton_while_loading", () => {
    render(<SkeletonBlock className="h-40" />);
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("should_show_empty_state_when_no_transactions", () => {
    render(<AccountDetail account={account} transactions={{ content: [], page: 0, totalPages: 0 }} onDeposit={() => undefined} onWithdraw={() => undefined} onTransfer={() => undefined} />);
    expect(screen.getByText(/no hay transacciones/i)).toBeInTheDocument();
  });
});
