// src/app/dashboard/page.js
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import QuickActions from "./components/QuickActions";
import Snapshot from "./components/Snapshot";
import AccountList from "./components/AccountList";
import RecentActivity from "./components/RecentActivity";
import BottomNav from "./components/BottomNav";


export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: {
        orderBy: { type: "asc" },
        include: { transactions: true },
      },
    },
  });
  if (!user) redirect("/login");

  const firstName = user.fullName.split(" ")[0];

  // ----- Snapshot: sum this month's transactions -----
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let moneyIn = 0;
  let moneyOut = 0;

  for (const account of user.accounts) {
    for (const tx of account.transactions) {
      if (new Date(tx.createdAt) >= startOfMonth) {
        if (tx.type === "credit") moneyIn += tx.amount;
        else moneyOut += tx.amount;
      }
    }
  }

  // ----- Flatten all transactions, newest first -----
  const allTransactions = user.accounts
    .flatMap((account) => account.transactions)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  // ----- Split accounts -----
  const bankAccounts = user.accounts.filter((a) => a.type !== "credit");
  const creditAccount = user.accounts.find((a) => a.type === "credit");

  return (
    <main className="min-h-screen bg-grey-bg pb-24 lg:pb-0">
      <Header firstName={firstName} />

      <div className="mx-auto flex max-w-7xl">
        <Sidebar />

        <div className="flex-1 space-y-5 px-4 py-6 sm:px-6 lg:px-8">
          {/* Greeting card */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-lg font-bold text-navy">Hello, {firstName}</p>
                <p className="text-sm text-text-grey">Preferred Rewards Member</p>
              </div>
              <ChevronRight className="h-5 w-5 text-text-grey" />
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
              <p className="text-base font-semibold text-navy">My Rewards</p>
              <ChevronRight className="h-5 w-5 text-text-grey" />
            </div>
          </div>

          {/* Quick actions */}
          <QuickActions />

          {/* Snapshot */}
          <Snapshot moneyIn={moneyIn} moneyOut={moneyOut} />

          {/* Banking group */}
          <AccountList title="Banking" accounts={bankAccounts} />

          {/* Credit cards group */}
          <AccountList
            title="Credit Cards"
            accounts={creditAccount ? [creditAccount] : []}
          />

          {/* Recent activity */}
          <RecentActivity transactions={allTransactions} />
               </div>
      </div>

      <BottomNav />
    </main>
  );
}