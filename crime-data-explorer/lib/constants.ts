export const STATE_NAME_TO_CODE: Record<string, string> = {
  ALABAMA: "AL", ALASKA: "AK", ARIZONA: "AZ", ARKANSAS: "AR", CALIFORNIA: "CA",
  COLORADO: "CO", CONNECTICUT: "CT", DELAWARE: "DE", FLORIDA: "FL", GEORGIA: "GA",
  HAWAII: "HI", IDAHO: "ID", ILLINOIS: "IL", INDIANA: "IN", IOWA: "IA",
  KANSAS: "KS", KENTUCKY: "KY", LOUISIANA: "LA", MAINE: "ME", MARYLAND: "MD",
  MASSACHUSETTS: "MA", MICHIGAN: "MI", MINNESOTA: "MN", MISSISSIPPI: "MS",
  MISSOURI: "MO", MONTANA: "MT", NEBRASKA: "NE", NEVADA: "NV",
  "NEW HAMPSHIRE": "NH", "NEW JERSEY": "NJ", "NEW MEXICO": "NM", "NEW YORK": "NY",
  "NORTH CAROLINA": "NC", "NORTH DAKOTA": "ND", OHIO: "OH", OKLAHOMA: "OK",
  OREGON: "OR", PENNSYLVANIA: "PA", "RHODE ISLAND": "RI", "SOUTH CAROLINA": "SC",
  "SOUTH DAKOTA": "SD", TENNESSEE: "TN", TEXAS: "TX", UTAH: "UT", VERMONT: "VT",
  VIRGINIA: "VA", WASHINGTON: "WA", "WEST VIRGINIA": "WV", WISCONSIN: "WI",
  WYOMING: "WY", "DISTRICT OF COLUMBIA": "DC",
};

export const STATE_CODE_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAME_TO_CODE).map(([name, code]) => [code, name])
);

export const STATE_CODE_TO_PROPER_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAME_TO_CODE).map(([name, code]) => [
    code,
    name
      .split(" ")
      .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
      .join(" "),
  ])
);

export const REGIONS = ["South", "West", "Midwest", "Northeast"] as const;

export const REGION_COLORS: Record<string, string> = {
  South: "#ef4444",
  West: "#3b82f6",
  Midwest: "#22c55e",
  Northeast: "#a855f7",
  "United States": "#f59e0b",
};

export const CRIME_METRICS = [
  { value: "violent_crime_total", label: "Violent Crime Total" },
  { value: "murder_manslaughter", label: "Murder & Manslaughter" },
  { value: "robbery", label: "Robbery" },
  { value: "agg_assault", label: "Aggravated Assault" },
  { value: "property_crime_total", label: "Property Crime Total" },
  { value: "burglary", label: "Burglary" },
  { value: "larceny", label: "Larceny" },
  { value: "vehicle_theft", label: "Vehicle Theft" },
  { value: "prisoner_count", label: "Prisoner Count" },
] as const;

export const CHART_COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#a855f7", "#f59e0b",
  "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
];

export const DEATH_PENALTY_STATUSES = [
  "Death Penalty",
  "No Death Penalty",
  "Governor-imposed moratorium",
] as const;
