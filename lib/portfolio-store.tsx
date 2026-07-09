"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { PortfolioResponse } from "./types";

const STORAGE_KEY = "screener.portfolio.v1";

interface PortfolioStore {
  data: PortfolioResponse | null;
  setData: (data: PortfolioResponse | null) => void;
}

const PortfolioContext = createContext<PortfolioStore | null>(null);

/**
 * Holds the most recent scored portfolio in memory and in sessionStorage, so
 * navigating from Upload to Portfolio (or refreshing Portfolio) does not lose the
 * result and force a re-upload. This is a stand-in for a real backend session; it is
 * intentionally the only piece of cross-page client state in the app.
 */
export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<PortfolioResponse | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setDataState(JSON.parse(raw));
    } catch {
      // corrupt or inaccessible storage: start empty rather than crash
    }
  }, []);

  const setData = (next: PortfolioResponse | null) => {
    setDataState(next);
    try {
      if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures (e.g. private browsing); in-memory state still works
    }
  };

  return (
    <PortfolioContext.Provider value={{ data, setData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioStore(): PortfolioStore {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolioStore must be used within PortfolioProvider");
  return ctx;
}
