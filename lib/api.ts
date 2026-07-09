import type { PortfolioResponse, Report } from "./types";

/**
 * One base URL, read once. Set NEXT_PUBLIC_API_URL in .env.local for local dev
 * (defaults to the FastAPI dev server) and in Vercel's project settings at deploy
 * time. Every fetch in this file goes through here, so there is exactly one place
 * that knows where the backend lives.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      // response was not JSON; keep the generic message
    }
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

export function fetchCompanyReport(ticker: string): Promise<Report> {
  return request<Report>(`/api/company/${encodeURIComponent(ticker)}`);
}

export function fetchSampleReport(name: string): Promise<Report> {
  return request<Report>(`/api/samples/${encodeURIComponent(name)}`);
}

export function fetchSampleNames(): Promise<{ samples: string[] }> {
  return request(`/api/samples`);
}

export function fetchExampleCsv(): Promise<{ csv_text: string }> {
  return request(`/api/portfolio/example`);
}

export function scorePortfolio(csvText: string, remember = true): Promise<PortfolioResponse> {
  return request<PortfolioResponse>(`/api/portfolio?remember=${remember}`, {
    method: "POST",
    body: JSON.stringify({ csv_text: csvText }),
  });
}
