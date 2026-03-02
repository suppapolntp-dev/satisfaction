import { NextResponse } from 'next/server';
import { db } from '@/db';
import { account } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await db.select().from(account).where(eq(account.userId, Number(id)));
      if (result.length === 0)
        return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: result[0] });
    }

    const accounts = await db.select().from(account);
    return NextResponse.json({ success: true, data: accounts, count: accounts.length });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch accounts', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.userName || !body.userPassword || !body.roleId) {
      return NextResponse.json(
        { success: false, error: 'userName, userPassword and roleId are required' },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(body.userPassword, 10);

    const result = await db.insert(account).values({
      userName:     body.userName,
      userPassword: hashed,
      roleId:       body.roleId,
      areaId:       body.areaId ?? null,
    });

    return NextResponse.json(
      { success: true, message: 'Account created successfully', data: result },
      { status: 201 }
    );

  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error &&
      (error as { code: string }).code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, error: 'Username already exists' }, { status: 409 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create account', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json({ success: false, error: 'userId is required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (body.roleId       !== undefined) updates.roleId  = body.roleId;
    if (body.areaId       !== undefined) updates.areaId  = body.areaId;
    if (body.userPassword)               updates.userPassword = await bcrypt.hash(body.userPassword, 10);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
    }

    await db.update(account).set(updates).where(eq(account.userId, Number(body.userId)));
    return NextResponse.json({ success: true, message: 'Account updated successfully' });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to update account', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });

    await db.delete(account).where(eq(account.userId, Number(id)));
    return NextResponse.json({ success: true, message: 'Account deleted successfully' });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete account', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}