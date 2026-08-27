"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { Baby, Gamepad2, Users, Activity as ActivityIcon, BrainCircuit } from "lucide-react";
import { KpiCard, Card, StatusPill } from "@/components/ui";
import { mockEngine } from "@/services/mockEngine";

export default function DashboardPage() {
  const data = mockEngine.getDashboard();

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Overview</h1>
      <p className="mt-1 text-sm text-slate-500">Control plane summary across the PHONOVA platform.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Children" value={data.totals.children} icon={<Baby size={18} />} hint="onboarded profiles" tone="brand" />
        <KpiCard label="Active Games" value={data.totals.games} icon={<Gamepad2 size={18} />} hint="registered & enabled" />
        <KpiCard label="Users" value={data.totals.users} icon={<Users size={18} />} hint="admins, therapists, parents" tone="green" />
        <KpiCard label="Sessions" value={data.totals.sessions.toLocaleString()} icon={<ActivityIcon size={18} />} hint={`${data.totals.exercises.toLocaleString()} exercises`} tone="amber" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Engine Health" className="lg:col-span-1">
          <ul className="space-y-3">
            {data.engineHealth.map((h) => (
              <li key={h.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{h.name}</p>
                  <p className="text-xs text-slate-400">{h.detail}</p>
                </div>
                <StatusPill value={h.status} />
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Overall Phoneme Performance" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.phonemePerformance} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="phoneme" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#4f46e5" fill="url(#acc)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Children by Game">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.childrenByGame} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="game" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" name="Children" radius={[6, 6, 0, 0]}>
                {data.childrenByGame.map((_, i) => (
                  <Cell key={i} fill={["#4f46e5", "#7c3aed", "#0ea5e9"][i % 3]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Recent Activity">
          <ul className="space-y-3">
            {data.recentActivity.slice(0, 7).map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                  <BrainCircuit size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-700">{a.text}</p>
                  <p className="text-xs text-slate-400">{new Date(a.timestamp).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
