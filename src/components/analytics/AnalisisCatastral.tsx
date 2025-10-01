'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { analyticsService, useAnalytics, AnalyticsFilters } from '@/services/analyticsService';

interface AnalisisCatastralData {
  totalCatastrales: number;
  conPlanoCatastral: number;
  sinPlanoCatastral: number;
  distribucionSuperficie: Array<{ tipoSuperficie: string; total: number }>;
}

export default function AnalisisCatastral({ filters }: { filters?: AnalyticsFilters }) {
  const { data, loading, error } = useAnalytics<AnalisisCatastralData>(analyticsService.getAnalisisCatastral, filters);
  const COLORS = ['#00C49F', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) return <div>Cargando análisis catastral...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  const planosData = [
    { name: 'Con Plano Catastral', value: data.conPlanoCatastral || 0 },
    { name: 'Sin Plano Catastral', value: data.sinPlanoCatastral || 0 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis Catastral</h3>
      <p className="text-sm text-gray-600 mb-4">Total de Registros Catastrales: <span className="font-semibold">{data.totalCatastrales}</span></p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Disponibilidad de Planos</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={planosData} dataKey="value" nameKey="name" outerRadius={100} label labelLine={{ stroke: '#9CA3AF' }}>
                {planosData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #E5E7EB', color: '#111827' }} />
              <Legend wrapperStyle={{ color: '#374151' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Distribución por Tipo de Superficie</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={data.distribucionSuperficie} dataKey="total" nameKey="tipoSuperficie" outerRadius={100} label labelLine={{ stroke: '#9CA3AF' }}>
                {data.distribucionSuperficie.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #E5E7EB', color: '#111827' }} />
              <Legend wrapperStyle={{ color: '#374151' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


