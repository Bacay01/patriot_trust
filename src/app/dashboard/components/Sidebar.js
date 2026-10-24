// src/app/dashboard/components/Sidebar.js
import Link from "next/link";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Receipt,
  CreditCard,
  PiggyBank,
  Settings,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Accounts", href: "/dashboard", active: true },
    { icon: ArrowLeftRight, label: "Transfers", href: "/dashboard/transfer" },,
    { icon: Receipt, label: "Bill Pay", href: "/dashboard/feature" },
  { icon: CreditCard, label: "Cards", href: "/dashboard/feature" },
  { icon: PiggyBank, label: "Savings Goals", href: "/dashboard/feature" },
  { icon: Settings, label: "Settings", href: "/dashboard/feature" },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white lg:block">
      <nav className="sticky top-16 flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                item.active
                  ? "bg-navy/5 text-navy"
                  : "text-text-grey hover:bg-grey-bg"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}