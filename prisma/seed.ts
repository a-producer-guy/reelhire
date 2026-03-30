import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create users
  const admin = await prisma.user.upsert({
    where: { email: "guy@reelarc.com" },
    update: {},
    create: {
      email: "guy@reelarc.com",
      name: "Guy",
      role: "ADMIN",
      jobTitle: "Producer",
    },
  });

  const deptHead = await prisma.user.upsert({
    where: { email: "sarah.m@reelarc.com" },
    update: {},
    create: {
      email: "sarah.m@reelarc.com",
      name: "MARTINEZ, SARAH",
      role: "DEPARTMENT_HEAD",
      jobTitle: "Post Supervisor",
      department: "Post Production",
    },
  });

  const josh = await prisma.user.upsert({
    where: { email: "josh.rifkin@reelarc.com" },
    update: {},
    create: {
      email: "josh.rifkin@reelarc.com",
      name: "RIFKIN, JOSH",
      role: "CREW_MEMBER",
      jobTitle: "Editor",
      unionLocal: "700",
      department: "Post Production",
    },
  });

  const barry = await prisma.user.upsert({
    where: { email: "barry.clint@reelarc.com" },
    update: {},
    create: {
      email: "barry.clint@reelarc.com",
      name: "CLINT, BARRY",
      role: "CREW_MEMBER",
      jobTitle: "Company Grip",
      unionLocal: "80",
      department: "Grip",
    },
  });

  const aaron = await prisma.user.upsert({
    where: { email: "aaron.wells@reelarc.com" },
    update: {},
    create: {
      email: "aaron.wells@reelarc.com",
      name: "WELLS, AARON",
      role: "CREW_MEMBER",
      jobTitle: "Assistant Snake Wrangler",
      department: "Animals",
    },
  });

  // Create production
  const production = await prisma.production.upsert({
    where: { code: "WHATNOW" },
    update: {},
    create: {
      name: "What Now?",
      code: "WHATNOW",
      description: "Feature film production",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-06-30"),
      isActive: true,
    },
  });

  // Add members to production
  for (const user of [admin, deptHead, josh, barry, aaron]) {
    await prisma.productionMember.upsert({
      where: {
        productionId_userId: {
          productionId: production.id,
          userId: user.id,
        },
      },
      update: {},
      create: {
        productionId: production.id,
        userId: user.id,
        role: user.role,
        department: user.department,
        jobTitle: user.jobTitle,
        rateType: user.unionLocal ? "Union/Custom" : "Flat Rate",
        weeklyRate:
          user.id === josh.id
            ? 1732.5
            : user.id === barry.id
              ? null
              : 1500,
        hourlyRate:
          user.id === josh.id
            ? 28.875
            : user.id === barry.id
              ? 42.5
              : 25,
        guaranteedHours: user.unionLocal ? 60 : null,
      },
    });
  }

  // Create shoot account
  await prisma.shootAccount.create({
    data: {
      productionId: production.id,
      accountCode: "4501",
      name: "Main Production",
      ff1: "4599",
    },
  });

  // Create a sample timecard for Josh
  const weekEnding = new Date("2026-03-28");
  const timecard = await prisma.timecard.create({
    data: {
      employeeId: josh.id,
      productionId: production.id,
      weekEnding,
      status: "EMPLOYEE_COMPLETED",
      workLocation: "CA - Glendale",
      studio: "Studio",
      jobTitle: "Editor",
      unionLocal: "700",
      department: "Post Production",
      accountCode: "4501",
      ff1: "4599",
      weeklyRate: 1732.5,
      hourlyRate: 28.875,
      guaranteedHours: 60,
      payType: "Union/Custom",
      totalStraight: 24,
      totalOT15: 12,
      totalOT2: 0,
      totalAllowances: 60,
      totalPenalties: 0,
      totalPay: 1099.5,
      entries: {
        create: [
          {
            date: new Date("2026-03-22"),
            dayOfWeek: "Sun",
            payType: "NOT_WORKED",
            location: "CA",
          },
          {
            date: new Date("2026-03-23"),
            dayOfWeek: "Mon",
            payType: "WORKED",
            location: "CA",
            timeIn: "06:00",
            meal1Out: "12:00",
            meal1In: "13:00",
            timeOut: "19:00",
            straightTime: 8,
            ot15: 4,
            totalHours: 12,
          },
          {
            date: new Date("2026-03-24"),
            dayOfWeek: "Tue",
            payType: "WORKED",
            location: "CA",
            timeIn: "06:00",
            meal1Out: "12:00",
            meal1In: "13:00",
            timeOut: "19:00",
            straightTime: 8,
            ot15: 4,
            totalHours: 12,
          },
          {
            date: new Date("2026-03-25"),
            dayOfWeek: "Wed",
            payType: "NOT_WORKED",
            location: "CA",
          },
          {
            date: new Date("2026-03-26"),
            dayOfWeek: "Thu",
            payType: "WORKED",
            location: "CA",
            timeIn: "06:00",
            meal1Out: "12:00",
            meal1In: "13:00",
            timeOut: "19:00",
            straightTime: 8,
            ot15: 4,
            totalHours: 12,
          },
          {
            date: new Date("2026-03-27"),
            dayOfWeek: "Fri",
            payType: "NOT_WORKED",
            location: "CA",
          },
          {
            date: new Date("2026-03-28"),
            dayOfWeek: "Sat",
            payType: "UNPAID_DAY",
            location: "CA",
          },
        ],
      },
      allowances: {
        create: [
          {
            type: "Kit/Box Rental NT",
            rate: 20,
            daysWorked: 3,
            amount: 60,
            isTaxable: false,
          },
        ],
      },
    },
  });

  console.log("Seed completed:");
  console.log(`  Users: ${admin.name}, ${deptHead.name}, ${josh.name}, ${barry.name}, ${aaron.name}`);
  console.log(`  Production: ${production.name}`);
  console.log(`  Timecard: ${timecard.id} for ${josh.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
