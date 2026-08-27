"use client";

import { useState, use } from "react";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { mockEngine } from "@/services/mockEngine";
import { Button, Card, PageHeader, StatusPill } from "@/components/ui";
import type { ExerciseType, PhonemePosition } from "@/types/engine";

const EXERCISE_TYPES: ExerciseType[] = ["picture_naming", "word_repetition", "minimal_pair", "sound_identification"];
const POSITIONS: PhonemePosition[] = ["initial", "medial", "final"];

export default function GameConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [, setTick] = useState(0);
  const [generating, setGenerating] = useState(false);
  const game = mockEngine.getGame(id);
  const refresh = () => setTick((t) => t + 1);

  if (!game) return <div className="py-20 text-center text-slate-400 dark:text-slate-500">Game not found.</div>;
  const currentGame = game;

  function toggleExerciseType(t: ExerciseType) {
    const cur = currentGame.capabilities.exerciseTypes;
    const next = cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t];
    mockEngine.updateGame(currentGame.id, { capabilities: { ...currentGame.capabilities, exerciseTypes: next } });
    refresh();
  }
  function togglePosition(p: PhonemePosition) {
    const cur = currentGame.capabilities.positions;
    const next = cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p];
    mockEngine.updateGame(currentGame.id, { capabilities: { ...currentGame.capabilities, positions: next } });
    refresh();
  }
  function regenerate() {
    setGenerating(true);
    setTimeout(() => {
      mockEngine.generateContent(currentGame.id);
      setGenerating(false);
      refresh();
    }, 1200);
  }

  return (
    <div>
      <Button variant="ghost" href={`/games/${game.id}`}><ArrowLeft size={16} /> Back to {game.name}</Button>
      <PageHeader
        title={`Configuration — ${game.name}`}
        subtitle="Capabilities tell the Engine what this skin can render."
        actions={<StatusPill value={game.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Exercise types">
          <div className="space-y-2">
            {EXERCISE_TYPES.map((t) => {
              const on = game.capabilities.exerciseTypes.includes(t);
              return (
                <button key={t} onClick={() => toggleExerciseType(t)} className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm ${on ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"}`}>
                  <span className="capitalize">{t.replace("_", " ")}</span>
                  <span>{on ? "✓" : "○"}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card title="Phoneme positions">
          <div className="space-y-2">
            {POSITIONS.map((p) => {
              const on = game.capabilities.positions.includes(p);
              return (
                <button key={p} onClick={() => togglePosition(p)} className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm capitalize ${on ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"}`}>
                  <span>{p}</span><span>{on ? "✓" : "○"}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <label className="block"><span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Min difficulty</span><input type="number" value={game.capabilities.difficultyMin} onChange={(e) => { mockEngine.updateGame(game.id, { capabilities: { ...game.capabilities, difficultyMin: +e.target.value } }); refresh(); }} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" /></label>
            <label className="block"><span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Max difficulty</span><input type="number" value={game.capabilities.difficultyMax} onChange={(e) => { mockEngine.updateGame(game.id, { capabilities: { ...game.capabilities, difficultyMax: +e.target.value } }); refresh(); }} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" /></label>
          </div>
        </Card>
      </div>

      <Card title="Content pool" className="mt-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-6">
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Levels</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{game.levelCount}</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Exercises</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{game.exerciseCount}</p></div>
            <div><p className="text-xs text-slate-500 dark:text-slate-400">Last generated</p><p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{game.generatedAt ? new Date(game.generatedAt).toLocaleString() : "never"}</p></div>
          </div>
          <Button onClick={regenerate} disabled={generating}>
            {generating ? <><Loader2 className="animate-spin" size={16} /> Regenerating…</> : <><RefreshCw size={16} /> Regenerate content</>}
          </Button>
        </div>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Changing capabilities then regenerating rebuilds the pool for this skin.</p>
      </Card>
    </div>
  );
}
