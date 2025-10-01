'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { analyticsService, useAnalytics, AnalyticsFilters } from '@/services/analyticsService';
import { useState } from 'react';

interface DistribucionGeograficaData {
  porEstado: Array<{ estado: string; total: number }>;
  porMunicipio: Array<{ municipio: string; total: number }>;
  porEstadoYMunicipio: Array<{ estado: string; municipio: string; total: number }>;
}

export default function DistribucionGeografica({ filters }: { filters?: AnalyticsFilters }) {
  const { data, loading, error } = useAnalytics<DistribucionGeograficaData>(analyticsService.getDistribucionGeografica, filters);
  const [vista, setVista] = useState<'estado' | 'municipio'>('estado');

  if (loading) return <div>Cargando distribución geográfica...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  const chartData = vista === 'estado' ? data.porEstado : data.porMunicipio;
  const dataKey = vista === 'estado' ? 'estado' : 'municipio';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => setVista('estado')} className={`px-3 py-1 rounded border ${vista==='estado'?'bg-[#676D47] text-white':'bg-white text-gray-700'}`}>Por Estado</button>
        <button onClick={() => setVista('municipio')} className={`px-3 py-1 rounded border ${vista==='municipio'?'bg-[#676D47] text-white':'bg-white text-gray-700'}`}>Por Municipio</button>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis type="category" dataKey={dataKey} tick={{ fill: '#374151', fontSize: 12 }} />
          <YAxis type="number" tick={{ fill: '#374151', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: 'white', border: '1px solid #E5E7EB', color: '#111827' }} />
          <Legend wrapperStyle={{ color: '#374151' }} />
          <Bar dataKey="total" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      {Array.isArray(data.porEstadoYMunicipio) && data.porEstadoYMunicipio.length > 0 && (
        <div className="mt-6 overflow-auto">
          <h4 className="font-semibold text-gray-900 mb-2">Top combinaciones Estado/Municipio</h4>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Estado</th>
                <th className="py-2 pr-4">Municipio</th>
                <th className="py-2 pr-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.porEstadoYMunicipio.slice(0, 10).map((item, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="py-2 pr-4">{item.estado}</td>
                  <td className="py-2 pr-4">{item.municipio}</td>
                  <td className="py-2 pr-4">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


