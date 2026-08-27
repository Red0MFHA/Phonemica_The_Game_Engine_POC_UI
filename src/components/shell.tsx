"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import {
  LayoutDashboard, Users, Baby, Gamepad2, Activity, Settings,
  Puzzle, BookOpen, Bell, LogOut, BrainCircuit,
} from "lucide-react";

const nav = [
  { section: "Overview", items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }] },
  {
    section: "Management",
    items: [
      { label: "Users", href: "/users", icon: Users },
      { label: "Children", href: "/children", icon: Baby },
      { label: "Games", href: "/games", icon: Gamepad2 },
    ],
  },
  {
    section: "Platform",
    items: [
      { label: "Exercises", href: "/exercises", icon: Puzzle },
      { label: "Content", href: "/content", icon: BookOpen },
      { label: "Analytics", href: "/analytics", icon: Activity },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function Shell({ children, role, userName }: {
  children: React.ReactNode;
  role: string;
  userName: string;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-4 dark:border-slate-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <BrainCircuit size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 tracking-tight dark:text-white">Phonemica</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">Engine</p>
          </div>
        </div>
        <nav className="px-3 py-3">
          {nav.map((group) => (
            <div key={group.section} className="mb-4">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{group.section}</p>
              {group.items.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                    title={item.label}
                  >
                    <Icon size={18} className="shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
              {userName.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{userName}</p>
              <p className="text-xs capitalize text-slate-400 dark:text-slate-500">{role}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Adaptive Speech Intelligence Platform</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <Link href="/auth/login" className="flex items-center gap-2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              <LogOut size={18} />
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
