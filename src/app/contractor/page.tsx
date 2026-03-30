"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { STATUS_LABELS, STATUS_COLORS, PAYMENT_TERMS_LABELS } from "@/types";
import { Plus, Clock, DollarSign } from "lucide-react";

const MY_TIMECARDS = [
  {
    id: "tc-1",
    weekEnding: "2026-03-28",
    production: "What Now?",
    status: "DRAFT",
    totalHours: 36,
    totalPay: 1800,
    paymentTerms: "NET_30",
    sceneCodes: ["SC-101", "SC-102", "SC-115"],
  },
  {
    id: "tc-2",
    weekEnding: "2026-03-21",
    production: "What Now?",
    status: "SUBMITTED",
    totalHours: 42,
    totalPay: 2310,
    paymentTerms: "NET_30",
    sceneCodes: ["SC-103", "SC-104"],
  },
  {
    id: "tc-3",
    weekEnding: "2026-03-14",
    production: "What Now?",
    status: "APPROVED",
    totalHours: 40,
    totalPay: 2100,
    paymentTerms: "NET_30",
    paymentDue: "2026-04-13",
    sceneCodes: ["SC-100", "SC-101"],
  },
  {
    id: "tc-4",
    weekEnding: "2026-03-07",
    production: "What Now?",
    status: "PAID",
    totalHours: 38,
    totalPay: 1950,
    paymentTerms: "NET_30",
    paidDate: "2026-04-06",
    sceneCodes: ["SC-098", "SC-099"],
  },
];

export default function ContractorDashboard() {
  const unpaidTotal = MY_TIMECARDS.filter(
    (tc) => tc.status !== "PAID" && tc.status !== "VOIDED"
  ).reduce((sum, tc) => sum + tc.totalPay, 0);

  const pendingCount = MY_TIMECARDS.filter(
    (tc) => tc.status === "SUBMITTED" || tc.status === "UNDER_REVIEW"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Timecards</h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit your timecards and track scene codes
          </p>
        </div>
        <Link href="/contractor/timecards/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Timecard
          </Button>
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending Approval</p>
              <p className="text-xl font-bold text-slate-900">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Outstanding Balance</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(unpaidTotal)}
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
              <p className="text-sm text-slate-500">Last Payment</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(1950)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timecards list */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left font-semibold text-slate-600">
                Week Ending
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                Production
              </th>
              <th className="px-3 py-3 text-center font-semibold text-slate-600">
                Status
              </th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">
                Scene Codes
              </th>
              <th className="px-3 py-3 text-center font-semibold text-slate-600">
                Terms
              </th>
              <th className="px-3 py-3 text-right font-semibold text-slate-600">
                Hours
              </th>
              <th className="px-3 py-3 text-right font-semibold text-slate-600">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {MY_TIMECARDS.map((tc) => (
              <tr
                key={tc.id}
                className="border-b border-slate-100 hover:bg-sky-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/contractor/timecards/${tc.id}`}
                    className="text-sky-600 hover:underline font-medium"
                  >
                    {formatDate(tc.weekEnding)}
                  </Link>
                </td>
                <td className="px-3 py-3 text-slate-600">{tc.production}</td>
                <td className="px-3 py-3 text-center">
                  <Badge className={STATUS_COLORS[tc.status]}>
                    {STATUS_LABELS[tc.status]}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {tc.sceneCodes.map((sc) => (
                      <span
                        key={sc}
                        className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded text-xs font-mono"
                      >
                        {sc}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs text-slate-500">
                  {PAYMENT_TERMS_LABELS[tc.paymentTerms]}
                </td>
                <td className="px-3 py-3 text-right font-mono">
                  {tc.totalHours.toFixed(1)}
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
