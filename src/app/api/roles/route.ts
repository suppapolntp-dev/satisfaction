// src/app/api/roles/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { role } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const result = await db.select().from(role).where(eq(role.roleId, Number(id)));
      if (result.length === 0)
        return NextResponse.json({ success: false, error: 'Role not found' }, { status: 404 });
      return NextResponse.json({ success: true, data: result[0] });
    }

    const roles = await db.select().from(role);
    return NextResponse.json({ success: true, data: roles, count: roles.length });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch roles', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.roleName)
      return NextResponse.json({ success: false, error: 'roleName is required' }, { status: 400 });

    const result = await db.insert(role).values({
      roleName:            body.roleName,
      canViewAll:          body.canViewAll          ?? 0,  // ← ใหม่
      canViewDashboard:    body.canViewDashboard    ?? 0,
      canViewSatisfaction: body.canViewSatisfaction ?? 0,
      canManageBrand:      body.canManageBrand      ?? 0,
      canManageBranch:     body.canManageBranch     ?? 0,
      canManageArea:       body.canManageArea       ?? 0,
      canManageUser:       body.canManageUser       ?? 0,
      canManageRole:       body.canManageRole       ?? 0,
      isActive:            body.isActive            ?? 1,
    });

    return NextResponse.json(
      { success: true, message: 'Role created successfully', data: result },
      { status: 201 }
    );

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to create role', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.roleId)
      return NextResponse.json({ success: false, error: 'roleId is required' }, { status: 400 });

    const updateData: Partial<{
      roleName:            string;
      canViewAll:          number;
      canViewDashboard:    number;
      canViewSatisfaction: number;
      canManageBrand:      number;
      canManageBranch:     number;
      canManageArea:       number;
      canManageUser:       number;
      canManageRole:       number;
      isActive:            number;
    }> = {};

    if (body.roleName            !== undefined) updateData.roleName            = body.roleName;
    if (body.canViewAll          !== undefined) updateData.canViewAll          = body.canViewAll;  // ← ใหม่
    if (body.canViewDashboard    !== undefined) updateData.canViewDashboard    = body.canViewDashboard;
    if (body.canViewSatisfaction !== undefined) updateData.canViewSatisfaction = body.canViewSatisfaction;
    if (body.canManageBrand      !== undefined) updateData.canManageBrand      = body.canManageBrand;
    if (body.canManageBranch     !== undefined) updateData.canManageBranch     = body.canManageBranch;
    if (body.canManageArea       !== undefined) updateData.canManageArea       = body.canManageArea;
    if (body.canManageUser       !== undefined) updateData.canManageUser       = body.canManageUser;
    if (body.canManageRole       !== undefined) updateData.canManageRole       = body.canManageRole;
    if (body.isActive            !== undefined) updateData.isActive            = body.isActive;

    if (Object.keys(updateData).length === 0)
      return NextResponse.json({ success: false, error: 'No data to update' }, { status: 400 });

    const result = await db.update(role).set(updateData).where(eq(role.roleId, body.roleId));
    return NextResponse.json({ success: true, message: 'Role updated successfully', data: result });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to update role', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id)
      return NextResponse.json({ success: false, error: 'roleId is required' }, { status: 400 });

    const result = await db.delete(role).where(eq(role.roleId, Number(id)));
    return NextResponse.json({ success: true, message: 'Role deleted successfully', data: result });

  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete role', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}