import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

describe("TransactionStatusBadge", () => {
  it("renders a success badge for completed transactions", () => {
    render(<TransactionStatusBadge status="SUCCESS" />);
    expect(screen.getByText(/completada/i)).toBeInTheDocument();
  });
});
