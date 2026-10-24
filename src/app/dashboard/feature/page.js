// src/app/dashboard/feature/page.js
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Construction, Lock } from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export default async function FeaturePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const accounts = await prisma.account.findMany({
    where: { userId: session.user.id },
  });

  // Is any account frozen? Grab the first frozen one's message.
  const frozenAccount = accounts.find((a) => a.frozen);

  return (
    <main className="min-h-screen bg-grey-bg">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-1 text-sm hover:text-red">
            <ArrowLeft className="h-5 w-5" />
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
        {frozenAccount ? (
          // ----- FROZEN: show the admin's message -----
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red/10">
              <Lock className="h-8 w-8 text-red" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-navy">Feature unavailable</h1>
            <div className="mt-4 w-full rounded-md bg-red/10 px-4 py-4 text-sm font-medium text-red">
              {frozenAccount.freezeMessage ||
                "Your account is currently restricted. Please contact support."}
            </div>
          </>
        ) : (
          // ----- NOT FROZEN: coming soon -----
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy/10">
              <Construction className="h-8 w-8 text-navy" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-navy">Coming soon</h1>
            <p className="mt-2 max-w-sm text-sm text-text-grey">
              This feature is under development and will be available shortly.
            </p>
          </>
        )}

        <Link
          href="/dashboard"
          className="mt-6 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-light"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}