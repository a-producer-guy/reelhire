"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const PRODUCTIONS = [
  { value: "prod-1", label: "What Now?" },
  { value: "prod-2", label: "Desert Storm II" },
  { value: "prod-3", label: "Night Shift" },
];

const EMPLOYEES = [
  { value: "emp-1", label: "RIFKIN, JOSH - Editor" },
  { value: "emp-2", label: "MARTINEZ, SARAH - Assistant Editor" },
  { value: "emp-3", label: "CLINT, BARRY - Company Grip" },
  { value: "emp-4", label: "WELLS, AARON - Assistant Snake Wrangler" },
  { value: "emp-5", label: "NEWKIRK, ANASTASIA - Production Assistant" },
];

const LOCATIONS = [
  { value: "CA - Glendale", label: "CA - Glendale" },
  { value: "CA - Burbank", label: "CA - Burbank" },
  { value: "CA - Hollywood", label: "CA - Hollywood" },
  { value: "NY - Manhattan", label: "NY - Manhattan" },
  { value: "GA - Atlanta", label: "GA - Atlanta" },
];

export default function NewTimecardPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    production: "",
    employee: "",
    weekEnding: "",
    workLocation: "",
    studio: "Studio",
  });

  const handleCreate = () => {
    // In production, this would POST to the API
    router.push("/timecards/tc-new");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          Create a New Timecard
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Production
          </label>
          <Select
            options={PRODUCTIONS}
            placeholder="Select a production..."
            value={form.production}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, production: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Employee
          </label>
          <Select
            options={EMPLOYEES}
            placeholder="Select an employee..."
            value={form.employee}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, employee: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Week Ending
          </label>
          <input
            type="date"
            value={form.weekEnding}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, weekEnding: e.target.value }))
            }
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Select the Saturday that ends the work week
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Work Location
            </label>
            <Select
              options={LOCATIONS}
              placeholder="Select location..."
              value={form.workLocation}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, workLocation: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Studio / Location
            </label>
            <Select
              options={[
                { value: "Studio", label: "Studio" },
                { value: "Location", label: "Location" },
              ]}
              value={form.studio}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, studio: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link href="/dashboard">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleCreate}>
            <Save className="h-4 w-4" />
            Create Timecard
          </Button>
        </div>
      </div>
    </div>
  );
}
