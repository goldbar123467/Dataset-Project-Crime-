import { Suspense } from "react";
import type { Metadata } from "next";
import { SkeletonChart } from "@/components/skeleton-card";
import { UnemploymentExplorer } from "./unemployment-explorer";

export const metadata: Metadata = {
  title: "Unemployment Explorer",
  description: "Explore county-level unemployment rates and distributions across US states from 2007 to 2018.",
};

export default async function UnemploymentPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">County Unemployment Explorer</h1>
        <p className="text-muted-foreground mt-1">
          County-level unemployment rates and distributions (2007–2018)
        </p>
      </div>

      <Suspense fallback={<SkeletonChart />}>
        <UnemploymentExplorer searchParams={params} />
      </Suspense>
    </div>
  );
}
