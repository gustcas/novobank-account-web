import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import { AccountsPage } from "./AccountsPage";

describe("AccountsPage", () => {
  it("renders the accounts table and primary action", async () => {
    sessionStorage.setItem("novobank_refresh_token", "refresh-token");
    renderWithProviders(<AccountsPage />);
    expect(await screen.findByText("Nueva Cuenta")).toBeInTheDocument();
    expect((await screen.findAllByText("Ahorros")).length).toBeGreaterThan(0);
  });
});
