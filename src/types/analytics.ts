export interface ChartData {
  metrica: string;
  titulo: string;
  comparacion: string | null;
  // number para totales; objeto para comparaciones u otros; array para distribuciones/series
  data: number | ChartItem[] | ComparisonData | Record<string, unknown>;
}

export interface ChartItem {
  [key: string]: string | number;
  total: string; // viene como string desde el backend
}

export interface ComparisonData {
  actual: number;
  comparacion: number;
}

export interface CustomChartsResponse {
  success: boolean;
  message: string;
  data: {
    graficas: ChartData[];
    timestamp: string; // ISO
  };
}
