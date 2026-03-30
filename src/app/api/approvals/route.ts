import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TimecardStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { timecardId, reviewerId, action, comment } = body;

  const review = await prisma.timecardReview.create({
    data: {
      timecardId,
      reviewerId,
      action,
      comment,
    },
  });

  let newStatus: TimecardStatus;
  switch (action) {
    case "APPROVED":
      newStatus = TimecardStatus.APPROVED;
      break;
    case "BYPASS_TO_FINAL":
      newStatus = TimecardStatus.SUBMITTED_TO_PAYROLL;
      break;
    case "RETURNED_TO_CONTRACTOR":
      newStatus = TimecardStatus.RETURNED;
      break;
    case "REVIEWED":
    case "TO_REVIEW":
      newStatus = TimecardStatus.UNDER_REVIEW;
      break;
    default:
      newStatus = TimecardStatus.UNDER_REVIEW;
  }

  // Calculate payment due date on approval
  const updateData: Record<string, unknown> = { status: newStatus };
  if (newStatus === TimecardStatus.APPROVED) {
    const timecard = await prisma.timecard.findUnique({
      where: { id: timecardId },
    });
    if (timecard) {
      const daysMap: Record<string, number> = {
        NET_30: 30,
        NET_45: 45,
        NET_60: 60,
      };
      const days = daysMap[timecard.paymentTerms] || 30;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + days);
      updateData.paymentDueDate = dueDate;
    }
  }

  await prisma.timecard.update({
    where: { id: timecardId },
    data: updateData,
  });

  return NextResponse.json(review, { status: 201 });
}
