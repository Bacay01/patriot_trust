// src/lib/adminAuth.js
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "patriot_admin_session";
const SECRET = process.env.ADMIN_JWT_SECRET;

// Create a signed token for an admin and store it in a cookie
export async function createAdminSession(admin) {
  const token = jwt.sign(
    { adminId: admin.id, email: admin.email },
    SECRET,
    { expiresIn: "12h" }
  );

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 12, // 12 hours in seconds
    path: "/",
  });
}

// Read + verify the current admin session (returns the payload, or null)
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null; // invalid or expired token
  }
}

// Clear the admin session (logout)
export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}