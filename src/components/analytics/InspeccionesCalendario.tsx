'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { analyticsService, useAnalytics, AnalyticsFilters } from '@/services/analyticsService';

interface InspeccionesCalendarioData {
  totalInspecciones: number;
  proximasInspecciones: number;
  inspeccionesVencidas: number;
  serieTemporal: Array<{ mes: string; total: number }>;
}

export default function InspeccionesCalendario({ filters }: { filters?: AnalyticsFilters }) {
  const { data, loading, error } = useAnalytics<InspeccionesCalendarioData>(analyticsService.getInspeccionesCalendario, filters);

  if (loading) return <div>Cargando calendario de inspecciones...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Total Inspecciones</div>
          <div className="text-2xl font-semibold">{data.totalInspecciones}</div>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="text-sm text-gray-600">Próximas (90 días)</div>
          <div className="text-2xl font-semibold text-yellow-700">{data.proximasInspecciones}</div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="text-sm text-gray-600">Vencidas</div>
          <div className="text-2xl font-semibold text-red-700">{data.inspeccionesVencidas}</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data.serieTemporal}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="mes" tick={{ fill: '#374151', fontSize: 12 }} />
          <YAxis tick={{ fill: '#374151', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: 'white', border: '1px solid #E5E7EB', color: '#111827' }} />
          <Area type="monotone" dataKey="total" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


