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
      production: { select: { id: true, name: true, code: true } },
      entries: { orderBy: { date: "asc" } },
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

  // Update timecard and recalculate totals
  const timecard = await prisma.timecard.update({
    where: { id },
    data: {
      status: body.status,
      workLocation: body.workLocation,
      studio: body.studio,
      accountCode: body.accountCode,
      totalStraight: body.totalStraight,
      totalOT15: body.totalOT15,
      totalOT2: body.totalOT2,
      totalForced: body.totalForced,
      totalAllowances: body.totalAllowances,
      totalPenalties: body.totalPenalties,
      totalPay: body.totalPay,
      dailyComments: body.dailyComments,
      employeeComments: body.employeeComments,
      employerComments: body.employerComments,
      payrollComments: body.payrollComments,
    },
  });

  // Update entries if provided
  if (body.entries) {
    for (const entry of body.entries) {
      if (entry.id) {
        await prisma.timecardEntry.update({
          where: { id: entry.id },
          data: entry,
        });
      }
    }
  }

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
