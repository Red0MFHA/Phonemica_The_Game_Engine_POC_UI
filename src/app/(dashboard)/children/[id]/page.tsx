"use client";

import { useState, use } from "react";
import { ArrowLeft, Sparkles, UserPlus } from "lucide-react";
import { mockEngine } from "@/services/mockEngine";
import { Button, Card, PageHeader, StatusPill } from "@/components/ui";

export default function ChildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [, setTick] = useState(0);
  const child = mockEngine.getChild(id);
  const refresh = () => setTick((t) => t + 1);

  if (!child) {
    return <div className="py-20 text-center text-slate-400 dark:text-slate-500">Child not found.</div>;
  }

  const games = mockEngine.getGames();

  return (
    <div>
      <Button variant="ghost" href="/children"><ArrowLeft size={16} /> Back to Children</Button>
      <PageHeader
        title={child.name}
        subtitle={`Age ${child.age} · ${child.gender} · created ${new Date(child.createdAt).toLocaleDateString()}`}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" href={`/children/${child.id}/assessment`}>Assessment</Button>
            <Button href={`/children/${child.id}/analytics`}>View Analytics</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Profile" className="lg:col-span-1">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Assessment</dt><dd><StatusPill value={child.assessmentStatus} /></dd></div>
            <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Parent</dt><dd className="text-slate-800 dark:text-slate-100">{mockEngine.getUserName(child.parentUserId)}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Therapist</dt><dd className="text-slate-800 dark:text-slate-100">{mockEngine.getUserName(child.therapistUserId)}</dd></div>
          </dl>
        </Card>

        <Card title="Target Phonemes" className="lg:col-span-2">
          {child.targets.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No targets yet — pending diagnostic screen.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {child.targets.map((t) => (
                <li key={t.phoneme} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-2 dark:border-slate-800">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t.phoneme}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <Sparkles size={12} /> {t.source}
                    {t.note && <span className="text-slate-400 dark:text-slate-500">· {t.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Game Assignments" className="mt-6"
        subtitle="Auto-assigned by the Engine. Admin can override without approval."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { mockEngine.regenerateAssignment(child.id); refresh(); }}>
              Regenerate
            </Button>
          </div>
        }
      >
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {child.assignments.map((a) => {
            const game = games.find((g) => g.id === a.gameId);
            return (
              <li key={a.gameId} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{game?.name.slice(0, 1)}</div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{game?.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{a.reason}</p>
                    <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 capitalize">
                      <Sparkles size={11} /> assigned by {a.source}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill value={a.active ? "active" : "disabled"} />
                  <Button variant="ghost" onClick={() => { mockEngine.setGameAssignmentActive(child.id, a.gameId, !a.active); refresh(); }}>
                    {a.active ? "Disable" : "Enable"}
                  </Button>
                  <Button variant="danger" onClick={() => { mockEngine.removeGameAssignment(child.id, a.gameId); refresh(); }}>Remove</Button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Manually assign a game</p>
          <div className="flex flex-wrap gap-2">
            {games.filter((g) => !child.assignments.some((a) => a.gameId === g.id)).map((g) => (
              <Button key={g.id} variant="secondary" onClick={() => { mockEngine.assignGame(child.id, g.id, "admin"); refresh(); }}>
                <UserPlus size={14} /> {g.name}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
