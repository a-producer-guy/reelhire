"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, BarChart3, Clock, DollarSign, Film } from "lucide-react";

// Demo data: scene codes with cross-referenced timecard data
const SCENES = [
  {
    id: "sc-1",
    code: "SC-098",
    description: "Ext. Parking Lot - Night",
    estimatedBudget: 8000,
    totalHours: 24,
    totalCost: 1200,
    contractors: [
      { name: "RIFKIN, JOSH", hours: 8, rate: 50, cost: 400 },
      { name: "CLINT, BARRY", hours: 10, rate: 42.5, cost: 425 },
      { name: "MARTINEZ, SARAH", hours: 6, rate: 62.5, cost: 375 },
    ],
  },
  {
    id: "sc-2",
    code: "SC-099",
    description: "Int. Hallway - Day",
    estimatedBudget: 5000,
    totalHours: 16,
    totalCost: 820,
    contractors: [
      { name: "RIFKIN, JOSH", hours: 8, rate: 50, cost: 400 },
      { name: "WELLS, AARON", hours: 8, rate: 52.5, cost: 420 },
    ],
  },
  {
    id: "sc-3",
    code: "SC-100",
    description: "Int. Office - Day - Dialog",
    estimatedBudget: 12000,
    totalHours: 48,
    totalCost: 2460,
    contractors: [
      { name: "RIFKIN, JOSH", hours: 12, rate: 50, cost: 600 },
      { name: "CLINT, BARRY", hours: 14, rate: 42.5, cost: 595 },
      { name: "MARTINEZ, SARAH", hours: 10, rate: 62.5, cost: 625 },
      { name: "NEWKIRK, ANASTASIA", hours: 12, rate: 53.33, cost: 640 },
    ],
  },
  {
    id: "sc-4",
    code: "SC-101",
    description: "Int. Office - Day - Action",
    estimatedBudget: 15000,
    totalHours: 62,
    totalCost: 3175,
    contractors: [
      { name: "RIFKIN, JOSH", hours: 16, rate: 50, cost: 800 },
      { name: "CLINT, BARRY", hours: 18, rate: 42.5, cost: 765 },
      { name: "MARTINEZ, SARAH", hours: 12, rate: 62.5, cost: 750 },
      { name: "WELLS, AARON", hours: 8, rate: 52.5, cost: 420 },
      { name: "GALLOWAY, JAY", hours: 8, rate: 55, cost: 440 },
    ],
  },
  {
    id: "sc-5",
    code: "SC-102",
    description: "Ext. Rooftop - Sunset",
    estimatedBudget: 20000,
    totalHours: 36,
    totalCost: 1862.5,
    contractors: [
      { name: "RIFKIN, JOSH", hours: 10, rate: 50, cost: 500 },
      { name: "CLINT, BARRY", hours: 12, rate: 42.5, cost: 510 },
      { name: "MARTINEZ, SARAH", hours: 8, rate: 62.5, cost: 500 },
      { name: "MASTRIPPOLITO, BRANDON", hours: 6, rate: 58.75, cost: 352.5 },
    ],
  },
  {
    id: "sc-6",
    code: "SC-103",
    description: "Int. Warehouse - Night",
    estimatedBudget: 10000,
    totalHours: 28,
    totalCost: 1400,
    contractors: [
      { name: "CLINT, BARRY", hours: 14, rate: 42.5, cost: 595 },
      { name: "WELLS, AARON", hours: 14, rate: 52.5, cost: 735 },
    ],
  },
  {
    id: "sc-7",
    code: "SC-104",
    description: "Ext. Street - Day - Chase",
    estimatedBudget: 25000,
    totalHours: 72,
    totalCost: 3660,
    contractors: [
      { name: "RIFKIN, JOSH", hours: 14, rate: 50, cost: 700 },
      { name: "CLINT, BARRY", hours: 16, rate: 42.5, cost: 680 },
      { name: "MARTINEZ, SARAH", hours: 12, rate: 62.5, cost: 750 },
      { name: "WELLS, AARON", hours: 10, rate: 52.5, cost: 525 },
      { name: "GALLOWAY, JAY", hours: 12, rate: 55, cost: 660 },
      { name: "MILROY, CAMILLE", hours: 8, rate: 43.125, cost: 345 },
    ],
  },
  {
    id: "sc-8",
    code: "SC-115",
    description: "Int. Kitchen - Morning",
    estimatedBudget: 6000,
    totalHours: 18,
    totalCost: 900,
    contractors: [
      { name: "RIFKIN, JOSH", hours: 8, rate: 50, cost: 400 },
      { name: "NEWKIRK, ANASTASIA", hours: 10, rate: 53.33, cost: 500 },
    ],
  },
];

