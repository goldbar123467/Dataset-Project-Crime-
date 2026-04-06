import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ratePer100k(count: number, population: number): number {
  if (!population) return 0;
  return Math.round((count / population) * 100000 * 100) / 100;
}

export function formatNumber(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US");
}

export function formatRate(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toFixed(2);
}

export function titleCase(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function parseSearchParamArray(param: string | string[] | undefined): string[] {
  if (!param) return [];
  if (Array.isArray(param)) return param;
  return param.split(",").filter(Boolean);
}

export function parseSearchParamNumber(
  param: string | string[] | undefined,
  fallback: number
): number {
  const val = Array.isArray(param) ? param[0] : param;
  if (!val) return fallback;
  const n = parseInt(val, 10);
  return isNaN(n) ? fallback : n;
}
