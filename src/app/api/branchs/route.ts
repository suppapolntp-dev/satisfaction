import { NextResponse } from 'next/server';
import { db } from '@/db';
import { branch, brand } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const brandId = searchParams.get('brandId');
    if (id) {
      const result = await db
        .select()
        .from(branch)
        .where(eq(branch.branchId, Number(id)));

      if (result.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Branch not found' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        data: result[0] 
      });
    }
    if (brandId) {
      const branches = await db
        .select()
        .from(branch)
        .where(eq(branch.brandId, Number(brandId)));

      return NextResponse.json({ 
        success: true, 
        data: branches,
        count: branches.length,
        brandId: Number(brandId)
      });
    }
    const branches = await db.select().from(branch);

    return NextResponse.json({ 
      success: true, 
      data: branches,
      count: branches.length
    });

  } catch (error: unknown) {
    console.error('GET /api/branches error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch branches',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.branchId || !body.brandId || !body.branchName) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'branchId, brandId, and branchName are required' 
        },
        { status: 400 }
      );
    }
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid email format' 
          },
          { status: 400 }
        );
      }
    }
    if (body.contact) {
      const contactRegex = /^\d{10}$/;
      if (!contactRegex.test(body.contact)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Contact must be 10 digits' 
          },
          { status: 400 }
        );
      }
    }
    const brandExists = await db
      .select()
      .from(brand)
      .where(eq(brand.brandId, body.brandId));

    if (brandExists.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Brand with ID ${body.brandId} does not exist` 
        },
        { status: 404 }
      );
    }
    const result = await db.insert(branch).values({
      branchId: body.branchId,
      brandId: body.brandId,
      branchName: body.branchName,
      branchShortName: body.branchShortName || null,
      branchAddress: body.branchAddress || null,
      email: body.email || null,
      contact: body.contact || null,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Branch created successfully',
        data: result
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('POST /api/branches error:', error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'ER_DUP_ENTRY'
    ) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Branch ID already exists' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create branch',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
