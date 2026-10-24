// src/app/dashboard/components/BottomNav.js
import Link from "next/link";
import {
  LayoutGrid,
  ArrowLeftRight,
  Receipt,
  CreditCard,
  Menu,
} from "lucide-react";

const items = [
  { icon: LayoutGrid, label: "Accounts", href: "/dashboard", active: true },
    { icon: ArrowLeftRight, label: "Transfer", href: "/dashboard/transfer" },
    { icon: Receipt, label: "Bill Pay", href: "/dashboard/feature" },
  { icon: CreditCard, label: "Cards", href: "/dashboard/feature" },
  { icon: Menu, label: "Menu", href: "/dashboard/feature" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-2 py-1 text-xs ${
                item.active ? "text-navy" : "text-text-grey"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}