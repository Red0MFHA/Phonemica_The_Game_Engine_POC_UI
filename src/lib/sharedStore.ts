/**
 * Shared POC store — same localStorage key across Engine + both skins.
 * Skins push attempts here; Engine analytics can merge on read.
 */
export const SHARED_KEY = "phonemica-shared-v1";

export type SharedAttempt = {
  id: string;
  childId: string;
  childName?: string;
  gameId: string;
  phoneme: string;
  word: string;
  accuracy: number;
  correct: boolean;
  errorType?: string;
  date: string;
};

export type SharedChild = {
  id: string;
  name: string;
  age: number;
  targets: string[];
  assessmentStatus: "declared" | "pending" | "diagnosed";
};

export type SharedStore = {
  children: SharedChild[];
  attempts: SharedAttempt[];
};

export function readSharedStore(): SharedStore {
  if (typeof window === "undefined") return { children: [], attempts: [] };
  try {
    const raw = window.localStorage.getItem(SHARED_KEY);
    if (!raw) return { children: [], attempts: [] };
    const parsed = JSON.parse(raw) as SharedStore;
    return {
      children: parsed.children ?? [],
      attempts: parsed.attempts ?? [],
    };
  } catch {
    return { children: [], attempts: [] };
  }
}

export function writeSharedStore(store: SharedStore) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SHARED_KEY, JSON.stringify(store));
}

export function upsertSharedChild(child: SharedChild) {
  const store = readSharedStore();
  const i = store.children.findIndex((c) => c.id === child.id);
  if (i >= 0) store.children[i] = child;
  else store.children.push(child);
  writeSharedStore(store);
}

export function pushSharedAttempt(attempt: SharedAttempt) {
  const store = readSharedStore();
  store.attempts.unshift(attempt);
  store.attempts = store.attempts.slice(0, 500);
  writeSharedStore(store);
}
