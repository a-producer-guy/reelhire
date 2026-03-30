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
  type TimecardWithRelations,
} from "@/types";
import Link from "next/link";
import { Plus, CheckSquare, Send, Filter } from "lucide-react";

// Demo data for the dashboard
const DEMO_TIMECARDS: TimecardWithRelations[] = [
  {
    id: "tc-1",
    employeeId: "emp-1",
    productionId: "prod-1",
    weekEnding: "2026-03-28",
    status: "EMPLOYEE_COMPLETED",
    workLocation: "CA - Glendale",
    studio: "Studio",
    jobTitle: "Editor",
    unionLocal: "700",
    department: "Post Production",
    accountCode: "4501",
    ff1: "4599",
    ff2: "",
    series: "",
    locationNote: "",
    setNote: "",
    weeklyRate: 1732.5,
    hourlyRate: 28.875,
    guaranteedHours: 60,
    payType: "Union/Custom",
    totalStraight: 24,
    totalOT15: 0,
    totalOT2: 0,
    totalOT25: 0,
    totalOT3: 0,
    totalForced: 0,
    totalGold: 0,
    totalAllowances: 60,
    totalPenalties: 0,
    totalPay: 1099.5,
    dailyComments: null,
    employeeComments: null,
    employerComments: null,
    payrollComments: null,
    createdAt: "2026-03-25",
    updatedAt: "2026-03-28",
    employee: {
      id: "emp-1",
      name: "RIFKIN, JOSH",
      email: "josh.rifkin@example.com",
      role: "CREW_MEMBER",
      jobTitle: "Editor",
      unionLocal: "700",
      department: "Post Production",
    },
    production: { id: "prod-1", name: "What Now?", code: "WHATNOW" },
    entries: [],
    allowances: [],
    reviews: [],
  },
  {
    id: "tc-2",
    employeeId: "emp-2",
    productionId: "prod-1",
    weekEnding: "2026-03-28",
    status: "EMPLOYEE_COMPLETED",
    workLocation: "CA - Glendale",
    studio: "Studio",
    jobTitle: "Assistant Editor",
    unionLocal: "700",
    department: "Post Production",
    accountCode: "4501",
    ff1: "",
    ff2: "",
    series: "",
    locationNote: "",
    setNote: "",
    weeklyRate: 1500,
    hourlyRate: 25,
    guaranteedHours: 60,
    payType: "Union/Custom",
    totalStraight: 40,
    totalOT15: 8,
    totalOT2: 0,
    totalOT25: 0,
    totalOT3: 0,
    totalForced: 0,
    totalGold: 0,
    totalAllowances: 30,
    totalPenalties: 0,
    totalPay: 1330,
    dailyComments: null,
    employeeComments: null,
    employerComments: null,
    payrollComments: null,
    createdAt: "2026-03-25",
    updatedAt: "2026-03-28",
    employee: {
      id: "emp-2",
      name: "MARTINEZ, SARAH",
      email: "sarah.m@example.com",
      role: "CREW_MEMBER",
      jobTitle: "Assistant Editor",
      unionLocal: "700",
      department: "Post Production",
    },
    production: { id: "prod-1", name: "What Now?", code: "WHATNOW" },
    entries: [],
    allowances: [],
    reviews: [],
  },
  {
    id: "tc-3",
    employeeId: "emp-3",
    productionId: "prod-1",
    weekEnding: "2026-03-28",
    status: "APPROVED",
    workLocation: "CA - Glendale",
    studio: "Location",
    jobTitle: "Company Grip",
    unionLocal: "80",
    department: "Grip",
    accountCode: "4501",
    ff1: "",
    ff2: "",
    series: "",
    locationNote: "",
    setNote: "",
    weeklyRate: null,
    hourlyRate: 42.5,
    guaranteedHours: null,
    payType: "Union/Custom",
    totalStraight: 48,
    totalOT15: 12,
    totalOT2: 4,
    totalOT25: 0,
    totalOT3: 0,
    totalForced: 0,
    totalGold: 0,
    totalAllowances: 150,
    totalPenalties: 50,
    totalPay: 3230,
    dailyComments: null,
    employeeComments: null,
    employerComments: null,
    payrollComments: null,
    createdAt: "2026-03-24",
    updatedAt: "2026-03-27",
    employee: {
      id: "emp-3",
      name: "CLINT, BARRY",
      email: "barry.c@example.com",
      role: "CREW_MEMBER",
      jobTitle: "Company Grip",
      unionLocal: "80",
      department: "Grip",
    },
    production: { id: "prod-1", name: "What Now?", code: "WHATNOW" },
    entries: [],
    allowances: [],
    reviews: [],
  },
];

