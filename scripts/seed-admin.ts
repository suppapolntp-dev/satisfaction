// scripts/seed-admin.ts
import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { account } from "../src/db/schema"; // ← relative path
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seedAdmin() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  const db = drizzle(connection);

  const plainPassword = "admin1234";
  const hashed = await bcrypt.hash(plainPassword, 10);

  await db.insert(account).values({
    userId: 2,
    userName: "user",
    userPassword: hashed,
    userRole: 2,
    branchId: null,
  });

  console.log("✅ Admin created!");
  console.log(`   username: admin`);
  console.log(`   password: ${plainPassword}`);

  await connection.end();
  process.exit(0);
}

seedAdmin().catch((e) => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});