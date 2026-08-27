"use client";

import { useState } from "react";
import { Bot, KeyRound, ShieldCheck, SlidersHorizontal, Palette, Save, RotateCcw } from "lucide-react";
import { Button, Card, PageHeader, StatusPill } from "@/components/ui";

const SETTINGS_KEY = "phonemica-engine-settings";

type Settings = {
  model: string;
  adaptiveEngine: boolean;
  autoAssignGames: boolean;
  analystNotifications: boolean;
  analyticsRetention: number;
  speechKey: string;
  exerciseKey: string;
  theme: "system" | "light" | "dark";
};

const MODELS = [
  { id: "wav2vec2-2.0", label: "Wav2Vec2 2.0", note: "Default speech recogniser" },
  { id: "whisper-small", label: "Whisper Small", note: "Multilingual recognition" },
  { id: "phonemica-speech-1", label: "Phonemica Speech 1", note: "Tuned for child speech" },
];

const DEFAULTS: Settings = {
  model: "wav2vec2-2.0",
  adaptiveEngine: true,
  autoAssignGames: true,
  analystNotifications: false,
  analyticsRetention: 180,
  speechKey: "pk_live_speech_****7f2a",
  exerciseKey: "pk_live_exercis_****9c31",
  theme: "system",
};

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      aria-pressed={enabled}
      className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-600"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${enabled ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(SETTINGS_KEY) : null;
      if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }
    return DEFAULTS;
  });
  const [saved, setSaved] = useState(false);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  }

  function save() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
  }

  function reset() {
    setSettings(DEFAULTS);
    localStorage.removeItem(SETTINGS_KEY);
    setSaved(false);
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Engine configuration, AI model, API keys and platform defaults."
        actions={
          <div className="flex items-center gap-2">
            {saved && <StatusPill value="saved" />}
            <Button variant="secondary" onClick={reset}><RotateCcw size={16} /> Reset</Button>
            <Button onClick={save}><Save size={16} /> Save changes</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Speech Model" subtitle="What powers correct/incorrect pronunciation scoring">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><Bot size={13} /> Active recogniser</p>
          <div className="mt-3 space-y-2">
            {MODELS.map((m) => (
              <label key={m.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${settings.model === m.id ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30" : "border-slate-200 dark:border-slate-700"}`}>
                <input type="radio" name="model" checked={settings.model === m.id} onChange={() => set("model", m.id)} className="mt-1 accent-brand-600" />
                <span>
                  <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">{m.label}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{m.note}</span>
                </span>
              </label>
            ))}
          </div>
        </Card>

        <Card title="API Keys" subtitle="Integration credentials for external services">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><KeyRound size={13} /> Live keys</p>
          <div className="space-y-3">
            {[
              { label: "Speech API", key: "speechKey" as const, full: "pk_live_speech_9d1f2a7c" },
              { label: "Exercise Engine", key: "exerciseKey" as const, full: "pk_live_exercis_3b8c91a4" },
            ].map(({ label, key, full }) => (
              <div key={key} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</span>
                  <button
                    onClick={() => set(key, `pk_live_****${full.slice(-4)}` === settings[key] ? full : `pk_live_****${full.slice(-4)}`)}
                    className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
                  >
                    {settings[key].includes("****") ? "Reveal" : "Mask"}
                  </button>
                </div>
                <code className="mt-1 block truncate rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{settings[key]}</code>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400"><ShieldCheck size={13} /> Keys are stored encrypted in this environment.</p>
        </Card>

        <Card title="Platform Defaults" subtitle="Behaviour the engine applies across all games">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Adaptive engine</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Adjust difficulty live from accuracy.</p>
              </div>
              <Toggle enabled={settings.adaptiveEngine} onChange={(v) => set("adaptiveEngine", v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Auto-assign games</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Assign a game when targets are diagnosed.</p>
              </div>
              <Toggle enabled={settings.autoAssignGames} onChange={(v) => set("autoAssignGames", v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Analytics notifications</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Email therapists on weekly progress.</p>
              </div>
              <Toggle enabled={settings.analystNotifications} onChange={(v) => set("analystNotifications", v)} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Data retention</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Days of historical analytics kept.</p>
              </div>
              <input
                type="number"
                value={settings.analyticsRetention}
                onChange={(e) => set("analyticsRetention", parseInt(e.target.value) || 0)}
                className="w-24 rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </Card>

        <Card title="Appearance" subtitle="Control-plane theme preference">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400"><Palette size={13} /> Theme</p>
          <div className="flex gap-2">
            {(["system", "light", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => set("theme", t)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize ${settings.theme === t ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400"><SlidersHorizontal size={13} /> Theme toggle in the top-right switches this immediately.</p>
        </Card>
      </div>
    </div>
  );
}
