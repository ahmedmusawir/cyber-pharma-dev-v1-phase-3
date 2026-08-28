/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { User as SupabaseUser } from "@supabase/auth-js";

const mockLogout = jest.fn().mockResolvedValue(undefined);
jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: Object.assign(jest.fn(), {
    getState: () => ({ logout: mockLogout }),
  }),
}));

import MobileNav from "@/components/global/MobileNav";
import { AppRole } from "@/utils/app-role";

const tony = { email: "tony@stark.com" } as SupabaseUser;

// KIP-2 kill contract: identity is server-passed as props — the panel's
// role-gated rows must be correct on the FIRST synchronous render, with no
// client fetch, no loading window, and no persisted-store role read.
describe("MobileNav (props-resolved identity)", () => {
  const openMenu = () =>
    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

  it("logged-out visitor gets Log in / Start free trial, no account rows", () => {
    render(<MobileNav user={null} role={null} />);
    openMenu();
    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.getByText("Start free trial")).toBeInTheDocument();
    expect(screen.queryByText("Log out")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin portal")).not.toBeInTheDocument();
  });

  it("ADMIN gets the Admin portal row synchronously", () => {
    render(<MobileNav user={tony} role={AppRole.ADMIN} />);
    openMenu();
    const portal = screen.getByText("Admin portal");
    expect(portal).toHaveAttribute("href", "/admin-portal");
    expect(screen.getByText("Log out")).toBeInTheDocument();
    expect(screen.queryByText("Log in")).not.toBeInTheDocument();
  });

  it("MEMBER gets the OwedBook row, never Admin portal", () => {
    render(<MobileNav user={tony} role={AppRole.MEMBER} />);
    openMenu();
    const portal = screen.getByText("OwedBook");
    expect(portal).toHaveAttribute("href", "/owedbook");
    expect(screen.queryByText("Admin portal")).not.toBeInTheDocument();
  });

  it("Log out invokes the store logout action (the one sanctioned store use)", () => {
    render(<MobileNav user={tony} role={AppRole.MEMBER} />);
    openMenu();
    fireEvent.click(screen.getByText("Log out"));
    expect(mockLogout).toHaveBeenCalled();
  });
});
