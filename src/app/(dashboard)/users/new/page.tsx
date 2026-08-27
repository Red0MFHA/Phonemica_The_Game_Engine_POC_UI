"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { mockEngine } from "@/services/mockEngine";
import { Button, Card, PageHeader } from "@/components/ui";

export default function NewUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "therapist" as "admin" | "therapist" | "parent",
    organization: "",
    status: "active" as "active" | "pending" | "disabled",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const u = mockEngine.createUser({
      name: form.name,
      email: form.email,
      role: form.role,
      organization: form.organization || undefined,
      status: form.status,
    });
    router.push(`/users/${u.id}`);
  }

  return (
    <div>
      <Button variant="ghost" href="/users"><ArrowLeft size={16} /> Back to Users</Button>
      <PageHeader title="Add User" subtitle="Create a platform user and assign a role." />

      <Card className="max-w-2xl">
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Full name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Email</span>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Role</span>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as typeof form.role })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <option value="therapist">Therapist</option>
                <option value="admin">Admin</option>
                <option value="parent">Parent</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Status</span>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="disabled">Disabled</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Organization</span>
            <input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Optional" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" href="/users">Cancel</Button>
            <Button type="submit">Create User</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
