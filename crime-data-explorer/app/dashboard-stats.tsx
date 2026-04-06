import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCrimeSummary, getNationalCrimeTrend } from "@/db/queries/crime";
import { getMurderSummary, getNationalMurderTrend } from "@/db/queries/murder";
import {
  getUnemploymentSummary,
  getNationalUnemploymentTrend,
} from "@/db/queries/unemployment";
import { Sparkline } from "@/components/charts/sparkline";
import { formatNumber } from "@/lib/utils";

export async function DashboardStats() {
  const [crimeSummary, murderSummary, unemploymentSummary, crimeTrend, murderTrend, unemploymentTrend] =
    await Promise.all([
      getCrimeSummary(),
      getMurderSummary(),
      getUnemploymentSummary(),
      getNationalCrimeTrend(),
      getNationalMurderTrend(),
      getNationalUnemploymentTrend(),
    ]);

  const crimeSparkline = crimeTrend.map((r) => ({
    value: r.totalPopulation ? (r.totalViolentCrime / r.totalPopulation) * 100000 : 0,
  }));

  const murderSparkline = murderTrend.map((r) => ({
    value: parseFloat(r.murderRate ?? "0"),
  }));

  const unemploymentSparkline = unemploymentTrend.map((r) => ({
    value: r.avgRate,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Crime & Incarceration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatNumber(crimeSummary.totalRows)} records
            </p>
            <p className="text-xs text-muted-foreground">
              {crimeSummary.jurisdictions} jurisdictions · {crimeSummary.minYear}–{crimeSummary.maxYear}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Murder Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatNumber(murderSummary.totalRows)} records
            </p>
            <p className="text-xs text-muted-foreground">
              By region & state · {murderSummary.minYear}–{murderSummary.maxYear}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unemployment (County)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatNumber(unemploymentSummary.totalRows)} records
            </p>
            <p className="text-xs text-muted-foreground">
              ~{formatNumber(unemploymentSummary.counties)} counties · {unemploymentSummary.minYear}–{unemploymentSummary.maxYear}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              National Violent Crime Rate (per 100K)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Sparkline data={crimeSparkline} color="#3b82f6" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              National Murder Rate (per 100K)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Sparkline data={murderSparkline} color="#ef4444" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              National Avg Unemployment Rate (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Sparkline data={unemploymentSparkline} color="#22c55e" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
