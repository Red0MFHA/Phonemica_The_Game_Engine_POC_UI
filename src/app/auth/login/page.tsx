"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Lock, Mail } from "lucide-react";
import { DEMO_ACCOUNTS, resolveDemoAccount, roleLabel, setAuth } from "@/lib/auth";
import type { Role } from "@/types/engine";
import { Button } from "@/components/ui";
import ThemeToggle from "@/components/theme-toggle";

const ROLES: Role[] = ["therapist", "admin", "parent"];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("amara@phonemica.io");
  const [password, setPassword] = useState("demo");
  const [role, setRole] = useState<Role>("therapist");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter an email and password to sign in.");
      return;
    }
    const session = resolveDemoAccount(email, role);
    setAuth(session);
    router.push("/dashboard");
  }

  function quickFill(accountEmail: string, accountRole: Role) {
    setEmail(accountEmail);
    setPassword("demo");
    setRole(accountRole);
    setError("");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg">
            <BrainCircuit size={28} />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Phonemica Engine</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Adaptive Speech Intelligence Platform</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Email</span>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amara@phonemica.io"
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-900"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Password</span>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo"
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-brand-900"
                />
              </div>
            </label>

            <div>
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">Sign in as</span>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                      role === r
                        ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                        : "border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {r === "admin" ? "Admin" : r === "therapist" ? "SLP" : "Parent"}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
            <Button type="submit" className="w-full justify-center">
              Sign in
            </Button>
          </form>

          <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Demo identities</p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => quickFill(a.email, a.role)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{a.name}</span>
                    <span className="mt-0.5 block text-slate-500">{a.email}</span>
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {roleLabel(a.role)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          POC demo — pick a roster identity. Any password works.
        </p>
      </div>
    </div>
  );
}
