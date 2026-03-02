// src/app/api/userbrand/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { userBrand } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/userbrand?userId=1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId)
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });

    const result = await db.select().from(userBrand).where(eq(userBrand.userId, Number(userId)));
    return NextResponse.json({ success: true, data: result });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST /api/userbrand → { userId, brandId }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.userId || !body.brandId)
      return NextResponse.json({ success: false, error: 'userId and brandId are required' }, { status: 400 });

    await db.insert(userBrand).values({ userId: body.userId, brandId: body.brandId });
    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to create', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/userbrand?userId=1           → ลบทุก brand ของ user
// DELETE /api/userbrand?userId=1&brandId=1 → ลบเฉพาะ brand นั้น
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId  = searchParams.get('userId');
    const brandId = searchParams.get('brandId');
    if (!userId)
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });

    if (brandId) {
      await db.delete(userBrand).where(
        and(eq(userBrand.userId, Number(userId)), eq(userBrand.brandId, Number(brandId)))
      );
    } else {
      await db.delete(userBrand).where(eq(userBrand.userId, Number(userId)));
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}