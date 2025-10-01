'use client';

import { useMemo } from 'react';
import { useCustomCharts } from '@/services/analyticsService';
import { ChartData } from '@/types/analytics';
import { parseTotal, normalizeChartData } from '@/utils/chartUtils';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';

type CustomChartsRequest = {
  filtrosGlobales?: Record<string, unknown>;
  graficas: Array<{
    metrica: string;
    titulo?: string;
    filtros?: Record<string, unknown>;
    comparacion?: string;
  }>;
};

interface ChartResponse {
  graficas?: unknown[];
}

export default function CustomChartsDashboard({ requestBody }: { requestBody: CustomChartsRequest }) {
  const { data, loading, error } = useCustomCharts<ChartResponse>(requestBody);

  const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#737B4C'];

  const charts = useMemo(() => {
    const raw = (data && (data.graficas ?? data)) as unknown;
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') return [raw];
    return [] as unknown[];
  }, [data]);

  if (loading) return <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">Cargando dashboard personalizado...</div>;
  if (error) return <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">Error: {error.message}</div>;
  if (!data) return null;

  const renderChart = (chart: Record<string, unknown>, idx: number) => {
    // Normalizar contract garantizado
    const comparacionValue = chart?.comparacion;
    const dataValue = chart?.data ?? chart?.resultado ?? chart;
    const normalized: ChartData = normalizeChartData({
      metrica: String(chart?.metrica ?? ''),
      titulo: String(chart?.titulo ?? chart?.metrica ?? ''),
      comparacion: typeof comparacionValue === 'string' ? comparacionValue : null,
      data: typeof dataValue === 'number' || Array.isArray(dataValue) || (typeof dataValue === 'object' && dataValue !== null) ? dataValue as number | Record<string, unknown> : {},
    });

    const { metrica, titulo, data, comparacion } = normalized;
    const payload = data;

    // Handler genérico: comparación temporal (actual vs comparación)
    if (payload && typeof payload === 'object' && 'actual' in payload && 'comparacion' in payload) {
      const actualRaw = (payload as Record<string, unknown>).actual;
      const compRaw = (payload as Record<string, unknown>).comparacion;

      const sumArray = (arr: unknown[]): number => {
        if (!Array.isArray(arr)) return 0;
        return arr.reduce((acc: number, it) => acc + (typeof it === 'number' ? it : parseTotal((it as Record<string, unknown>)?.total)), 0);
      };

      const toNumber = (val: unknown): number => {
        if (Array.isArray(val)) return sumArray(val);
        if (typeof val === 'number') return val;
        if (typeof val === 'string') return parseFloat(val) || 0;
        if (val && typeof val === 'object' && 'total' in val) return parseTotal((val as Record<string, unknown>).total);
        return 0;
      };

      const actualVal = toNumber(actualRaw);
      const compVal = toNumber(compRaw);
      const diff = actualVal - compVal;
      const pct = compVal > 0 ? ((diff / compVal) * 100).toFixed(1) : '0.0';
      const miniData = [
        { name: 'Anterior', value: compVal },
        { name: 'Actual', value: actualVal },
      ];
      return (
        <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
          <div className="text-4xl font-bold text-[#676D47]">{actualVal.toLocaleString()}</div>
          <div className={`mt-2 text-sm font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {diff >= 0 ? '↑' : '↓'} {Math.abs(diff).toLocaleString()} ({pct}%)
            {comparacion ? <span className="text-gray-500"> · {String(comparacion)}</span> : null}
          </div>
          <div className="text-xs text-gray-500">Anterior: {compVal.toLocaleString()}</div>
          <div className="mt-3 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={miniData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E5E7EB', color: '#111827' }} />
                <Area type="monotone" dataKey="value" stroke="#676D47" fill="#A7AE88" fillOpacity={0.35} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    }

    switch (metrica) {
      case 'total_inmuebles': {
        const payloadObj = payload as Record<string, unknown>;
        const total = typeof payload === 'number' ? payload : (payloadObj?.total ?? 0);
        return (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
            <div className="text-4xl font-bold text-[#676D47]">{Number(total).toLocaleString()}</div>
          </div>
        );
      }
      case 'inmuebles_por_estado': {
        const payloadObj = payload as Record<string, unknown>;
        const raw = payloadObj?.porEstado || payload;
        const dataSrc = Array.isArray(raw)
          ? raw.map((it: Record<string, unknown>) => ({
              estadoActualInmueble: (it?.estadoActualInmueble as string) ?? 'Sin estado',
              total: parseTotal(it?.total),
            }))
          : [];
        return (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{titulo}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={dataSrc} dataKey="total" nameKey="estadoActualInmueble" outerRadius={110} label={(entry) => `${(entry as unknown as Record<string, unknown>).estadoActualInmueble}: ${(entry as unknown as Record<string, unknown>).total}`} labelLine={{ stroke: '#9CA3AF' }}>
                  {dataSrc?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: '#374151' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      }
      case 'inmuebles_por_municipio': {
        const payloadObj = payload as Record<string, unknown>;
        const raw = payloadObj?.porMunicipio || payload;
        const dataSrc = Array.isArray(raw)
          ? raw.map((it: Record<string, unknown>) => ({
              municipio: (it?.municipio as string) ?? 'Sin municipio',
              total: parseTotal(it?.total),
            }))
          : [];
        return (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{titulo}</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={dataSrc}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="municipio" tick={{ fill: '#374151', fontSize: 12 }} />
                <YAxis tick={{ fill: '#374151', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E5E7EB', color: '#111827' }} />
                <Legend wrapperStyle={{ color: '#374151' }} />
                <Bar dataKey="total" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      }
      case 'valuaciones_por_tipo': {
        const payloadObj = payload as Record<string, unknown>;
        const distribucion = payloadObj?.distribucion as Record<string, unknown> | undefined;
        const raw = distribucion?.porTipoValuacion || payload;
        const dataSrc = Array.isArray(raw)
          ? raw.map((it: Record<string, unknown>) => ({
              tipoValuacion: (it?.tipoValuacion as string) ?? 'Sin tipo',
              total: parseTotal(it?.total),
            }))
          : [];
        return (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{titulo}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataSrc}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="tipoValuacion" tick={{ fill: '#374151', fontSize: 12 }} />
                <YAxis tick={{ fill: '#374151', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid #E5E7EB', color: '#111827' }} />
                <Legend wrapperStyle={{ color: '#374151' }} />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      }
      default: {
        return (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{titulo}</h3>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(payload, null, 2)}</pre>
          </div>
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      {Array.isArray(charts) && charts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">Sin datos para mostrar</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.isArray(charts) ? charts.map((c, idx: number) => renderChart(c as Record<string, unknown>, idx)) : null}
        </div>
      )}
    </div>
  );
}


