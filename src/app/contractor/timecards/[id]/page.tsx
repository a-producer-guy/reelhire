"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  formatCurrency,
  calculateEntryHours,
} from "@/lib/utils";
import { PAY_TYPES, STATUS_LABELS, STATUS_COLORS, PAYMENT_TERMS_LABELS } from "@/types";
import { Save, Send, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

// Demo scene codes for the production
const AVAILABLE_SCENES = [
  { id: "sc-1", code: "SC-098", description: "Ext. Parking Lot - Night" },
  { id: "sc-2", code: "SC-099", description: "Int. Hallway - Day" },
  { id: "sc-3", code: "SC-100", description: "Int. Office - Day - Dialog" },
  { id: "sc-4", code: "SC-101", description: "Int. Office - Day - Action" },
  { id: "sc-5", code: "SC-102", description: "Ext. Rooftop - Sunset" },
  { id: "sc-6", code: "SC-103", description: "Int. Warehouse - Night" },
  { id: "sc-7", code: "SC-104", description: "Ext. Street - Day - Chase" },
  { id: "sc-8", code: "SC-115", description: "Int. Kitchen - Morning" },
  { id: "sc-9", code: "SC-116", description: "Int. Bedroom - Night" },
  { id: "sc-10", code: "SC-120", description: "Ext. Beach - Golden Hour" },
];

type SceneEntry = {
  sceneId: string;
  sceneCode: string;
  hours: number;
  notes: string;
};

type DayEntry = {
  id: string;
  date: string;
  dayLabel: string;
  payType: string;
  timeIn: string;
  meal1Out: string;
  meal1In: string;
  meal2Out: string;
  meal2In: string;
  timeOut: string;
  straightTime: number;
  ot15: number;
  ot2: number;
  totalHours: number;
  scenes: SceneEntry[];
};

function getWeekDays(weekEnding: string) {
  const end = new Date(weekEnding + "T12:00:00");
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    days.push({
      date: d.toISOString().split("T")[0],
      label:
        d.toLocaleDateString("en-US", { weekday: "short" }) +
        " " +
        d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }),
    });
  }
  return days;
}

