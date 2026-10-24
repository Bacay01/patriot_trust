// src/app/api/admin/accounts/[accountId]/transactions/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/adminAuth";

export async function POST(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { accountId } = await params;
  const { type, amount, description, label } = await request.json();

  const value = Number(amount);
  if (!type || isNaN(value) || value <= 0 || !description) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }
  if (type !== "credit" && type !== "debit") {
    return NextResponse.json({ error: "Type must be credit or debit." }, { status: 400 });
  }

  // Create the transaction AND adjust the account balance together
  const account = await prisma.account.findUnique({ where: { id: accountId } });
  if (!account) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  const newBalance =
    type === "credit" ? account.balance + value : account.balance - value;

  await prisma.$transaction([
    prisma.transaction.create({
      data: {
        accountId,
        type,
        amount: value,
        description,
        label: label || null,
      },
    }),
    prisma.account.update({
      where: { id: accountId },
      data: { balance: newBalance },
    }),
  ]);

  return NextResponse.json({ message: "Transaction added." });
}