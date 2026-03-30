import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const timecard = await prisma.timecard.findUnique({
    where: { id },
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
      production: { select: { id: true, name: true, code: true } },
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
  });

  if (!timecard) {
    return NextResponse.json({ error: "Timecard not found" }, { status: 404 });
  }

  return NextResponse.json(timecard);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const timecard = await prisma.timecard.update({
    where: { id },
    data: {
      status: body.status,
      workLocation: body.workLocation,
      totalHours: body.totalHours,
      totalStraight: body.totalStraight,
      totalOT15: body.totalOT15,
      totalOT2: body.totalOT2,
      totalAllowances: body.totalAllowances,
      totalPay: body.totalPay,
      contractorNotes: body.contractorNotes,
      adminNotes: body.adminNotes,
      payrollNotes: body.payrollNotes,
    },
  });

  return NextResponse.json(timecard);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.timecard.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
