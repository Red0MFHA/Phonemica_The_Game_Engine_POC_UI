"use client";

import { Plus, Gamepad2 } from "lucide-react";
import { mockEngine } from "@/services/mockEngine";
import { Button, PageHeader, StatusPill } from "@/components/ui";
import Link from "next/link";

export default function GamesPage() {
  const games = mockEngine.getGames();

  return (
    <div>
      <PageHeader
        title="Games"
        subtitle="Registered skins that consume the Engine as clients."
        actions={<Button href="/games/new"><Plus size={16} /> Register Game</Button>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {games.map((g) => (
          <Link key={g.id} href={`/games/${g.id}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Gamepad2 size={22} /></div>
              <StatusPill value={g.status} />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-brand-700">{g.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{g.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {g.capabilities.exerciseTypes.map((t) => (
                <span key={t} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{t.replace("_", " ")}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
              <span>v{g.version}</span>
              <span>{g.connectedChildren} children · {g.sessions} sessions</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
