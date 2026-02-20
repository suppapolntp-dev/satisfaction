// scripts/hash-password.ts
import bcrypt from "bcrypt";
import { db } from "@/db";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";

async function hashPasswords() {
  // ดึง user ทั้งหมด
  const users = await db.select().from(account);

  for (const user of users) {
    // hash password เดิม
    const hashed = await bcrypt.hash(user.userPassword, 10);
    
    // อัปเดตกลับ DB
    await db
      .update(account)
      .set({ userPassword: hashed })
      .where(eq(account.userId, user.userId));

    console.log(`✅ Hashed password for user: ${user.userName}`);
  }

  console.log("Done!");
  process.exit(0);
}

hashPasswords();