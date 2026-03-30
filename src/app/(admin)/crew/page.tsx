"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

const CREW = [
  { id: "1", name: "RIFKIN, JOSH", title: "Editor", union: "700", dept: "Post Production", email: "josh.r@example.com", status: "active" },
  { id: "2", name: "MARTINEZ, SARAH", title: "Assistant Editor", union: "700", dept: "Post Production", email: "sarah.m@example.com", status: "active" },
  { id: "3", name: "CLINT, BARRY", title: "Company Grip", union: "80", dept: "Grip", email: "barry.c@example.com", status: "active" },
  { id: "4", name: "WELLS, AARON", title: "Assistant Snake Wrangler", union: "", dept: "Animals", email: "aaron.w@example.com", status: "pending" },
  { id: "5", name: "NEWKIRK, ANASTASIA", title: "Production Assistant", union: "", dept: "Production", email: "anastasia.n@example.com", status: "active" },
  { id: "6", name: "GALLOWAY, JAY", title: "Class B Driver", union: "399", dept: "Transportation", email: "jay.g@example.com", status: "active" },
  { id: "7", name: "MILROY, CAMILLE", title: "Costumer", union: "705", dept: "Wardrobe", email: "camille.m@example.com", status: "active" },
  { id: "8", name: "MASTRIPPOLITO, BRANDON", title: "Director of Photography", union: "600", dept: "Camera", email: "brandon.m@example.com", status: "active" },
];

export default function CrewPage() {
  const [search, setSearch] = useState("");

  const filtered = CREW.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Crew</h1>
        <Button>
          <Plus className="h-4 w-4" />
          Add Crew Member
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search crew..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Name</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Title</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Department</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Union/Local</th>
              <th className="px-3 py-3 text-left font-semibold text-slate-600">Email</th>
              <th className="px-3 py-3 text-center font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.id} className="border-b border-slate-100 hover:bg-sky-50/50">
                <td className="px-4 py-3 font-medium text-sky-600">{member.name}</td>
                <td className="px-3 py-3 text-slate-600">{member.title}</td>
                <td className="px-3 py-3 text-slate-600">{member.dept}</td>
                <td className="px-3 py-3 text-slate-600">{member.union || "Non-Union"}</td>
                <td className="px-3 py-3 text-slate-600">{member.email}</td>
                <td className="px-3 py-3 text-center">
                  <Badge variant={member.status === "active" ? "success" : "warning"}>
                    {member.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
