import { describe, expect, it } from "vitest";
import { formatAccountNumber } from "./formatAccountNumber";

describe("formatAccountNumber", () => {
  it("should_mask_account_number_by_default", () => {
    expect(formatAccountNumber("1234567890123456")).toBe("****  ****  ****  3456");
  });

  it("should_show_full_number_when_masked_false", () => {
    expect(formatAccountNumber("1234567890123456", false)).toBe("1234 5678 9012 3456");
  });

  it("should_handle_short_account_numbers", () => {
    expect(formatAccountNumber("1234")).toBe("1234");
  });
});
