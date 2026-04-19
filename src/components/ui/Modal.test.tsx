import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("should_render_children_when_open_is_true", () => {
    render(
      <Modal isOpen title="Modal" onClose={vi.fn()}>
        <div>Contenido</div>
      </Modal>
    );
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });

  it("should_not_render_when_open_is_false", () => {
    render(
      <Modal isOpen={false} title="Modal" onClose={vi.fn()}>
        <div>Contenido</div>
      </Modal>
    );
    expect(screen.queryByText("Contenido")).not.toBeInTheDocument();
  });

  it("should_call_onClose_when_X_button_clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen title="Modal" onClose={onClose}>
        <div>Contenido</div>
      </Modal>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
