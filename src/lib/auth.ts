"use client";

import type { Role } from "@/types/engine";

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  role: Role;
  organization?: string;
}

const KEY = "phonemica-auth";

/** Demo roster — same people as the Engine mock. Password is anything non-empty. */
export const DEMO_ACCOUNTS: AuthSession[] = [
  {
    userId: "u2",
    name: "Steve Okafor",
    email: "steve@phonemica.io",
    role: "admin",
    organization: "Phonemica HQ",
  },
  {
    userId: "u1",
    name: "Dr. Amara Singh",
    email: "amara@phonemica.io",
    role: "therapist",
    organization: "Child Speech Clinic",
  },
  {
    userId: "u3",
    name: "Layla Haddad",
    email: "layla@phonemica.io",
    role: "therapist",
    organization: "Bright Voices",
  },
  {
    userId: "u4",
    name: "Maria Gomez",
    email: "maria.gomez@gmail.com",
    role: "parent",
  },
  {
    userId: "u5",
    name: "Rahul Verma",
    email: "rahul.verma@gmail.com",
    role: "parent",
  },
];

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

export function resolveDemoAccount(email: string, role: Role): AuthSession {
  const match = DEMO_ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.role === role,
  );
  if (match) return match;
  const fallback = DEMO_ACCOUNTS.find((a) => a.role === role) ?? DEMO_ACCOUNTS[0];
  return { ...fallback };
}

export function roleLabel(role: Role): string {
  if (role === "therapist") return "Therapist / SLP";
  if (role === "admin") return "Platform Admin";
  return "Parent";
}

/** @deprecated prefer DEMO_ACCOUNTS / resolveDemoAccount */
export const defaultSession: Record<string, AuthSession> = {
  admin: DEMO_ACCOUNTS[0],
  therapist: DEMO_ACCOUNTS[1],
  parent: DEMO_ACCOUNTS[3],
};
