"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { ArrowLeft, BrainCircuit, Sparkles } from "lucide-react";
import { mockEngine } from "@/services/mockEngine";
import { Button, Card, PageHeader, StatusPill } from "@/components/ui";
import { use } from "react";

const TREND_TONES: Record<string, string> = {
  improving: "↑ improving",
  stable: "→ stable",
  declining: "↓ declining",
};

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const child = mockEngine.getChild(id);
  if (!child) return <div className="py-20 text-center text-slate-400 dark:text-slate-500">Child not found.</div>;
  const a = mockEngine.getAnalytics(child.id);

  const errorColors = ["#ef4444", "#f59e0b", "#8b5cf6", "#22c55e"];

  return (
    <div>
      <Button variant="ghost" href={`/children/${child.id}`}><ArrowLeft size={16} /> Back to {child.name}</Button>
      <PageHeader
        title={`Analytics — ${child.name}`}
        subtitle={`Age ${child.age} · ${mockEngine.getUserName(child.therapistUserId)} · ${mockEngine.getUserName(child.parentUserId) !== "—" ? `parent ${mockEngine.getUserName(child.parentUserId)}` : "no parent linked"}`}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><p className="text-xs text-slate-500 dark:text-slate-400">Total attempts</p><p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{a.totals.attempts}</p></Card>
        <Card><p className="text-xs text-slate-500 dark:text-slate-400">Correct</p><p className="mt-1 text-2xl font-bold text-emerald-600">{a.totals.correct}</p></Card>
        <Card><p className="text-xs text-slate-500 dark:text-slate-400">Sessions</p><p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{a.totals.sessions}</p></Card>
        <Card><p className="text-xs text-slate-500 dark:text-slate-400">Overall accuracy</p><p className="mt-1 text-2xl font-bold text-brand-700">{Math.round((a.totals.correct / a.totals.attempts) * 100)}%</p></Card>
      </div>

      <Card title="Phoneme Performance" className="mt-6">
        <div className="space-y-3">
          {a.perPhoneme.map((p) => (
            <div key={p.phoneme} className="flex items-center gap-4 rounded-lg border border-slate-100 px-4 py-3 dark:border-slate-800">
              <span className="w-10 text-sm font-bold text-slate-800 dark:text-slate-100">{p.phoneme}</span>
              <div className="h-2.5 w-full max-w-md overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${
                    p.accuracy >= 85 ? "bg-emerald-500" : p.accuracy >= 60 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${p.accuracy}%` }}
                />
              </div>
              <span className="w-14 text-right text-sm font-medium text-slate-700 dark:text-slate-300">{p.accuracy}%</span>
              <span className="w-32 text-xs text-slate-500 dark:text-slate-400">{p.attempts} attempts</span>
              <StatusPill value={p.mastery} />
              <span className={`text-xs ${TREND_TONES[p.trend].includes("improving") ? "text-emerald-600" : TREND_TONES[p.trend].includes("declining") ? "text-red-600" : "text-slate-500 dark:text-slate-400"}`}>
                {TREND_TONES[p.trend]}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Mastery Trend" subtitle="Accuracy over recent sessions">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={a.sessionHistory} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" })} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip labelFormatter={(d) => new Date(String(d)).toLocaleString()} />
              <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Error Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={a.errorDistribution} dataKey="count" nameKey="errorType" outerRadius={80} label>
                {a.errorDistribution.map((_, i) => <Cell key={i} fill={errorColors[i]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Position Breakdown" className="mt-6">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={a.positionBreakdown} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="position" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="accuracy" name="Accuracy %" radius={[6, 6, 0, 0]}>
              {a.positionBreakdown.map((_, i) => <Cell key={i} fill={["#4f46e5", "#7c3aed", "#0ea5e9"][i % 3]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <Card title="Recent Sessions">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr><th className="py-2">Date</th><th className="py-2">Game</th><th className="py-2">Type</th><th className="py-2">Exercises</th><th className="py-2 text-right">Accuracy</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {a.sessionHistory.map((s) => (
                <tr key={s.id}>
                  <td className="py-2 text-slate-600 dark:text-slate-300">{new Date(s.date).toLocaleString()}</td>
                  <td className="py-2 text-slate-600 dark:text-slate-300">{mockEngine.getGameName(s.gameId)}</td>
                  <td className="py-2">{s.isDiagnostic ? <StatusPill value="pending" /> : "—"}</td>
                  <td className="py-2 text-slate-600 dark:text-slate-300">{s.exercises}</td>
                  <td className="py-2 text-right font-medium text-slate-700 dark:text-slate-300">{s.accuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card title="Engine Recommendation" className="mt-6 border-brand-200 bg-brand-50/40">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white"><BrainCircuit size={20} /></div>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              <Sparkles size={14} className="text-brand-700" /> {a.recommendation.phoneme}
              <span className="text-xs font-normal text-slate-400 dark:text-slate-500">generated by Adaptive Engine</span>
            </p>
            <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
              <div className="rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/60"><p className="text-xs text-slate-500 dark:text-slate-400">Target</p><p className="font-medium text-slate-800 dark:text-slate-100">{a.recommendation.phoneme}</p></div>
              <div className="rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/60"><p className="text-xs text-slate-500 dark:text-slate-400">Recommended difficulty</p><p className="font-medium text-slate-800 dark:text-slate-100">{a.recommendation.recommendedDifficulty.toFixed(2)}</p></div>
              <div className="rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-800/60"><p className="text-xs text-slate-500 dark:text-slate-400">Recommended exercise</p><p className="font-medium text-slate-800 dark:text-slate-100">{a.recommendation.recommendedExercise.replace("_", " ")}</p></div>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{a.recommendation.reason}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
