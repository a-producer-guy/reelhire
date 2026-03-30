"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Send, Download, FileText, DollarSign } from "lucide-react";

const PAYROLL_BATCHES = [
  {
    id: "batch-1",
    weekEnding: "03/28/2026",
    production: "What Now?",
    status: "pending",
    timecards: 3,
    totalGross: 5659.5,
    submittedBy: null,
  },
  {
    id: "batch-2",
    weekEnding: "03/21/2026",
    production: "What Now?",
    status: "submitted",
    timecards: 12,
    totalGross: 28450.0,
    submittedBy: "Guy",
  },
  {
    id: "batch-3",
    weekEnding: "03/14/2026",
    production: "What Now?",
    status: "processed",
    timecards: 15,
    totalGross: 35200.0,
    submittedBy: "Guy",
  },
  {
    id: "batch-4",
    weekEnding: "03/21/2026",
    production: "Desert Storm II",
    status: "submitted",
    timecards: 24,
    totalGross: 72100.0,
    submittedBy: "Guy",
  },
];

const statusVariant: Record<string, "warning" | "info" | "success"> = {
  pending: "warning",
  submitted: "info",
  processed: "success",
};

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Payroll</h1>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button>
            <Send className="h-4 w-4" />
            Submit for Processing
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Pending Review", value: "$5,659.50", count: "3 timecards", color: "text-amber-600" },
          { label: "Submitted to Payroll", value: "$100,550.00", count: "36 timecards", color: "text-sky-600" },
          { label: "Processed This Month", value: "$35,200.00", count: "15 timecards", color: "text-emerald-600" },
          { label: "Total This Month", value: "$141,409.50", count: "54 timecards", color: "text-slate-900" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>
              {card.value}
            </p>
            <p className="text-xs text-slate-400 mt-1">{card.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select
          options={[
            { value: "", label: "All Productions" },
            { value: "prod-1", label: "What Now?" },
            { value: "prod-2", label: "Desert Storm II" },
          ]}
          className="w-48"
        />
        <Select
          options={[
            { value: "", label: "All Statuses" },
            { value: "pending", label: "Pending" },
            { value: "submitted", label: "Submitted" },
            { value: "processed", label: "Processed" },
          ]}
          className="w-40"
        />
        <Select
          options={[
            { value: "", label: "Week Ending" },
            { value: "2026-03-28", label: "03/28/2026" },
            { value: "2026-03-21", label: "03/21/2026" },
            { value: "2026-03-14", label: "03/14/2026" },
          ]}
          className="w-40"
        />
      </div>

      {/* Batches table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="w-10 px-4 py-3">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                Week Ending
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                Production
              </th>
              <th className="px-3 py-3 text-center font-semibold text-slate-600">
                Status
              </th>
              <th className="px-3 py-3 text-right font-semibold text-slate-600">
                Timecards
              </th>
              <th className="px-3 py-3 text-right font-semibold text-slate-600">
                Total Gross
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                Submitted By
              </th>
              <th className="px-3 py-3 text-center font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {PAYROLL_BATCHES.map((batch) => (
              <tr
                key={batch.id}
                className="border-b border-slate-100 hover:bg-sky-50/50"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300"
                  />
                </td>
                <td className="px-3 py-3 font-medium">{batch.weekEnding}</td>
                <td className="px-3 py-3 text-slate-600">
                  {batch.production}
                </td>
                <td className="px-3 py-3 text-center">
                  <Badge variant={statusVariant[batch.status]}>
                    {batch.status.charAt(0).toUpperCase() +
                      batch.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-3 py-3 text-right font-mono">
                  {batch.timecards}
                </td>
                <td className="px-3 py-3 text-right font-mono font-semibold">
                  {formatCurrency(batch.totalGross)}
                </td>
                <td className="px-3 py-3 text-slate-600">
                  {batch.submittedBy || "-"}
                </td>
                <td className="px-3 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="p-1 text-sky-600 hover:text-sky-800">
                      <FileText className="h-4 w-4" />
                    </button>
                    {batch.status === "pending" && (
                      <button className="p-1 text-emerald-600 hover:text-emerald-800">
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
