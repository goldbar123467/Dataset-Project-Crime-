"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SeedForm() {
  const [crimeFile, setCrimeFile] = useState<File | null>(null);
  const [murderFile, setMurderFile] = useState<File | null>(null);
  const [unemploymentFile, setUnemploymentFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!crimeFile && !murderFile && !unemploymentFile) {
      setStatus("Please select at least one CSV file.");
      return;
    }

    setLoading(true);
    setStatus("Uploading and seeding... This may take a few minutes.");

    try {
      const formData = new FormData();
      if (crimeFile) formData.append("crime", crimeFile);
      if (murderFile) formData.append("murder", murderFile);
      if (unemploymentFile) formData.append("unemployment", unemploymentFile);

      const res = await fetch("/api/seed", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(
          `Success!\n${Object.entries(data.results)
            .map(([k, v]) => `  ${k}: ${v}`)
            .join("\n")}`
        );
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      setStatus(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            1. Crime & Incarceration CSV
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            File: crime_and_incarceration_by_state.csv
          </p>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCrimeFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            2. Murder Rates CSV
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            File: Murder Rates, States By Region_Full Data_data.csv
          </p>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setMurderFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            3. Unemployment County CSV
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            File: unemployment_county.csv
          </p>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setUnemploymentFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Seeding..." : "Seed Database"}
      </Button>

      {status && (
        <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
          {status}
        </pre>
      )}
    </form>
  );
}
