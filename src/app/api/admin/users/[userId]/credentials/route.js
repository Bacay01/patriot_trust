// src/app/api/admin/users/[userId]/credentials/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/adminAuth";

export async function POST(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { userId } = await params;
  const { password, pin } = await request.json();

  const data = {};

  if (password) {
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    data.password = await bcrypt.hash(password, 10);
  }

  if (pin) {
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: "PIN must be exactly 4 digits." }, { status: 400 });
    }
    data.pin = await bcrypt.hash(pin, 10);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  await prisma.user.update({ where: { id: userId }, data });

  return NextResponse.json({ message: "Credentials updated." });
}
