import type { Health, ScoreBlock } from "./types";

export type FindingState = "bad" | "watch" | "good" | "na";

/**
 * Per-metric state, one level more granular than the overall verdict. Thresholds are
 * not invented here: Altman reuses its own zone (models.py), Piotroski reuses the
 * exact <=3 / <=6 bands portfolio.py's worst_signal already scores by, and Beneish
 * is inherently binary (models.py's flag), so it has no watch state.
 */
export function altmanState(block: ScoreBlock & { zone: string | null }): FindingState {
  if (!block.applicable) return "na";
  if (block.zone === "Distress") return "bad";
  if (block.zone === "Grey") return "watch";
  return "good";
}

export function piotroskiState(block: ScoreBlock): FindingState {
  if (!block.applicable || block.value === null) return "na";
  if (block.value <= 3) return "bad";
  if (block.value <= 6) return "watch";
  return "good";
}

export function beneishState(block: ScoreBlock & { flag: boolean }): FindingState {
  if (!block.applicable) return "na";
  return block.flag ? "bad" : "good";
}

export function findingColorVar(state: FindingState): string {
  switch (state) {
    case "bad": return "var(--distress)";
    case "watch": return "var(--watch)";
    case "good": return "var(--ok)";
    default: return "var(--neutral)";
  }
}

/** One place that knows which color a health state maps to, so no component
 * hardcodes "orange means Watch" on its own. */
export function healthColorVar(health: Health): string {
  switch (health) {
    case "Distressed": return "var(--distress)";
    case "Watch": return "var(--watch)";
    case "Healthy": return "var(--ok)";
    default: return "var(--neutral)";
  }
}

export function healthSoftVar(health: Health): string {
  switch (health) {
    case "Distressed": return "var(--distress-soft)";
    case "Watch": return "var(--watch-soft)";
    case "Healthy": return "var(--ok-soft)";
    default: return "var(--line)";
  }
}
