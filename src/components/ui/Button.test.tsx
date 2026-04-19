import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("should_render_label_correctly", () => {
    render(<Button>Ingresar</Button>);
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });

  it("should_show_spinner_when_isLoading_is_true", () => {
    render(<Button isLoading>Guardar</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should_be_disabled_when_disabled_prop_is_true", () => {
    render(<Button disabled>Guardar</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should_call_onClick_when_clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Acción</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should_apply_accent_classes_for_accent_variant", () => {
    render(<Button variant="accent">Acción</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-accent");
  });
});
