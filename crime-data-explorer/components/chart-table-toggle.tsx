"use client";

import { useState, type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TableIcon } from "lucide-react";

export function ChartTableToggle({
  chart,
  table,
}: {
  chart: ReactNode;
  table: ReactNode;
}) {
  const [view, setView] = useState<string>("chart");

  return (
    <Tabs value={view} onValueChange={setView}>
      <div className="flex justify-end mb-2">
        <TabsList>
          <TabsTrigger value="chart" className="gap-1">
            <BarChart3 className="h-3 w-3" /> Chart
          </TabsTrigger>
          <TabsTrigger value="table" className="gap-1">
            <TableIcon className="h-3 w-3" /> Table
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="chart">{chart}</TabsContent>
      <TabsContent value="table">{table}</TabsContent>
    </Tabs>
  );
}
