import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TimecardStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { timecardId, reviewerId, action, comment } = body;

  // Create the review record
  const review = await prisma.timecardReview.create({
    data: {
      timecardId,
      reviewerId,
      action,
      comment,
      tier: body.tier || 1,
    },
  });

  // Update the timecard status based on the action
  let newStatus: TimecardStatus;
  switch (action) {
    case "APPROVED":
      newStatus = TimecardStatus.APPROVED;
      break;
    case "BYPASS_TO_FINAL":
      newStatus = TimecardStatus.SUBMITTED_TO_PAYROLL;
      break;
    case "RETURNED_TO_EMPLOYEE":
      newStatus = TimecardStatus.RETURNED;
      break;
    case "REVIEWED":
    case "TO_REVIEW":
      newStatus = TimecardStatus.UNDER_REVIEW;
      break;
    default:
      newStatus = TimecardStatus.UNDER_REVIEW;
  }

  await prisma.timecard.update({
    where: { id: timecardId },
    data: { status: newStatus },
  });

  return NextResponse.json(review, { status: 201 });
}
