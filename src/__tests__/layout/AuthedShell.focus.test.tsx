/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { usePathname } from "next/navigation";

// RRM-003 AC-103/104 (R-010): the collapsed-breakpoint drawer moves focus in,
// contains Tab, closes on Escape and returns focus to its trigger; a PBM picker
// nested inside closes first on Escape (A-06).

jest.mock("@/components/global/Navbar", () => ({
  __esModule: true,
  default: () => <div data-testid="navbar" />,
}));
// The sidebar hosts a real MultiSelect so the nested-Escape order is exercised
// against the real picker.
jest.mock("@/components/layout/AdminSidebar", () => {
  const MultiSelect = jest.requireActual("@/components/common/MultiSelect").default;
  const { useState } = jest.requireActual("react");
  const Sidebar = () => {
    const [selected, setSelected] = useState([] as string[]);
    return (
      <div data-testid="sidebar-content">
        <MultiSelect options={["Caremark", "OptumRx"]} selected={selected} onChange={setSelected} />
        <button type="button">Apply</button>
      </div>
    );
  };
  return { __esModule: true, default: Sidebar };
});
jest.mock("@/components/owedbook/OwedBookContext", () => ({
  useOwedBook: () => ({
    appliedTick: 0,
    filters: { pbms: [] },
    pbmOptions: [],
    applyFilters: () => {},
    clearFilters: () => {},
  }),
}));

import AuthedShell from "@/components/layout/AuthedShell";
import { AppRole } from "@/utils/app-role";
import type { User as SupabaseUser } from "@supabase/auth-js";

const mockUsePathname = usePathname as jest.Mock;
const tony = { email: "tony@stark.com" } as SupabaseUser;

const renderShell = () => {
  mockUsePathname.mockReturnValue("/owedbook");
  return render(
    <AuthedShell user={tony} role={AppRole.MEMBER}>
      <p>main</p>
    </AuthedShell>,
  );
};

const openDrawer = () => {
  const trigger = screen.getByRole("button", { name: "Open Filters" });
  fireEvent.click(trigger);
  return { trigger, drawer: screen.getByTestId("sidebar-drawer") };
};

describe("AuthedShell drawer focus management (AC-103)", () => {
  it("on mount nothing moves focus and nothing is inert (desktop rail untouched)", () => {
    const { container } = renderShell();
    expect(document.activeElement).toBe(document.body);
    expect(container.querySelector("[inert]")).toBeNull();
  });

  it("opening moves focus to the first control inside the drawer (Close)", () => {
    renderShell();
    openDrawer();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close" }));
  });

  it("Tab from the last control wraps to the first; Shift-Tab from the first wraps to the last", async () => {
    const user = userEvent.setup();
    renderShell();
    const { drawer } = openDrawer();
    const close = screen.getByRole("button", { name: "Close" });
    const buttons = drawer.querySelectorAll("button");
    const last = buttons[buttons.length - 1];

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(last);
    await user.tab();
    expect(document.activeElement).toBe(close);
  });

  it("Escape closes the drawer and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderShell();
    const { trigger } = openDrawer();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("closing via the Close button or the backdrop also returns focus to the trigger", () => {
    renderShell();
    const { trigger } = openDrawer();
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(document.activeElement).toBe(trigger);

    openDrawer();
    fireEvent.click(screen.getByRole("dialog").querySelector("[aria-hidden]")!);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("body scroll lock is unchanged: hidden while open, cleared on close", () => {
    renderShell();
    openDrawer();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(document.body.style.overflow).toBe("");
  });

  it("an Escape already defaultPrevented by an inner handler leaves the drawer open (A-06 guard)", () => {
    renderShell();
    openDrawer();
    const preventEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.preventDefault();
    };
    document.addEventListener("keydown", preventEscape, true);
    fireEvent.keyDown(document.body, { key: "Escape" });
    document.removeEventListener("keydown", preventEscape, true);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("Nested Escape: PBM picker inside the drawer (AC-104)", () => {
  it("Escape #1 closes only the picker; Escape #2 closes the drawer and focuses its trigger", async () => {
    const user = userEvent.setup();
    renderShell();
    const { trigger, drawer } = openDrawer();
    // A second sidebar instance lives in the (hidden) desktop rail — scope to the drawer.
    const picker = within(drawer).getByTestId("multiselect-trigger");

    fireEvent.click(picker);
    expect(within(drawer).getByTestId("multiselect-panel")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByTestId("multiselect-panel")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.activeElement).toBe(picker);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });
});
