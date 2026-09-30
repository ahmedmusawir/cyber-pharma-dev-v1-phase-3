"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/auth-js";
import Navbar from "@/components/global/Navbar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { useOwedBook } from "@/components/owedbook/OwedBookContext";
import type { AppRole } from "@/utils/app-role";

// Authed chrome (Rule Zero — mobile-correct from the start). Desktop (lg+):
// fixed sidebar column, identical to the prior shell. Below lg (tablet + phone):
// the column is hidden and a trigger opens a left slide-over holding the same
// AdminSidebar (nav items on /admin-portal, filter rail on /owedbook).
// user/role come from the server layout's protectPage — forwarded to the Navbar
// so nav identity is server-truth (no client fetch window).
// Tabbable candidates inside the drawer; filtered by tabIndex at use (drops
// tabindex=-1 helpers such as Radix's hidden native <select>).
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]';

interface AuthedShellProps {
  user: SupabaseUser;
  role: AppRole;
  children: ReactNode;
}

const AuthedShell = ({ user, role, children }: AuthedShellProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const pathname = usePathname() ?? "";
  // /owedbook's filter rail is wide (KPI row + wide table) → it stays
  // two-column only at xl+ and collapses to the drawer below xl. /admin-portal's
  // narrow nav rail collapses at lg. (Full literal classes so Tailwind keeps them.)
  const onOwedbook = pathname.startsWith("/owedbook");
  const triggerLabel = onOwedbook ? "Filters" : "Menu";
  const sidebarVisible = onOwedbook ? "hidden xl:block" : "hidden lg:block";
  const collapsedBelow = onOwedbook ? "xl:hidden" : "lg:hidden";

  // appliedTick bumps whenever filters are applied/cleared (OwedBook surface;
  // default 0 on /admin-portal where there's no provider).
  const { appliedTick } = useOwedBook();

  // Close the drawer on navigation OR on filter apply/clear — otherwise the open
  // drawer covers the freshly-filtered results.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname, appliedTick]);

  // Escape to close + lock body scroll while the drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return; // a nested picker already handled it (A-06)
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Focus management (R-010): on open, move focus to the first control inside
  // the drawer; on close (any path), return it to the trigger that opened it.
  useEffect(() => {
    if (drawerOpen) {
      wasOpen.current = true;
      tabbables(drawerRef.current)[0]?.focus();
    } else if (wasOpen.current) {
      wasOpen.current = false;
      if (triggerRef.current?.isConnected) triggerRef.current.focus();
    }
  }, [drawerOpen]);

  // Contain Tab/Shift-Tab inside the open drawer (wrap at the ends). Acts only
  // when focus sits on the first/last control, so focus in a portal is left alone.
  const onDrawerKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const items = tabbables(drawerRef.current);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} role={role} />

      {/* Mobile sidebar trigger (< lg) */}
      <div className={`${collapsedBelow} border-b border-border px-4 py-2`}>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={`Open ${triggerLabel}`}
          aria-expanded={drawerOpen}
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
        >
          <Menu className="h-5 w-5" />
          {triggerLabel}
        </button>
      </div>

      <section className="flex flex-1">
        {/* Desktop fixed sidebar (lg+) — same box as before */}
        <div
          data-testid="desktop-sidebar"
          className={`${sidebarVisible} h-auto flex-shrink-0 border-4 w-[25rem]`}
        >
          <AdminSidebar />
        </div>
        {/* min-w-0: let the main column shrink to the viewport so wide content
            (e.g. the tab strip) scrolls internally instead of overflowing the
            page horizontally (which made the navbar look "cut short"). */}
        <div className="flex-grow min-w-0">{children}</div>
      </section>

      {/* Mobile slide-over drawer (< lg) */}
      {drawerOpen && (
        <div className={`${collapsedBelow} fixed inset-0 z-50`} role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          {/* Drawer width: 75% of viewport on phone (< md), 50% on tablet (md–<lg). */}
          <div
            ref={drawerRef}
            onKeyDown={onDrawerKeyDown}
            data-testid="sidebar-drawer"
            className="absolute inset-y-0 left-0 w-3/4 md:w-1/2 bg-secondary shadow-xl overflow-y-auto"
          >
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close"
                className="p-2 text-foreground hover:opacity-80"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AdminSidebar />
          </div>
        </div>
      )}
    </div>
  );
};

function tabbables(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.tabIndex >= 0,
  );
}

export default AuthedShell;
