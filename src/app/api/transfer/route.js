// src/app/api/transfer/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { fromAccountId, toAccountId, toAccountNumber, recipientName, amount, description, pin, mode } =
    await request.json();

  const value = Number(amount);

  if (!fromAccountId || isNaN(value) || value <= 0) {
    return NextResponse.json({ error: "Enter a valid amount." }, { status: 400 });
  }
  if (!pin) {
    return NextResponse.json({ error: "PIN is required." }, { status: 400 });
  }

  // Verify PIN
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  const pinOk = await bcrypt.compare(String(pin), user.pin);
  if (!pinOk) {
    return NextResponse.json({ error: "Incorrect PIN." }, { status: 403 });
  }

  // Load + check the "from" account
  const fromAccount = await prisma.account.findUnique({ where: { id: fromAccountId } });
  if (!fromAccount || fromAccount.userId !== user.id) {
    return NextResponse.json({ error: "Invalid source account." }, { status: 400 });
  }
    if (fromAccount.blockTransfer) {
    return NextResponse.json(
      {
        error:
          fromAccount.freezeMessage ||
          "Transfers from this account are currently unavailable. Please contact support.",
      },
      { status: 400 }
    );
  }
  if (fromAccount.balance < value) {
    return NextResponse.json({ error: "Insufficient funds." }, { status: 400 });
  }

  // ---------- EXTERNAL: send to someone (no recipient lookup) ----------
  if (mode === "external") {
    if (!toAccountNumber) {
      return NextResponse.json({ error: "Enter the recipient's account number." }, { status: 400 });
    }

    const toLabel = recipientName
      ? `Transfer to ${recipientName} (••${String(toAccountNumber).slice(-4)})`
      : `Transfer to ••${String(toAccountNumber).slice(-4)}`;

    // Debit the sender, record the transfer. No recipient account is touched.
    await prisma.$transaction([
      prisma.account.update({
        where: { id: fromAccount.id },
        data: { balance: fromAccount.balance - value },
      }),
      prisma.transaction.create({
        data: {
          accountId: fromAccount.id,
          type: "debit",
          amount: value,
          description: description || "Transfer",
          label: toLabel,
        },
      }),
    ]);

    return NextResponse.json({ message: "Transfer complete." });
  }

  // ---------- INTERNAL: between my own accounts (real both sides) ----------
  if (!toAccountId) {
    return NextResponse.json({ error: "Choose a destination account." }, { status: 400 });
  }
  const toAccount = await prisma.account.findUnique({ where: { id: toAccountId } });
  if (!toAccount || toAccount.userId !== user.id) {
    return NextResponse.json({ error: "Invalid destination account." }, { status: 400 });
  }
  if (toAccount.id === fromAccount.id) {
    return NextResponse.json({ error: "Cannot transfer to the same account." }, { status: 400 });
  }
  if (toAccount.frozen) {
    return NextResponse.json({ error: "Destination account is frozen." }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.account.update({
      where: { id: fromAccount.id },
      data: { balance: fromAccount.balance - value },
    }),
    prisma.transaction.create({
      data: {
        accountId: fromAccount.id,
        type: "debit",
        amount: value,
        description: description || "Transfer",
        label: `Transfer to ${toAccount.type}`,
      },
    }),
    prisma.account.update({
      where: { id: toAccount.id },
      data: { balance: toAccount.balance + value },
    }),
    prisma.transaction.create({
      data: {
        accountId: toAccount.id,
        type: "credit",
        amount: value,
        description: description || "Transfer",
        label: `Transfer from ${user.fullName}`,
      },
    }),
  ]);

  return NextResponse.json({ message: "Transfer complete." });
}