"use client";

import { Settings } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Engine, AI model and platform configuration." />
      <Card>
        <div className="flex items-center gap-3 text-slate-600">
          <Settings size={24} className="text-brand-600" />
          <div>
            <p className="text-sm font-medium text-slate-800">Engine configuration</p>
            <p className="text-sm text-slate-500">Model selection, API keys and integration settings are managed here in production.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
