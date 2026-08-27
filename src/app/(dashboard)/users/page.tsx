"use client";

import { useState } from "react";
import { Plus, Search, Users as UsersIcon } from "lucide-react";
import { mockEngine } from "@/services/mockEngine";
import { Button, PageHeader, StatusPill } from "@/components/ui";
import Link from "next/link";

export default function UsersPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("all");
  const users = mockEngine.getUsers();

  const filtered = users.filter((u) => {
    const matchQ = u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase());
    const matchRole = role === "all" || u.role === role;
    return matchQ && matchRole;
  });

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Admins, therapists and parents who operate the platform."
        actions={<Button href="/users/new"><Plus size={16} /> Add User</Button>}
      />

      <div className="mb-4 flex items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users…"
            className="w-64 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-600"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-600"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="therapist">Therapist</option>
          <option value="parent">Parent</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Organization</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Children</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => {
              const childCount =
                (u.therapistChildrenIds?.length ?? 0) + (u.parentChildrenIds?.length ?? 0);
              return (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link href={`/users/${u.id}`} className="font-medium text-brand-700 hover:underline">
                      {u.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{u.email}</td>
                  <td className="px-5 py-3 capitalize text-slate-600">{u.role}</td>
                  <td className="px-5 py-3 text-slate-600">{u.organization ?? "—"}</td>
                  <td className="px-5 py-3"><StatusPill value={u.status} /></td>
                  <td className="px-5 py-3 text-slate-600">{childCount}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                  <UsersIcon className="mx-auto mb-2" /> No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
