"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { useCallback } from "react";

interface YearSliderProps {
  min: number;
  max: number;
  paramMin?: string;
  paramMax?: string;
}

export function YearSlider({
  min,
  max,
  paramMin = "yearMin",
  paramMax = "yearMax",
}: YearSliderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentMin = parseInt(searchParams.get(paramMin) ?? String(min));
  const currentMax = parseInt(searchParams.get(paramMax) ?? String(max));

  const handleChange = useCallback(
    (value: number | readonly number[]) => {
      const values = Array.isArray(value) ? value : [value];
      if (values.length < 2) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set(paramMin, String(values[0]));
      params.set(paramMax, String(values[1]));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, paramMin, paramMax]
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{currentMin}</span>
        <span>{currentMax}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[currentMin, currentMax]}
        onValueChange={handleChange}
      />
    </div>
  );
}
