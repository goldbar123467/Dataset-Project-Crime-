import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonCard } from "@/components/skeleton-card";
import Link from "next/link";
import { BarChart3, Skull, Briefcase, GitBranch } from "lucide-react";
import { DashboardStats } from "./dashboard-stats";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crime Data Explorer</h1>
        <p className="text-muted-foreground mt-1">
          Explore crime, incarceration, murder rates, and unemployment data across US states and counties.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/crime">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <div>
                <CardTitle>Crime & Incarceration</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Explore incarceration rates vs. crime rates across states (2001-2016)
                </p>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/murder">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-3">
              <Skull className="h-8 w-8 text-red-500" />
              <div>
                <CardTitle>Murder Rate Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Compare murder rates by region and death penalty status (1987-2020)
                </p>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/unemployment">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-3">
              <Briefcase className="h-8 w-8 text-green-500" />
              <div>
                <CardTitle>Unemployment Explorer</CardTitle>
                <p className="text-sm text-muted-foreground">
                  County-level unemployment rates and distributions (2007-2018)
                </p>
              </div>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/correlations">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-3">
              <GitBranch className="h-8 w-8 text-purple-500" />
              <div>
                <CardTitle>Cross-Dataset Correlations</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Unemployment vs. crime correlations across the 2007-2016 overlap
                </p>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
