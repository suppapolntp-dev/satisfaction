// src/app/api/areas/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { area, account } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await db.select().from(area).where(eq(area.areaId, Number(id)));
      if (result.length === 0)
        return NextResponse.json({ success: false, error: 'Area not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: result[0] });
    }

    // ดึง area ทั้งหมดพร้อม memberCount (นับ user ที่มี areaId นั้น)
    const areas = await db
      .select({
        areaId:      area.areaId,
        areaName:    area.areaName,
        description: area.description,
        canFilter:   area.canFilter,
        memberCount: sql<number>`COUNT(${account.userId})`.as('member_count'),
      })
      .from(area)
      .leftJoin(account, eq(account.areaId, area.areaId))
      .groupBy(area.areaId, area.areaName, area.description, area.canFilter);

    return NextResponse.json({ success: true, data: areas, count: areas.length });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch areas', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.areaName)
      return NextResponse.json({ success: false, error: 'areaName is required' }, { status: 400 });

    const result = await db.insert(area).values({
      areaName:    body.areaName,
      description: body.description ?? null,
      canFilter:   body.canFilter   ?? 0,    // ← ใหม่
    });

    return NextResponse.json(
      { success: true, message: 'Area created successfully', data: result },
      { status: 201 }
    );

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to create area', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.areaId)
      return NextResponse.json({ success: false, error: 'areaId is required' }, { status: 400 });

    const updateData: Partial<{ areaName: string; description: string; canFilter: number }> = {};
    if (body.areaName    !== undefined) updateData.areaName    = body.areaName;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.canFilter   !== undefined) updateData.canFilter   = body.canFilter;   // ← ใหม่

    if (Object.keys(updateData).length === 0)
      return NextResponse.json({ success: false, error: 'No data to update' }, { status: 400 });

    const result = await db.update(area).set(updateData).where(eq(area.areaId, body.areaId));
    return NextResponse.json({ success: true, message: 'Area updated successfully', data: result });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to update area', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id)
      return NextResponse.json({ success: false, error: 'areaId is required' }, { status: 400 });

    const result = await db.delete(area).where(eq(area.areaId, Number(id)));
    return NextResponse.json({ success: true, message: 'Area deleted successfully', data: result });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete area', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}