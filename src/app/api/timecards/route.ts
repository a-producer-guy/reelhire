import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const productionId = searchParams.get("productionId");
  const status = searchParams.get("status");
  const weekEnding = searchParams.get("weekEnding");
  const contractorId = searchParams.get("contractorId");

  const where: Record<string, unknown> = {};
  if (productionId) where.productionId = productionId;
  if (status) where.status = status;
  if (weekEnding) where.weekEnding = new Date(weekEnding);
  if (contractorId) where.contractorId = contractorId;

  const timecards = await prisma.timecard.findMany({
    where,
    include: {
      contractor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          jobTitle: true,
          department: true,
        },
      },
      production: {
        select: { id: true, name: true, code: true },
      },
      entries: {
        orderBy: { date: "asc" },
        include: {
          scenes: {
            include: { scene: true },
          },
        },
      },
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
      contractorId: body.contractorId,
      productionId: body.productionId,
      weekEnding: new Date(body.weekEnding),
      workLocation: body.workLocation || "Studio",
      jobTitle: body.jobTitle,
      department: body.department,
      hourlyRate: body.hourlyRate,
      dayRate: body.dayRate,
      paymentTerms: body.paymentTerms || "NET_30",
      entries: {
        create: body.entries || [],
      },
      allowances: {
        create: body.allowances || [],
      },
    },
    include: {
      contractor: true,
      production: true,
      entries: true,
      allowances: true,
    },
  });

  return NextResponse.json(timecard, { status: 201 });
}
