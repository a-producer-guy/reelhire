"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TimecardReviewModal } from "@/components/timecards/review-modal";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  PAYMENT_TERMS_LABELS,
} from "@/types";
import Link from "next/link";
import {
  Plus,
  CheckSquare,
  Send,
  Filter,
  Clock,
  DollarSign,
  Users,
  Clapperboard,
} from "lucide-react";

const DEMO_TIMECARDS = [
  {
    id: "tc-1",
    contractorId: "emp-1",
    weekEnding: "2026-03-28",
    status: "SUBMITTED",
    contractor: "RIFKIN, JOSH",
    jobTitle: "Editor",
    department: "Post Production",
    production: "What Now?",
    paymentTerms: "NET_30",
    totalHours: 36,
    totalStraight: 32,
    totalOT: 4,
    totalPay: 1900,
    sceneCodes: ["SC-101", "SC-102", "SC-115"],
    submittedAt: "2026-03-28",
  },
  {
    id: "tc-2",
    contractorId: "emp-2",
    weekEnding: "2026-03-28",
    status: "SUBMITTED",
    contractor: "MARTINEZ, SARAH",
    jobTitle: "Colorist",
    department: "Post Production",
    production: "What Now?",
    paymentTerms: "NET_45",
    totalHours: 42,
    totalStraight: 40,
    totalOT: 2,
    totalPay: 2687.5,
    sceneCodes: ["SC-103", "SC-104"],
    submittedAt: "2026-03-28",
  },
  {
    id: "tc-3",
    contractorId: "emp-3",
    weekEnding: "2026-03-28",
    status: "APPROVED",
    contractor: "CLINT, BARRY",
    jobTitle: "Gaffer",
    department: "Electric",
    production: "What Now?",
    paymentTerms: "NET_30",
    totalHours: 48,
    totalStraight: 40,
    totalOT: 8,
    totalPay: 2210,
    sceneCodes: ["SC-100", "SC-101", "SC-104"],
    submittedAt: "2026-03-27",
  },
  {
    id: "tc-4",
    contractorId: "emp-4",
    weekEnding: "2026-03-28",
    status: "DRAFT",
    contractor: "WELLS, AARON",
    jobTitle: "Camera Operator",
    department: "Camera",
    production: "What Now?",
    paymentTerms: "NET_60",
    totalHours: 0,
    totalStraight: 0,
    totalOT: 0,
    totalPay: 0,
    sceneCodes: [],
    submittedAt: null,
  },
  {
    id: "tc-5",
    contractorId: "emp-5",
    weekEnding: "2026-03-21",
    status: "PAID",
    contractor: "NEWKIRK, ANASTASIA",
    jobTitle: "Production Assistant",
    department: "Production",
    production: "What Now?",
    paymentTerms: "NET_30",
    totalHours: 55,
    totalStraight: 40,
    totalOT: 15,
    totalPay: 1875,
    sceneCodes: ["SC-098", "SC-099"],
    submittedAt: "2026-03-21",
  },
];

