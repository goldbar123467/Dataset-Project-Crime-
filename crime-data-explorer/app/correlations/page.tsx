import { Suspense } from "react";
import type { Metadata } from "next";
import { SkeletonChart } from "@/components/skeleton-card";
import { CorrelationsExplorer } from "./correlations-explorer";

export const metadata: Metadata = {
  title: "Cross-Dataset Correlations",
  description: "Explore correlations between unemployment, crime, and incarceration across states.",
};

export default async function CorrelationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cross-Dataset Correlations</h1>
        <p className="text-muted-foreground mt-1">
          Explore relationships between unemployment, crime rates, and incarceration (2007–2016 overlap)
        </p>
      </div>

      <Suspense fallback={<SkeletonChart />}>
        <CorrelationsExplorer searchParams={params} />
      </Suspense>
    </div>
  );
}
