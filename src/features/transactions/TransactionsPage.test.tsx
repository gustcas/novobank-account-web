import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import { TransactionsPage } from "./TransactionsPage";

describe("TransactionsPage", () => {
  it("renders the transactions table for the selected account", async () => {
    sessionStorage.setItem("novobank_refresh_token", "refresh-token");
    renderWithProviders(<TransactionsPage />);
    expect(await screen.findByRole("heading", { name: /transacciones/i })).toBeInTheDocument();
    expect((await screen.findAllByText("DEP-001")).length).toBeGreaterThan(0);
  });
});
