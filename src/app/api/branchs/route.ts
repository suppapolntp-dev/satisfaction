import { NextResponse } from 'next/server';
import { db } from '@/db';
import { branch, brand } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id      = searchParams.get('id');
    const brandId = searchParams.get('brandId');

    if (id) {
      const result = await db.select().from(branch).where(eq(branch.branchId, Number(id)));
      if (result.length === 0)
        return NextResponse.json({ success: false, error: 'Branch not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: result[0] });
    }

    if (brandId) {
      const branches = await db.select().from(branch).where(eq(branch.brandId, Number(brandId)));
      return NextResponse.json({ success: true, data: branches, count: branches.length });
    }

    const branches = await db.select().from(branch);
    return NextResponse.json({ success: true, data: branches, count: branches.length });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch branches', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.branchId)
      return NextResponse.json({ success: false, error: 'branchId is required' }, { status: 400 });
    if (!body.brandId || !body.branchName)
      return NextResponse.json({ success: false, error: 'brandId and branchName are required' }, { status: 400 });

    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email))
        return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 });
    }

    if (body.contact) {
      const contactRegex = /^\d{10}$/;
      if (!contactRegex.test(body.contact))
        return NextResponse.json({ success: false, error: 'Contact must be 10 digits' }, { status: 400 });
    }

    const brandExists = await db.select().from(brand).where(eq(brand.brandId, body.brandId));
    if (brandExists.length === 0)
      return NextResponse.json({ success: false, error: `Brand with ID ${body.brandId} does not exist` }, { status: 404 });

    const result = await db.insert(branch).values({
      branchId:        Number(body.branchId),
      brandId:         body.brandId,
      branchName:      body.branchName,
      branchShortName: body.branchShortName ?? null,
      branchAddress:   body.branchAddress   ?? null,
      email:           body.email           ?? null,
      contact:         body.contact         ?? null,
    });

    return NextResponse.json(
      { success: true, message: 'Branch created successfully', data: result },
      { status: 201 }
    );

  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error &&
      (error as { code: string }).code === 'ER_DUP_ENTRY')
      return NextResponse.json({ success: false, error: 'Branch ID นี้มีอยู่แล้ว' }, { status: 409 });

    return NextResponse.json(
      { success: false, error: 'Failed to create branch', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.branchId)
      return NextResponse.json({ success: false, error: 'branchId is required' }, { status: 400 });

    const updateData: Partial<{
      brandId: number; branchName: string; branchShortName: string;
      branchAddress: string; email: string; contact: string;
    }> = {};
    if (body.brandId         !== undefined) updateData.brandId         = body.brandId;
    if (body.branchName      !== undefined) updateData.branchName      = body.branchName;
    if (body.branchShortName !== undefined) updateData.branchShortName = body.branchShortName;
    if (body.branchAddress   !== undefined) updateData.branchAddress   = body.branchAddress;
    if (body.email           !== undefined) updateData.email           = body.email;
    if (body.contact         !== undefined) updateData.contact         = body.contact;

    const targetId = body.newBranchId ?? body.branchId;
    const result = await db.update(branch).set({ ...updateData, branchId: targetId }).where(eq(branch.branchId, body.branchId));
    return NextResponse.json({ success: true, message: 'Branch updated successfully', data: result });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to update branch', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id)
      return NextResponse.json({ success: false, error: 'branchId is required' }, { status: 400 });

    const result = await db.delete(branch).where(eq(branch.branchId, Number(id)));
    return NextResponse.json({ success: true, message: 'Branch deleted successfully', data: result });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete branch', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}