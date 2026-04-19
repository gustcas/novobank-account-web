import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("should_apply_accent_classes_for_ACTIVE_status", () => {
    render(<Badge variant="ACTIVE">Activa</Badge>);
    expect(screen.getByText("Activa")).toHaveClass("bg-accent/10");
  });

  it("should_apply_warning_styles_for_BLOCKED_status", () => {
    render(<Badge variant="BLOCKED">Bloqueada</Badge>);
    expect(screen.getByText("Bloqueada")).toHaveClass("bg-warning/10");
  });

  it("should_apply_neutral_styles_for_CLOSED_status", () => {
    render(<Badge variant="CLOSED">Cerrada</Badge>);
    expect(screen.getByText("Cerrada")).toHaveClass("bg-gray-100");
  });
});
