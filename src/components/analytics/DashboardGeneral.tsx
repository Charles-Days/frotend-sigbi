'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { analyticsService, useAnalytics, AnalyticsFilters } from '@/services/analyticsService';

interface DashboardStats {
  totalInmuebles: number;
  distribuciones: {
    porEstado: Array<{ estadoActualInmueble: string; total: number }>;
    porTipo: Array<{ tipoInmueble: string; total: number }>;
    porEstadoAprobacion: Array<{ estadoAprobacion: string; total: number }>;
    topMunicipios: Array<{ municipio: string; total: number }>;
  };
}

export default function DashboardGeneral({ filters }: { filters?: AnalyticsFilters }) {
  const { data, loading, error } = useAnalytics<DashboardStats>(analyticsService.getDashboard, filters);

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  if (loading) return <div>Cargando dashboard...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Total de Inmuebles</h2>
        <p className="text-3xl font-bold text-[#676D47]">{data.totalInmuebles}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado Actual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.distribuciones.porEstado} dataKey="total" nameKey="estadoActualInmueble" outerRadius={110} label labelLine={{ stroke: '#9CA3AF' }}>
                {data.distribuciones.porEstado.map((_e, idx: number) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ color: '#374151' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Municipios</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.distribuciones.topMunicipios}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="municipio" tick={{ fill: '#374151', fontSize: 12 }} />
              <YAxis tick={{ fill: '#374151', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #E5E7EB', color: '#111827' }} />
              <Legend wrapperStyle={{ color: '#374151' }} />
              <Bar dataKey="total" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


