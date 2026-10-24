// src/app/dashboard/components/QuickActions.js
import Link from "next/link";
import { ArrowLeftRight, Camera, Receipt } from "lucide-react";

const actions = [
  { icon: ArrowLeftRight, label: "Transfer", href: "/dashboard/transfer" },
    { icon: Camera, label: "Deposit", href: "/dashboard/feature" },
  { icon: Receipt, label: "Pay Bills", href: "/dashboard/feature" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-2 rounded-xl bg-white p-4 shadow-sm hover:bg-grey-bg sm:flex-row sm:justify-center sm:gap-3"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10 text-navy">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold text-navy sm:text-sm">
              {action.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}