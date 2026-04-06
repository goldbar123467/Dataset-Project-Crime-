import * as shapefile from "shapefile";
import { writeFileSync } from "fs";
import * as path from "path";
import * as turf from "@turf/turf";

function simplifyCoords(coords: number[][], tolerance: number): number[][] {
  if (coords.length <= 4) return coords;
  const line = turf.lineString(coords);
  const simplified = turf.simplify(line, { tolerance, highQuality: false });
  return (simplified.geometry as GeoJSON.LineString).coordinates as number[][];
}

function simplifyGeometry(geometry: GeoJSON.Geometry, tolerance: number): GeoJSON.Geometry {
  if (geometry.type === "Polygon") {
    return {
      type: "Polygon",
      coordinates: (geometry as GeoJSON.Polygon).coordinates.map((ring) =>
        simplifyCoords(ring as number[][], tolerance)
      ),
    };
  }
  if (geometry.type === "MultiPolygon") {
    return {
      type: "MultiPolygon",
      coordinates: (geometry as GeoJSON.MultiPolygon).coordinates.map((polygon) =>
        polygon.map((ring) => simplifyCoords(ring as number[][], tolerance))
      ),
    };
  }
  return geometry;
}

async function convert() {
  const shpPath = path.resolve(
    __dirname,
    "../../data/tl_2019_us_state/tl_2019_us_state.shp"
  );
  const dbfPath = path.resolve(
    __dirname,
    "../../data/tl_2019_us_state/tl_2019_us_state.dbf"
  );

  const geojson = await shapefile.read(shpPath, dbfPath);

  const tolerance = 0.05;

  const simplified = {
    type: "FeatureCollection" as const,
    features: geojson.features.map((f) => ({
      type: f.type,
      properties: {
        STATEFP: f.properties?.STATEFP,
        STUSPS: f.properties?.STUSPS,
        NAME: f.properties?.NAME,
      },
      geometry: simplifyGeometry(f.geometry as GeoJSON.Geometry, tolerance),
    })),
  };

  const outPath = path.resolve(__dirname, "../public/us-states.json");
  const json = JSON.stringify(simplified);
  writeFileSync(outPath, json);
  console.log(`Wrote ${outPath} (${(json.length / 1024).toFixed(0)} KB)`);
}

convert().catch(console.error);
