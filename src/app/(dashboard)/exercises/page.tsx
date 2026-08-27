"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";
import { mockEngine } from "@/services/mockEngine";

const TYPE_LABEL: Record<string, string> = {
  picture_naming: "Picture naming",
  word_repetition: "Word repetition",
  minimal_pair: "Minimal pair",
  sound_identification: "Sound ID",
};

export default function ExercisesPage() {
  const exercises = useMemo(() => mockEngine.getExercises(36), []);
  const [query, setQuery] = useState("");
  const typeNames = useMemo(() => Array.from(new Set(exercises.map((e) => e.type))), [exercises]);
  const [type, setType] = useState("all");

  const filtered = exercises.filter((e) => {
    const q = query.toLowerCase();
    const matchesQ = !q || e.word.toLowerCase().includes(q) || e.targetPhoneme.toLowerCase().includes(q);
    const matchesT = type === "all" || e.type === type;
    return matchesQ && matchesT;
  });

  return (
    <div>
      <PageHeader title="Exercise Library" subtitle="Engine-generated exercises across registered games." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-xs flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search word or phoneme…"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-brand-900"
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="all">All types</option>
          {typeNames.map((t) => <option key={t} value={t}>{TYPE_LABEL[t] ?? t}</option>)}
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 dark:border-slate-800">
                <th className="pb-2 pr-4 font-medium">Phoneme</th>
                <th className="pb-2 pr-4 font-medium">Word</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 pr-4 font-medium">Position</th>
                <th className="pb-2 font-medium">Difficulty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((e) => (
                <tr key={e.id} className="text-slate-700 dark:text-slate-300">
                  <td className="py-2.5 pr-4"><span className="rounded bg-brand-50 px-2 py-0.5 font-mono text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{e.targetPhoneme}</span></td>
                  <td className="py-2.5 pr-4 font-medium capitalize">{e.word}</td>
                  <td className="py-2.5 pr-4 capitalize">{TYPE_LABEL[e.type] ?? e.type}</td>
                  <td className="py-2.5 pr-4 capitalize">{e.position}</td>
                  <td className="py-2.5">{e.difficulty.toFixed(1)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">No exercises match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
