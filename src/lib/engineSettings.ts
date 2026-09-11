/** Persisted Engine settings — read by mock assignment helpers. */
export const SETTINGS_KEY = "phonemica-engine-settings";

export type EngineSettings = {
  model: string;
  adaptiveEngine: boolean;
  autoAssignGames: boolean;
  analystNotifications: boolean;
  analyticsRetention: number;
  speechKey: string;
  exerciseKey: string;
  theme: "system" | "light" | "dark";
};

export const DEFAULT_ENGINE_SETTINGS: EngineSettings = {
  model: "wav2vec2-2.0",
  adaptiveEngine: true,
  autoAssignGames: true,
  analystNotifications: false,
  analyticsRetention: 180,
  speechKey: "pk_live_speech_****7f2a",
  exerciseKey: "pk_live_exercis_****9c31",
  theme: "system",
};

export function loadEngineSettings(): EngineSettings {
  if (typeof window === "undefined") return { ...DEFAULT_ENGINE_SETTINGS };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_ENGINE_SETTINGS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_ENGINE_SETTINGS };
}
