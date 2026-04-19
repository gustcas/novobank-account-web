import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/test-utils";
import { TransferPage } from "./TransferPage";

describe("TransferPage", () => {
  it("opens the transfer modal from the primary action", async () => {
    const user = userEvent.setup();
    sessionStorage.setItem("novobank_refresh_token", "refresh-token");
    renderWithProviders(<TransferPage />);
    await user.click(await screen.findByRole("button", { name: /nueva transferencia/i }));
    expect(await screen.findByText(/^Transferencia$/)).toBeInTheDocument();
  });
});
