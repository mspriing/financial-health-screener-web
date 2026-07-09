"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TraceMarkSmall } from "./TraceMark";

const TABS = [
  { href: "/", label: "Home", exact: true },
  { href: "/upload", label: "Upload", exact: true },
  { href: "/portfolio", label: "Portfolio", exact: true },
  { href: "/company/AAPL", label: "Company", exact: false, matchPrefix: "/company" },
  { href: "/analyst-tools", label: "Analyst tools", exact: true, soon: true },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-10 border-b border-line-strong bg-[var(--surface)] backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2 font-mono text-[13px] font-bold tracking-wide text-ink">
          <TraceMarkSmall className="text-blue" />
          SCREENER
        </Link>
        <div className="relative min-w-0">
          <div className="flex gap-1 overflow-x-auto rounded-full border border-line-strong bg-paper p-1">
            {TABS.map((tab) => {
              const active = tab.matchPrefix ? pathname.startsWith(tab.matchPrefix) : pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[13.5px] font-bold transition-colors ${
                    active ? "bg-blue text-white" : "text-ink-soft hover:bg-blue-soft hover:text-ink"
                  }`}
                >
                  {tab.label}
                  {tab.soon && (
                    <span
                      className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                        active ? "bg-white text-blue" : "bg-blue text-white"
                      }`}
                    >
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          {/* Signals there are more tabs to scroll to when the bar is narrower than the
              tab row (phones). Purely decorative, so it never blocks taps underneath. */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-8 rounded-r-full"
            style={{ background: "linear-gradient(to right, transparent, var(--paper))" }}
          />
        </div>
      </div>
    </div>
  );
}
