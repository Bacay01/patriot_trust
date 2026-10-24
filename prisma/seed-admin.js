// prisma/seed-admin.js
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ---- Set your admin login here ----
const ADMIN_EMAIL = "admin@patriottrust.com";
const ADMIN_PASSWORD = "admin12345";
// -----------------------------------

async function main() {
  const existing = await prisma.admin.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log("Admin already exists:", ADMIN_EMAIL);
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.admin.create({
    data: { email: ADMIN_EMAIL, password: hashed },
  });

  console.log("✅ Admin created:");
  console.log("   Email:   ", ADMIN_EMAIL);
  console.log("   Password:", ADMIN_PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());