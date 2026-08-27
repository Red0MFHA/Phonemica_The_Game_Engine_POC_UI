"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Shell from "@/components/shell";
import { getAuth } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session] = useState(getAuth);

  useEffect(() => {
    if (!session) {
      router.replace("/auth/login");
    }
  }, [router, session]);

  if (!session) {
    return <div className="flex min-h-screen items-center justify-center bg-white text-sm text-slate-400 dark:bg-slate-950 dark:text-slate-500">Loading Phonemica Engine…</div>;
  }

  return (
    <Shell role={session.role} userName={session.name}>
      {children}
    </Shell>
  );
}
