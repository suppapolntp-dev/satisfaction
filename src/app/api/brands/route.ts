import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brand } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await db.select().from(brand).where(eq(brand.brandId, Number(id)));
      if (result.length === 0)
        return NextResponse.json({ success: false, error: 'Brand not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: result[0] });
    }

    const brands = await db.select().from(brand);
    return NextResponse.json({ success: true, data: brands, count: brands.length });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.brandId)
      return NextResponse.json({ success: false, error: 'brandId is required' }, { status: 400 });
    if (!body.brandName)
      return NextResponse.json({ success: false, error: 'brandName is required' }, { status: 400 });

    const result = await db.insert(brand).values({
      brandId:        Number(body.brandId),
      brandName:      body.brandName,
      brandShortName: body.brandShortName ?? null,
      brandImage:     body.brandImage     ?? null,
    });

    return NextResponse.json(
      { success: true, message: 'Brand created successfully', data: result },
      { status: 201 }
    );

  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error &&
      (error as { code: string }).code === 'ER_DUP_ENTRY')
      return NextResponse.json({ success: false, error: 'Brand ID หรือชื่อ Brand นี้มีอยู่แล้ว' }, { status: 409 });

    return NextResponse.json(
      { success: false, error: 'Failed to create brand', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.brandId)
      return NextResponse.json({ success: false, error: 'brandId is required' }, { status: 400 });

    const updateData: Partial<{ brandName: string; brandShortName: string; brandImage: string }> = {};
    if (body.brandName !== undefined)      updateData.brandName      = body.brandName;
    if (body.brandShortName !== undefined) updateData.brandShortName = body.brandShortName;
    if (body.brandImage !== undefined)     updateData.brandImage     = body.brandImage;

    if (Object.keys(updateData).length === 0)
      return NextResponse.json({ success: false, error: 'No data to update' }, { status: 400 });

    const result = await db.update(brand).set(updateData).where(eq(brand.brandId, body.brandId));
    return NextResponse.json({ success: true, message: 'Brand updated successfully', data: result });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to update brand', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id)
      return NextResponse.json({ success: false, error: 'brandId is required' }, { status: 400 });

    const result = await db.delete(brand).where(eq(brand.brandId, Number(id)));
    return NextResponse.json({ success: true, message: 'Brand deleted successfully', data: result });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete brand', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}