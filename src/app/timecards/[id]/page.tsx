"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TimecardReviewModal } from "@/components/timecards/review-modal";
import {
  formatCurrency,
  calculateEntryHours,
  calculatePaySummary,
} from "@/lib/utils";
import { PAY_TYPES, ALLOWANCE_TYPES, STATUS_LABELS, STATUS_COLORS } from "@/types";
import {
  Save,
  Copy,
  CheckCircle,
  X,
  ChevronDown,
  FileText,
  Trash2,
} from "lucide-react";
import Link from "next/link";

type DayEntry = {
  id: string;
  date: string;
  dayLabel: string;
  payType: string;
  location: string;
  timeIn: string;
  meal1Out: string;
  meal1In: string;
  meal2Out: string;
  meal2In: string;
  timeOut: string;
  mp1: number;
  mp2: number;
  mealPenalties: number;
  straightTime: number;
  ot15: number;
  ot2: number;
  ot25: number;
  ot3Plus: number;
  goldTime: number;
  forcedCall: number;
  totalHours: number;
};

type AllowanceEntry = {
  id: string;
  type: string;
  rate: string;
  daysWorked: string;
  amount: string;
  accountCode: string;
  ff1: string;
  ff2: string;
};

function getWeekDays(weekEnding: string): { date: string; label: string }[] {
  const end = new Date(weekEnding + "T12:00:00");
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    days.push({
      date: d.toISOString().split("T")[0],
      label:
        d.toLocaleDateString("en-US", { weekday: "short" }) +
        ", " +
        d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }),
    });
  }
  return days;
}

const INITIAL_ALLOWANCES: AllowanceEntry[] = ALLOWANCE_TYPES.map((type, i) => ({
  id: `allow-${i}`,
  type,
  rate: type === "Kit/Box Rental NT" ? "20.00/D" : "N/A",
  daysWorked: type === "Kit/Box Rental NT" ? "3" : "0",
  amount: type === "Kit/Box Rental NT" ? "60" : "0",
  accountCode: "",
  ff1: "",
  ff2: "",
}));

