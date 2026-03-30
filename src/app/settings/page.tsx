"use client";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      {/* Company Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Company Settings
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              defaultValue="Reelarc"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Default Work State
            </label>
            <Select
              options={[
                { value: "CA", label: "California" },
                { value: "NY", label: "New York" },
                { value: "GA", label: "Georgia" },
              ]}
              value="CA"
            />
          </div>
        </div>
      </div>

      {/* Approval Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Approval Workflow
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Number of Approval Tiers
          </label>
          <Select
            options={[
              { value: "1", label: "1 Tier" },
              { value: "2", label: "2 Tiers" },
              { value: "3", label: "3 Tiers" },
            ]}
            value="2"
          />
          <p className="text-xs text-slate-500 mt-1">
            Tier 1: Department Head, Tier 2: Production Coordinator
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-sky-600" />
            <span className="text-sm text-slate-700">Require employee submission before approval</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-sky-600" />
            <span className="text-sm text-slate-700">Allow bypass to final approval</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-slate-300 text-sky-600" />
            <span className="text-sm text-slate-700">Auto-submit to payroll after final approval</span>
          </label>
        </div>
      </div>

      {/* OT Rules */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Overtime Rules
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Straight Time (up to hours)
            </label>
            <input
              type="number"
              defaultValue="8"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              OT 1.5x (up to hours)
            </label>
            <input
              type="number"
              defaultValue="12"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              OT 2x (after hours)
            </label>
            <input
              type="number"
              defaultValue="12"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
