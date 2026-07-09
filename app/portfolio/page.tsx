"use client";

import Link from "next/link";
import { usePortfolioStore } from "@/lib/portfolio-store";
import { healthColorVar } from "@/lib/state";
import type { Health, PortfolioRow } from "@/lib/types";

const TINTS = ["var(--tint-1)", "var(--tint-2)", "var(--tint-3)", "var(--tint-4)"];

function zStr(v: number | null): string {
  if (v === null || v === undefined) return "N/A";
  const s = v.toFixed(1);
  return s.startsWith("-") ? "−" + s.slice(1) : s;
}

function HoldingCard({ row }: { row: PortfolioRow }) {
  if (row.source === "unscored") {
    return (
      <div className="surface-card mb-2.5 p-4" style={{ borderLeft: "4px solid var(--neutral)" }}>
        <div className="mb-1 flex items-center gap-2">
          <span className="font-mono text-[15px] font-extrabold text-ink">{row.ticker}</span>
        </div>
        <div className="text-[14.5px] leading-relaxed text-ink">
          <span className="font-extrabold" style={{ color: "var(--neutral)" }}>
            Unscored.
          </span>{" "}
          {row.unscored_reason}
        </div>
      </div>
    );
  }

  const color = healthColorVar(row.verdict.health);
  return (
    <Link
      href={`/company/${row.ticker}`}
      className="surface-card surface-card-hover mb-2.5 block p-4"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className="flex-none font-mono text-[15px] font-extrabold text-ink">{row.ticker}</span>
        {row.sector && (
          <span className="min-w-0 truncate text-[12.5px] text-ink-soft">&middot; {row.sector}</span>
        )}
        <span className="ml-auto flex-none text-[15px] text-ink-soft">&rarr;</span>
      </div>
      <div className="mb-1 text-[14.5px] leading-relaxed">
        <span className="font-extrabold" style={{ color }}>
          {row.verdict.health}.
        </span>{" "}
        {row.worst_signal}
        {row.delta?.changed && (
          <span className="mt-1 block text-[12.5px] font-bold text-blue">
            {row.delta.direction === "deteriorated" ? "↓ " : "↑ "}
            {row.delta.headline}
          </span>
        )}
      </div>
      <div className="font-mono text-[11.5px] text-ink-soft">
        Z {zStr(row.z)} · {row.data_source.source || row.source}
        {row.data_source.as_of ? `, ${row.data_source.as_of}` : ""}
      </div>
    </Link>
  );
}

export default function PortfolioPage() {
  const { data } = usePortfolioStore();

  if (!data) {
    return (
      <div className="mx-auto max-w-[560px] px-6 pb-20 pt-16 text-center">
        <div className="mb-3 font-display text-2xl text-ink">No holdings yet</div>
        <p className="mb-6 text-[14.5px] leading-relaxed text-ink-soft">
          Upload a brokerage export to see every holding scored for financial distress and earnings red flags.
        </p>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-[10px] bg-blue px-5.5 py-3 text-[14.5px] font-bold text-white"
        >
          Upload your holdings &rarr;
        </Link>
      </div>
    );
  }

  const { rollup, parse_note } = data;
  const total = rollup.ranked.length;
  const needLook = rollup.counts.Distressed + rollup.counts.Watch;
  const headline = needLook === 0 ? `All ${total} holdings look healthy` : `${needLook} of ${total} need a look`;
  const worstHealth: Health =
    rollup.counts.Distressed > 0 ? "Distressed" : rollup.counts.Watch > 0 ? "Watch" : "Healthy";
  const bannerColor = healthColorVar(worstHealth);

  const changes = rollup.changes;
  const firstChanged = changes ? changes.deteriorated[0] || changes.improved[0] : undefined;

  return (
    <div>
      <div className="mx-auto max-w-[760px] px-6 pt-11">
        <span className="font-mono text-xs font-bold uppercase tracking-wide text-blue">
          Your Portfolio · {total + rollup.n_unscored} holdings
        </span>
      </div>

      {parse_note && (
        <div className="mx-auto mt-4 max-w-[760px] px-6 text-[13px] text-ink-soft">{parse_note}</div>
      )}

      <div
        className="surface-card mx-auto my-7.5 flex max-w-[760px] flex-wrap items-center justify-between gap-5 px-7 py-6.5"
        style={{ borderLeft: `5px solid ${bannerColor}` }}
      >
        <div>
          <div className="font-display text-[26px] text-ink">{headline}</div>
          {changes && changes.any_change && firstChanged && (
            <div className="mt-2 text-[13px] text-ink-soft">
              {changes.n_deteriorated + changes.n_improved} change
              {changes.n_deteriorated + changes.n_improved > 1 ? "s" : ""} since your last check:{" "}
              <strong className="font-bold text-ink">
                {firstChanged.ticker} {firstChanged.delta?.headline?.toLowerCase()}
              </strong>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {rollup.counts.Distressed > 0 && (
            <span className="rounded-full bg-distress-soft px-2.5 py-0.5 text-[12.5px] font-extrabold text-distress">
              {rollup.counts.Distressed} Distressed
            </span>
          )}
          {rollup.counts.Watch > 0 && (
            <span className="rounded-full bg-watch-soft px-2.5 py-0.5 text-[12.5px] font-extrabold text-watch">
              {rollup.counts.Watch} Watch
            </span>
          )}
          {rollup.counts.Healthy > 0 && (
            <span className="rounded-full bg-ok-soft px-2.5 py-0.5 text-[12.5px] font-extrabold text-ok">
              {rollup.counts.Healthy} Healthy
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto mb-8.5 max-w-[760px] border-b border-line-strong px-6 pb-6.5">
        <div className="mb-2.5 text-xs font-bold uppercase tracking-wide text-ink-soft">Where you&rsquo;re concentrated</div>
        <div className="mb-3.5 text-[14.5px]">{rollup.concentration.headline}</div>
        <div className="mb-2.5 flex h-2.5 gap-0.75">
          {rollup.concentration.sectors.map((s, i) => (
            <span
              key={s.sector}
              className="h-full rounded-full"
              style={{ width: `${s.pct}%`, background: TINTS[i % TINTS.length] }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-[12.5px] text-ink-soft">
          {rollup.concentration.sectors.map((s, i) => (
            <span key={s.sector}>
              <i
                className="mr-1.5 inline-block h-2 w-2 rounded-full"
                style={{ background: TINTS[i % TINTS.length] }}
              />
              {s.sector} {s.pct}%
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto mb-2 max-w-[760px] px-6">
        <div className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-soft">Weakest first</div>
        {rollup.ranked.map((row) => (
          <HoldingCard key={row.ticker} row={row} />
        ))}
        {rollup.unscored.map((row) => (
          <HoldingCard key={row.ticker} row={row} />
        ))}
      </div>

      <div className="mx-auto mb-15 max-w-[760px] border-t border-line-strong px-6 pt-5 text-center text-[13px] text-ink-soft">
        Want the full sector tables, comps, or the deal-screening view?{" "}
        <Link href="/analyst-tools" className="font-bold text-blue">
          Open Analyst tools &rarr;
        </Link>
      </div>
    </div>
  );
}
