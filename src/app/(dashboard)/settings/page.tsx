"use client";

import { Settings } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Engine, AI model and platform configuration." />
      <Card>
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Settings size={24} className="text-brand-600" />
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Engine configuration</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Model selection, API keys and integration settings are managed here in production.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
