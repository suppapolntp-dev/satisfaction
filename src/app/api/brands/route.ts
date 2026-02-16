import { NextResponse } from 'next/server';
import { db } from '@/db';
import { brand } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await db
        .select()
        .from(brand)
        .where(eq(brand.brandId, Number(id)));

      if (result.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Brand not found' 
          },
          { status: 404 } 
        );
      }

      return NextResponse.json({ 
        success: true, 
        data: result[0] 
      });
    }

    const brands = await db.select().from(brand);

    return NextResponse.json({ 
      success: true, 
      data: brands,
      count: brands.length 
    });

  } catch (error: unknown) {
    console.error('GET /api/brands error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch brands',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.brandId || !body.brandName) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'brandId and brandName are required' 
        },
        { status: 400 } 
      );
    }
    const result = await db.insert(brand).values({
      brandId: body.brandId,
      brandName: body.brandName,
      brandShortName: body.brandShortName || null,
      brandImage: body.brandImage || null,
    });
    return NextResponse.json(
      { 
        success: true, 
        message: 'Brand created successfully',
        data: result
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('POST /api/brands error:', error);
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'ER_DUP_ENTRY'
    ) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Brand ID already exists' 
        },
        { status: 409 } // 409 = Conflict
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create brand',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
