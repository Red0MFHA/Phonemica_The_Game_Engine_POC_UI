"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";
import {
  LayoutDashboard, Users, Baby, Gamepad2, Activity, Settings,
  Puzzle, BookOpen, Bell, LogOut, BrainCircuit, ChevronLeft, ChevronRight,
} from "lucide-react";
import { clearAuth, roleLabel } from "@/lib/auth";
import { canAccessRoute } from "@/lib/permissions";
import type { Role } from "@/types/engine";

const COLLAPSE_KEY = "phonemica-nav-collapsed";

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

export default function Shell({ children, role, userName, userEmail, organization }: {
  children: React.ReactNode;
  role: Role | string;
  userName: string;
  userEmail?: string;
  organization?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const r = role as Role;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function toggleCollapse() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const visibleNav = nav
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessRoute(r, item.href)),
    }))
    .filter((group) => group.items.length > 0);

  function logout() {
    clearAuth();
    router.replace("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <aside
        className={`shrink-0 border-r border-slate-200 bg-white transition-[width] dark:border-slate-800 dark:bg-slate-900 ${
          collapsed ? "w-[4.25rem]" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-3 py-4 dark:border-slate-800">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white">
              <BrainCircuit size={20} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white">Phonemica</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">Engine</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={toggleCollapse}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <nav className="px-2 py-3">
          {visibleNav.map((group) => (
            <div key={group.section} className="mb-4">
              {!collapsed && (
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.section}
                </p>
              )}
              {group.items.map((item) => {
                const active = pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                    title={item.label}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!collapsed && item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-300">
              {userName.slice(0, 1)}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{userName}</p>
                {userEmail && <p className="truncate text-[10px] text-slate-400 dark:text-slate-500">{userEmail}</p>}
                <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                  {roleLabel(r)}
                  {organization ? ` · ${organization}` : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Adaptive Speech Intelligence Platform</span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button type="button" className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
