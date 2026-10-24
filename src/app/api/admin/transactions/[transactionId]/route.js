// src/app/api/admin/transactions/[transactionId]/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/adminAuth";

// ---- EDIT a transaction (adjusts balance by the difference) ----
export async function PATCH(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { transactionId } = await params;
  const { type, amount, description, label } = await request.json();

  const value = Number(amount);
  if (!type || isNaN(value) || value <= 0 || !description) {
    return NextResponse.json({ error: "Missing or invalid fields." }, { status: 400 });
  }
  if (type !== "credit" && type !== "debit") {
    return NextResponse.json({ error: "Type must be credit or debit." }, { status: 400 });
  }

  const oldTx = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!oldTx) {
    return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
  }

  const account = await prisma.account.findUnique({ where: { id: oldTx.accountId } });

  // Step 1: reverse the OLD transaction's effect on the balance
  let balance = account.balance;
  balance += oldTx.type === "credit" ? -oldTx.amount : oldTx.amount;

  // Step 2: apply the NEW transaction's effect
  balance += type === "credit" ? value : -value;

  await prisma.$transaction([
    prisma.transaction.update({
      where: { id: transactionId },
      data: { type, amount: value, description, label: label || null },
    }),
    prisma.account.update({
      where: { id: oldTx.accountId },
      data: { balance },
    }),
  ]);

  return NextResponse.json({ message: "Transaction updated." });
}

// ---- DELETE a transaction (reverses its balance effect) ----
export async function DELETE(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { transactionId } = await params;

  const tx = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!tx) {
    return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
  }

  const account = await prisma.account.findUnique({ where: { id: tx.accountId } });

  const newBalance =
    tx.type === "credit" ? account.balance - tx.amount : account.balance + tx.amount;

  await prisma.$transaction([
    prisma.transaction.delete({ where: { id: transactionId } }),
    prisma.account.update({
      where: { id: tx.accountId },
      data: { balance: newBalance },
    }),
  ]);

  return NextResponse.json({ message: "Transaction deleted." });
}
