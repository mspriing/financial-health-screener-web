/**
 * Mirrors report.py's build_report() schema and portfolio.rank_portfolio()'s rollup
 * shape exactly. These are not guesses: they were pinned against the real FastAPI
 * responses (see server.py) before this file was written. If report.py's schema
 * changes, this is the one file that needs to change with it.
 */

export type Health = "Healthy" | "Watch" | "Distressed" | "Unknown";
export type Integrity = "Clean" | "Possible manipulation" | "Not enough data";
export type Zone = "Safe" | "Grey" | "Distress" | null;

export interface ScoreBlock {
  applicable: boolean;
  why: string | null;
  note: string | null;
  value: number | null;
  [key: string]: unknown; // zone/components (altman), max/signals (piotroski), flag/threshold/indices (beneish)
}

export interface BenchmarkMetric {
  value: number | null;
  median: number | null;
  p25: number | null;
  p75: number | null;
  peer_count: number;
  thin: boolean;
  percentile: number | null;
  higher_is_better: boolean;
}

export interface ProvenanceSource {
  source: string | null;
  as_of: string | null;
  fetched_at?: number | null;
  value?: number | null;
}

export interface Report {
  schema_version: string;
  company: {
    name: string | null;
    ticker: string | null;
    sector: string | null;
    is_financial: boolean;
  };
  verdict: {
    health: Health;
    integrity: Integrity;
    summary: string;
  };
  scores: {
    altman: ScoreBlock & { zone: Zone; components: Record<string, number> };
    piotroski: ScoreBlock & { max: number; signals: Record<string, number> };
    beneish: ScoreBlock & { flag: boolean; threshold: number; indices: Record<string, number> };
  };
  benchmark: {
    sector: string | null;
    available: boolean;
    metrics: Record<string, BenchmarkMetric>;
  };
  provenance: {
    fundamentals: ProvenanceSource;
    price: ProvenanceSource;
    peers: { source: string };
  };
  periods: { current: string | null; prior: string | null };
}

export interface DeltaBlock {
  first_seen: boolean;
  changed: boolean;
  direction: "deteriorated" | "improved" | "unchanged";
  health_from: Health | null;
  health_to: Health | null;
  z_delta: number | null;
  f_delta: number | null;
  new_flag: boolean;
  cleared_flag: boolean;
  last_checked: number | null;
  headline: string;
}

export interface PortfolioRow {
  ticker: string;
  name: string | null;
  sector: string | null;
  z: number | null;
  zone: Zone;
  f_score: number | null;
  m_score: number | null;
  m_flag: boolean;
  verdict: { health: Health; integrity: Integrity };
  source: "live" | "snapshot" | "unscored";
  data_source: { source: string | null; as_of: string | null };
  weight: number | null;
  worst_signal: string;
  unscored_reason: string | null;
  delta?: DeltaBlock;
}

export interface SectorSlice {
  sector: string;
  n: number;
  weight: number;
  pct: number;
}

export interface Concentration {
  basis: "market value" | "position count";
  sectors: SectorSlice[];
  top_sector: string | null;
  top_pct: number | null;
  concentrated: boolean;
  headline: string;
}

export interface PortfolioRollup {
  ranked: PortfolioRow[];
  unscored: PortfolioRow[];
  counts: { Distressed: number; Watch: number; Healthy: number };
  n_flagged: number;
  weakest: PortfolioRow[];
  n_unscored: number;
  concentration: Concentration;
  changes?: {
    deteriorated: PortfolioRow[];
    improved: PortfolioRow[];
    n_deteriorated: number;
    n_improved: number;
    n_first_seen: number;
    any_change: boolean;
  };
}

export interface PortfolioResponse {
  parse_note: string | null;
  rollup: PortfolioRollup;
}
