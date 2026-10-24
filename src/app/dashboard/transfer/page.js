// src/app/dashboard/transfer/page.js
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import TransferForm from "./TransferForm";


export default async function TransferPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
    orderBy: { type: "asc" },
  });

  return (
    <main className="min-h-screen bg-grey-bg pb-16">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-1 text-sm hover:text-red">
            <ArrowLeft className="h-5 w-5" />
            Back
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <h1 className="mb-5 text-2xl font-bold text-navy">Transfer money</h1>
        <TransferForm accounts={accounts} />
      </div>
    </main>
  );
}
