import Link from "next/link";
import type { Report } from "@/lib/types";
import { altmanState, beneishState, findingColorVar, healthColorVar, piotroskiState } from "@/lib/state";

function fmtNum(v: number | null, digits = 1): string {
  if (v === null || v === undefined) return "N/A";
  const s = v.toFixed(digits);
  return s.startsWith("-") ? "−" + s.slice(1) : s;
}

function timeAgo(ts?: number | null): string | null {
  if (!ts) return null;
  const mins = Math.round((Date.now() / 1000 - ts) / 60);
  if (mins < 1) return "moments ago";
  if (mins === 1) return "1 minute ago";
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.round(mins / 60);
  return hrs === 1 ? "1 hour ago" : `${hrs} hours ago`;
}

export function CompanyReport({ report, backHref }: { report: Report; backHref?: string }) {
  const { company, verdict, scores, benchmark, provenance, periods } = report;
  const verdictColor = healthColorVar(verdict.health);

  const findings = [
    {
      name: "Bankruptcy risk",
      tech: "Altman Z-Score",
      value: fmtNum(scores.altman.value),
      state: altmanState(scores.altman),
      why: scores.altman.applicable
        ? scores.altman.why
        : scores.altman.note || "Not enough data to run this model.",
    },
    {
      name: "Financial strength",
      tech: "Piotroski F-Score",
      value: scores.piotroski.applicable ? `${scores.piotroski.value}/${scores.piotroski.max}` : "N/A",
      state: piotroskiState(scores.piotroski),
      why: scores.piotroski.applicable
        ? scores.piotroski.why
        : scores.piotroski.note || "Not enough statement history on file to run this one yet.",
    },
    {
      name: "Earnings honesty",
      tech: "Beneish M-Score",
      value: fmtNum(scores.beneish.value),
      state: beneishState(scores.beneish),
      why: scores.beneish.applicable
        ? scores.beneish.why
        : scores.beneish.note || "Not enough data to run this model.",
    },
  ];

  const priceAgo = timeAgo(provenance.price.fetched_at);

  return (
    <div className="mx-auto max-w-[700px] px-6 pb-20 pt-11">
      {backHref && (
        <Link href={backHref} className="group mb-5.5 inline-block text-[13px] font-bold text-blue">
          <span className="inline-block transition-transform group-hover:-translate-x-1">&larr;</span> Back to
          portfolio
        </Link>
      )}

      <div className="mb-5.5">
        <div className="font-display text-[28px] text-ink">{company.name || company.ticker}</div>
        <div className="mt-1 font-mono text-[13px] text-ink-soft">
          {company.ticker}
          {company.sector ? ` · ${company.sector}` : ""}
        </div>
      </div>

      <div
        className="surface-card mb-6.5 p-7"
        style={{ borderLeft: `5px solid ${verdictColor}` }}
      >
        <div
          className="mb-2 font-mono text-xl font-extrabold uppercase tracking-wide"
          style={{ color: verdictColor }}
        >
          {verdict.health}
        </div>
        <div className="mb-2.5 text-[15px] text-ink">{verdict.summary}</div>
        {scores.altman.applicable && (
          <div className="text-[13.5px] leading-relaxed text-ink-soft">{scores.altman.why}</div>
        )}
      </div>

      <div className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-soft">The three checks</div>

      {findings.map((f) => (
        <div
          key={f.name}
          className="surface-card mb-2.5 p-4"
          style={{ borderLeft: `4px solid ${findingColorVar(f.state)}` }}
        >
          <div className="mb-1 text-[14.5px] font-bold text-ink">
            {f.name}
            <span className="ml-1.5 font-mono text-[11.5px] font-normal text-ink-soft">{f.tech}</span>
            <span className="ml-1.5 font-mono text-[13.5px] font-extrabold text-ink">{f.value}</span>
          </div>
          <div className="text-[13.5px] leading-relaxed text-ink-soft">{f.why}</div>
        </div>
      ))}

      <div className="border-b border-line-strong py-4.5">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">Sector benchmark</div>
        {benchmark.available ? (
          <div className="space-y-1.5 text-[13.5px] text-ink-soft">
            {Object.entries(benchmark.metrics).map(([key, m]) => (
              <div key={key}>
                {key === "z" ? "Altman Z" : key === "f_score" ? "Piotroski F" : "Beneish M"}:{" "}
                {m.thin
                  ? `too few ${company.sector || "sector"} peers in the snapshot to benchmark honestly (fewer than 8).`
                  : m.percentile !== null
                    ? `${Math.round(m.percentile)}th percentile among ${m.peer_count} ${company.sector} peers.`
                    : "not available for this holding."}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[13.5px] text-ink-soft">
            No sector on file for this ticker, so it cannot be benchmarked against peers yet.
          </div>
        )}
      </div>

      <Link href="/analyst-tools" className="group mb-4.5 mt-1.5 inline-block text-[13.5px] font-bold text-blue">
        How every number here is calculated{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
      </Link>

      <div className="border-t border-line-strong pt-4.5 font-mono text-[11.5px] leading-relaxed text-ink-soft">
        Fundamentals: {provenance.fundamentals.source || "unknown"}
        {provenance.fundamentals.as_of ? `, filed ${provenance.fundamentals.as_of}` : ""}
        <br />
        Price: {provenance.price.source || "unknown"}
        {priceAgo ? `, updated ${priceAgo}` : ""}
        <br />
        Peers: {provenance.peers.source}
        {periods.current ? ` · period: ${periods.current}` : ""}
      </div>
    </div>
  );
}
