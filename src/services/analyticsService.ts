"use client";
import { useEffect, useState } from "react";
import axios from "axios";

// Usar endpoints internos de Next.js que actúan como proxy
const API_BASE_URL = "/api/v1/analytics";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export interface AnalyticsFilters {
  fechaInicio?: string;
  fechaFin?: string;
  estado?: string[];
  municipio?: string[];
  tipoInmueble?: ("Normal" | "Especial")[];
  estadoActualInmueble?: ("Disponible" | "Invadido" | "Ocupado")[];
  estadoAprobacion?: (
    | "BORRADOR"
    | "PENDIENTE_APROBACION"
    | "APROBADO"
    | "RECHAZADO"
    | "PUBLICADO"
  )[];
  tipoOcupante?: ("Dependencia" | "Fideicomiso" | "Municipio" | "Organismo")[];
  tipoValuacion?: string[];
  agruparPor?: "dia" | "mes" | "trimestre" | "anio";
}

const buildQueryParams = (filters?: AnalyticsFilters): string => {
  if (!filters) return "";
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const analyticsService = {
  getDashboard: async (filters?: AnalyticsFilters) => {
    const response = await axiosInstance.get(
      `/dashboard${buildQueryParams(filters)}`
    );
    return response.data.data;
  },
  getInmueblesEstadisticas: async (filters?: AnalyticsFilters) => {
    const response = await axiosInstance.get(
      `/inmuebles/estadisticas${buildQueryParams(filters)}`
    );
    return response.data.data;
  },
  getValuacionesTendencias: async (filters?: AnalyticsFilters) => {
    const response = await axiosInstance.get(
      `/valuaciones/tendencias${buildQueryParams(filters)}`
    );
    return response.data.data;
  },
  getOcupacionDistribucion: async (filters?: AnalyticsFilters) => {
    const response = await axiosInstance.get(
      `/ocupacion/distribucion${buildQueryParams(filters)}`
    );
    return response.data.data;
  },
  getInspeccionesCalendario: async (filters?: AnalyticsFilters) => {
    const response = await axiosInstance.get(
      `/inspecciones/calendario${buildQueryParams(filters)}`
    );
    return response.data.data;
  },
  getDistribucionGeografica: async (filters?: AnalyticsFilters) => {
    const response = await axiosInstance.get(
      `/geografico/distribucion${buildQueryParams(filters)}`
    );
    return response.data.data;
  },
  getAnalisisCatastral: async (filters?: AnalyticsFilters) => {
    const response = await axiosInstance.get(
      `/catastral/analisis${buildQueryParams(filters)}`
    );
    return response.data.data;
  },
  postCustomCharts: async (body: unknown) => {
    const response = await axiosInstance.post(`/custom-charts`, body);
    return response.data.data ?? response.data;
  },
};

export function useAnalytics<T>(
  fetchFn: (filters?: AnalyticsFilters) => Promise<T>,
  filters?: AnalyticsFilters
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchFn(filters);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [fetchFn, filters]);

  return { data, loading, error } as const;
}

export function useCustomCharts<TResponse = unknown>(body: unknown) {
  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const result = await analyticsService.postCustomCharts(body);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [body]);

  return { data, loading, error } as const;
}
