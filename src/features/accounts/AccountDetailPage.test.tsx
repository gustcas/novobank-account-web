import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import { AccountDetailPage } from "./AccountDetailPage";

describe("AccountDetailPage", () => {
  it("renders account balance and transaction history", async () => {
    renderWithProviders(
      <Routes>
        <Route path="/accounts/:id" element={<AccountDetailPage />} />
      </Routes>,
      ["/accounts/acc-1"]
    );

    expect(await screen.findByText("$2,500.45")).toBeInTheDocument();
    expect(await screen.findByText("DEP-001")).toBeInTheDocument();
  });
});
