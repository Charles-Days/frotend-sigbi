import { ChartData } from "@/types/analytics";

export const parseTotal = (value: unknown): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseInt(value, 10) || 0;
  return 0;
};

export const normalizeChartData = (data: ChartData): ChartData => {
  return {
    ...data,
    metrica: String(data.metrica),
    titulo: String((data as unknown as Record<string, unknown>).titulo ?? data.metrica),
    comparacion: data.comparacion ? String(data.comparacion) : null,
  };
};
