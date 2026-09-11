"use client";

import { useState, use } from "react";
import { ArrowLeft, ExternalLink, Sparkles, UserPlus } from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";
import { mockEngine } from "@/services/mockEngine";
import { Button, Card, PageHeader, StatusPill } from "@/components/ui";
import { getAuth } from "@/lib/auth";
import { can } from "@/lib/permissions";

const SKIN_LINKS = [
  { name: "Jungle Quest", href: "http://localhost:3001/welcome" },
  { name: "Cosmic Rescue", href: "http://localhost:3002/welcome" },
];

export default function ChildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const session = getAuth();
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  if (!mockEngine.canViewChild(session, id)) {
    return <div className="py-20 text-center text-slate-400 dark:text-slate-500">Child not in your scope.</div>;
  }

  const child = mockEngine.getChild(id);
  if (!child) {
    return <div className="py-20 text-center text-slate-400 dark:text-slate-500">Child not found.</div>;
  }

  const games = mockEngine.getGames();
  const parents = mockEngine.getUsers().filter((u) => u.role === "parent");
  const therapists = mockEngine.getUsers().filter((u) => u.role === "therapist");
  const canTherapy = can(session?.role, "children.edit_therapy");
  const canAssign = can(session?.role, "children.assign_games");
  const canLaunch = can(session?.role, "skin.launch");
  const canPersonal = can(session?.role, "children.edit_personal");

  return (
    <div>
      <Breadcrumbs items={[{ label: "Children", href: "/children" }, { label: child.name }]} />
      <Button variant="ghost" href="/children">
        <ArrowLeft size={16} /> Back to Children
      </Button>
      <PageHeader
        title={child.name}
        subtitle={`Age ${child.age} · ${child.gender ?? "—"} · created ${new Date(child.createdAt).toLocaleDateString()}`}
        actions={
          <div className="flex flex-wrap gap-2">
            {can(session?.role, "children.assess") && (
              <Button variant="secondary" href={`/children/${child.id}/assessment`}>
                Assessment
              </Button>
            )}
            <Button href={`/children/${child.id}/analytics`}>View Analytics</Button>
          </div>
        }
      />

      {!canPersonal && (
        <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">
          Personal demographics are read-only for your role. Therapy blocks below stay editable for SLPs.
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Profile" className="lg:col-span-1">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Assessment</dt>
              <dd>
                <StatusPill value={child.assessmentStatus} />
              </dd>
            </div>
            {canPersonal ? (
              <>
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500">Parent</span>
                  <select
                    value={child.parentUserId ?? ""}
                    onChange={(e) => {
                      mockEngine.updateChildLinks(child.id, { parentUserId: e.target.value });
                      refresh();
                    }}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="">— none —</option>
                    {parents.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500">Therapist / SLP</span>
                  <select
                    value={child.therapistUserId ?? ""}
                    onChange={(e) => {
                      mockEngine.updateChildLinks(child.id, { therapistUserId: e.target.value });
                      refresh();
                    }}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
                  >
                    <option value="">— none —</option>
                    {therapists.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Parent</dt>
                  <dd className="text-slate-800 dark:text-slate-100">{mockEngine.getUserName(child.parentUserId)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500 dark:text-slate-400">Therapist</dt>
                  <dd className="text-slate-800 dark:text-slate-100">{mockEngine.getUserName(child.therapistUserId)}</dd>
                </div>
              </>
            )}
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
                    {t.note && <span>· {t.note}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {!canTherapy && <p className="mt-3 text-xs text-slate-400">Targets are view-only for parents.</p>}
        </Card>
      </div>

      {canLaunch && (
        <Card title="Launch skin" className="mt-6" subtitle="Opens the child-facing game (separate POC app).">
          <div className="flex flex-wrap gap-2">
            {SKIN_LINKS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-brand-700 hover:border-brand-600 dark:border-slate-700 dark:text-brand-300"
              >
                <ExternalLink size={14} /> {s.name}
              </a>
            ))}
          </div>
        </Card>
      )}

      <Card
        title="Game Assignments"
        className="mt-6"
        subtitle={
          canAssign
            ? "Auto-assigned by Settings · Auto-assign games. Admin/SLP can override."
            : "Assigned games for this child (view only)."
        }
        action={
          canAssign ? (
            <Button
              variant="secondary"
              onClick={() => {
                mockEngine.regenerateAssignment(child.id);
                refresh();
              }}
            >
              Regenerate
            </Button>
          ) : undefined
        }
      >
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {child.assignments.map((a) => {
            const game = games.find((g) => g.id === a.gameId);
            return (
              <li key={a.gameId} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                    {game?.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{game?.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{a.reason}</p>
                    <span className="flex items-center gap-1 text-xs capitalize text-slate-400 dark:text-slate-500">
                      <Sparkles size={11} /> assigned by {a.source}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill value={a.active ? "active" : "disabled"} />
                  {canAssign && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          mockEngine.setGameAssignmentActive(child.id, a.gameId, !a.active);
                          refresh();
                        }}
                      >
                        {a.active ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          mockEngine.removeGameAssignment(child.id, a.gameId);
                          refresh();
                        }}
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {canAssign && (
          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Manually assign a game</p>
            <div className="flex flex-wrap gap-2">
              {games
                .filter((g) => !child.assignments.some((a) => a.gameId === g.id))
                .map((g) => (
                  <Button
                    key={g.id}
                    variant="secondary"
                    onClick={() => {
                      mockEngine.assignGame(child.id, g.id, "admin");
                      refresh();
                    }}
                  >
                    <UserPlus size={14} /> {g.name}
                  </Button>
                ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
