"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Trash2, Check, X, Save } from "lucide-react";
import { mockEngine } from "@/services/mockEngine";
import { Button, Card, Input, PageHeader } from "@/components/ui";
import type { Exercise, ExerciseType } from "@/types/engine";

const TYPE_LABEL: Record<string, string> = {
  picture_naming: "Picture naming",
  word_repetition: "Word repetition",
  minimal_pair: "Minimal pair",
  sound_identification: "Sound ID",
};

const PHONEMES = ["/r/", "/s/", "/th/", "/k/", "/g/", "/ʃ/", "/θ/", "/ð/", "/l/"];
const POSITIONS = ["initial", "medial", "final"] as const;

export default function LevelDetailPage({ params }: { params: Promise<{ id: string; levelId: string }> }) {
  const { id, levelId } = use(params);
  const game = mockEngine.getGame(id);
  const level = mockEngine.getLevel(levelId);
  const [exercises, setExercises] = useState<Exercise[]>(() => (level ? mockEngine.getLevelExercises(levelId) : []));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Exercise>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ word: "", targetPhoneme: "/r/", type: "word_repetition" as ExerciseType, position: "initial" as Exercise["position"], difficulty: 0.5 });

  if (!game || !level) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400">Level not found.</p>
        <Button variant="ghost" href={`/games/${id}`} className="mt-4"><ArrowLeft size={16} /> Back to game</Button>
      </div>
    );
  }

  function refresh() {
    setEditingId(null);
    setDraft({});
    setExercises(mockEngine.getLevelExercises(levelId));
  }

  function startEdit(ex: Exercise) {
    setEditingId(ex.id);
    setDraft({ word: ex.word, targetPhoneme: ex.targetPhoneme, type: ex.type, position: ex.position, difficulty: ex.difficulty });
    setShowAdd(false);
  }

  function saveEdit() {
    if (!editingId || !draft.word) return;
    mockEngine.updateExercise(editingId, {
      word: draft.word,
      targetPhoneme: draft.targetPhoneme,
      type: draft.type,
      position: draft.position,
      difficulty: draft.difficulty,
    });
    refresh();
  }

  function remove(id: string) {
    mockEngine.removeExercise(id);
    refresh();
  }

  function submitAdd() {
    if (!addForm.word) return;
    mockEngine.addExercise(levelId, addForm);
    setAddForm({ word: "", targetPhoneme: "/r/", type: "word_repetition", position: "initial", difficulty: 0.5 });
    setShowAdd(false);
    refresh();
  }

  return (
    <div>
      <Button variant="ghost" href={`/games/${game.id}`}><ArrowLeft size={16} /> {game.name}</Button>
      <PageHeader
        title={`Level ${level.index} · Words & Exercises`}
        subtitle={`${level.difficulty} difficulty · ${exercises.length} exercises for ${game.name}`}
        actions={
          <Button onClick={() => { setShowAdd(true); setEditingId(null); }}>
            <Plus size={16} /> Add word
          </Button>
        }
      />

      {showAdd && (
        <Card title="Add exercise" className="mb-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Word" value={addForm.word} onChange={(e) => setAddForm({ ...addForm, word: e.target.value })} />
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Phoneme</span>
              <select value={addForm.targetPhoneme} onChange={(e) => setAddForm({ ...addForm, targetPhoneme: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                {PHONEMES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Exercise type</span>
              <select value={addForm.type} onChange={(e) => setAddForm({ ...addForm, type: e.target.value as ExerciseType })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <Button variant="primary" onClick={submitAdd}><Check size={16} /> Save word</Button>
              <Button variant="secondary" onClick={() => setShowAdd(false)}><X size={16} /> Cancel</Button>
            </div>
            <span className="text-xs text-slate-400">The engine auto-generates the prompt from these fields.</span>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 dark:border-slate-800">
                <th className="pb-2 pr-4 font-medium">Word</th>
                <th className="pb-2 pr-4 font-medium">Phoneme</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 pr-4 font-medium">Position</th>
                <th className="pb-2 pr-4 font-medium">Difficulty</th>
                <th className="pb-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {exercises.map((ex) => {
                const isEditing = editingId === ex.id;
                return (
                  <tr key={ex.id} className="text-slate-700 dark:text-slate-300">
                    {isEditing ? (
                      <>
                        <td className="py-2.5 pr-4"><input value={draft.word ?? ""} onChange={(e) => setDraft({ ...draft, word: e.target.value })} className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" /></td>
                        <td className="py-2.5 pr-4">
                          <select value={draft.targetPhoneme} onChange={(e) => setDraft({ ...draft, targetPhoneme: e.target.value })} className="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                            {PHONEMES.map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </td>
                        <td className="py-2.5 pr-4">
                          <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as ExerciseType })} className="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                            {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                          </select>
                        </td>
                        <td className="py-2.5 pr-4">
                          <select value={draft.position} onChange={(e) => setDraft({ ...draft, position: e.target.value as Exercise["position"] })} className="rounded-md border border-slate-300 px-2 py-1 text-sm capitalize dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                            {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </td>
                        <td className="py-2.5 pr-4"><input type="number" min={0.1} max={10} step={0.1} value={draft.difficulty ?? 0.5} onChange={(e) => setDraft({ ...draft, difficulty: parseFloat(e.target.value) })} className="w-20 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" /></td>
                        <td className="py-2.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={saveEdit} title="Save" className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/30"><Check size={16} /></button>
                            <button onClick={() => { setEditingId(null); refresh(); }} title="Cancel" className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={16} /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2.5 pr-4 font-medium capitalize">{ex.word}</td>
                        <td className="py-2.5 pr-4"><span className="rounded bg-brand-50 px-2 py-0.5 font-mono text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{ex.targetPhoneme}</span></td>
                        <td className="py-2.5 pr-4 capitalize">{TYPE_LABEL[ex.type] ?? ex.type}</td>
                        <td className="py-2.5 pr-4 capitalize">{ex.position}</td>
                        <td className="py-2.5 pr-4">{ex.difficulty.toFixed(1)}</td>
                        <td className="py-2.5 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => startEdit(ex)} title="Edit" className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800 dark:hover:text-brand-400"><Pencil size={16} /></button>
                            <button onClick={() => remove(ex.id)} title="Remove" className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              {exercises.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400">No exercises in this level yet. Add a word to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="text-xs text-slate-400">Changes update the <Link href={`/games/${game.id}/configuration`} className="text-brand-600 underline dark:text-brand-400">game configuration</Link> for this level.</p>
          <Button variant="secondary" onClick={refresh}><Save size={16} /> Refresh</Button>
        </div>
      </Card>
    </div>
  );
}
