// src/app/api/admin/accounts/[accountId]/freeze/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/adminAuth";

export async function POST(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { accountId } = await params;
  const { frozen, freezeMessage } = await request.json();

  await prisma.account.update({
    where: { id: accountId },
    data: {
      frozen: Boolean(frozen),
      freezeMessage: frozen ? (freezeMessage || "") : null,
    },
  });

  return NextResponse.json({ message: "Account updated." });
}