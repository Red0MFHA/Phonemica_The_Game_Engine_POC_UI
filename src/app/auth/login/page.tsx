"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Lock, Mail } from "lucide-react";
import { defaultSession, setAuth } from "@/lib/auth";
import { Button } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "therapist">("therapist");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Enter an email and password to sign in.");
      return;
    }
    setAuth(defaultSession[role]);
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg">
            <BrainCircuit size={28} />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">PHONOVA Engine</h1>
          <p className="text-sm text-slate-500">Adaptive Speech Intelligence Platform</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Email</span>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@phonova.io"
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600">Password</span>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </label>

            <div>
              <span className="mb-1 block text-xs font-medium text-slate-600">Sign in as</span>
              <div className="grid grid-cols-2 gap-2">
                {(["therapist", "admin"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                      role === r ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {r === "admin" ? "Platform Admin" : "Therapist"}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}
            <Button type="submit" className="w-full justify-center">Sign in</Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          POC demo — any email/password works. Choose a role to preview scoped access.
        </p>
      </div>
    </div>
  );
}
