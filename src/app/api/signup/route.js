// src/app/api/signup/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateAccountNumber } from "@/lib/accountNumber";

export async function POST(request) {
  try {
    const { fullName, email, userId, password, pin } = await request.json();

    // 1. All fields required
    if (!fullName || !email || !userId || !password || !pin) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // 2. Rules
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: "PIN must be exactly 4 digits." }, { status: 400 });
    }

    // 3. Duplicate check (email OR userId)
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { userId }] },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with that email or User ID already exists." },
        { status: 409 }
      );
    }

    // 4. Hash password and PIN
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);

    // 5. Create user + 3 accounts together (atomic)
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        userId,
        password: hashedPassword,
        pin: hashedPin,
        accounts: {
          create: [
            { type: "checking", balance: 1000, accountNumber: generateAccountNumber() },
            { type: "savings",  balance: 500,  accountNumber: generateAccountNumber() },
            { type: "credit",   balance: 0,    accountNumber: generateAccountNumber() },
          ],
        },
      },
    });

    // 6. Success — never return password/pin
    return NextResponse.json(
      { message: "Account created successfully.", userId: user.userId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}