export default function ScenesPage() {
  const [search, setSearch] = useState("");
  const [expandedScene, setExpandedScene] = useState<string | null>(null);

  const filtered = SCENES.filter(
    (s) =>
      !search ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalBudget = SCENES.reduce((s, sc) => s + sc.estimatedBudget, 0);
  const totalSpent = SCENES.reduce((s, sc) => s + sc.totalCost, 0);
  const totalHours = SCENES.reduce((s, sc) => s + sc.totalHours, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Scene Code Cross-Reference
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track hours and costs by scene for What Now?
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Add Scene Code
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Film className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Scenes</p>
              <p className="text-xl font-bold text-slate-900">{SCENES.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Clock className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Hours</p>
              <p className="text-xl font-bold text-slate-900">
                {totalHours.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Cost</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(totalSpent)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Budget Remaining</p>
              <p className="text-xl font-bold text-emerald-600">
                {formatCurrency(totalBudget - totalSpent)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search scene codes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Scene codes table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Scene Code
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                Description
              </th>
              <th className="px-3 py-3 text-right font-semibold text-slate-600">
                Budget
              </th>
              <th className="px-3 py-3 text-right font-semibold text-slate-600">
                Spent
              </th>
              <th className="px-3 py-3 text-right font-semibold text-slate-600">
                Remaining
              </th>
              <th className="px-3 py-3 text-right font-semibold text-slate-600">
                Hours
              </th>
              <th className="px-3 py-3 text-center font-semibold text-slate-600">
                Crew
              </th>
              <th className="px-3 py-3 text-center font-semibold text-slate-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((scene) => {
              const remaining = scene.estimatedBudget - scene.totalCost;
              const pct = (scene.totalCost / scene.estimatedBudget) * 100;
              const isOver = remaining < 0;
              const isExpanded = expandedScene === scene.id;

              return (
                <>
                  <tr
                    key={scene.id}
                    className="border-b border-slate-100 hover:bg-violet-50/50 cursor-pointer transition-colors"
                    onClick={() =>
                      setExpandedScene(isExpanded ? null : scene.id)
                    }
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-violet-700 bg-violet-100 px-2 py-0.5 rounded">
                        {scene.code}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {scene.description}
                    </td>
                    <td className="px-3 py-3 text-right font-mono">
                      {formatCurrency(scene.estimatedBudget)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono">
                      {formatCurrency(scene.totalCost)}
                    </td>
                    <td
                      className={`px-3 py-3 text-right font-mono font-semibold ${
                        isOver ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {formatCurrency(remaining)}
                    </td>
                    <td className="px-3 py-3 text-right font-mono">
                      {scene.totalHours}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {scene.contractors.length}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge
                        variant={
                          pct > 90
                            ? isOver
                              ? "danger"
                              : "warning"
                            : "success"
                        }
                      >
                        {pct.toFixed(0)}% used
                      </Badge>
                    </td>
                  </tr>
                  {/* Expanded row: contractor breakdown */}
                  {isExpanded && (
                    <tr key={`${scene.id}-detail`}>
                      <td colSpan={8} className="bg-violet-50/50 px-8 py-4">
                        <h4 className="text-sm font-semibold text-violet-800 mb-3">
                          Contractor Hours for {scene.code}
                        </h4>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-slate-500">
                              <th className="text-left py-1 font-medium">
                                Contractor
                              </th>
                              <th className="text-right py-1 font-medium">
                                Rate
                              </th>
                              <th className="text-right py-1 font-medium">
                                Hours
                              </th>
                              <th className="text-right py-1 font-medium">
                                Cost
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {scene.contractors.map((c) => (
                              <tr
                                key={c.name}
                                className="border-t border-violet-200"
                              >
                                <td className="py-1.5 text-slate-700">
                                  {c.name}
                                </td>
                                <td className="py-1.5 text-right font-mono">
                                  {formatCurrency(c.rate)}/hr
                                </td>
                                <td className="py-1.5 text-right font-mono">
                                  {c.hours}
                                </td>
                                <td className="py-1.5 text-right font-mono font-semibold">
                                  {formatCurrency(c.cost)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Budget bar */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>
                              {formatCurrency(scene.totalCost)} of{" "}
                              {formatCurrency(scene.estimatedBudget)}
                            </span>
                            <span>{pct.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                isOver
                                  ? "bg-red-500"
                                  : pct > 80
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                              }`}
                              style={{
                                width: `${Math.min(pct, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-semibold text-sm">
              <td colSpan={2} className="px-4 py-3">
                Totals ({filtered.length} scenes)
              </td>
              <td className="px-3 py-3 text-right font-mono">
                {formatCurrency(totalBudget)}
              </td>
              <td className="px-3 py-3 text-right font-mono">
                {formatCurrency(totalSpent)}
              </td>
              <td className="px-3 py-3 text-right font-mono text-emerald-600">
                {formatCurrency(totalBudget - totalSpent)}
              </td>
              <td className="px-3 py-3 text-right font-mono">{totalHours}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
