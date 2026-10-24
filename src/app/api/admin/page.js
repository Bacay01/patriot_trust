// src/app/admin/page.js
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/adminAuth";
import prisma from "@/lib/prisma";
import { ChevronRight } from "lucide-react";

function money(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export default async function AdminPanelPage() {
  // Protect: must be a valid admin
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  // Load all users + their accounts
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { accounts: true },
  });

  return (
    <main className="min-h-screen bg-grey-bg">
      {/* Admin top bar */}
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-bold">
            Patriot<span className="text-red">Trust</span> <span className="text-white/60">Admin</span>
          </span>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="rounded-full border border-white px-4 py-1.5 text-sm font-semibold hover:bg-white hover:text-navy"
            >
              Log out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-navy">Customers</h1>
        <p className="mt-1 text-sm text-text-grey">{users.length} total</p>

        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {users.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-text-grey">No customers yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((user) => {
                const totalBalance = user.accounts.reduce((sum, a) => sum + a.balance, 0);
                return (
                  <Link
                    key={user.id}
                    href={`/admin/users/${user.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-grey-bg"
                  >
                    <div>
                      <p className="text-sm font-semibold text-navy">{user.fullName}</p>
                      <p className="text-xs text-text-grey">
                        {user.email} · @{user.userId}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-navy">{money(totalBalance)}</span>
                      <ChevronRight className="h-4 w-4 text-text-grey" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}