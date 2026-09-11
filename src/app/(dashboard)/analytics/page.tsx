"use client";

import { Activity, TrendingUp, Clock, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, PageHeader, KpiCard } from "@/components/ui";
import { mockEngine } from "@/services/mockEngine";
import { getAuth } from "@/lib/auth";
import Link from "next/link";

export default function AnalyticsPage() {
  const session = getAuth();
  const data = mockEngine.getPlatformAnalytics(session);

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle={
          session?.role === "therapist"
            ? "Caseload aggregate from recorded attempts."
            : "Org aggregate from recorded attempts."
        }
      />

      <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">
        {data.seeded ? "Figures derived from seeded attempt history (POC). " : ""}
        {data.liveSharedAttempts > 0 ? `${data.liveSharedAttempts} live skin attempts merged from shared store. ` : ""}
        Active = children with ≥1 attempt in the store.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active children" value={String(data.activeChildren)} icon={<Activity size={18} />} />
        <KpiCard label="Correctness" value={`${data.correctness}%`} icon={<TrendingUp size={18} />} />
        <KpiCard label="Avg attempts / session-day" value={String(data.avgSessionAttempts)} icon={<Clock size={18} />} />
        <KpiCard label="Words practised" value={String(data.wordsPractised)} icon={<Sparkles size={18} />} />
      </div>

      <Card title="Sessions & accuracy (last 7 days)" className="mt-6">
        <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
          Sessions = distinct children with attempts that day. Accuracy = correct / attempts that day.
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" stroke="#0ea5e9" strokeWidth={2} name="Children active" />
              <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} name="Accuracy %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Jump to a child&apos;s analytics" className="mt-6">
        <div className="flex flex-wrap gap-2">
          {data.children.map((c) => (
            <Link
              key={c.id}
              href={`/children/${c.id}/analytics`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-brand-600 hover:text-brand-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:text-brand-300"
            >
              <Activity size={14} /> {c.name}
            </Link>
          ))}
          {data.children.length === 0 && <p className="text-sm text-slate-400">No children in scope.</p>}
        </div>
      </Card>
    </div>
  );
}
