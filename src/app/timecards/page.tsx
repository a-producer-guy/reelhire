"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { STATUS_LABELS, STATUS_COLORS } from "@/types";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

const DEMO_TIMECARDS = [
  {
    id: "tc-1",
    employee: "RIFKIN, JOSH",
    title: "Editor",
    weekEnding: "2026-03-28",
    status: "EMPLOYEE_COMPLETED",
    production: "What Now?",
    department: "Post Production",
    union: "700",
    hours: 42,
    totalPay: 1099.5,
  },
  {
    id: "tc-2",
    employee: "MARTINEZ, SARAH",
    title: "Assistant Editor",
    weekEnding: "2026-03-28",
    status: "EMPLOYEE_COMPLETED",
    production: "What Now?",
    department: "Post Production",
    union: "700",
    hours: 48,
    totalPay: 1330,
  },
  {
    id: "tc-3",
    employee: "CLINT, BARRY",
    title: "Company Grip",
    weekEnding: "2026-03-28",
    status: "APPROVED",
    production: "What Now?",
    department: "Grip",
    union: "80",
    hours: 64,
    totalPay: 3230,
  },
  {
    id: "tc-4",
    employee: "WELLS, AARON",
    title: "Assistant Snake Wrangler",
    weekEnding: "2026-03-28",
    status: "DRAFT",
    production: "What Now?",
    department: "Animals",
    union: "",
    hours: 0,
    totalPay: 0,
  },
  {
    id: "tc-5",
    employee: "NEWKIRK, ANASTASIA",
    title: "Production Assistant",
    weekEnding: "2026-03-21",
    status: "PROCESSED",
    production: "What Now?",
    department: "Production",
    union: "",
    hours: 55,
    totalPay: 1875,
  },
  {
    id: "tc-6",
    employee: "GALLOWAY, JAY",
    title: "Class B Driver",
    weekEnding: "2026-03-21",
    status: "SUBMITTED_TO_PAYROLL",
    production: "What Now?",
    department: "Transportation",
    union: "399",
    hours: 60,
    totalPay: 2800,
  },
];

export default function TimecardsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = DEMO_TIMECARDS.filter((tc) => {
    const matchesSearch =
      !search || tc.employee.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || tc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Timecards</h1>
        <Link href="/timecards/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Timecard
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: "", label: "All Statuses" },
            { value: "DRAFT", label: "Draft" },
            { value: "EMPLOYEE_COMPLETED", label: "Employee Completed" },
            { value: "UNDER_REVIEW", label: "Under Review" },
            { value: "APPROVED", label: "Approved" },
            { value: "SUBMITTED_TO_PAYROLL", label: "Submitted to Payroll" },
            { value: "PROCESSED", label: "Processed" },
          ]}
          className="w-48"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Employee
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                Title
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                Production
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                Week Ending
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                Department
              </th>
              <th className="px-3 py-3 text-center font-semibold text-slate-600">
                Status
              </th>
              <th className="px-3 py-3 text-right font-semibold text-slate-600">
                Hours
              </th>
              <th className="px-3 py-3 text-right font-semibold text-slate-600">
                Gross Pay
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tc) => (
              <tr
                key={tc.id}
                className="border-b border-slate-100 hover:bg-sky-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/timecards/${tc.id}`}
                    className="text-sky-600 hover:underline font-medium"
                  >
                    {tc.employee}
                  </Link>
                </td>
                <td className="px-3 py-3 text-slate-600">{tc.title}</td>
                <td className="px-3 py-3 text-slate-600">{tc.production}</td>
                <td className="px-3 py-3 text-slate-600">
                  {formatDate(tc.weekEnding)}
                </td>
                <td className="px-3 py-3 text-slate-600">{tc.department}</td>
                <td className="px-3 py-3 text-center">
                  <Badge className={STATUS_COLORS[tc.status]}>
                    {STATUS_LABELS[tc.status]}
                  </Badge>
                </td>
                <td className="px-3 py-3 text-right font-mono">
                  {tc.hours.toFixed(2)}
                </td>
                <td className="px-3 py-3 text-right font-mono font-semibold">
                  {formatCurrency(tc.totalPay)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
