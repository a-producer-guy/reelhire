import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const productionId = request.nextUrl.searchParams.get("productionId");

  const where: Record<string, unknown> = {};
  if (productionId) where.productionId = productionId;

  const scenes = await prisma.scene.findMany({
    where,
    include: {
      timecardScenes: {
        include: {
          timecardEntry: {
            include: {
              timecard: {
                include: {
                  contractor: {
                    select: { id: true, name: true, jobTitle: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { code: "asc" },
  });

  // Transform to include summary data
  const enriched = scenes.map((scene) => {
    const totalHours = scene.timecardScenes.reduce((sum, ts) => sum + ts.hours, 0);
    const contractors = new Map<string, { name: string; hours: number; rate: number }>();

    scene.timecardScenes.forEach((ts) => {
      const tc = ts.timecardEntry.timecard;
      const key = tc.contractorId;
      const existing = contractors.get(key);
      if (existing) {
        existing.hours += ts.hours;
      } else {
        contractors.set(key, {
          name: tc.contractor.name,
          hours: ts.hours,
          rate: tc.hourlyRate || 0,
        });
      }
    });

    const contractorList = Array.from(contractors.values()).map((c) => ({
      ...c,
      cost: c.hours * c.rate,
    }));

    const totalCost = contractorList.reduce((sum, c) => sum + c.cost, 0);

    return {
      id: scene.id,
      code: scene.code,
      description: scene.description,
      estimatedBudget: scene.estimatedBudget,
      isActive: scene.isActive,
      totalHours,
      totalCost,
      contractors: contractorList,
    };
  });

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const scene = await prisma.scene.create({
    data: {
      productionId: body.productionId,
      code: body.code,
      description: body.description,
      estimatedBudget: body.estimatedBudget,
    },
  });

  return NextResponse.json(scene, { status: 201 });
}