const dashboardTabs = [
  { id: "pending", label: "Pending Review", count: 2 },
  { id: "approved", label: "Approved", count: 1 },
  { id: "payroll", label: "In Payroll" },
  { id: "paid", label: "Paid" },
  { id: "all", label: "All Timecards", count: 5 },
  { id: "scenes", label: "By Scene Code" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedTimecards, setSelectedTimecards] = useState<string[]>([]);
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    timecardId: string | null;
  }>({ open: false, timecardId: null });

  const displayTimecards =
    activeTab === "pending"
      ? DEMO_TIMECARDS.filter((tc) => tc.status === "SUBMITTED")
      : activeTab === "approved"
        ? DEMO_TIMECARDS.filter((tc) => tc.status === "APPROVED")
        : activeTab === "paid"
          ? DEMO_TIMECARDS.filter((tc) => tc.status === "PAID")
          : DEMO_TIMECARDS;

  const toggleSelect = (id: string) => {
    setSelectedTimecards((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedTimecards.length === displayTimecards.length) {
      setSelectedTimecards([]);
    } else {
      setSelectedTimecards(displayTimecards.map((tc) => tc.id));
    }
  };

  // Stats
  const pendingCount = DEMO_TIMECARDS.filter((tc) => tc.status === "SUBMITTED").length;
  const pendingPay = DEMO_TIMECARDS.filter((tc) => tc.status === "SUBMITTED").reduce((s, tc) => s + tc.totalPay, 0);
  const approvedPay = DEMO_TIMECARDS.filter((tc) => tc.status === "APPROVED").reduce((s, tc) => s + tc.totalPay, 0);
  const uniqueScenes = new Set(DEMO_TIMECARDS.flatMap((tc) => tc.sceneCodes)).size;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Reelarc Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Contractor timecard management &middot; What Now?
          </p>
        </div>
        <Link href="/timecards/new">
          <Button>
            <Plus className="h-4 w-4" />
            Create Timecard
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending Review</p>
              <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
              <p className="text-xs text-slate-400">{formatCurrency(pendingPay)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Ready for Payroll</p>
              <p className="text-2xl font-bold text-slate-900">{formatCurrency(approvedPay)}</p>
              <p className="text-xs text-slate-400">1 timecard approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Users className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Contractors</p>
              <p className="text-2xl font-bold text-slate-900">5</p>
              <p className="text-xs text-slate-400">This week</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Clapperboard className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Scenes</p>
              <p className="text-2xl font-bold text-slate-900">{uniqueScenes}</p>
              <p className="text-xs text-slate-400">
                <Link href="/scenes" className="text-violet-600 hover:underline">
                  View cross-reference
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={dashboardTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Timecards table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-100 bg-slate-50">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select
            options={[
              { value: "", label: "All Contractors" },
              { value: "emp-1", label: "RIFKIN, JOSH" },
              { value: "emp-2", label: "MARTINEZ, SARAH" },
              { value: "emp-3", label: "CLINT, BARRY" },
            ]}
            className="w-44"
          />
          <Select
            options={[
              { value: "", label: "Payment Terms" },
              { value: "NET_30", label: "Net 30" },
              { value: "NET_45", label: "Net 45" },
              { value: "NET_60", label: "Net 60" },
            ]}
            className="w-36"
          />
          <Select
            options={[
              { value: "", label: "Week Ending" },
              { value: "2026-03-28", label: "03/28/2026" },
              { value: "2026-03-21", label: "03/21/2026" },
            ]}
            className="w-36"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTimecards.length === displayTimecards.length && displayTimecards.length > 0}
                    onChange={toggleAll}
                    className="rounded border-slate-300"
                  />
                </th>
                <th className="px-3 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-3 py-3 text-left font-semibold text-slate-600">Week Ending</th>
                <th className="px-3 py-3 text-left font-semibold text-slate-600">Contractor</th>
                <th className="px-3 py-3 text-left font-semibold text-slate-600">Title</th>
                <th className="px-3 py-3 text-left font-semibold text-slate-600">Scene Codes</th>
                <th className="px-3 py-3 text-center font-semibold text-slate-600">Terms</th>
                <th className="px-3 py-3 text-right font-semibold text-slate-600">Hours</th>
                <th className="px-3 py-3 text-right font-semibold text-slate-600">OT</th>
                <th className="px-3 py-3 text-right font-semibold text-slate-600">Gross Pay</th>
              </tr>
            </thead>
            <tbody>
              {displayTimecards.map((tc) => (
                <tr
                  key={tc.id}
                  className="border-b border-slate-100 hover:bg-sky-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedTimecards.includes(tc.id)}
                      onChange={() => toggleSelect(tc.id)}
                      className="rounded border-slate-300"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Badge className={STATUS_COLORS[tc.status]}>
                      {STATUS_LABELS[tc.status]}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/timecards/${tc.id}`}
                      className="text-sky-600 hover:underline font-medium"
                    >
                      {formatDate(tc.weekEnding)}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/timecards/${tc.id}`}
                      className="text-sky-600 hover:underline font-medium"
                    >
                      {tc.contractor}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{tc.jobTitle}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {tc.sceneCodes.map((sc) => (
                        <span
                          key={sc}
                          className="bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded text-xs font-mono"
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
                  <td className="px-3 py-3 text-right font-mono">
                    {tc.totalOT.toFixed(1)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-semibold">
                    {formatCurrency(tc.totalPay)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-semibold text-sm">
                <td colSpan={9} className="px-4 py-3 text-right">
                  {displayTimecards.length} timecards
                </td>
                <td className="px-3 py-3 text-right font-mono">
                  {formatCurrency(displayTimecards.reduce((s, tc) => s + tc.totalPay, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (selectedTimecards.length > 0) {
                setReviewModal({ open: true, timecardId: selectedTimecards[0] });
              }
            }}
          >
            Return to Contractor
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => {}}
          >
            <Send className="h-3.5 w-3.5" />
            Submit to Payroll
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (selectedTimecards.length > 0) {
                setReviewModal({ open: true, timecardId: selectedTimecards[0] });
              }
            }}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            Approve Selected
          </Button>
        </div>
      </div>

      {/* Review Modal */}
      <TimecardReviewModal
        open={reviewModal.open}
        onClose={() => setReviewModal({ open: false, timecardId: null })}
        timecardId={reviewModal.timecardId}
        onSubmit={async (action, comment) => {
          console.log("Review:", action, comment);
          setReviewModal({ open: false, timecardId: null });
        }}
      />
    </div>
  );
}
