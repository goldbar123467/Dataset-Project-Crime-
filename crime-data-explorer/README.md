# Crime Data Explorer

Interactive data exploration platform for US crime, incarceration, murder rates, and unemployment statistics.

## Stack

- **Framework**: Next.js 15 (App Router, React Server Components)
- **Database**: Vercel Postgres (Neon) with Drizzle ORM
- **UI**: shadcn/ui, Tailwind CSS 4
- **Charts**: Recharts, react-simple-maps (choropleth)
- **Language**: TypeScript (end-to-end type safety)

## Setup

### Prerequisites

- Node.js 18+
- A Vercel Postgres (Neon) database

### Environment Variables

Copy `.env.example` to `.env` and set your database URL:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon/Vercel Postgres connection string |

### Install Dependencies

```bash
npm install
```

### Seed the Database

Place the CSV data files in `../data/` (relative to the project root), then run:

```bash
npm run seed
```

This will:
1. Create the database tables
2. Parse and clean CSV data (BOM removal, comma-stripped numbers, type casting)
3. Insert all records into Postgres

### Convert Shapefile (already included)

The GeoJSON file is pre-built at `public/us-states.json`. To regenerate:

```bash
npm run convert-shapefile
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with summary stats and sparkline trends |
| `/crime` | Crime & Incarceration Explorer (dual-axis charts, choropleth, data table) |
| `/murder` | Murder Rate Analysis (region trends, death penalty comparison, divergence) |
| `/unemployment` | County Unemployment Explorer (choropleth, histogram, county table) |
| `/correlations` | Cross-Dataset Analysis (scatter plot, paired trend lines) |
| `/api/health` | Health check endpoint with DB status and row counts |

## Datasets

1. **Crime & Incarceration** (816 rows, 51 jurisdictions, 2001-2016)
2. **Murder Rates by Region** (1,870 rows, 1987-2020)
3. **Unemployment by County** (37,674 rows, ~3,200 counties, 2007-2018)
4. **TIGER/Line US State Shapefile** (2019, converted to simplified GeoJSON)

## Deploy

```bash
vercel
```

Ensure `DATABASE_URL` is set in your Vercel project environment variables.
