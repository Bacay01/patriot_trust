// src/app/dashboard/[accountId]/page.js
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ArrowLeft, ArrowLeftRight, Receipt, ArrowDownLeft, ArrowUpRight, Inbox } from "lucide-react";


function money(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const typeLabel = {
  checking: "Checking Account",
  savings: "Savings Account",
  credit: "Credit Card",
};

export default async function AccountDetailPage({ params }) {
  const { accountId } = await params;

  const session = await auth();
  if (!session) redirect("/login");

  // Load the account + its transactions
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      transactions: { orderBy: { createdAt: "desc" } },
    },
  });

  // Not found, OR not owned by this user → block
  if (!account || account.userId !== session.user.id) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-grey-bg pb-16">
      {/* Top bar */}
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-1 text-sm hover:text-red">
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6">
        {/* Balance card */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="flex h-1.5 w-full">
            <div className="h-full w-3/5 bg-red" />
            <div className="h-full w-2/5 bg-navy" />
          </div>
          <div className="p-6">
            <p className="text-sm font-semibold text-text-grey">
              {typeLabel[account.type] || account.type}
            </p>
            <p className="text-xs text-text-grey">
              Account number ••••{account.accountNumber.slice(-4)}
            </p>

            {account.frozen ? (
              <>
                <p className="mt-4 text-3xl font-bold text-text-grey">Account frozen</p>
                <div className="mt-3 rounded-md bg-red/10 px-4 py-3 text-sm font-medium text-red">
                  {account.freezeMessage || "This account is frozen. Please contact support."}
                </div>
              </>
            ) : (
              <>
                <p className="mt-4 text-xs text-text-grey">Available balance</p>
                <p className="text-4xl font-bold text-navy">{money(account.balance)}</p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-light">
                    <ArrowLeftRight className="h-4 w-4" />
                    Transfer
                  </button>
                  <button className="flex items-center gap-2 rounded-full border border-navy px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy hover:text-white">
                    <Receipt className="h-4 w-4" />
                    Pay a bill
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Transaction history */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-bold text-navy">Transaction history</h2>
          </div>

          {account.transactions.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <Inbox className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-text-grey">No transactions yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {account.transactions.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        tx.type === "credit" ? "bg-green-100 text-green-700" : "bg-red/10 text-red"
                      }`}
                    >
                      {tx.type === "credit" ? (
                        <ArrowDownLeft className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-navy">{tx.description}</p>
                      <p className="text-xs text-text-grey">
                        {tx.label ? `${tx.label} · ` : ""}
                        {formatDate(tx.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      tx.type === "credit" ? "text-green-700" : "text-navy"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}
                    {money(tx.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}