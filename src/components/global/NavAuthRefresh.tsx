"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

// Nav identity is server-resolved props, so the ONLY client job left is
// reactivity: when auth changes in another tab (or this one), re-render the
// server layout so the public nav flips state. Renders nothing.
const NavAuthRefresh = () => {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh();
      }
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return null;
};

export default NavAuthRefresh;
