import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { MdAccountCircle } from "react-icons/md";
import { IoCart } from "react-icons/io5";

const AuthButton = async () => {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return (
    <div className="flex gap-5 items-center">
      <div className="flex flex-col items-center relative w-2/3 group">
        <div className="flex items-center gap-3 text-black hover:text-decor-olive-300 transition-colors cursor-default">
          <MdAccountCircle className="text-4xl" />
          <p className="text-2xl">Account</p>
        </div>
        <div className="hidden group-hover:flex flex-col bg-decor-olive-600 absolute top-[82%] w-full p-4 text-2xl z-20 shadow-xl">
          {user ? (
            <div className="w-full flex flex-col items-center gap-4">
              <Link
                href="/"
                className="text-decor-beige-100 hover:text-decor-olive-300 transition-colors"
              >
                Settings
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-4">
              <Link
                href="/auth/login"
                className="text-decor-beige-100 hover:text-decor-olive-300 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/auth/sign-up"
                className="text-decor-beige-100 hover:text-decor-olive-300 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
      <Link
        href="/auth/login"
        className="flex items-center gap-3 text-black hover:text-decor-olive-300 transition-colors"
      >
        <IoCart className="text-4xl" />
        <p className="text-2xl">Cart</p>
      </Link>
    </div>
  );
};

export default AuthButton;