export default function TimecardDetailPage() {
  const weekEnding = "2026-03-28";
  const weekDays = getWeekDays(weekEnding);

  const [entries, setEntries] = useState<DayEntry[]>(
    weekDays.map((day, i) => ({
      id: `entry-${i}`,
      date: day.date,
      dayLabel: day.label,
      payType: [1, 2, 4].includes(i) ? "WORKED" : "NOT_WORKED",
      location: "CA",
      timeIn: [1, 2, 4].includes(i) ? "06:00" : "",
      meal1Out: [1, 2, 4].includes(i) ? "12:00" : "",
      meal1In: [1, 2, 4].includes(i) ? "13:00" : "",
      meal2Out: "",
      meal2In: "",
      timeOut: [1, 2, 4].includes(i) ? "19:00" : "",
      mp1: 0,
      mp2: 0,
      mealPenalties: 0,
      straightTime: [1, 2, 4].includes(i) ? 8 : 0,
      ot15: [1, 2, 4].includes(i) ? 4 : 0,
      ot2: [1, 2, 4].includes(i) ? 0 : 0,
      ot25: 0,
      ot3Plus: 0,
      goldTime: 0,
      forcedCall: 0,
      totalHours: [1, 2, 4].includes(i) ? 12 : 0,
    }))
  );

  const [allowances, setAllowances] = useState<AllowanceEntry[]>(INITIAL_ALLOWANCES);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [comments, setComments] = useState({
    daily: "",
    employee: "",
    employer: "",
    payroll: "",
  });

  // Employee info
  const employee = {
    name: "RIFKIN, JOSH - Editor",
    workLocation: "CA - Glendale",
    studio: "Studio",
    jobTitle: "Editor",
    unionLocal: "700",
    department: "",
    weeklyRate: 1732.5,
    hourlyRate: 28.875,
    guaranteedHours: 60,
    payType: "Union/Custom",
    accountCode: "4501",
    accountCode2: "4599",
  };

  const updateEntry = (index: number, field: keyof DayEntry, value: string) => {
    setEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[index], [field]: value };

      // Recalculate hours if time fields changed
      if (
        [
          "timeIn",
          "timeOut",
          "meal1Out",
          "meal1In",
          "meal2Out",
          "meal2In",
          "payType",
        ].includes(field)
      ) {
        const hours = calculateEntryHours({
          timeIn: entry.timeIn,
          timeOut: entry.timeOut,
          meal1Out: entry.meal1Out,
          meal1In: entry.meal1In,
          meal2Out: entry.meal2Out,
          meal2In: entry.meal2In,
          payType: entry.payType,
        });
        Object.assign(entry, hours);
      }

      updated[index] = entry;
      return updated;
    });
  };

  const updateAllowance = (
    index: number,
    field: keyof AllowanceEntry,
    value: string
  ) => {
    setAllowances((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      // Recalc amount if rate or days changed
      if (field === "daysWorked" || field === "rate") {
        const rate = parseFloat(updated[index].rate) || 0;
        const days = parseFloat(updated[index].daysWorked) || 0;
        updated[index].amount = (rate * days).toFixed(2);
      }
      return updated;
    });
  };

  const totalAllowances = useMemo(
    () => allowances.reduce((sum, a) => sum + (parseFloat(a.amount) || 0), 0),
    [allowances]
  );

  const paySummary = useMemo(
    () =>
      calculatePaySummary(entries, employee.hourlyRate, totalAllowances, 0),
    [entries, totalAllowances]
  );

  const status = "EMPLOYEE_COMPLETED";

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Dashboard
          </Link>
          <span className="text-slate-300">/</span>
          <h1 className="text-xl font-bold text-slate-900">
            Timecard for What Now?
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            New
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-3.5 w-3.5" />
          </Button>
          <div className="relative">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            >
              More <ChevronDown className="h-3.5 w-3.5" />
            </Button>
            {showMoreMenu && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                {[
                  "Refresh Start Data",
                  "View Start",
                  "Return Timecard to Employee",
                  "Clone Timecard to Another Pay Period",
                  "Change Week Ending",
                  "Void Timecard",
                  "Refresh Chart of Accounts",
                  "Approve and Bypass to Final Approval",
                ].map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => setShowMoreMenu(false)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button variant="secondary" size="sm">
            <Copy className="h-3.5 w-3.5" />
            Copy Prev
          </Button>
          <Button variant="success" size="sm">
            <Save className="h-3.5 w-3.5" />
            Calc & Save
          </Button>
          <Button size="sm" onClick={() => setReviewModal(true)}>
            <CheckCircle className="h-3.5 w-3.5" />
            Review/Approve
          </Button>
          <Link href="/dashboard">
            <Button variant="danger" size="sm">
              <X className="h-3.5 w-3.5" />
              Close
            </Button>
          </Link>
        </div>
      </div>

      {/* Main timecard layout - two columns */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left side - Employee info */}
        <div className="col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h2 className="text-lg font-semibold text-sky-600 text-center border-b pb-2">
            Timecard
          </h2>

          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
            <label className="text-right font-medium text-slate-600 self-center">
              Week Ending
            </label>
            <input
              type="date"
              value={weekEnding}
              readOnly
              className="px-3 py-1.5 border border-slate-300 rounded bg-slate-50 text-sm"
            />

            <label className="text-right font-medium text-slate-600 self-center">
              Employee
            </label>
            <input
              type="text"
              value={employee.name}
              readOnly
              className="px-3 py-1.5 border border-slate-300 rounded bg-sky-50 text-sm font-medium"
            />

            <label className="text-right font-medium text-slate-600 self-center">
              Work Loc
            </label>
            <div className="flex gap-2">
              <Select
                options={[
                  { value: "CA - Glendale", label: "CA - Glendale" },
                  { value: "CA - Burbank", label: "CA - Burbank" },
                  { value: "NY - Manhattan", label: "NY - Manhattan" },
                ]}
                value={employee.workLocation}
                className="flex-1"
              />
              <Select
                options={[
                  { value: "Studio", label: "Studio" },
                  { value: "Location", label: "Location" },
                ]}
                value={employee.studio}
                className="w-28"
              />
            </div>

            <label className="text-right font-medium text-slate-600 self-center">
              Job Title
            </label>
            <input
              type="text"
              value={employee.jobTitle}
              readOnly
              className="px-3 py-1.5 border border-slate-300 rounded bg-slate-50 text-sm"
            />

            <label className="text-right font-medium text-slate-600 self-center">
              Union/Local
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={employee.unionLocal}
                readOnly
                className="px-3 py-1.5 border border-slate-300 rounded bg-slate-50 text-sm w-20"
              />
              <span className="self-center text-sm text-slate-500">Dept</span>
              <input
                type="text"
                value={employee.department}
                className="px-3 py-1.5 border border-slate-300 rounded text-sm flex-1"
              />
            </div>

            <label className="text-right font-medium text-slate-600 self-start mt-1">
              Pay Info
            </label>
            <div className="bg-sky-50 p-3 rounded text-sm space-y-1">
              <p className="font-semibold">
                ${employee.weeklyRate.toFixed(4)}/Week
              </p>
              <p className="text-slate-600">
                (Effective Hourly Rate: ${employee.hourlyRate.toFixed(4)})
              </p>
              <p className="text-slate-600">
                Guaranteed Hours: {employee.guaranteedHours.toFixed(4)} Per Week
              </p>
              <p className="text-slate-600">Pay Type: {employee.payType}</p>
            </div>

            <label className="text-right font-medium text-slate-600 self-center">
              Work Day 1
            </label>
            <Select
              options={[
                { value: "system", label: "System Determined" },
                { value: "monday", label: "Monday" },
                { value: "sunday", label: "Sunday" },
              ]}
              value="system"
            />

            <label className="text-right font-medium text-slate-600 self-center">
              Shoot Acct
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={employee.accountCode}
                className="px-3 py-1.5 border border-slate-300 rounded text-sm w-20"
              />
              <input
                type="text"
                value={employee.accountCode2}
                className="px-3 py-1.5 border border-slate-300 rounded text-sm w-20"
              />
              <span className="self-center text-xs text-slate-400">FF1</span>
              <input
                type="text"
                className="px-3 py-1.5 border border-slate-300 rounded text-sm w-14"
              />
              <span className="self-center text-xs text-slate-400">FF2</span>
              <input
                type="text"
                className="px-3 py-1.5 border border-slate-300 rounded text-sm w-14"
              />
            </div>

            <label className="text-right font-medium text-slate-600 self-center" />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Series"
                className="px-3 py-1.5 border border-slate-300 rounded text-sm flex-1"
              />
              <input
                type="text"
                placeholder="Location"
                className="px-3 py-1.5 border border-slate-300 rounded text-sm flex-1"
              />
              <input
                type="text"
                placeholder="Set"
                className="px-3 py-1.5 border border-slate-300 rounded text-sm flex-1"
              />
            </div>
          </div>
        </div>

        {/* Right side - Allowances + Pay Summary */}
        <div className="col-span-7 space-y-4">
          {/* Allowances */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-sky-50 px-4 py-2 border-b">
              <h3 className="text-sm font-semibold text-slate-700 text-center">
                Timecard
              </h3>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="px-2 py-2 text-left font-semibold text-slate-600" />
                  <th className="px-2 py-2 text-center font-semibold text-slate-600">
                    $ Start
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-slate-600">
                    Days Worked/Total
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-slate-600">
                    Acct
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-slate-600 w-12">
                    F1
                  </th>
                  <th className="px-2 py-2 text-center font-semibold text-slate-600 w-12">
                    F2
                  </th>
                </tr>
              </thead>
              <tbody>
                {allowances.map((allow, i) => (
                  <tr key={allow.id} className="border-b border-slate-100">
                    <td className="px-2 py-1.5 font-medium text-slate-700">
                      {allow.type}
                    </td>
                    <td className="px-2 py-1.5">
                      <input
                        type="text"
                        value={allow.rate}
                        onChange={(e) =>
                          updateAllowance(i, "rate", e.target.value)
                        }
                        className="w-20 px-2 py-1 border border-slate-300 rounded text-center text-xs"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="text"
                          value={allow.daysWorked}
                          onChange={(e) =>
                            updateAllowance(i, "daysWorked", e.target.value)
                          }
                          className="w-10 px-1 py-1 border border-slate-300 rounded text-center text-xs"
                        />
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-600 font-mono">
                          {allow.amount}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <input
                        type="text"
                        value={allow.accountCode}
                        onChange={(e) =>
                          updateAllowance(i, "accountCode", e.target.value)
                        }
                        className="w-14 px-1 py-1 border border-slate-300 rounded text-center text-xs"
                      />
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <input
                        type="text"
                        value={allow.ff1}
                        onChange={(e) =>
                          updateAllowance(i, "ff1", e.target.value)
                        }
                        className="w-10 px-1 py-1 border border-slate-300 rounded text-center text-xs"
                      />
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <input
                        type="text"
                        value={allow.ff2}
                        onChange={(e) =>
                          updateAllowance(i, "ff2", e.target.value)
                        }
                        className="w-10 px-1 py-1 border border-slate-300 rounded text-center text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-2 border-t">
              <Button variant="ghost" size="sm" className="text-sky-600">
                Add Other Pay
              </Button>
            </div>
          </div>

          {/* Pay Summary */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-slate-600">ST Pay*</span>
                <div className="flex gap-4 font-mono">
                  <span>{formatCurrency(paySummary.stPay)}</span>
                  <span className="text-slate-400">
                    {entries
                      .reduce((s, e) => s + e.straightTime, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600">OT 1.5*</span>
                <div className="flex gap-4 font-mono">
                  <span>{formatCurrency(paySummary.ot15Pay)}</span>
                  <span className="text-slate-400">
                    {entries.reduce((s, e) => s + e.ot15, 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600">OT 2*</span>
                <div className="flex gap-4 font-mono">
                  <span>{formatCurrency(paySummary.ot2Pay)}</span>
                  <span className="text-slate-400">
                    {entries.reduce((s, e) => s + e.ot2, 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600">Forced*</span>
                <div className="flex gap-4 font-mono">
                  <span>{formatCurrency(paySummary.forcedPay)}</span>
                  <span className="text-slate-400">0.00</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600">Allowances*</span>
                <div className="flex gap-4 font-mono">
                  <span>{formatCurrency(totalAllowances)}</span>
                  <span className="text-slate-400">N/A</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-slate-600">Penalties*</span>
                <div className="flex gap-4 font-mono">
                  <span>{formatCurrency(0)}</span>
                  <span className="text-slate-400">0.00</span>
                </div>
              </div>
              <div className="flex justify-between border-t pt-2 col-span-2">
                <span className="font-bold text-slate-900">Total*</span>
                <div className="flex gap-4 font-mono font-bold">
                  <span>{formatCurrency(paySummary.totalPay)}</span>
                  <span className="text-slate-400">
                    {entries
                      .reduce((s, e) => s + e.totalHours, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="font-medium text-slate-600">Status</span>
                <Badge className={STATUS_COLORS[status]}>
                  {STATUS_LABELS[status]}
                </Badge>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="font-medium text-slate-600">Review</span>
                <span className="text-slate-400">None</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Timecard entries */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-sky-50 px-4 py-2 border-b">
          <h3 className="text-base font-semibold text-sky-700 text-center">
            Timecard
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full timecard-table">
            <thead>
              <tr>
                <th className="w-28">Date</th>
                <th className="w-24">Pay Type</th>
                <th className="w-16">Loc</th>
                <th className="w-20">Time In</th>
                <th className="w-20">Meal 1 Out</th>
                <th className="w-20">In</th>
                <th className="w-20">Meal 2 Out</th>
                <th className="w-20">In</th>
                <th className="w-20">Time Out</th>
                <th className="w-12">MP1/MP2</th>
                <th className="w-10">MPs</th>
                <th className="w-12">ST</th>
                <th className="w-12">1.5x</th>
                <th className="w-12">2x</th>
                <th className="w-12">2.5</th>
                <th className="w-12">3+</th>
                <th className="w-12">Gold</th>
                <th className="w-10">FC</th>
                <th className="w-14">Total</th>
                <th className="w-16">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr
                  key={entry.id}
                  className={
                    entry.payType === "NOT_WORKED" || entry.payType === "UNPAID_DAY"
                      ? "bg-slate-50/50"
                      : ""
                  }
                >
                  <td className="font-medium text-slate-700 text-xs">
                    {entry.dayLabel}
                  </td>
                  <td>
                    <select
                      value={entry.payType}
                      onChange={(e) =>
                        updateEntry(i, "payType", e.target.value)
                      }
                      className="text-xs"
                    >
                      {PAY_TYPES.map((pt) => (
                        <option key={pt} value={pt}>
                          {pt.replace(/_/g, " ").replace(/\b\w/g, (c) => c)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={entry.location}
                      onChange={(e) =>
                        updateEntry(i, "location", e.target.value)
                      }
                      className="text-xs"
                    >
                      <option value="CA">CA</option>
                      <option value="NY">NY</option>
                      <option value="GA">GA</option>
                      <option value="LA">LA</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="time"
                      value={entry.timeIn}
                      onChange={(e) =>
                        updateEntry(i, "timeIn", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={entry.meal1Out}
                      onChange={(e) =>
                        updateEntry(i, "meal1Out", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={entry.meal1In}
                      onChange={(e) =>
                        updateEntry(i, "meal1In", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={entry.meal2Out}
                      onChange={(e) =>
                        updateEntry(i, "meal2Out", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={entry.meal2In}
                      onChange={(e) =>
                        updateEntry(i, "meal2In", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="time"
                      value={entry.timeOut}
                      onChange={(e) =>
                        updateEntry(i, "timeOut", e.target.value)
                      }
                    />
                  </td>
                  <td className="font-mono text-xs">
                    {entry.mp1} {entry.mp2}
                  </td>
                  <td className="font-mono text-xs">{entry.mealPenalties}</td>
                  <td className="font-mono text-xs">
                    {entry.straightTime.toFixed(2)}
                  </td>
                  <td className="font-mono text-xs">
                    {entry.ot15.toFixed(2)}
                  </td>
                  <td className="font-mono text-xs">
                    {entry.ot2.toFixed(2)}
                  </td>
                  <td className="font-mono text-xs">
                    {entry.ot25.toFixed(2)}
                  </td>
                  <td className="font-mono text-xs">
                    {entry.ot3Plus.toFixed(2)}
                  </td>
                  <td className="font-mono text-xs">
                    {entry.goldTime > 0 ? entry.goldTime.toFixed(0) : "0"}
                  </td>
                  <td className="font-mono text-xs">
                    {entry.forcedCall > 0 ? entry.forcedCall.toFixed(0) : "0"}
                  </td>
                  <td className="font-mono text-xs font-semibold">
                    {entry.totalHours > 0 ? entry.totalHours.toFixed(2) : ""}
                  </td>
                  <td>
                    <div className="flex gap-1 justify-center">
                      <button
                        className="p-1 text-sky-600 hover:text-sky-800"
                        title="Copy"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Clear"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comments section */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { key: "daily", label: "Daily Comments" },
          { key: "employee", label: "Employee Comments" },
          { key: "employer", label: "Employer Comments" },
          { key: "payroll", label: "Comments to Payroll" },
        ].map((section) => (
          <div
            key={section.key}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4"
          >
            <h4 className="text-sm font-semibold text-slate-700 mb-2">
              {section.label}
            </h4>
            <textarea
              value={comments[section.key as keyof typeof comments]}
              onChange={(e) =>
                setComments((prev) => ({
                  ...prev,
                  [section.key]: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        ))}
      </div>

      {/* Review Modal */}
      <TimecardReviewModal
        open={reviewModal}
        onClose={() => setReviewModal(false)}
        timecardId="tc-1"
        onSubmit={async (action, comment) => {
          console.log("Review:", action, comment);
          setReviewModal(false);
        }}
      />
    </div>
  );
}
