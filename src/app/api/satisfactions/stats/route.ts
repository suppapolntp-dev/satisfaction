// src/app/api/satisfactions/stats/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";
import { satisfaction, branch, areaBranch, userBranch } from "@/db/schema";
import { eq, and, gte, lte, inArray, sql } from "drizzle-orm";

// GET /api/satisfactions/stats
// query params: brandId, branchId, branchIds, areaId, noAccess, startDate, endDate
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId   = searchParams.get("brandId");
    const branchId  = searchParams.get("branchId");   // admin filter — branch เดียว
    const branchIds = searchParams.get("branchIds");  // user สาขา — หลาย branch
    const areaId    = searchParams.get("areaId");     // operation/RM/AM
    const noAccess  = searchParams.get("noAccess");   // ไม่มีสิทธิ์
    const startDate = searchParams.get("startDate");
    const endDate   = searchParams.get("endDate");

    // ── ไม่มีสิทธิ์ → return ว่างเลย ──
    if (noAccess === "1") {
      return NextResponse.json({ success: true, data: emptyStats() });
    }

    const conditions: ReturnType<typeof eq>[] = [];

    // ── filter by scope ──
    if (branchId) {
      // admin เลือก branch เดียว — filter ตาม branchId ตรงๆ
      conditions.push(eq(satisfaction.branchId, Number(branchId)) as ReturnType<typeof eq>);

    } else if (branchIds) {
      // user สาขา — หลาย branch
      const ids = branchIds.split(",").map(Number).filter(Boolean);
      if (ids.length === 0) return NextResponse.json({ success: true, data: emptyStats() });
      conditions.push(inArray(satisfaction.branchId, ids) as ReturnType<typeof eq>);

    } else if (areaId) {
      // operation/RM/AM — lookup ผ่าน AreaBranch → branchIds
      const abRows = await db.select({ branchId: areaBranch.branchId })
        .from(areaBranch)
        .where(eq(areaBranch.areaId, Number(areaId)));
      const abranchIds = abRows.map((r) => r.branchId);
      if (abranchIds.length === 0) return NextResponse.json({ success: true, data: emptyStats() });
      conditions.push(inArray(satisfaction.branchId, abranchIds) as ReturnType<typeof eq>);

    } else if (brandId) {
      // admin เลือก brand — lookup ผ่าน Branch → branchIds
      const branchRows = await db.select({ branchId: branch.branchId })
        .from(branch)
        .where(eq(branch.brandId, Number(brandId)));
      const bIds = branchRows.map((r) => r.branchId);
      if (bIds.length === 0) return NextResponse.json({ success: true, data: emptyStats() });
      conditions.push(inArray(satisfaction.branchId, bIds) as ReturnType<typeof eq>);
    }
    // ไม่มี param ใดเลย = canViewAll ดูทั้งหมด

    // ── filter by date range ──
    if (startDate) {
      conditions.push(gte(satisfaction.createdAt, new Date(startDate)) as ReturnType<typeof eq>);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      conditions.push(lte(satisfaction.createdAt, end) as ReturnType<typeof eq>);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // ── query จำนวนรวม + แยกประเภท ──
    const rows = await db
      .select({
        satisfactionName: satisfaction.satisfactionName,
        count: sql<number>`COUNT(*)`.as("count"),
      })
      .from(satisfaction)
      .where(whereClause)
      .groupBy(satisfaction.satisfactionName);

    const totalRow = await db
      .select({ total: sql<number>`COUNT(*)`.as("total") })
      .from(satisfaction)
      .where(whereClause);

    const total = Number(totalRow[0]?.total ?? 0);
    const counts = { good: 0, average: 0, poor: 0 };

    rows.forEach((r) => {
      const n = Number(r.count);
      if (r.satisfactionName === "ดี")      counts.good    = n;
      if (r.satisfactionName === "ปานกลาง") counts.average = n;
      if (r.satisfactionName === "แย่")     counts.poor    = n;
    });

    const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

    return NextResponse.json({
      success: true,
      data: {
        total,
        counts,
        percentages: {
          good:    pct(counts.good),
          average: pct(counts.average),
          poor:    pct(counts.poor),
        },
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("GET /api/satisfactions/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

function emptyStats() {
  return {
    total: 0,
    counts:      { good: 0, average: 0, poor: 0 },
    percentages: { good: 0, average: 0, poor: 0 },
    updatedAt:   new Date().toISOString(),
  };
}