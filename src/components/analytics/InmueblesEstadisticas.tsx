'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { analyticsService, useAnalytics, AnalyticsFilters } from '@/services/analyticsService';

interface SerieTemporalItem { periodo: string; estadoActualInmueble: string; total: number; }

export default function InmueblesEstadisticas({ filters }: { filters?: AnalyticsFilters }) {
  const { data, loading, error } = useAnalytics<any>(analyticsService.getInmueblesEstadisticas, filters);

  if (loading) return <div>Cargando estadísticas de inmuebles...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  const chartData = (data.serieTemporal as SerieTemporalItem[]).reduce((acc: any[], item: SerieTemporalItem) => {
    const existing = acc.find((x) => x.periodo === item.periodo);
    if (existing) {
      existing[item.estadoActualInmueble] = item.total;
    } else {
      acc.push({ periodo: item.periodo, [item.estadoActualInmueble]: item.total });
    }
    return acc;
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Serie Temporal de Inmuebles</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="periodo" tick={{ fill: '#374151', fontSize: 12 }} />
          <YAxis tick={{ fill: '#374151', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: 'white', border: '1px solid #E5E7EB', color: '#111827' }} />
          <Legend wrapperStyle={{ color: '#374151' }} />
          <Line type="monotone" dataKey="Disponible" stroke="#00C49F" />
          <Line type="monotone" dataKey="Ocupado" stroke="#FFBB28" />
          <Line type="monotone" dataKey="Invadido" stroke="#FF8042" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


