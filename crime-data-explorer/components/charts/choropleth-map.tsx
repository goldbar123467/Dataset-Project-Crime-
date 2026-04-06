"use client";

import { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

interface ChoroplethMapProps {
  data: Record<string, number>;
  valueLabel?: string;
  colorScale?: [string, string];
}

const geoUrl = "/us-states.json";

function getColor(value: number, min: number, max: number, scale: [string, string]) {
  if (max === min) return scale[0];
  const t = (value - min) / (max - min);
  // Interpolate between scale[0] and scale[1]
  return interpolateColor(scale[0], scale[1], t);
}

function interpolateColor(c1: string, c2: string, t: number): string {
  const r1 = parseInt(c1.slice(1, 3), 16);
  const g1 = parseInt(c1.slice(3, 5), 16);
  const b1 = parseInt(c1.slice(5, 7), 16);
  const r2 = parseInt(c2.slice(1, 3), 16);
  const g2 = parseInt(c2.slice(3, 5), 16);
  const b2 = parseInt(c2.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function ChoroplethMap({
  data,
  valueLabel = "Value",
  colorScale = ["#dbeafe", "#1e40af"],
}: ChoroplethMapProps) {
  const { min, max } = useMemo(() => {
    const values = Object.values(data).filter((v) => v != null && !isNaN(v));
    return {
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 1,
    };
  }, [data]);

  return (
    <div className="relative">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
        width={800}
        height={500}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }: { geographies: { rsmKey: string; properties: { STUSPS: string; NAME: string } }[] }) =>
            geographies.map((geo) => {
              const stateCode = geo.properties.STUSPS;
              const value = data[stateCode];
              const fill =
                value != null
                  ? getColor(value, min, max, colorScale)
                  : "#374151";
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="hsl(var(--border))"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", opacity: 0.8 },
                    pressed: { outline: "none" },
                  }}
                  data-tooltip-id="map-tooltip"
                  data-tooltip-content={`${geo.properties.NAME}: ${value != null ? value.toFixed(2) : "N/A"}`}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {/* Legend */}
      <div className="flex items-center gap-2 justify-center mt-2">
        <span className="text-xs text-muted-foreground">{min.toFixed(1)}</span>
        <div
          className="h-3 w-32 rounded"
          style={{
            background: `linear-gradient(to right, ${colorScale[0]}, ${colorScale[1]})`,
          }}
        />
        <span className="text-xs text-muted-foreground">{max.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground ml-2">{valueLabel}</span>
      </div>
    </div>
  );
}
