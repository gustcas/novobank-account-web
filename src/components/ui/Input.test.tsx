import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("should_render_label_and_placeholder", () => {
    render(<Input label="Correo" placeholder="usuario@novobanco.com" />);
    expect(screen.getByLabelText("Correo")).toHaveAttribute("placeholder", "usuario@novobanco.com");
  });

  it("should_display_error_message_when_error_prop_provided", () => {
    render(<Input label="Correo" error="Campo requerido" />);
    expect(screen.getByText("Campo requerido")).toBeInTheDocument();
  });

  it("should_call_onChange_on_user_input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input label="Correo" onChange={onChange} />);
    await user.type(screen.getByLabelText("Correo"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("should_apply_accent_focus_ring_classes", () => {
    render(<Input label="Correo" />);
    expect(screen.getByLabelText("Correo")).toHaveClass("focus:ring-accent");
  });
});
