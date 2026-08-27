"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Baby } from "lucide-react";
import { mockEngine } from "@/services/mockEngine";
import { Button, Card, PageHeader, StatusPill } from "@/components/ui";
import Link from "next/link";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = mockEngine.getUser(id);
  if (!user) {
    return (
      <div className="py-20 text-center text-slate-400 dark:text-slate-500">
        <p>User not found.</p>
        <Button variant="ghost" href="/users" className="mt-4">Back to Users</Button>
      </div>
    );
  }

  const childIds = [...(user.therapistChildrenIds ?? []), ...(user.parentChildrenIds ?? [])];
  const childUsers = childIds.map((id) => mockEngine.getChild(id)).filter(Boolean);

  return (
    <div>
      <Button variant="ghost" href="/users"><ArrowLeft size={16} /> Back to Users</Button>
      <PageHeader
        title={user.name}
        subtitle={`${user.email} · ${user.organization ?? "Platform user"}`}
        actions={<StatusPill value={user.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Details" className="lg:col-span-1">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Role</dt><dd className="capitalize font-medium text-slate-800 dark:text-slate-100">{user.role}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Organization</dt><dd className="text-slate-800 dark:text-slate-100">{user.organization ?? "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Joined</dt><dd className="text-slate-800 dark:text-slate-100">{new Date(user.createdAt).toLocaleDateString()}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500 dark:text-slate-400">Status</dt><dd><StatusPill value={user.status} /></dd></div>
          </dl>
          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button variant="secondary" onClick={() => {
              mockEngine.updateUser(user.id, { status: user.status === "active" ? "disabled" : "active" });
              router.refresh();
              window.location.reload();
            }}>
              {user.status === "active" ? "Disable user" : "Enable user"}
            </Button>
          </div>
        </Card>

        <Card title={user.role === "parent" ? "Children linked" : "Assigned children"} className="lg:col-span-2">
          {childUsers.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">No children linked to this user.</p>
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {childUsers.map((c) => (
                <li key={c!.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"><Baby size={16} /></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{c!.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Age {c!.age} · {c!.assessmentStatus}</p>
                    </div>
                  </div>
                  <Link href={`/children/${c!.id}`} className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">View →</Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