const START_PAPERWORK = [
  { name: "WELLS, AARON", title: "Assistant Snake Wrangler", status: "pending" },
  { name: "CLINT, BARRY", title: "Company Grip", status: "waiting" },
  { name: "NEWKIRK, ANASTASIA", title: "Production Assistant", status: "waiting" },
  { name: "GALLOWAY, JAY", title: "Class B Driver", status: "waiting" },
  { name: "MILROY, CAMILLE", title: "Costumer", status: "waiting" },
];

const dashboardTabs = [
  { id: "todo", label: "To Do/Approve", count: 1 },
  { id: "open", label: "Open Timecards", count: 6 },
  { id: "approved", label: "Approved Timecards" },
  { id: "missing", label: "Missing Timecards" },
  { id: "starts", label: "Starts", count: 1 },
  { id: "history", label: "History" },
  { id: "roster", label: "Roster" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("todo");
  const [selectedTimecards, setSelectedTimecards] = useState<string[]>([]);
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    timecardId: string | null;
  }>({ open: false, timecardId: null });

  const todoTimecards = DEMO_TIMECARDS.filter(
    (tc) => tc.status === "EMPLOYEE_COMPLETED"
  );
  const approvedTimecards = DEMO_TIMECARDS.filter(
    (tc) => tc.status === "APPROVED"
  );

  const displayTimecards =
    activeTab === "todo"
      ? todoTimecards
      : activeTab === "approved"
        ? approvedTimecards
        : activeTab === "open"
          ? DEMO_TIMECARDS
          : [];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard for What Now?
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Production timecard management
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/timecards/new">
            <Button>
              <Plus className="h-4 w-4" />
              Create a New Timecard
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={dashboardTabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Timecards table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-sky-50 px-6 py-3 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-800 text-center">
            {activeTab === "todo"
              ? "Timecards to Review"
              : activeTab === "open"
                ? "Open Timecards"
                : activeTab === "approved"
                  ? "Approved Timecards"
                  : "Timecards"}
          </h2>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-slate-100 bg-slate-50">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select
            options={[
              { value: "", label: "Sort" },
              { value: "name", label: "Employee Name" },
              { value: "date", label: "Week Ending" },
              { value: "department", label: "Department" },
            ]}
            className="w-32"
          />
          <Select
            options={[
              { value: "", label: "Status" },
              { value: "EMPLOYEE_COMPLETED", label: "Employee Completed" },
              { value: "UNDER_REVIEW", label: "Under Review" },
              { value: "APPROVED", label: "Approved" },
            ]}
            className="w-40"
          />
          <Select
            options={[
              { value: "", label: "Review" },
              { value: "none", label: "None" },
              { value: "reviewed", label: "Reviewed" },
            ]}
            className="w-32"
          />
          <Select
            options={[
              { value: "", label: "Union/Non-Union" },
              { value: "union", label: "Union" },
              { value: "non-union", label: "Non-Union" },
            ]}
            className="w-40"
          />
          <Select
            options={[
              { value: "", label: "Department" },
              { value: "camera", label: "Camera" },
              { value: "grip", label: "Grip" },
              { value: "electric", label: "Electric" },
              { value: "post", label: "Post Production" },
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
                    checked={
                      selectedTimecards.length === displayTimecards.length &&
                      displayTimecards.length > 0
                    }
                    onChange={toggleAll}
                    className="rounded border-slate-300"
                  />
                </th>
                <th className="px-3 py-3 text-left font-semibold text-slate-600">
                  Status
                </th>
                <th className="px-3 py-3 text-left font-semibold text-slate-600">
                  Week Ending
                </th>
                <th className="px-3 py-3 text-left font-semibold text-slate-600">
                  Employee
                </th>
                <th className="px-3 py-3 text-left font-semibold text-slate-600">
                  Title
                </th>
                <th className="px-3 py-3 text-left font-semibold text-slate-600">
                  Union
                </th>
                <th className="px-3 py-3 text-left font-semibold text-slate-600">
                  Department
                </th>
                <th className="px-3 py-3 text-left font-semibold text-slate-600">
                  Account
                </th>
                <th className="px-3 py-3 text-right font-semibold text-slate-600">
                  Hours
                </th>
                <th className="px-3 py-3 text-right font-semibold text-slate-600">
                  OT
                </th>
                <th className="px-3 py-3 text-right font-semibold text-slate-600">
                  Allowances
                </th>
                <th className="px-3 py-3 text-right font-semibold text-slate-600">
                  Penalties
                </th>
                <th className="px-3 py-3 text-right font-semibold text-slate-600">
                  Days Worked
                </th>
                <th className="px-3 py-3 text-center font-semibold text-slate-600">
                  Reviewed
                </th>
                <th className="px-3 py-3 text-right font-semibold text-slate-600">
                  Gross Pay
                </th>
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
                    <Badge
                      className={STATUS_COLORS[tc.status]}
                    >
                      {STATUS_LABELS[tc.status]}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/timecards/${tc.id}`}
                      className="text-sky-600 hover:text-sky-800 hover:underline font-medium"
                    >
                      {formatDate(tc.weekEnding)}
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={`/timecards/${tc.id}`}
                      className="text-sky-600 hover:text-sky-800 hover:underline font-medium"
                    >
                      {tc.employee.name}
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{tc.jobTitle}</td>
                  <td className="px-3 py-3 text-slate-600">{tc.unionLocal}</td>
                  <td className="px-3 py-3 text-slate-600">{tc.department}</td>
                  <td className="px-3 py-3 text-slate-600">{tc.accountCode}</td>
                  <td className="px-3 py-3 text-right font-mono">
                    {(tc.totalStraight + tc.totalOT15 + tc.totalOT2).toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono">
                    {(tc.totalOT15 + tc.totalOT2).toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono">
                    {formatCurrency(tc.totalAllowances)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono">
                    {tc.totalPenalties}
                  </td>
                  <td className="px-3 py-3 text-right font-mono">3</td>
                  <td className="px-3 py-3 text-center text-slate-400" />
                  <td className="px-3 py-3 text-right font-mono font-semibold">
                    {formatCurrency(tc.totalPay)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-semibold text-sm">
                <td colSpan={14} className="px-4 py-3 text-right">
                  Total Timecards: {displayTimecards.length}
                </td>
                <td className="px-3 py-3 text-right font-mono">
                  {formatCurrency(
                    displayTimecards.reduce((sum, tc) => sum + tc.totalPay, 0)
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <Button variant="outline" size="sm">
            Other Actions
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={() => {}}
          >
            <Send className="h-3.5 w-3.5" />
            Submit for Processing
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (selectedTimecards.length > 0) {
                setReviewModal({
                  open: true,
                  timecardId: selectedTimecards[0],
                });
              }
            }}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            Approve Selected Timecards
          </Button>
        </div>
      </div>

      {/* Start Paperwork Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Start Paperwork</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Starts for Me to Approve */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-sky-500 px-4 py-2.5 text-center">
              <h3 className="text-sm font-semibold text-white">
                Starts for Me to Approve
              </h3>
            </div>
            <div className="p-4 space-y-2">
              <Link
                href="#"
                className="block text-sky-600 hover:underline text-sm"
              >
                WELLS, AARON - Assistant Snake Wrangler
              </Link>
            </div>
          </div>

          {/* Out for Approval */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-200 px-4 py-2.5 text-center">
              <h3 className="text-sm font-semibold text-slate-700">
                Out for Approval
              </h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <Link href="#" className="text-sky-600 hover:underline">
                  WELLS, AARON - Assistant Snake Wrangler
                </Link>
                <span className="text-slate-500">Approval Tier 1</span>
              </div>
            </div>
          </div>

          {/* Waiting on Employee to Sign */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-amber-100 px-4 py-2.5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-amber-800 flex-1 text-center">
                Waiting on Employee to Sign
              </h3>
              <Button variant="danger" size="sm">
                Send Reminder Email
              </Button>
            </div>
            <div className="p-4 space-y-2">
              {START_PAPERWORK.filter((s) => s.status === "waiting").map(
                (person) => (
                  <div key={person.name} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700">
                      {person.name} - {person.title}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <TimecardReviewModal
        open={reviewModal.open}
        onClose={() => setReviewModal({ open: false, timecardId: null })}
        timecardId={reviewModal.timecardId}
        onSubmit={async (action, comment) => {
          console.log("Review submitted:", action, comment);
          setReviewModal({ open: false, timecardId: null });
        }}
      />
    </div>
  );
}
