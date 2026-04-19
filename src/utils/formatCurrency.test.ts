import { describe, expect, it } from "vitest";
import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  it("should_format_positive_amount_correctly", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  it("should_format_zero_as_currency", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("should_handle_large_amounts", () => {
    expect(formatCurrency(9999999.99)).toBe("$9,999,999.99");
  });
});
