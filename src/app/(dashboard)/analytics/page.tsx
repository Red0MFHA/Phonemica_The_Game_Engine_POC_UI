"use client";

import { Activity } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";
import { mockEngine } from "@/services/mockEngine";
import Link from "next/link";

export default function AnalyticsPage() {
  const children = mockEngine.getChildren();
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Cross-platform analytics. Per-child analytics live under each profile." />
      <Card>
        <p className="mb-3 text-sm font-medium text-slate-800">Jump to a child&apos;s analytics</p>
        <div className="flex flex-wrap gap-2">
          {children.map((c) => (
            <Link key={c.id} href={`/children/${c.id}/analytics`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-brand-600 hover:text-brand-700">
              <Activity size={14} /> {c.name}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
