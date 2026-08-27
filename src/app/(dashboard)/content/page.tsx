"use client";

import { BookOpen, Box, Volume2 } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";
import { mockEngine } from "@/services/mockEngine";

export default function ContentPage() {
  const bank = mockEngine.getContentBank();
  const phonemes = mockEngine.getPhonemeInfo();
  const totalWords = bank.reduce((a, c) => a + c.words.length, 0);

  return (
    <div>
      <PageHeader title="Content" subtitle="Phonemes, word bank and difficulty metadata." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Phoneme coverage" className="lg:col-span-1">
          <ul className="space-y-2">
            {phonemes.map((p) => (
              <li key={p.phoneme} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded bg-brand-50 font-mono text-sm font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{p.phoneme}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{p.name}</span>
                </div>
                <span className="text-xs text-slate-400">{p.occurrences} words</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Word bank" className="lg:col-span-2">
          <p className="mb-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Volume2 size={14} /> {totalWords} curated words across {phonemes.length} target phonemes.</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {bank.map((c, i) => (
              <div key={i} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-brand-700 dark:text-brand-300">{c.phoneme}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] capitalize text-slate-500 dark:bg-slate-800 dark:text-slate-400">{c.position}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.words.map((w) => (
                    <span key={w} className="rounded bg-slate-50 px-2 py-0.5 text-xs capitalize text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">{w}</span>
                  ))}
                </div>
                <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-400"><Box size={10} /> difficulty {c.difficulty.toFixed(1)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 rounded-xl border border-dashed border-brand-300 bg-brand-50 p-4 text-sm text-brand-800 dark:border-brand-700 dark:bg-brand-900/30 dark:text-brand-200">
        <BookOpen size={16} className="mb-1" />
        Word selection is governed by difficulty metadata and each child&apos;s target phonemes. New words are added by the team and auto-scored for difficulty before entering the pool.
      </div>
    </div>
  );
}
