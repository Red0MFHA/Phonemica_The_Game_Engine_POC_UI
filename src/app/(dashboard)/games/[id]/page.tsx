"use client";

import { ArrowLeft, Gamepad2, Layers, FileText, KeyRound } from "lucide-react";
import { mockEngine } from "@/services/mockEngine";
import { Button, Card, PageHeader, StatusPill } from "@/components/ui";

export default function GameDetailPage({ params }: { params: { id: string } }) {
  const game = mockEngine.getGame(params.id);
  if (!game) return <div className="py-20 text-center text-slate-400">Game not found.</div>;
  const levels = mockEngine.getLevels(game.id);

  return (
    <div>
      <Button variant="ghost" href="/games"><ArrowLeft size={16} /> Back to Games</Button>
      <PageHeader
        title={game.name}
        subtitle={`${game.shortId} · v${game.version} · ${game.developer}`}
        actions={
          <div className="flex gap-2">
            <StatusPill value={game.status} />
            <Button href={`/games/${game.id}/configuration`}>Configuration</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Overview" className="lg:col-span-1">
          <p className="text-sm text-slate-600">{game.description}</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Theme</dt><dd className="text-slate-800">{game.theme}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Word style</dt><dd className="text-slate-800">{game.wordStyle}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Age range</dt><dd className="text-slate-800">{game.ageRangeMin}–{game.ageRangeMax}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Mechanics</dt><dd className="text-slate-800">{game.mechanics.join(", ")}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Generated</dt><dd className="text-slate-800">{game.generatedAt ? new Date(game.generatedAt).toLocaleDateString() : "—"}</dd></div>
          </dl>
        </Card>

        <Card title="Capabilities" className="lg:col-span-2">
          <div className="space-y-3 text-sm">
            <div><p className="text-xs text-slate-500">Exercise types</p><div className="mt-1 flex flex-wrap gap-1.5">{game.capabilities.exerciseTypes.map((t) => <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 capitalize">{t.replace("_", " ")}</span>)}</div></div>
            <div><p className="text-xs text-slate-500">Positions</p><div className="mt-1 flex flex-wrap gap-1.5 capitalize">{game.capabilities.positions.map((p) => <span key={p} className="rounded bg-slate-100 px-2 py-0.5 text-slate-600">{p}</span>)}</div></div>
            <div><p className="text-xs text-slate-500">Difficulty</p><p className="mt-1 font-medium text-slate-800">{game.capabilities.difficultyMin}–{game.capabilities.difficultyMax}</p></div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
            <div className="rounded-lg bg-slate-50 p-3 text-center"><p className="flex items-center justify-center gap-1 text-xs text-slate-500"><Layers size={12} /> Levels</p><p className="mt-1 text-xl font-bold text-slate-900">{game.levelCount}</p></div>
            <div className="rounded-lg bg-slate-50 p-3 text-center"><p className="flex items-center justify-center gap-1 text-xs text-slate-500"><FileText size={12} /> Exercises</p><p className="mt-1 text-xl font-bold text-slate-900">{game.exerciseCount}</p></div>
            <div className="rounded-lg bg-slate-50 p-3 text-center"><p className="flex items-center justify-center gap-1 text-xs text-slate-500"><KeyRound size={12} /> API</p><p className="mt-1 font-mono text-xs text-slate-700">{game.apiKey}</p></div>
          </div>
        </Card>
      </div>

      <Card title="Levels" className="mt-6">
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {levels.map((lv) => (
            <li key={lv.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Gamepad2 size={15} /></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Level {lv.index}</p>
                  <p className="text-xs text-slate-400">{lv.exerciseIds.length} exercises</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">diff {lv.difficulty}</span>
            </li>
          ))}
          {levels.length === 0 && <li className="text-sm text-slate-400">No levels generated yet.</li>}
        </ul>
      </Card>
    </div>
  );
}
