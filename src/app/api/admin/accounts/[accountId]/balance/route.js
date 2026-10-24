// src/app/api/admin/accounts/[accountId]/balance/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/adminAuth";

export async function POST(request, { params }) {
  // Protect: admin only
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { accountId } = await params;
  const { balance } = await request.json();

  const amount = Number(balance);
  if (isNaN(amount)) {
    return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
  }

  await prisma.account.update({
    where: { id: accountId },
    data: { balance: amount },
  });

  return NextResponse.json({ message: "Balance updated." });
}