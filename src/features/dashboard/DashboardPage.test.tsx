import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders summary cards and recent transactions", async () => {
    sessionStorage.setItem("novobank_refresh_token", "refresh-token");
    renderWithProviders(<DashboardPage />);
    expect((await screen.findAllByText("DEP-001")).length).toBeGreaterThan(0);
  });
});
