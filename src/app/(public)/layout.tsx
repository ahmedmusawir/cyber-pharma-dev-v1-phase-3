import { ReactNode } from "react";
import NavbarHome from "@/components/global/NavbarHome";
import Main from "@/components/common/Main";
import { createClient } from "@/utils/supabase/server";
import { getUserRole } from "@/utils/get-user-role";

// Identity is SERVER-RESOLVED here, redirect-free (logged-out visitors are
// legitimate on the public group — protectPage would bounce them, so we resolve
// by hand): user may be null, and role comes from user_roles (DB is role truth),
// never from client-persisted state. Passed as props so the public nav can't
// render stale role-gated UI (KIP-2).
export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user ?? null;
  const role = user ? await getUserRole(user.id) : null;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavbarHome user={user} role={role} />
        <Main className="flex flex-col">
          {children
            ? children
            : "This is a Layout container. Must have children"}
        </Main>
      </div>
    </>
  );
}
