"use client";

export type Theme = "light" | "dark";

const KEY = "phonemica-theme";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
  try {
    window.localStorage.setItem(KEY, t);
  } catch {
    /* ignore */
  }
}

export function initTheme() {
  applyTheme(getTheme());
}
