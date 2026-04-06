declare module "shapefile" {
  export function read(
    shp: string,
    dbf?: string,
    options?: Record<string, unknown>
  ): Promise<GeoJSON.FeatureCollection>;
}
