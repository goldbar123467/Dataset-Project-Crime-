import { Suspense } from "react";
import type { Metadata } from "next";
import { SkeletonChart } from "@/components/skeleton-card";
import { MurderExplorer } from "./murder-explorer";

export const metadata: Metadata = {
  title: "Murder Rate Analysis",
  description: "Analyze murder rates by region, state, and death penalty status from 1987 to 2020.",
};

export default async function MurderPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Murder Rate Analysis</h1>
        <p className="text-muted-foreground mt-1">
          Compare murder rates by region and death penalty status (1987–2020)
        </p>
      </div>

      <Suspense fallback={<SkeletonChart />}>
        <MurderExplorer searchParams={params} />
      </Suspense>
    </div>
  );
}
