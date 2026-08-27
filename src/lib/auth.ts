"use client";

export interface AuthSession {
  name: string;
  role: "admin" | "therapist";
}

const KEY = "phonova-auth";

export function getAuth(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function setAuth(session: AuthSession) {
  window.localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearAuth() {
  window.localStorage.removeItem(KEY);
}

export const defaultSession: Record<string, AuthSession> = {
  admin: { name: "Steve Okafor", role: "admin" },
  therapist: { name: "Dr. Amara Singh", role: "therapist" },
};
