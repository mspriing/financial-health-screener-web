"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, fetchExampleCsv, scorePortfolio } from "@/lib/api";
import { usePortfolioStore } from "@/lib/portfolio-store";

const BROKERS = [
  { badge: "R", name: "Robinhood", steps: "Account → History\nLook for Export or Download" },
  { badge: "F", name: "Fidelity", steps: "Accounts & Trade → Portfolio\nLook for Download Positions" },
  { badge: "S", name: "Schwab", steps: "Accounts → Positions\nLook for Export" },
];

export default function UploadPage() {
  const router = useRouter();
  const { setData } = usePortfolioStore();
  const fileInput = useRef<HTMLInputElement>(null);
  const [isOver, setIsOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitCsv(csvText: string) {
    setBusy(true);
    setError(null);
    try {
      const result = await scorePortfolio(csvText);
      setData(result);
      router.push("/portfolio");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't score that file. Try again in a moment.");
      setBusy(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => submitCsv(String(reader.result || ""));
    reader.onerror = () => setError("Couldn't read that file.");
    reader.readAsText(file);
  }

  async function trySample() {
    setBusy(true);
    setError(null);
    try {
      const { csv_text } = await fetchExampleCsv();
      await submitCsv(csv_text);
    } catch {
      setError("Couldn't load the sample portfolio right now.");
      setBusy(false);
    }
  }

  return (
    <div className="px-6 py-14 pb-20">
      <div className="mx-auto mb-10 max-w-[640px] text-center">
        <span className="font-mono text-xs font-bold uppercase tracking-wide text-blue">Step 1 of 1</span>
        <h2 className="mb-2.5 mt-2.5 font-display text-[32px] text-ink">Add your holdings</h2>
        <p className="text-[15px] text-ink-soft">
          Export your positions from your brokerage as a CSV and drop it below. We read Symbol, Shares, and Cost
          Basis, whatever your broker happens to call them.
        </p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInput.current?.click()}
        className={`surface-card mx-auto mb-4.5 max-w-[640px] cursor-pointer border-2 border-dashed !border-blue p-11 text-center transition-colors ${
          isOver ? "bg-blue-soft" : ""
        } ${busy ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={fileInput}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="mx-auto mb-3.5 flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-blue text-blue">
          &uarr;
        </div>
        <div className="mb-1 text-[15px] font-bold text-ink">
          {busy ? "Scoring your holdings..." : "Drop your CSV here"}
        </div>
        <div className="text-[13px] text-ink-soft">or click to choose a file</div>
      </div>

      {error && (
        <div className="mx-auto mb-4.5 max-w-[640px] rounded-[10px] border border-distress bg-distress-soft px-4 py-3 text-center text-[13.5px] text-distress">
          {error}
        </div>
      )}

      <p className="mb-13 text-center text-[13.5px] text-ink-soft">
        Don&rsquo;t have your export handy?{" "}
        <button onClick={trySample} disabled={busy} className="font-bold text-blue hover:underline">
          Try a sample portfolio instead
        </button>
        .
      </p>

      <div className="mx-auto mb-4.5 max-w-[640px] text-center">
        <h3 className="text-[13px] font-bold uppercase tracking-wide text-ink-soft">Where to find your export</h3>
      </div>
      <div className="mx-auto grid max-w-[760px] grid-cols-1 gap-3.5 sm:grid-cols-3">
        {BROKERS.map((b) => (
          <div key={b.name} className="surface-card surface-card-hover p-4.5">
            <div className="mb-2.5 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-blue-soft font-mono text-[13px] font-extrabold text-blue">
              {b.badge}
            </div>
            <div className="mb-2 text-[14.5px] font-extrabold text-ink">{b.name}</div>
            <div className="whitespace-pre-line text-[13px] leading-relaxed text-ink-soft">{b.steps}</div>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-4.5 max-w-[640px] text-center text-[12.5px] text-ink-soft">
        Menu names shift between broker app versions. Anywhere you see Export, Download, or History near your
        positions is the right spot.
      </p>
    </div>
  );
}
