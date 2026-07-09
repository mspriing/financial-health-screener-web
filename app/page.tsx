import Link from "next/link";
import { TraceMarkHero } from "@/components/TraceMark";

const PROOF = [
  {
    k: "No black box",
    v: "Three public models",
    d: "Bankruptcy risk, financial strength, and earnings honesty (Altman Z, Piotroski F, and Beneish M, if you know the names). Decades old, peer reviewed, fully public. Nothing proprietary, nothing hidden.",
  },
  {
    k: "Tested, not just trusted",
    v: "17 months early",
    d: "Run against Intel's real filings using only the data available at the time, no hindsight, the models flagged its distress 17 months before the market repriced the stock in December 2025.",
  },
  {
    k: "Check it yourself",
    v: "Straight from the source",
    d: "Fundamentals come straight from SEC filings, prices refresh every 15 minutes, and every number on screen traces back to where it came from.",
  },
];

export default function HomePage() {
  return (
    <div>
      <div className="px-6 pt-19 text-center">
        <div className="mx-auto max-w-[720px]">
          <span className="mb-4.5 block font-mono text-xs font-bold uppercase tracking-[.1em] text-blue">
            Financial Health Screener
          </span>
          <h1 className="mb-5 font-display text-[clamp(2.1rem,4.6vw+.8rem,3.5rem)] leading-[1.1] text-balance text-ink">
            Stock Health, Reimagined.
          </h1>
          <p className="mx-auto mb-7.5 max-w-[56ch] text-[17.5px] leading-relaxed text-ink-soft">
            Every stock you hold accumulates risk quietly, from the day you buy it
            until something finally goes wrong, and most investors never look back to
            check. Think of this as a checkup for the stocks already in your
            portfolio. Upload your holdings, and we&rsquo;ll tell you, in plain
            English, which ones still look healthy and which ones deserve a second
            look.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/upload"
              className="group inline-flex items-center gap-2 rounded-[10px] bg-blue px-5.5 py-3 text-[14.5px] font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Upload your holdings
              <span className="inline-block transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href="/portfolio"
              className="surface-card inline-flex items-center gap-2 rounded-[10px] px-5.5 py-3 text-[14.5px] font-bold text-ink transition-transform hover:-translate-y-0.5"
            >
              See a sample portfolio
            </Link>
          </div>
        </div>
        <TraceMarkHero />
      </div>

      <div className="mx-auto mt-14 grid max-w-[960px] grid-cols-1 gap-3.5 px-6 sm:grid-cols-3">
        {PROOF.map((item) => (
          <div key={item.k} className="surface-card surface-card-hover p-6.5">
            <div className="mb-2.5 font-mono text-[11px] font-bold uppercase tracking-wide text-blue">
              {item.k}
            </div>
            <div className="mb-2 font-display text-[23px] text-ink">{item.v}</div>
            <div className="text-[13.5px] leading-relaxed text-ink-soft">{item.d}</div>
          </div>
        ))}
      </div>

      <div className="mx-auto mb-19 mt-13 max-w-[480px] px-6 text-center">
        <div className="mb-3.5 text-[13px] text-ink-soft">
          This is what one holding looks like once it&rsquo;s scored.
        </div>
        <Link
          href="/company/AAPL"
          className="surface-card surface-card-hover flex items-center justify-between gap-3.5 p-4.5 text-left"
        >
          <div>
            <div className="font-mono text-sm font-extrabold text-ink">AAPL</div>
            <div className="mt-0.5 text-[13px] text-ink-soft">
              See its live read, straight from EDGAR and Finnhub.
            </div>
          </div>
          <span className="rounded-full bg-ok-soft px-2.5 py-0.5 text-[12.5px] font-extrabold text-ok">
            Live
          </span>
        </Link>
      </div>
    </div>
  );
}
