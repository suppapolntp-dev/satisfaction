// src/app/api/satisfactions/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { satisfaction } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const results = await db.select().from(satisfaction);
    return NextResponse.json({ success: true, data: results, count: results.length });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch satisfaction records', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.userId)
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });

    const validNames = ['ดี', 'ปานกลาง', 'แย่'];
    if (!body.satisfactionName || !validNames.includes(body.satisfactionName))
      return NextResponse.json(
        { success: false, error: `satisfactionName must be one of: ${validNames.join(', ')}` },
        { status: 400 }
      );

    await db.insert(satisfaction).values({
      satisfactionName: body.satisfactionName,
      userId:           body.userId,
      branchId:         body.branchId ?? null,   // ← ใหม่: เก็บ branchId ตรงๆ
    });

    return NextResponse.json(
      { success: true, message: 'Satisfaction record created successfully' },
      { status: 201 }
    );

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to create satisfaction record', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let satisfactionId = searchParams.get('id');

    if (!satisfactionId) {
      const body = await request.json();
      satisfactionId = body.satisfactionId;
    }

    if (!satisfactionId)
      return NextResponse.json({ success: false, error: 'satisfactionId is required' }, { status: 400 });

    const result = await db.delete(satisfaction).where(eq(satisfaction.satisfactionId, Number(satisfactionId)));
    return NextResponse.json({ success: true, message: 'Satisfaction record deleted successfully', data: result });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete satisfaction record', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}