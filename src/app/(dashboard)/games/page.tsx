"use client";

import { Plus, Gamepad2 } from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";
import { mockEngine } from "@/services/mockEngine";
import { Button, PageHeader, StatusPill } from "@/components/ui";
import { getAuth } from "@/lib/auth";
import { can } from "@/lib/permissions";
import Link from "next/link";

export default function GamesPage() {
  const session = getAuth();
  const games = mockEngine.getGames();
  const canRegister = can(session?.role, "games.register");
  const isParent = session?.role === "parent";

  return (
    <div>
      <Breadcrumbs items={[{ label: "Games" }]} />
      <PageHeader
        title="Games"
        subtitle={
          isParent
            ? "Games assigned to your children (view only)."
            : "Registered skins that consume the Engine as clients."
        }
        actions={
          canRegister ? (
            <Button href="/games/new">
              <Plus size={16} /> Register Game
            </Button>
          ) : undefined
        }
      />
      {!canRegister && (
        <p className="mb-4 text-xs text-slate-400">Only Platform Admins can register or configure games.</p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {games.map((g) => (
          <Link
            key={g.id}
            href={`/games/${g.id}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                <Gamepad2 size={22} />
              </div>
              <StatusPill value={g.status} />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
              {g.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{g.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {g.capabilities.exerciseTypes.map((t) => (
                <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {t.replace("_", " ")}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
              <span>v{g.version}</span>
              <span>
                {g.connectedChildren} children · {g.sessions} sessions
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
