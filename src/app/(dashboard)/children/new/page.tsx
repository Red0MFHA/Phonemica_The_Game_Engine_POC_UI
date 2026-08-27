"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { mockEngine } from "@/services/mockEngine";
import { Button, Card, PageHeader } from "@/components/ui";

const PHONEMES = ["/r/", "/s/", "/th/", "/k/", "/g/", "/ʃ/", "/θ/", "/ð/", "/l/"];

export default function NewChildPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    age: 5,
    gender: "female" as string,
    parentName: "",
    therapistName: "",
    known: "no" as "yes" | "no",
    selected: [] as string[],
  });

  function toggle(p: string) {
    setForm((f) => ({
      ...f,
      selected: f.selected.includes(p) ? f.selected.filter((x) => x !== p) : [...f.selected, p],
    }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const declared = form.known === "yes";
    const c = mockEngine.createChild({
      name: form.name,
      age: form.age,
      gender: form.gender,
      assessmentStatus: declared ? "declared" : "pending",
      targets: declared ? form.selected.map((p) => ({ phoneme: p, source: "declared" as const })) : [],
      assignments: [],
    });
    router.push(`/children/${c.id}`);
  }

  return (
    <div>
      <Button variant="ghost" href="/children"><ArrowLeft size={16} /> Back to Children</Button>
      <PageHeader title="Add Child" subtitle="Create a child profile. If the parent is unsure of problem sounds, we run a diagnostic." />

      <Card className="max-w-2xl">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Child name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Age</span>
              <input type="number" min={3} max={12} value={form.age} onChange={(e) => setForm({ ...form, age: +e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Parent</span>
              <input value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} placeholder="Full name" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Therapist</span>
              <input value={form.therapistName} onChange={(e) => setForm({ ...form, therapistName: e.target.value })} placeholder="Full name" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            </label>
          </div>

          <div>
            <span className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-300">Do you know which sounds are difficult?</span>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setForm({ ...form, known: "no", selected: [] })} className={`rounded-lg border px-3 py-2 text-sm font-medium ${form.known === "no" ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`}>
                Not sure — run a diagnostic
              </button>
              <button type="button" onClick={() => setForm({ ...form, known: "yes" })} className={`rounded-lg border px-3 py-2 text-sm font-medium ${form.known === "yes" ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`}>
                Yes — I know the sounds
              </button>
            </div>
            {form.known === "yes" && (
              <div className="mt-3">
                <span className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-300">Select target sounds</span>
                <div className="flex flex-wrap gap-2">
                  {PHONEMES.map((p) => {
                    const on = form.selected.includes(p);
                    return (
                      <button key={p} type="button" onClick={() => toggle(p)} className={`rounded-lg border px-3 py-1.5 text-sm ${on ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`}>
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" href="/children">Cancel</Button>
            <Button type="submit">Create Child</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
