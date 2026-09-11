"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Shell from "@/components/shell";
import { getAuth } from "@/lib/auth";
import { canAccessRoute, homeForRole } from "@/lib/permissions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session] = useState(getAuth);

  useEffect(() => {
    if (!session) {
      router.replace("/auth/login");
      return;
    }
    if (!canAccessRoute(session.role, pathname)) {
      router.replace(homeForRole(session.role));
    }
  }, [router, session, pathname]);

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-slate-400 dark:bg-slate-950 dark:text-slate-500">
        Loading Phonemica Engine…
      </div>
    );
  }

  if (!canAccessRoute(session.role, pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-slate-400 dark:bg-slate-950 dark:text-slate-500">
        Redirecting…
      </div>
    );
  }

  return (
    <Shell role={session.role} userName={session.name} userEmail={session.email} organization={session.organization}>
      {children}
    </Shell>
  );
}
