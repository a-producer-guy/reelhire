import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create admin user (Guy @ Reelarc)
  const admin = await prisma.user.upsert({
    where: { email: "guy@reelarc.com" },
    update: {},
    create: {
      email: "guy@reelarc.com",
      name: "Guy Chachkes",
      role: "ADMIN",
      jobTitle: "Producer",
      paymentTerms: "NET_30",
    },
  });

  // Create contractors (filmmakers)
  const josh = await prisma.user.upsert({
    where: { email: "josh@reelarc.com" },
    update: {},
    create: {
      email: "josh@reelarc.com",
      name: "RIFKIN, JOSH",
      role: "CONTRACTOR",
      jobTitle: "Editor",
      department: "Post Production",
      hourlyRate: 50,
      paymentTerms: "NET_30",
    },
  });

  const sarah = await prisma.user.upsert({
    where: { email: "sarah@reelarc.com" },
    update: {},
    create: {
      email: "sarah@reelarc.com",
      name: "MARTINEZ, SARAH",
      role: "CONTRACTOR",
      jobTitle: "Colorist",
      department: "Post Production",
      hourlyRate: 62.5,
      paymentTerms: "NET_45",
    },
  });

  const barry = await prisma.user.upsert({
    where: { email: "barry@reelarc.com" },
    update: {},
    create: {
      email: "barry@reelarc.com",
      name: "CLINT, BARRY",
      role: "CONTRACTOR",
      jobTitle: "Gaffer",
      department: "Electric",
      hourlyRate: 42.5,
      paymentTerms: "NET_30",
    },
  });

  const aaron = await prisma.user.upsert({
    where: { email: "aaron@reelarc.com" },
    update: {},
    create: {
      email: "aaron@reelarc.com",
      name: "WELLS, AARON",
      role: "CONTRACTOR",
      jobTitle: "Camera Operator",
      department: "Camera",
      hourlyRate: 52.5,
      paymentTerms: "NET_60",
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

  // Add production members
  for (const user of [admin, josh, sarah, barry, aaron]) {
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
        rateType: "Hourly",
        hourlyRate: user.hourlyRate,
        paymentTerms: user.paymentTerms,
      },
    });
  }

  // Create scene codes
  const sceneCodes = [
    { code: "SC-098", description: "Ext. Parking Lot - Night", budget: 8000 },
    { code: "SC-099", description: "Int. Hallway - Day", budget: 5000 },
    { code: "SC-100", description: "Int. Office - Day - Dialog", budget: 12000 },
    { code: "SC-101", description: "Int. Office - Day - Action", budget: 15000 },
    { code: "SC-102", description: "Ext. Rooftop - Sunset", budget: 20000 },
    { code: "SC-103", description: "Int. Warehouse - Night", budget: 10000 },
    { code: "SC-104", description: "Ext. Street - Day - Chase", budget: 25000 },
    { code: "SC-115", description: "Int. Kitchen - Morning", budget: 6000 },
    { code: "SC-116", description: "Int. Bedroom - Night", budget: 4000 },
    { code: "SC-120", description: "Ext. Beach - Golden Hour", budget: 18000 },
  ];

  for (const sc of sceneCodes) {
    await prisma.scene.upsert({
      where: {
        productionId_code: {
          productionId: production.id,
          code: sc.code,
        },
      },
      update: {},
      create: {
        productionId: production.id,
        code: sc.code,
        description: sc.description,
        estimatedBudget: sc.budget,
      },
    });
  }

  // Create a sample timecard for Josh
  const timecard = await prisma.timecard.create({
    data: {
      contractorId: josh.id,
      productionId: production.id,
      weekEnding: new Date("2026-03-28"),
      status: "SUBMITTED",
      workLocation: "Studio",
      jobTitle: "Editor",
      department: "Post Production",
      hourlyRate: 50,
      paymentTerms: "NET_30",
      totalHours: 36,
      totalStraight: 32,
      totalOT15: 4,
      totalPay: 1900,
      entries: {
        create: [
          { date: new Date("2026-03-22"), dayOfWeek: "Sun", payType: "NOT_WORKED" },
          { date: new Date("2026-03-23"), dayOfWeek: "Mon", payType: "WORKED", timeIn: "09:00", meal1Out: "12:30", meal1In: "13:30", timeOut: "18:00", straightTime: 8, totalHours: 8 },
          { date: new Date("2026-03-24"), dayOfWeek: "Tue", payType: "WORKED", timeIn: "09:00", meal1Out: "12:30", meal1In: "13:30", timeOut: "18:00", straightTime: 8, totalHours: 8 },
          { date: new Date("2026-03-25"), dayOfWeek: "Wed", payType: "WORKED", timeIn: "09:00", meal1Out: "12:30", meal1In: "13:30", timeOut: "20:00", straightTime: 8, ot15: 2, totalHours: 10 },
          { date: new Date("2026-03-26"), dayOfWeek: "Thu", payType: "WORKED", timeIn: "09:00", meal1Out: "12:30", meal1In: "13:30", timeOut: "20:00", straightTime: 8, ot15: 2, totalHours: 10 },
          { date: new Date("2026-03-27"), dayOfWeek: "Fri", payType: "NOT_WORKED" },
          { date: new Date("2026-03-28"), dayOfWeek: "Sat", payType: "NOT_WORKED" },
        ],
      },
    },
  });

  console.log("Seed completed:");
  console.log(`  Admin: ${admin.name} (${admin.email})`);
  console.log(`  Contractors: ${josh.name}, ${sarah.name}, ${barry.name}, ${aaron.name}`);
  console.log(`  Production: ${production.name}`);
  console.log(`  Scenes: ${sceneCodes.length} scene codes created`);
  console.log(`  Timecard: ${timecard.id} for ${josh.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
