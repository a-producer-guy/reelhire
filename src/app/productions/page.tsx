"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Film, Users, Clock } from "lucide-react";
import Link from "next/link";

const PRODUCTIONS = [
  {
    id: "prod-1",
    name: "What Now?",
    code: "WHATNOW",
    status: "Active",
    crewCount: 45,
    openTimecards: 6,
    startDate: "2026-01-15",
    endDate: "2026-06-30",
  },
  {
    id: "prod-2",
    name: "Desert Storm II",
    code: "DS2",
    status: "Active",
    crewCount: 120,
    openTimecards: 24,
    startDate: "2026-02-01",
    endDate: "2026-08-15",
  },
  {
    id: "prod-3",
    name: "Night Shift",
    code: "NIGHTSHIFT",
    status: "Pre-Production",
    crewCount: 12,
    openTimecards: 0,
    startDate: "2026-04-01",
    endDate: null,
  },
];

export default function ProductionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Productions</h1>
        <Button>
          <Plus className="h-4 w-4" />
          New Production
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRODUCTIONS.map((prod) => (
          <Link key={prod.id} href={`/dashboard`}>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-sky-300 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">
                    {prod.name}
                  </h3>
                  <p className="text-sm text-slate-500">{prod.code}</p>
                </div>
                <Badge
                  variant={
                    prod.status === "Active" ? "success" : "info"
                  }
                >
                  {prod.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>{prod.crewCount} crew</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{prod.openTimecards} open</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Film className="h-4 w-4 text-slate-400" />
                  <span>
                    {new Date(prod.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
