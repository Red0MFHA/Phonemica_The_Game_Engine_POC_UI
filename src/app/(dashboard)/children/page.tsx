"use client";

import { useState } from "react";
import { Plus, Search, Baby } from "lucide-react";
import { mockEngine } from "@/services/mockEngine";
import { Button, PageHeader, StatusPill } from "@/components/ui";
import Link from "next/link";

export default function ChildrenPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const children = mockEngine.getChildren();

  const filtered = children.filter((c) => {
    const matchQ = c.name.toLowerCase().includes(q.toLowerCase());
    const matchStatus = status === "all" || c.assessmentStatus === status;
    return matchQ && matchStatus;
  });

  return (
    <div>
      <PageHeader
        title="Children"
        subtitle="Therapeutic profiles owned by the Engine."
        actions={<Button href="/children/new"><Plus size={16} /> Add Child</Button>}
      />

      <div className="mb-4 flex items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search children…" className="w-64 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
          <option value="all">All statuses</option>
          <option value="declared">Declared</option>
          <option value="pending">Pending diagnostic</option>
          <option value="diagnosed">Diagnosed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3">Child</th>
              <th className="px-5 py-3">Age</th>
              <th className="px-5 py-3">Assessment</th>
              <th className="px-5 py-3">Targets</th>
              <th className="px-5 py-3">Games</th>
              <th className="px-5 py-3">Therapist</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <td className="px-5 py-3">
                  <Link href={`/children/${c.id}`} className="flex items-center gap-3 font-medium text-brand-700 hover:underline dark:text-brand-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"><Baby size={15} /></div>
                    {c.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{c.age}</td>
                <td className="px-5 py-3"><StatusPill value={c.assessmentStatus} /></td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{c.targets.map((t) => t.phoneme).join(", ") || "—"}</td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{c.assignments.filter((a) => a.active).length}</td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{mockEngine.getUserName(c.therapistUserId)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-400 dark:text-slate-500">No children match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
