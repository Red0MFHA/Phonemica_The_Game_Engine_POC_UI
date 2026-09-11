"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (!items.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="inline-flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} className="opacity-60" />}
            {item.href && !last ? (
              <Link href={item.href} className="hover:text-brand-600 dark:hover:text-brand-300">
                {item.label}
              </Link>
            ) : (
              <span className={last ? "font-medium text-slate-700 dark:text-slate-200" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
