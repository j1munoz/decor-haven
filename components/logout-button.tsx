"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();

    // Remove user ID from localStorage
    localStorage.removeItem("userId");

    // Redirect to login page
    router.push("/auth/login");
  };

  return (
    <div className="w-full text-decor-beige-100 hover:text-decor-olive-300 transition-colors text-center text-2xl">
      <button onClick={logout}>Logout</button>
    </div>
  );
}
