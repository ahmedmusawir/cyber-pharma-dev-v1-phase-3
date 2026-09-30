/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import MultiSelect from "@/components/common/MultiSelect";

// RRM-003 AC-104 (R-010): the PBM picker moves focus in, keeps Tab inside the
// panel, and Escape closes it and returns focus to the trigger.

const options = ["AssistRx", "Caremark", "OptumRx"];

const openPicker = () => {
  fireEvent.click(screen.getByTestId("multiselect-trigger"));
  return screen.getByTestId("multiselect-panel");
};

describe("MultiSelect focus management (AC-104)", () => {
  it("opening the panel focuses the search input", () => {
    render(<MultiSelect options={options} selected={[]} onChange={() => {}} />);
    openPicker();
    expect(document.activeElement).toBe(screen.getByPlaceholderText("Search..."));
  });

  it("Tab from the last control wraps to the search input; Shift-Tab wraps back", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} selected={[]} onChange={() => {}} />);
    openPicker();
    const search = screen.getByPlaceholderText("Search...");
    const lastBox = screen.getByLabelText("OptumRx");

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(lastBox);
    await user.tab();
    expect(document.activeElement).toBe(search);
  });

  it("Tab never leaves the panel", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <MultiSelect options={options} selected={["Caremark"]} onChange={() => {}} />
        <button type="button">after</button>
      </div>,
    );
    const panel = openPicker();
    for (let i = 0; i < 8; i++) {
      await user.tab();
      expect(panel).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it("Escape closes the panel and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<MultiSelect options={options} selected={[]} onChange={() => {}} />);
    openPicker();
    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("multiselect-panel")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(screen.getByTestId("multiselect-trigger"));
  });

  // A-06: an enclosing drawer skips Escape events already defaultPrevented.
  it("Escape is marked handled (defaultPrevented) for enclosing listeners", () => {
    render(<MultiSelect options={options} selected={[]} onChange={() => {}} />);
    openPicker();
    // fireEvent returns false when the event's default was prevented.
    const notPrevented = fireEvent.keyDown(screen.getByPlaceholderText("Search..."), {
      key: "Escape",
    });
    expect(notPrevented).toBe(false);
    expect(screen.queryByTestId("multiselect-panel")).not.toBeInTheDocument();
  });

  it("click-outside still closes without pulling focus to the trigger", () => {
    render(
      <div>
        <MultiSelect options={options} selected={[]} onChange={() => {}} />
        <div data-testid="outside">outside</div>
      </div>,
    );
    openPicker();
    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByTestId("multiselect-panel")).not.toBeInTheDocument();
    expect(document.activeElement).not.toBe(screen.getByTestId("multiselect-trigger"));
  });
});
