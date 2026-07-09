import Link from "next/link";
import { ApiError, fetchCompanyReport } from "@/lib/api";
import { CompanyReport } from "@/components/CompanyReport";

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;

  try {
    const report = await fetchCompanyReport(ticker);
    return <CompanyReport report={report} backHref="/portfolio" />;
  } catch (err) {
    const message =
      err instanceof ApiError ? err.message : "Something went wrong reaching the data source. Try again in a moment.";
    return (
      <div className="mx-auto max-w-[560px] px-6 pb-20 pt-16 text-center">
        <div className="mb-3 font-display text-2xl text-ink">Couldn&rsquo;t read {ticker.toUpperCase()}</div>
        <p className="mb-6 text-[14.5px] leading-relaxed text-ink-soft">{message}</p>
        <Link href="/portfolio" className="text-[13.5px] font-bold text-blue">
          &larr; Back to portfolio
        </Link>
      </div>
    );
  }
}
