// import { NextResponse } from 'next/server';
// import { db } from '@/database';
// import { satisfaction, account, branch } from '@/database/schema';
// import { sql } from 'drizzle-orm';
// import { eq, gte, lte, and } from 'drizzle-orm';

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId');
//     const branchId = searchParams.get('branchId');
//     const startDate = searchParams.get('startDate');
//     const endDate = searchParams.get('endDate');
//     const conditions = [];

//     if (userId) {
//       conditions.push(eq(satisfaction.userId, Number(userId)));
//     }
//     if (branchId) {
//     }
//     if (startDate && endDate) {
//       conditions.push(
//         and(
//           gte(satisfaction.createdAt, startDate),
//           lte(satisfaction.createdAt, endDate)
//         )
//       );
//     } else if (startDate) {
//       conditions.push(gte(satisfaction.createdAt, startDate));
//     } else if (endDate) {
//       conditions.push(lte(satisfaction.createdAt, endDate));
//     }
//     let statsQuery = db
//       .select({
//         satisfactionName: satisfaction.satisfactionName,
//         count: sql<number>`COUNT(*)`.as('count')
//       })
//       .from(satisfaction);

//     if (conditions.length > 0) {
//       statsQuery = statsQuery.where(and(...conditions));
//     }

//     const statsResult = await statsQuery.groupBy(satisfaction.satisfactionName);

//     let totalQuery = db
//       .select({
//         total: sql<number>`COUNT(*)`.as('total')
//       })
//       .from(satisfaction);

//     if (conditions.length > 0) {
//       totalQuery = totalQuery.where(and(...conditions));
//     }

//     const totalResult = await totalQuery;
//     const total = Number(totalResult[0]?.total || 0);

//     const counts = {
//       good: 0,      // ดี
//       average: 0,   // ปานกลาง
//       poor: 0       // แย่
//     };

//     statsResult.forEach(row => {
//       const name = row.satisfactionName || '';
//       const count = Number(row.count);

//       switch (name) {
//         case 'ดี':
//           counts.good = count;
//           break;
//         case 'ปานกลาง':
//           counts.average = count;
//           break;
//         case 'แย่':
//           counts.poor = count;
//           break;
//       }
//     });

//     const percentages = {
//       good: total > 0 ? Number(((counts.good / total) * 100).toFixed(2)) : 0,
//       average: total > 0 ? Number(((counts.average / total) * 100).toFixed(2)) : 0,
//       poor: total > 0 ? Number(((counts.poor / total) * 100).toFixed(2)) : 0,
//     };

//     return NextResponse.json({
//       success: true,
//       data: {
//         total,
//         counts,
//         percentages
//       },
//       filters: {
//         userId: userId ? Number(userId) : null,
//         branchId: branchId ? Number(branchId) : null,
//         startDate: startDate || null,
//         endDate: endDate || null,
//       }
//     });

//   } catch (error: unknown) {
//     console.error('GET /api/satisfaction/stats error:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: 'Failed to fetch satisfaction statistics',
//         details: error instanceof Error ? error.message : String(error)
//       },
//       { status: 500 }
//     );
//   }
// }