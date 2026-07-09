const SOON = [
  "Full sector tables and comps",
  "Deal-screening view (acquisition targets)",
  "Full methodology page, every formula and threshold",
];

export default function AnalystToolsPage() {
  return (
    <div className="px-6 pb-20 pt-14 text-center">
      <span className="font-mono text-xs font-bold uppercase tracking-wide text-blue">Coming soon</span>
      <h2 className="mb-2.5 mt-2.5 font-display text-[32px] text-ink">Analyst tools</h2>
      <div className="mx-auto mt-6.5 flex max-w-[440px] flex-col gap-2.5">
        {SOON.map((item) => (
          <div key={item} className="surface-card p-4.5 text-center text-sm font-semibold text-ink">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
