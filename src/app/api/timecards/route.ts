import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productionId = searchParams.get("productionId");
  const status = searchParams.get("status");
  const weekEnding = searchParams.get("weekEnding");

  const where: Record<string, unknown> = {};
  if (productionId) where.productionId = productionId;
  if (status) where.status = status;
  if (weekEnding) where.weekEnding = new Date(weekEnding);

  const timecards = await prisma.timecard.findMany({
    where,
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          jobTitle: true,
          unionLocal: true,
          department: true,
        },
      },
      production: {
        select: { id: true, name: true, code: true },
      },
      entries: { orderBy: { date: "asc" } },
      allowances: true,
      reviews: {
        include: {
          reviewer: { select: { id: true, name: true, role: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(timecards);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const timecard = await prisma.timecard.create({
    data: {
      employeeId: body.employeeId,
      productionId: body.productionId,
      weekEnding: new Date(body.weekEnding),
      workLocation: body.workLocation,
      studio: body.studio,
      jobTitle: body.jobTitle,
      unionLocal: body.unionLocal,
      department: body.department,
      accountCode: body.accountCode,
      weeklyRate: body.weeklyRate,
      hourlyRate: body.hourlyRate,
      guaranteedHours: body.guaranteedHours,
      payType: body.payType,
      entries: {
        create: body.entries || [],
      },
      allowances: {
        create: body.allowances || [],
      },
    },
    include: {
      employee: true,
      production: true,
      entries: true,
      allowances: true,
    },
  });

  return NextResponse.json(timecard, { status: 201 });
}
