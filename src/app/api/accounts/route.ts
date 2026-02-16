
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { account } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
 
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await db
        .select()
        .from(account)
        .where(eq(account.userId, Number(id)));

      // ถ้าไม่เจอข้อมูล
      if (result.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Account not found' 
          },
          { status: 404 }
        );
      }

      
      return NextResponse.json({ 
        success: true, 
        data: result[0] 
      });
    }

    
    const accounts = await db.select().from(account);

    return NextResponse.json({ 
      success: true, 
      data: accounts,
      count: accounts.length
    });
    
  } catch (error: unknown) {
    console.error('GET /api/accounts error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch accounts',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
   
    const body = await request.json();

    
    if (!body.userId || !body.userName || !body.userPassword) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'userId, userName, and userPassword are required' 
        },
        { status: 400 }
      );
    }

    
    if (body.userRole !== undefined) {
      if (![0, 1, 2].includes(body.userRole)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'userRole must be 0 (Block), 1 (User), or 2 (Admin)' 
          },
          { status: 400 }
        );
      }
    }
    
    const result = await db.insert(account).values({
      userId: body.userId,
      userName: body.userName,
      userPassword: body.userPassword,  // ⚠️ ควร hash ด้วย bcrypt ก่อน!
      userRole: body.userRole ?? 1,     // Default = 1 (User)
      branchId: body.branchId ?? null,
    });
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Account created successfully',
        data: result
      },
      { status: 201 }
    );
    
  } catch (error: unknown) {
    console.error('POST /api/accounts error:', error);

   
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'ER_DUP_ENTRY'
    ) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Username already exists' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create account',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'userId is required' 
        },
        { status: 400 }
      );
    }

    const updateData: Partial<{
      userName: string;
      userRole: number;
      branchId: number;
      userPassword: string;
    }> = {};
    
    if (body.userName !== undefined) updateData.userName = body.userName;
    if (body.userRole !== undefined) updateData.userRole = body.userRole;
    if (body.branchId !== undefined) updateData.branchId = body.branchId;

    if (body.userPassword !== undefined) {
      updateData.userPassword = body.userPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No data to update' 
        },
        { status: 400 }
      );
    }

 
    if (updateData.userRole !== undefined) {
      if (![0, 1, 2].includes(updateData.userRole)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'userRole must be 0 (Block), 1 (User), or 2 (Admin)' 
          },
          { status: 400 }
        );
      }
    }

    const result = await db
      .update(account)
      .set(updateData)
      .where(eq(account.userId, body.userId));

    return NextResponse.json({ 
      success: true, 
      message: 'Account updated successfully',
      data: result
    });

  } catch (error: unknown) {
    console.error('PUT /api/accounts error:', error);

    
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'ER_DUP_ENTRY'
    ) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Username already exists' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update account',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get('id');

    if (!userId) {
      const body = await request.json();
      userId = body.userId;
    }

    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'userId is required' 
        },
        { status: 400 }
      );
    }

    
    const result = await db
      .delete(account)
      .where(eq(account.userId, Number(userId)));

    return NextResponse.json({ 
      success: true, 
      message: 'Account deleted successfully',
      data: result
    });

  } catch (error: unknown) {
    console.error('DELETE /api/accounts error:', error);

    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'ER_ROW_IS_REFERENCED_2'
    ) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete account. It has related satisfaction records. Consider setting userRole to 0 (Block) instead.' 
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete account',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
