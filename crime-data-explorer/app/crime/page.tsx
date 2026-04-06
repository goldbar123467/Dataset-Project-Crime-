import { Suspense } from "react";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonChart } from "@/components/skeleton-card";
import { CrimeExplorer } from "./crime-explorer";
import { getCrimeStates } from "@/db/queries/crime";

export const metadata: Metadata = {
  title: "Crime & Incarceration",
  description: "Explore incarceration rates vs. crime rates across US states from 2001 to 2016.",
};

export default async function CrimePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const states = await getCrimeStates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crime & Incarceration Explorer</h1>
        <p className="text-muted-foreground mt-1">
          Compare incarceration rates with crime metrics across states (2001–2016)
        </p>
      </div>

      <Suspense fallback={<SkeletonChart />}>
        <CrimeExplorer states={states} searchParams={params} />
      </Suspense>
    </div>
  );
}
