"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { User as SupabaseUser } from "@supabase/auth-js";
import { useAuthStore } from "@/store/useAuthStore";
import { AppRole } from "@/utils/app-role";

const marketingLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

// Identity is SERVER-RESOLVED and passed as props (Navbar Law — KIP-2 kill):
// no client auth fetch, no persisted-store role read, no loading window. The
// store appears below ONLY as the logout action, mirroring the cured Navbar.
interface MobileNavProps {
  user: SupabaseUser | null;
  role: AppRole | null;
}

const MobileNav = ({ user, role }: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const close = () => setOpen(false);

  const handleLogout = async () => {
    close();
    try {
      await useAuthStore.getState().logout();
      router.refresh();
      router.push("/auth");
    } catch {
      console.error("Failed to log out");
    }
  };

  const portalHref = role === AppRole.ADMIN ? "/admin-portal" : "/owedbook";
  const portalLabel = role === AppRole.ADMIN ? "Admin portal" : "OwedBook";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="p-2 text-foreground hover:bg-accent/10 transition-colors"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {open && (
        <div
          className="absolute top-[84px] left-0 right-0 bg-card border-b-2 border-border shadow-lg z-50"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col">
            {marketingLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="uppercase text-xs font-bold tracking-wide px-7 py-4 text-foreground hover:bg-accent/10 border-b border-border transition-colors"
              >
                {label}
              </Link>
            ))}

            {user && (
              <>
                <Link
                  href={portalHref}
                  onClick={close}
                  className="uppercase text-xs font-bold tracking-wide px-7 py-4 text-foreground hover:bg-accent/10 border-b border-border transition-colors"
                >
                  {portalLabel}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="uppercase text-xs font-bold tracking-wide px-7 py-5 bg-secondary text-secondary-foreground hover:bg-secondary/80 text-left transition-colors"
                >
                  Log out
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  href="/auth"
                  onClick={close}
                  className="uppercase text-xs font-bold tracking-wide px-7 py-4 text-foreground hover:bg-accent/10 border-b border-border transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/auth?tab=register"
                  onClick={close}
                  className="uppercase text-xs font-bold tracking-wide px-7 py-5 bg-primary text-primary-foreground text-center hover:bg-primary/90 transition-colors"
                >
                  Start free trial
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileNav;
