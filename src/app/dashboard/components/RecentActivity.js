// src/app/dashboard/components/RecentActivity.js
import { ArrowDownLeft, ArrowUpRight, Inbox } from "lucide-react";

function money(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function RecentActivity({ transactions }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="text-base font-bold text-navy">Recent activity</h2>
        <button className="text-sm font-semibold text-blue-700 hover:text-navy">
          See all
        </button>
      </div>

      {transactions.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <Inbox className="h-8 w-8 text-gray-300" />
          <p className="text-sm text-text-grey">No activity yet.</p>
          <p className="text-xs text-text-grey">
            Your transactions will appear here.
          </p>
        </div>
      ) : (
        /* Transaction list */
        <ul className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                {/* Direction icon */}
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    tx.type === "credit"
                      ? "bg-green-100 text-green-700"
                      : "bg-red/10 text-red"
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

              {/* Amount */}
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
  );
}