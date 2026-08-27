"use client";

import { useState, use } from "react";
import { ArrowLeft, Activity as ActivityIcon, RefreshCw } from "lucide-react";
import { mockEngine } from "@/services/mockEngine";
import { Button, Card, PageHeader, StatusPill } from "@/components/ui";

const TEST_PHONEMES = ["/r/", "/s/", "/th/", "/k/", "/g/", "/ʃ/", "/θ/", "/l/"];

export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [, setTick] = useState(0);
  const child = mockEngine.getChild(id);
  const refresh = () => setTick((t) => t + 1);
  const [running, setRunning] = useState(false);
  const [runProgress, setRunProgress] = useState<string[]>([]);

  if (!child) {
    return <div className="py-20 text-center text-slate-400 dark:text-slate-500">Child not found.</div>;
  }

  function runDiagnostics() {
    setRunning(true);
    setRunProgress([]);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setRunProgress((p) => [...p, `Evaluated ${TEST_PHONEMES[i - 1]} — Wav2Vec phoneme alignment complete`]);
      if (i >= TEST_PHONEMES.length) {
        clearInterval(interval);
        const diagnosed = TEST_PHONEMES.filter((_, idx) => idx % 3 === 0);
        mockEngine.setAssessmentDiagnosed(child!.id, diagnosed);
        setRunning(false);
        refresh();
      }
    }, 450);
  }

  const results = child.targets.map((t) => ({
    phoneme: t.phoneme,
    accuracy: mockEngine.getAnalytics(child.id).perPhoneme.find((p) => p.phoneme === t.phoneme)?.accuracy ?? 0,
  }));

  return (
    <div>
      <Button variant="ghost" href={`/children/${child.id}`}><ArrowLeft size={16} /> Back to {child.name}</Button>
      <PageHeader
        title={`Assessment — ${child.name}`}
        subtitle="Target phoneme screening. The Engine owns this diagnostic data."
        actions={
          <Button onClick={runDiagnostics} disabled={running}>
            <RefreshCw size={16} className={running ? "animate-spin" : ""} /> {running ? "Diagnosing…" : "Run Diagnostics"}
          </Button>
        }
      />

      <div className="mb-6">
        <StatusPill value={child.assessmentStatus} />
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {child.assessmentStatus === "pending" && "No declared targets — a diagnostic run seeds them from the standard phoneme set."}
          {child.assessmentStatus === "declared" && "Parent/guardian declared initial target sounds. Run diagnostics for a data-backed re-evaluation."}
          {child.assessmentStatus === "diagnosed" && "Target sounds established by the adaptive engine from speech analysis."}
        </p>
      </div>

      <Card title="Assessment summary">
        {results.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">No assessment results yet. Run diagnostics above.</p>
        ) : (
          <div className="space-y-3">
            {results.map((r) => (
              <div key={r.phoneme} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 dark:border-slate-800">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{r.phoneme}</span>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${r.accuracy}%` }} />
                  </div>
                  <span className="w-12 text-right text-sm font-medium text-slate-700 dark:text-slate-300">{r.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {(running || runProgress.length > 0) && (
        <Card title="Diagnostic run" className="mt-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><ActivityIcon size={16} className="text-brand-600" /> Evaluating standard phoneme set…</div>
          <ul className="mt-3 space-y-1">
            {runProgress.map((line, i) => (
              <li key={i} className="text-xs text-slate-500 dark:text-slate-400">✓ {line}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
