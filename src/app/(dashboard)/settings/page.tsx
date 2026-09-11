"use client";

import { useState } from "react";
import { Bot, KeyRound, ShieldCheck, SlidersHorizontal, Palette, Save, RotateCcw } from "lucide-react";
import { Button, Card, PageHeader, StatusPill } from "@/components/ui";
import { getAuth } from "@/lib/auth";
import { can } from "@/lib/permissions";
import {
  DEFAULT_ENGINE_SETTINGS,
  SETTINGS_KEY,
  loadEngineSettings,
  type EngineSettings,
} from "@/lib/engineSettings";

const MODELS = [
  { id: "wav2vec2-2.0", label: "Wav2Vec2 2.0", note: "Default speech recogniser" },
  { id: "whisper-small", label: "Whisper Small", note: "Multilingual recognition" },
  { id: "phonemica-speech-1", label: "Phonemica Speech 1", note: "Tuned for child speech" },
];

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      aria-pressed={enabled}
      className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${enabled ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-600"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${enabled ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const session = getAuth();
  const write = can(session?.role, "settings.write");
  const [settings, setSettings] = useState<EngineSettings>(loadEngineSettings);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof EngineSettings>(key: K, value: EngineSettings[K]) {
    if (!write) return;
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  }

  function save() {
    if (!write) return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    if (settings.theme !== "system") {
      localStorage.setItem("phonemica-theme", settings.theme);
      document.documentElement.classList.toggle("dark", settings.theme === "dark");
    }
    setSaved(true);
  }

  function reset() {
    if (!write) return;
    setSettings({ ...DEFAULT_ENGINE_SETTINGS });
    localStorage.removeItem(SETTINGS_KEY);
    setSaved(false);
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle={
          write
            ? "Engine configuration, AI model, API keys and platform defaults. Auto-assign / adaptive apply on next child create & regenerate."
            : "Read-only for Therapist / SLP. Ask an Admin to change platform settings."
        }
        actions={
          write ? (
            <div className="flex items-center gap-2">
              {saved && <StatusPill value="saved" />}
              <Button variant="secondary" onClick={reset}>
                <RotateCcw size={16} /> Reset
              </Button>
              <Button onClick={save}>
                <Save size={16} /> Save changes
              </Button>
            </div>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="Speech model" subtitle="Which model scores child speech.">
          <div className="space-y-2">
            {MODELS.map((m) => (
              <button
                key={m.id}
                type="button"
                disabled={!write}
                onClick={() => set("model", m.id)}
                className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left disabled:opacity-70 ${
                  settings.model === m.id ? "border-brand-600 bg-brand-50 dark:bg-brand-900/30" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <Bot size={18} className="mt-0.5 text-brand-600" />
                <span>
                  <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{m.label}</span>
                  <span className="text-xs text-slate-500">{m.note}</span>
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Platform toggles">
          <ul className="space-y-4">
            <li className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <SlidersHorizontal size={16} /> Adaptive difficulty
              </div>
              <Toggle enabled={settings.adaptiveEngine} disabled={!write} onChange={(v) => set("adaptiveEngine", v)} />
            </li>
            <li className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                <ShieldCheck size={16} /> Auto-assign games by target
              </div>
              <Toggle enabled={settings.autoAssignGames} disabled={!write} onChange={(v) => set("autoAssignGames", v)} />
            </li>
            <li className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                Analyst email digests
              </div>
              <Toggle enabled={settings.analystNotifications} disabled={!write} onChange={(v) => set("analystNotifications", v)} />
            </li>
            <li className="flex items-center justify-between gap-4">
              <div className="text-sm text-slate-700 dark:text-slate-200">Analytics retention (days)</div>
              <input
                type="number"
                disabled={!write}
                value={settings.analyticsRetention}
                onChange={(e) => set("analyticsRetention", +e.target.value)}
                className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </li>
          </ul>
        </Card>

        <Card title="API keys" subtitle="Masked POC keys.">
          <div className="space-y-3">
            <label className="block text-sm">
              <span className="mb-1 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <KeyRound size={14} /> Speech API
              </span>
              <input
                disabled={!write}
                value={settings.speechKey}
                onChange={(e) => set("speechKey", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <KeyRound size={14} /> Exercise API
              </span>
              <input
                disabled={!write}
                value={settings.exerciseKey}
                onChange={(e) => set("exerciseKey", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              />
            </label>
          </div>
        </Card>

        <Card title="Appearance">
          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <Palette size={16} /> Theme
          </div>
          <div className="mt-3 flex gap-2">
            {(["system", "light", "dark"] as const).map((t) => (
              <button
                key={t}
                type="button"
                disabled={!write}
                onClick={() => set("theme", t)}
                className={`rounded-lg border px-3 py-2 text-sm capitalize disabled:opacity-70 ${
                  settings.theme === t ? "border-brand-600 bg-brand-50 dark:bg-brand-900/30" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
