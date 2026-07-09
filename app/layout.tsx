import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { PortfolioProvider } from "@/lib/portfolio-store";

export const metadata: Metadata = {
  title: "Financial Health Screener",
  description: "A checkup for the stocks already in your portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-paper font-sans text-ink">
        <PortfolioProvider>
          <Nav />
          {children}
        </PortfolioProvider>
      </body>
    </html>
  );
}
