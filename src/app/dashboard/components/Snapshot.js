// src/app/dashboard/components/Snapshot.js
import { TrendingUp, TrendingDown } from "lucide-react";

function money(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default function Snapshot({ moneyIn, moneyOut }) {
  const net = moneyIn - moneyOut;

  const monthName = new Date().toLocaleString("en-US", { month: "long" });

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      {/* red/navy strip */}
      <div className="flex h-1.5 w-full">
        <div className="h-full w-3/5 bg-red" />
        <div className="h-full w-2/5 bg-navy" />
      </div>

      <div className="p-5">
        <h2 className="text-base font-bold text-navy">{monthName} Snapshot</h2>
        <p className="text-xs text-text-grey">Money moved this month</p>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {/* Money in */}
          <div className="rounded-lg bg-grey-bg p-3">
            <div className="flex items-center gap-1 text-green-700">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-semibold">In</span>
            </div>
            <p className="mt-1 text-sm font-bold text-navy sm:text-base">
              {money(moneyIn)}
            </p>
          </div>

          {/* Money out */}
          <div className="rounded-lg bg-grey-bg p-3">
            <div className="flex items-center gap-1 text-red">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs font-semibold">Out</span>
            </div>
            <p className="mt-1 text-sm font-bold text-navy sm:text-base">
              {money(moneyOut)}
            </p>
          </div>

          {/* Net */}
          <div className="rounded-lg bg-navy p-3 text-white">
            <span className="text-xs font-semibold text-white/70">Net</span>
            <p className="mt-1 text-sm font-bold sm:text-base">
              {net >= 0 ? "+" : ""}
              {money(net)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}