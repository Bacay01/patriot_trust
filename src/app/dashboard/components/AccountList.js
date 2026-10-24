// src/app/dashboard/components/AccountList.js
import Link from "next/link";
import { ChevronRight } from "lucide-react";

function money(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

const typeLabel = {
  checking: "Checking",
  savings: "Savings",
  credit: "Credit Card",
};

export default function AccountList({ title, accounts }) {
  if (accounts.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Group header with thin red accent */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-3">
        <div className="flex h-5 w-1 overflow-hidden rounded-full">
          <div className="h-full w-full bg-red" />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-navy">
          {title}
        </h2>
      </div>

      {/* Account rows */}
      <div className="divide-y divide-gray-100">
        {accounts.map((account) => (
          <Link
            key={account.id}
            href={`/dashboard/${account.id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-grey-bg"
          >
            <div>
              <p className="text-sm font-semibold text-navy">
                {typeLabel[account.type] || account.type}
              </p>
              <p className="text-xs text-text-grey">
                ••••{account.accountNumber.slice(-4)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-navy">
                {money(account.balance)}
              </span>
              <ChevronRight className="h-4 w-4 text-text-grey" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}