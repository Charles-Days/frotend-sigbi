'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { analyticsService, useAnalytics, AnalyticsFilters } from '@/services/analyticsService';

interface ValuacionesReciente {
  id: string;
  numeroAvaluo: string;
  valorSenaladoAvaluo: string;
  fechaAvaluo: string;
  tipoValuacion: string;
  caracteristicaInmueble?: {
    municipio: string;
    estado: string;
  };
}

interface ValuacionesTendenciasData {
  totalValuaciones: number;
  distribucion: {
    porTipoValuacion: Array<{ tipoValuacion: string; total: number }>;
  };
  valuacionesRecientes: ValuacionesReciente[];
}

export default function ValuacionesTendencias({ filters }: { filters?: AnalyticsFilters }) {
  const { data, loading, error } = useAnalytics<ValuacionesTendenciasData>(analyticsService.getValuacionesTendencias, filters);

  if (loading) return <div>Cargando tendencias de valuaciones...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Tipo de Valuación</h3>
      <p className="text-sm text-gray-600 mb-4">Total de Valuaciones: <span className="font-semibold">{data.totalValuaciones}</span></p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.distribucion.porTipoValuacion}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="tipoValuacion" tick={{ fill: '#374151', fontSize: 12 }} />
          <YAxis tick={{ fill: '#374151', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: 'white', border: '1px solid #E5E7EB', color: '#111827' }} />
          <Legend wrapperStyle={{ color: '#374151' }} />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {Array.isArray(data.valuacionesRecientes) && data.valuacionesRecientes.length > 0 && (
        <div className="mt-6 overflow-auto">
          <h4 className="font-semibold text-gray-900 mb-2">Valuaciones Recientes</h4>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Número</th>
                <th className="py-2 pr-4">Valor</th>
                <th className="py-2 pr-4">Fecha</th>
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2 pr-4">Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {data.valuacionesRecientes.map((v) => (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{v.numeroAvaluo}</td>
                  <td className="py-2 pr-4">${parseFloat(v.valorSenaladoAvaluo).toLocaleString()}</td>
                  <td className="py-2 pr-4">{new Date(v.fechaAvaluo).toLocaleDateString()}</td>
                  <td className="py-2 pr-4">{v.tipoValuacion}</td>
                  <td className="py-2 pr-4">{v.caracteristicaInmueble?.municipio}, {v.caracteristicaInmueble?.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