export default function ContractorTimecardPage() {
  const weekEnding = "2026-03-28";
  const status = "DRAFT";
  const weekDays = getWeekDays(weekEnding);

  const [entries, setEntries] = useState<DayEntry[]>(
    weekDays.map((day, i) => ({
      id: `entry-${i}`,
      date: day.date,
      dayLabel: day.label,
      payType: [1, 2, 3, 4].includes(i) ? "WORKED" : "NOT_WORKED",
      timeIn: [1, 2, 3, 4].includes(i) ? "09:00" : "",
      meal1Out: [1, 2, 3, 4].includes(i) ? "12:30" : "",
      meal1In: [1, 2, 3, 4].includes(i) ? "13:30" : "",
      meal2Out: "",
      meal2In: "",
      timeOut: [1, 2, 3, 4].includes(i) ? "18:00" : "",
      straightTime: [1, 2, 3, 4].includes(i) ? 8 : 0,
      ot15: [1, 2, 3, 4].includes(i) ? 0 : 0,
      ot2: 0,
      totalHours: [1, 2, 3, 4].includes(i) ? 8 : 0,
      scenes: [1, 2, 3, 4].includes(i)
        ? [
            {
              sceneId: AVAILABLE_SCENES[i].id,
              sceneCode: AVAILABLE_SCENES[i].code,
              hours: 5,
              notes: "",
            },
            {
              sceneId: AVAILABLE_SCENES[i + 1].id,
              sceneCode: AVAILABLE_SCENES[i + 1].code,
              hours: 3,
              notes: "",
            },
          ]
        : [],
    }))
  );

  const [contractorNotes, setContractorNotes] = useState("");
  const [showScenePickerFor, setShowScenePickerFor] = useState<number | null>(null);

  const hourlyRate = 50;
  const paymentTerms = "NET_30";

  const updateEntry = (index: number, field: keyof DayEntry, value: string) => {
    setEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[index], [field]: value };

      if (
        ["timeIn", "timeOut", "meal1Out", "meal1In", "meal2Out", "meal2In", "payType"].includes(field)
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

  const addScene = (dayIndex: number, sceneId: string) => {
    const scene = AVAILABLE_SCENES.find((s) => s.id === sceneId);
    if (!scene) return;

    setEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[dayIndex] };
      if (entry.scenes.some((s) => s.sceneId === sceneId)) return prev;
      entry.scenes = [
        ...entry.scenes,
        { sceneId, sceneCode: scene.code, hours: 0, notes: "" },
      ];
      updated[dayIndex] = entry;
      return updated;
    });
    setShowScenePickerFor(null);
  };

  const removeScene = (dayIndex: number, sceneId: string) => {
    setEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[dayIndex] };
      entry.scenes = entry.scenes.filter((s) => s.sceneId !== sceneId);
      updated[dayIndex] = entry;
      return updated;
    });
  };

  const updateSceneHours = (dayIndex: number, sceneId: string, hours: number) => {
    setEntries((prev) => {
      const updated = [...prev];
      const entry = { ...updated[dayIndex] };
      entry.scenes = entry.scenes.map((s) =>
        s.sceneId === sceneId ? { ...s, hours } : s
      );
      updated[dayIndex] = entry;
      return updated;
    });
  };

  const totalHours = useMemo(
    () => entries.reduce((sum, e) => sum + e.totalHours, 0),
    [entries]
  );

  const totalST = entries.reduce((s, e) => s + e.straightTime, 0);
  const totalOT = entries.reduce((s, e) => s + e.ot15 + e.ot2, 0);
  const totalPay = totalST * hourlyRate + totalOT * hourlyRate * 1.5;

  // Gather all scene codes used
  const allSceneCodes = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach((e) => {
      e.scenes.forEach((s) => {
        map.set(s.sceneCode, (map.get(s.sceneCode) || 0) + s.hours);
      });
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [entries]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/contractor">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Timecard - Week Ending {weekEnding}
            </h1>
            <p className="text-sm text-slate-500">
              What Now? &middot; {PAYMENT_TERMS_LABELS[paymentTerms]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={STATUS_COLORS[status]}>
            {STATUS_LABELS[status]}
          </Badge>
          <Button variant="outline" size="sm">
            <Save className="h-3.5 w-3.5" />
            Save Draft
          </Button>
          <Button size="sm">
            <Send className="h-3.5 w-3.5" />
            Submit Timecard
          </Button>
        </div>
      </div>

      {/* Daily entries with scene codes */}
      <div className="space-y-4">
        {entries.map((entry, dayIdx) => (
          <div
            key={entry.id}
            className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
              entry.payType === "NOT_WORKED" || entry.payType === "UNPAID_DAY"
                ? "border-slate-200 opacity-60"
                : "border-slate-200"
            }`}
          >
            {/* Day header */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-800 w-24">
                  {entry.dayLabel}
                </span>
                <select
                  value={entry.payType}
                  onChange={(e) => updateEntry(dayIdx, "payType", e.target.value)}
                  className="text-sm px-2 py-1 border border-slate-300 rounded-md bg-white"
                >
                  {PAY_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-500">
                  ST: <span className="font-mono font-medium text-slate-800">{entry.straightTime.toFixed(1)}</span>
                </span>
                {entry.ot15 > 0 && (
                  <span className="text-amber-600">
                    OT: <span className="font-mono font-medium">{entry.ot15.toFixed(1)}</span>
                  </span>
                )}
                <span className="font-semibold text-slate-900">
                  {entry.totalHours.toFixed(1)}h
                </span>
              </div>
            </div>

            {entry.payType === "WORKED" && (
              <div className="p-5 space-y-4">
                {/* Time inputs */}
                <div className="grid grid-cols-6 gap-3">
                  {[
                    { label: "Time In", field: "timeIn" as const },
                    { label: "Meal Out", field: "meal1Out" as const },
                    { label: "Meal In", field: "meal1In" as const },
                    { label: "Meal 2 Out", field: "meal2Out" as const },
                    { label: "Meal 2 In", field: "meal2In" as const },
                    { label: "Time Out", field: "timeOut" as const },
                  ].map(({ label, field }) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        {label}
                      </label>
                      <input
                        type="time"
                        value={entry[field]}
                        onChange={(e) => updateEntry(dayIdx, field, e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  ))}
                </div>

                {/* Scene codes section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-violet-700">
                      Scene Codes
                    </h4>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-violet-600"
                        onClick={() =>
                          setShowScenePickerFor(
                            showScenePickerFor === dayIdx ? null : dayIdx
                          )
                        }
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Scene
                      </Button>
                      {showScenePickerFor === dayIdx && (
                        <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-48 overflow-auto">
                          {AVAILABLE_SCENES.filter(
                            (s) =>
                              !entry.scenes.some((es) => es.sceneId === s.id)
                          ).map((scene) => (
                            <button
                              key={scene.id}
                              onClick={() => addScene(dayIdx, scene.id)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-violet-50 flex items-center gap-2"
                            >
                              <span className="font-mono font-medium text-violet-600">
                                {scene.code}
                              </span>
                              <span className="text-slate-500 truncate">
                                {scene.description}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {entry.scenes.length > 0 ? (
                    <div className="space-y-2">
                      {entry.scenes.map((scene) => (
                        <div
                          key={scene.sceneId}
                          className="flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-lg px-3 py-2"
                        >
                          <span className="font-mono text-sm font-semibold text-violet-700 w-16">
                            {scene.sceneCode}
                          </span>
                          <span className="text-xs text-slate-500 flex-1">
                            {
                              AVAILABLE_SCENES.find(
                                (s) => s.id === scene.sceneId
                              )?.description
                            }
                          </span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={scene.hours || ""}
                              onChange={(e) =>
                                updateSceneHours(
                                  dayIdx,
                                  scene.sceneId,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              step="0.5"
                              min="0"
                              className="w-16 px-2 py-1 text-sm border border-violet-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                            <span className="text-xs text-slate-500">hrs</span>
                          </div>
                          <button
                            onClick={() => removeScene(dayIdx, scene.sceneId)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {/* Unallocated hours warning */}
                      {entry.totalHours > 0 && (
                        (() => {
                          const allocated = entry.scenes.reduce(
                            (sum, s) => sum + s.hours,
                            0
                          );
                          const diff = entry.totalHours - allocated;
                          if (Math.abs(diff) > 0.01) {
                            return (
                              <p className="text-xs text-amber-600 mt-1">
                                {diff > 0
                                  ? `${diff.toFixed(1)}h not yet allocated to a scene`
                                  : `${Math.abs(diff).toFixed(1)}h over-allocated`}
                              </p>
                            );
                          }
                          return (
                            <p className="text-xs text-emerald-600 mt-1">
                              All hours allocated to scenes
                            </p>
                          );
                        })()
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No scene codes added. Click &quot;Add Scene&quot; to tag
                      your hours.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-6">
        {/* Pay Summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Pay Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Rate</span>
              <span className="font-mono">{formatCurrency(hourlyRate)}/hr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Straight Time ({totalST.toFixed(1)}h)</span>
              <span className="font-mono">{formatCurrency(totalST * hourlyRate)}</span>
            </div>
            {totalOT > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-600">Overtime ({totalOT.toFixed(1)}h @ 1.5x)</span>
                <span className="font-mono">{formatCurrency(totalOT * hourlyRate * 1.5)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total ({totalHours.toFixed(1)}h)</span>
              <span className="font-mono">{formatCurrency(totalPay)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 pt-1">
              <span>Payment Terms</span>
              <span>{PAYMENT_TERMS_LABELS[paymentTerms]}</span>
            </div>
          </div>
        </div>

        {/* Scene Code Summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-semibold text-violet-800 mb-4">
            Scene Code Summary
          </h3>
          {allSceneCodes.length > 0 ? (
            <div className="space-y-2">
              {allSceneCodes.map(([code, hours]) => (
                <div key={code} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-violet-700 bg-violet-100 px-2 py-0.5 rounded">
                      {code}
                    </span>
                    <span className="text-xs text-slate-500">
                      {AVAILABLE_SCENES.find((s) => s.code === code)?.description}
                    </span>
                  </div>
                  <span className="font-mono text-sm">{hours.toFixed(1)}h</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 font-semibold text-sm">
                <span>Total Allocated</span>
                <span className="font-mono">
                  {allSceneCodes.reduce((s, [, h]) => s + h, 0).toFixed(1)}h
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">
              No scene codes added yet.
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
        <textarea
          value={contractorNotes}
          onChange={(e) => setContractorNotes(e.target.value)}
          rows={3}
          placeholder="Add any notes about your work this week..."
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
    </div>
  );
}
