// src/app/dashboard/components/Header.js
import Link from "next/link";
import { signOut } from "@/auth";
import { Bell, HelpCircle, LogOut } from "lucide-react";

// A small server action we reuse for the logout button
async function doSignOut() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default function Header({ firstName }) {
  return (
    <>
      {/* ===== DESKTOP HEADER (hidden on mobile) ===== */}
      <header className="sticky top-0 z-20 hidden bg-navy text-white shadow-sm md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-extrabold">
            Bank Of America
          </span>

          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link href="/dashboard" className="hover:text-red">Accounts</Link>
            <Link href="#" className="text-white/80 hover:text-red">Transfers</Link>
            <Link href="#" className="text-white/80 hover:text-red">Bill Pay</Link>
            <Link href="#" className="text-white/80 hover:text-red">Profile</Link>
          </nav>

          <div className="flex items-center gap-5">
            <Bell className="h-5 w-5" />
            <HelpCircle className="h-5 w-5" />
            <span className="text-sm">Hi, {firstName}</span>
            <form action={doSignOut}>
              <button
                type="submit"
                className="rounded-full border border-white px-4 py-1.5 text-sm font-semibold hover:bg-white hover:text-navy"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ===== MOBILE HEADER (hidden on desktop) ===== */}
      <header className="sticky top-0 z-20 bg-white shadow-sm md:hidden">
        <div className="grid grid-cols-3 items-center px-4 py-3">
          {/* Left: notifications */}
          <div className="flex items-center gap-4 text-red">
            <Bell className="h-5 w-5" />
            <HelpCircle className="h-5 w-5" />
          </div>

          {/* Center: BOA logo */}
          <span className="text-center text-xl font-extrabold text-navy">
                    B<span className="text-red">O</span>A
          </span>

          {/* Right: logout */}
          <div className="flex items-center justify-end text-red">
            <form action={doSignOut}>
              <button type="submit" aria-label="Log out">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </header>
    </>
  );
}
