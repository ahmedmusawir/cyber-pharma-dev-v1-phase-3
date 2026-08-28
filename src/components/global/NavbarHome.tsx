import Image from "next/image";
import Link from "next/link";
import { User as SupabaseUser } from "@supabase/auth-js";
import MobileNav from "./MobileNav";
import NavAuthRefresh from "./NavAuthRefresh";
import ThemeToggler from "./ThemeToggler";
import UserMenu from "./UserMenu";
import { AppRole } from "@/utils/app-role";

// Identity arrives server-resolved from (public)/layout.tsx (Navbar Law: props,
// never client-persisted state). Both may be null — logged-out visitors are a
// first-class state on the public nav.
interface NavbarHomeProps {
  user: SupabaseUser | null;
  role: AppRole | null;
}

const NavbarHome = ({ user, role }: NavbarHomeProps) => {
  return (
    <header className="relative flex items-center h-[84px] border-b-2 border-border px-7">
      <Link href="/" className="flex items-center" aria-label="Cyber Pharma — Home">
        <Image
          src="/brand/logo-lockup.svg"
          alt="Cyber Pharma"
          width={180}
          height={34}
          priority
        />
      </Link>

      <nav className="ml-auto hidden lg:flex items-center h-full text-xs font-semibold tracking-wide">
        <Link
          href="#features"
          className="uppercase px-5 h-full flex items-center text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
        >
          Features
        </Link>
        <Link
          href="#how-it-works"
          className="uppercase px-5 h-full flex items-center text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
        >
          How it works
        </Link>
        <Link
          href="#pricing"
          className="uppercase px-5 h-full flex items-center text-muted-foreground hover:bg-accent/10 hover:text-foreground transition-colors"
        >
          Pricing
        </Link>
        <ThemeToggler />
        <UserMenu user={user} role={role} />
      </nav>

      <div className="ml-auto flex items-center lg:hidden">
        <ThemeToggler />
        <MobileNav user={user} role={role} />
      </div>

      {/* Single cross-tab listener — both nav variants are always mounted
          (CSS-hidden), so the listener lives once up here, not per component. */}
      <NavAuthRefresh />
    </header>
  );
};

export default NavbarHome;
