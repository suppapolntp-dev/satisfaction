// src/app/api/accounts/check/route.ts
// เช็คว่า username มีอยู่ในระบบหรือไม่ (ไม่ return password)
import { NextResponse } from "next/server";
import { db } from "@/db";
import { account } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { userName } = await request.json();
    if (!userName) {
      return NextResponse.json({ exists: false });
    }
    const rows = await db
      .select({ userId: account.userId })
      .from(account)
      .where(eq(account.userName, userName));
    return NextResponse.json({ exists: rows.length > 0 });
  } catch (error) {
    return NextResponse.json({ exists: false });
  }
}