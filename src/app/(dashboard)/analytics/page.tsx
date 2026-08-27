"use client";

import { Activity, TrendingUp, Clock, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, PageHeader, KpiCard } from "@/components/ui";
import { mockEngine } from "@/services/mockEngine";
import Link from "next/link";

const WEEKLY = [
  { day: "Mon", sessions: 24, accuracy: 71 },
  { day: "Tue", sessions: 31, accuracy: 74 },
  { day: "Wed", sessions: 28, accuracy: 78 },
  { day: "Thu", sessions: 35, accuracy: 76 },
  { day: "Fri", sessions: 40, accuracy: 81 },
  { day: "Sat", sessions: 46, accuracy: 83 },
  { day: "Sun", sessions: 38, accuracy: 85 },
];

export default function AnalyticsPage() {
  const children = mockEngine.getChildren();

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Cross-platform aggregate analytics." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Active children" value="32" icon={<Activity size={18} />} />
        <KpiCard label="Correctness (30d)" value="82%" delta={+4} icon={<TrendingUp size={18} />} />
        <KpiCard label="Avg session" value="8m 30s" icon={<Clock size={18} />} />
        <KpiCard label="Words practised" value="1,284" delta={+118} icon={<Sparkles size={18} />} />
      </div>

      <Card title="Sessions & accuracy (this week)" className="mt-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={WEEKLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" stroke="#0ea5e9" strokeWidth={2} />
              <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Jump to a child&apos;s analytics" className="mt-6">
        <div className="flex flex-wrap gap-2">
          {children.map((c) => (
            <Link key={c.id} href={`/children/${c.id}/analytics`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-brand-600 hover:text-brand-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-500 dark:hover:text-brand-300">
              <Activity size={14} /> {c.name}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
