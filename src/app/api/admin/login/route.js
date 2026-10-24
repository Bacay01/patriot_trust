// src/app/api/admin/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createAdminSession } from "@/lib/adminAuth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Valid → create the admin session cookie
    await createAdminSession(admin);

    return NextResponse.json({ message: "Logged in." }, { status: 200 });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}