// src/app/admin/users/[userId]/page.js
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminSession } from "@/lib/adminAuth";
import prisma from "@/lib/prisma";
import AccountAdmin from "./AccountAdmin";
import ResetCredentials from "./ResetCredentials";
  import DeleteUser from "./DeleteUser";

export default async function AdminUserPage({ params }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
 
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: {
        orderBy: { type: "asc" },
        include: { transactions: { orderBy: { createdAt: "desc" } } },
      },
    },
  });

  if (!user) notFound();

  return (
    <main className="min-h-screen bg-grey-bg">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-1 text-sm hover:text-red">
            <ArrowLeft className="h-5 w-5" />
            All customers
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-5 px-4 py-8 sm:px-6">
                {/* Customer info */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <h1 className="text-xl font-bold text-navy">{user.fullName}</h1>
          <p className="mt-1 text-sm text-text-grey">
            {user.email} · @{user.userId}
          </p>
        </div>

        {/* Reset login details */}
        <ResetCredentials userId={user.id} />

        {/* Each account's controls */}
        {user.accounts.map((account) => (
          <AccountAdmin key={account.id} account={account} />
        ))}


          <DeleteUser userId={user.id} userName={user.fullName} />
      </div>
    </main>
  );
}