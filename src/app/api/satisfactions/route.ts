import { NextResponse } from 'next/server';
import { db } from '@/db';
import { satisfaction, account } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    /**
     * ดึงข้อมูลทั้งหมด
     * SQL: SELECT * FROM Satisfaction
     */
    const results = await db.select().from(satisfaction);

    return NextResponse.json({ 
      success: true, 
      data: results,
      count: results.length
    });

  } catch (error: unknown) {
    console.error('GET /api/satisfaction error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch satisfaction records',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();

    /**
     * ตรวจสอบข้อมูลที่จำเป็น
     */
    if (!body.satisfactionId || !body.userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'satisfactionId and userId are required' 
        },
        { status: 400 }
      );
    }

    if (body.satisfactionName) {
      const validNames = ['ดี', 'ปานกลาง', 'แย่'];
      if (!validNames.includes(body.satisfactionName)) {
        return NextResponse.json(
          { 
            success: false, 
            error: `satisfactionName must be one of: ${validNames.join(', ')}` 
          },
          { status: 400 }
        );
      }
    }

    const userExists = await db
      .select()
      .from(account)
      .where(eq(account.userId, body.userId));

    if (userExists.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `User with ID ${body.userId} does not exist` 
        },
        { status: 404 }
      );
    }

    const result = await db.insert(satisfaction).values({
      satisfactionId: body.satisfactionId,
      satisfactionName: body.satisfactionName || null,
      userId: body.userId,
    });

    const newRecord = await db
      .select()
      .from(satisfaction)
      .where(eq(satisfaction.satisfactionId, body.satisfactionId));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Satisfaction record created successfully',
        data: newRecord[0]
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('POST /api/satisfaction error:', error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'ER_DUP_ENTRY'
    ) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Satisfaction ID already exists' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create satisfaction record',
        details: error instanceof Error ? error.message : String(error)
      },
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

    if (!satisfactionId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'satisfactionId is required' 
        },
        { status: 400 }
      );
    }

    const result = await db
      .delete(satisfaction)
      .where(eq(satisfaction.satisfactionId, Number(satisfactionId)));

    return NextResponse.json({ 
      success: true, 
      message: 'Satisfaction record deleted successfully',
      data: result
    });

  } catch (error: unknown) {
    console.error('DELETE /api/satisfaction error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete satisfaction record',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
