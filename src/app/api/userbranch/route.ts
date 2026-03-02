// src/app/api/userbranch/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { userBranch } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/userbranch?userId=1 → branchIds ทั้งหมดของ user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId)
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });

    const result = await db.select().from(userBranch).where(eq(userBranch.userId, Number(userId)));
    return NextResponse.json({ success: true, data: result });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user branches', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.userId || !body.branchId)
      return NextResponse.json({ success: false, error: 'userId and branchId are required' }, { status: 400 });

    await db.insert(userBranch).values({ userId: body.userId, branchId: body.branchId });
    return NextResponse.json({ success: true, message: 'UserBranch created' }, { status: 201 });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to create user branch', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId   = searchParams.get('userId');
    const branchId = searchParams.get('branchId');

    if (!userId)
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });

    if (branchId) {
      await db.delete(userBranch).where(
        and(eq(userBranch.userId, Number(userId)), eq(userBranch.branchId, Number(branchId)))
      );
    } else {
      await db.delete(userBranch).where(eq(userBranch.userId, Number(userId)));
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete user branch', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}