// src/app/api/areabranch/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { areaBranch } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const areaId = searchParams.get('areaId');
    const branchId = searchParams.get('branchId');

    // ดึงตาม areaId
    if (areaId) {
      const result = await db.select().from(areaBranch).where(eq(areaBranch.areaId, Number(areaId)));
      return NextResponse.json({ success: true, data: result, count: result.length });
    }

    // ดึงตาม branchId
    if (branchId) {
      const result = await db.select().from(areaBranch).where(eq(areaBranch.branchId, Number(branchId)));
      return NextResponse.json({ success: true, data: result, count: result.length });
    }

    // ดึงทั้งหมด
    const result = await db.select().from(areaBranch);
    return NextResponse.json({ success: true, data: result, count: result.length });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch area branches', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.areaId || !body.branchId)
      return NextResponse.json({ success: false, error: 'areaId and branchId are required' }, { status: 400 });

    // เช็คว่ามีซ้ำไหม
    const existing = await db
      .select()
      .from(areaBranch)
      .where(and(eq(areaBranch.areaId, body.areaId), eq(areaBranch.branchId, body.branchId)));

    if (existing.length > 0)
      return NextResponse.json({ success: false, error: 'This branch is already assigned to this area' }, { status: 409 });

    const result = await db.insert(areaBranch).values({
      areaId:   body.areaId,
      branchId: body.branchId,
    });

    return NextResponse.json(
      { success: true, message: 'AreaBranch created successfully', data: result },
      { status: 201 }
    );

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to create area branch', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id)
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });

    const updateData: Partial<{ areaId: number; branchId: number }> = {};
    if (body.areaId !== undefined)   updateData.areaId   = body.areaId;
    if (body.branchId !== undefined) updateData.branchId = body.branchId;

    if (Object.keys(updateData).length === 0)
      return NextResponse.json({ success: false, error: 'No data to update' }, { status: 400 });

    const result = await db.update(areaBranch).set(updateData).where(eq(areaBranch.id, body.id));
    return NextResponse.json({ success: true, message: 'AreaBranch updated successfully', data: result });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to update area branch', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const areaId = searchParams.get('areaId');
    const branchId = searchParams.get('branchId');

    // ลบด้วย id ตรงๆ
    if (id) {
      const result = await db.delete(areaBranch).where(eq(areaBranch.id, Number(id)));
      return NextResponse.json({ success: true, message: 'AreaBranch deleted successfully', data: result });
    }

    // ลบด้วย areaId + branchId
    if (areaId && branchId) {
      const result = await db
        .delete(areaBranch)
        .where(and(eq(areaBranch.areaId, Number(areaId)), eq(areaBranch.branchId, Number(branchId))));
      return NextResponse.json({ success: true, message: 'AreaBranch deleted successfully', data: result });
    }

    // ลบทั้ง area (ใช้ตอนลบ area ทิ้งทั้งก้อน)
    if (areaId) {
      const result = await db.delete(areaBranch).where(eq(areaBranch.areaId, Number(areaId)));
      return NextResponse.json({ success: true, message: 'All branches removed from area', data: result });
    }

    return NextResponse.json({ success: false, error: 'id, areaId, or areaId+branchId is required' }, { status: 400 });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete area branch', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}