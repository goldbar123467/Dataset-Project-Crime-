import type { Metadata } from "next";
import { SeedForm } from "./seed-form";

export const metadata: Metadata = {
  title: "Seed Database",
};

export default function SeedPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Seed Database</h1>
        <p className="text-muted-foreground mt-1">
          Upload the 3 CSV data files to populate the database. This will truncate existing data and re-insert.
        </p>
      </div>
      <SeedForm />
    </div>
  );
}
