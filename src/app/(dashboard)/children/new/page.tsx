"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/components/breadcrumbs";
import { mockEngine } from "@/services/mockEngine";
import { Button, Card, PageHeader } from "@/components/ui";
import { getAuth } from "@/lib/auth";
import { can } from "@/lib/permissions";

const PHONEMES = ["/r/", "/s/", "/th/", "/k/", "/g/", "/ʃ/", "/θ/", "/ð/", "/l/"];

export default function NewChildPage() {
  const router = useRouter();
  const session = getAuth();
  const parents = mockEngine.getUsers().filter((u) => u.role === "parent" && u.status === "active");
  const therapists = mockEngine.getUsers().filter((u) => u.role === "therapist" && u.status === "active");
  const canPersonal = can(session?.role, "children.edit_personal");

  const [form, setForm] = useState({
    name: "",
    age: 5,
    gender: "female",
    parentUserId: session?.role === "parent" ? session.userId : "",
    therapistUserId: session?.role === "therapist" ? session.userId : therapists[0]?.id ?? "",
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
    if (!can(session?.role, "children.create")) return;
    const declared = form.known === "yes";
    const parentUserId = canPersonal ? form.parentUserId || undefined : session?.role === "parent" ? session.userId : form.parentUserId || undefined;
    const therapistUserId =
      canPersonal || session?.role === "therapist"
        ? form.therapistUserId || (session?.role === "therapist" ? session.userId : undefined)
        : form.therapistUserId || undefined;

    const c = mockEngine.createChild({
      name: form.name,
      age: form.age,
      gender: form.gender,
      parentUserId,
      therapistUserId,
      assessmentStatus: declared ? "declared" : "pending",
      targets: declared ? form.selected.map((p) => ({ phoneme: p, source: "declared" as const })) : [],
      assignments: [],
    });
    router.push(`/children/${c.id}`);
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "Children", href: "/children" }, { label: "Add child" }]} />
      <Button variant="ghost" href="/children">
        <ArrowLeft size={16} /> Back to Children
      </Button>
      <PageHeader title="Add Child" subtitle="Link real roster parent & therapist accounts. Auto-assign uses Settings." />

      <Card className="max-w-2xl">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Child name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Age</span>
              <input
                type="number"
                min={3}
                max={12}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: +e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Parent account</span>
              <select
                value={form.parentUserId}
                onChange={(e) => setForm({ ...form, parentUserId: e.target.value })}
                disabled={session?.role === "parent"}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">— none —</option>
                {parents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Therapist / SLP</span>
              <select
                value={form.therapistUserId}
                onChange={(e) => setForm({ ...form, therapistUserId: e.target.value })}
                disabled={session?.role === "therapist"}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">— none —</option>
                {therapists.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.organization ?? "clinic"})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Gender</span>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other / prefer not to say</option>
            </select>
          </label>

          <div>
            <span className="mb-2 block text-xs font-medium text-slate-600 dark:text-slate-300">Do you know which sounds are difficult?</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, known: "no", selected: [] })}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${form.known === "no" ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`}
              >
                Not sure — run a diagnostic
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, known: "yes" })}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${form.known === "yes" ? "border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`}
              >
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
                      <button
                        key={p}
                        type="button"
                        onClick={() => toggle(p)}
                        className={`rounded-lg border px-3 py-1.5 text-sm ${on ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"}`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" href="/children">
              Cancel
            </Button>
            <Button type="submit">Create Child</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
