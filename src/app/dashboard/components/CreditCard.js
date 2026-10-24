// src/app/dashboard/components/CreditCard.js
import Link from "next/link";
import { CreditCard as CardIcon } from "lucide-react";

function money(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

// Fixed display limit for now (admin will control this later)
const CREDIT_LIMIT = 5000;

export default function CreditCard({ account }) {
  const owed = account.balance;
  const available = CREDIT_LIMIT - owed;
  const usedPercent = Math.min((owed / CREDIT_LIMIT) * 100, 100);

  return (
    <div className="overflow-hidden rounded-xl bg-navy text-white shadow-sm">
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardIcon className="h-5 w-5 text-white/80" />
            <div>
              <p className="text-sm font-semibold">Credit Card</p>
              <p className="text-xs text-white/70">••••{account.accountNumber.slice(-4)}</p>
            </div>
          </div>
          <Link
            href={`/dashboard/${account.id}`}
            className="text-sm font-semibold text-white/90 underline hover:text-white"
          >
            View
          </Link>
        </div>

        {/* Current balance owed */}
        <p className="mt-4 text-xs text-white/70">Current balance</p>
        <p className="text-3xl font-bold">{money(owed)}</p>

        {/* Usage bar */}
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-red"
              style={{ width: `${usedPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-white/70">
            <span>{money(available)} available</span>
            <span>Limit {money(CREDIT_LIMIT)}</span>
          </div>
        </div>

        {/* Make a payment */}
        <button className="mt-5 w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-grey-bg">
          Make a payment
        </button>
      </div>
    </div>
  );
}