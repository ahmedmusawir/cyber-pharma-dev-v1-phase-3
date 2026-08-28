/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import type { User as SupabaseUser } from "@supabase/auth-js";

jest.mock("@/store/useAuthStore", () => ({
  useAuthStore: Object.assign(jest.fn(), {
    getState: () => ({ logout: jest.fn().mockResolvedValue(undefined) }),
  }),
}));

import UserMenu from "@/components/global/UserMenu";
import { AppRole } from "@/utils/app-role";

const tony = { email: "tony@stark.com" } as SupabaseUser;

// KIP-2 kill contract: identity is server-passed as props — the avatar (or the
// logged-out links) must be correct on the FIRST synchronous render, with no
// client fetch, no loading null-window, and no persisted-store role read.
describe("UserMenu (props-resolved identity)", () => {
  it("logged-out visitor gets Log in / Start free trial, no avatar", () => {
    render(<UserMenu user={null} role={null} />);
    expect(screen.getByText("Log in")).toHaveAttribute("href", "/auth");
    expect(screen.getByText("Start free trial")).toBeInTheDocument();
    expect(screen.queryByText("T")).not.toBeInTheDocument();
  });

  it("authenticated user renders the avatar synchronously, no auth links", () => {
    render(<UserMenu user={tony} role={AppRole.MEMBER} />);
    expect(screen.getByText("T")).toBeInTheDocument(); // avatar fallback
    expect(screen.queryByText("Log in")).not.toBeInTheDocument();
    expect(screen.queryByText("Start free trial")).not.toBeInTheDocument();
  });

  // jsdom has no real pointer events; Radix triggers open reliably on keyboard.
  const openDropdown = () =>
    fireEvent.keyDown(screen.getByRole("button", { name: "T" }), {
      key: "Enter",
    });

  it("ADMIN dropdown carries email, role label, and the Admin portal link", () => {
    render(<UserMenu user={tony} role={AppRole.ADMIN} />);
    openDropdown();
    expect(screen.getByText("tony@stark.com")).toBeInTheDocument();
    expect(screen.getByText(AppRole.ADMIN)).toBeInTheDocument();
    expect(screen.getByText("Admin portal")).toHaveAttribute("href", "/admin-portal");
  });

  it("MEMBER dropdown routes to OwedBook, never the Admin portal", () => {
    render(<UserMenu user={tony} role={AppRole.MEMBER} />);
    openDropdown();
    expect(screen.getByText("OwedBook")).toHaveAttribute("href", "/owedbook");
    expect(screen.queryByText("Admin portal")).not.toBeInTheDocument();
  });
});
