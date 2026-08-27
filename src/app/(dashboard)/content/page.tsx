"use client";

import { BookOpen } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";

export default function ContentPage() {
  return (
    <div>
      <PageHeader title="Content" subtitle="Phonemes, word bank and difficulty metadata." />
      <Card>
        <div className="flex items-center gap-3 text-slate-600">
          <BookOpen size={24} className="text-brand-600" />
          <div>
            <p className="text-sm font-medium text-slate-800">Phoneme & word bank</p>
            <p className="text-sm text-slate-500">Curated in the Engine. Word selection is governed by difficulty metadata and child targets.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
