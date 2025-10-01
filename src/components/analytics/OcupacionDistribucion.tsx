'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { analyticsService, useAnalytics, AnalyticsFilters } from '@/services/analyticsService';

interface OcupacionDistribucionData {
  totalOcupaciones: number;
  distribucion: {
    porTipoOcupante: Array<{ tipoOcupante: string; total: number }>;
  };
}

export default function OcupacionDistribucion({ filters }: { filters?: AnalyticsFilters }) {
  const { data, loading, error } = useAnalytics<OcupacionDistribucionData>(analyticsService.getOcupacionDistribucion, filters);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) return <div>Cargando distribución de ocupación...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Ocupación</h3>
      <p className="text-sm text-gray-600 mb-2">Total: <span className="font-semibold">{data.totalOcupaciones}</span></p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data.distribucion.porTipoOcupante} dataKey="total" nameKey="tipoOcupante" outerRadius={110} label={(e) => `${(e as unknown as { tipoOcupante: string; total: number }).tipoOcupante}: ${(e as unknown as { tipoOcupante: string; total: number }).total}`}>
            {data.distribucion.porTipoOcupante.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}


