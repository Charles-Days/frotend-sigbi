'use client';

import { useMemo, useState } from 'react';
import CustomChartsDashboard from './CustomChartsDashboard';
import { obtenerEstados, obtenerMunicipios } from '@/constants/estadosMunicipios';

const METRIC_OPTIONS: { value: string; label: string }[] = [
  { value: 'total_inmuebles', label: 'Total de Inmuebles' },
  { value: 'inmuebles_por_estado', label: 'Inmuebles por Estado Actual' },
  { value: 'inmuebles_por_municipio', label: 'Inmuebles por Municipio' },
  { value: 'valuaciones_por_tipo', label: 'Valuaciones por Tipo' },
  { value: 'total_valuaciones', label: 'Total de Valuaciones' },
];

const COMPARISON_OPTIONS: { value: string; label: string }[] = [
  { value: 'ninguna', label: 'Sin comparación' },
  { value: 'mes_actual_vs_anterior', label: 'Mes actual vs anterior' },
  { value: 'anio_actual_vs_anterior', label: 'Año actual vs anterior' },
  { value: 'por_estado', label: 'Por Estado' },
  { value: 'por_municipio', label: 'Por Municipio' },
  { value: 'por_tipo_inmueble', label: 'Por Tipo de Inmueble' },
  { value: 'por_estado_actual', label: 'Por Estado Actual' },
  { value: 'por_estado_aprobacion', label: 'Por Estado Aprobación' },
];

export default function CustomChartsBuilder() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['total_inmuebles', 'inmuebles_por_estado']);
  const [selectedComparison, setSelectedComparison] = useState<string>('ninguna');
  const [estado, setEstado] = useState<string>('');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [selectedMunicipios, setSelectedMunicipios] = useState<string[]>([]);

  const requestBody = useMemo(() => {
    const filtrosGlobales: Record<string, any> = {};
    if (estado) filtrosGlobales.estado = [estado];
    if (fechaInicio) filtrosGlobales.fechaInicio = fechaInicio;
    if (fechaFin) filtrosGlobales.fechaFin = fechaFin;

    const graficas = selectedMetrics.map((metrica) => {
      const g: any = { metrica };
      if (selectedComparison && selectedComparison !== 'ninguna') {
        g.comparacion = selectedComparison;
      }
      // Si se seleccionan municipios, crear una gráfica por municipio
      if (metrica === 'total_inmuebles' && selectedMunicipios.length > 0) {
        return selectedMunicipios.map((municipio) => ({ metrica, titulo: municipio, filtros: { municipio: [municipio] } }));
      }
      return g;
    });

    // Aplanar en caso de que alguna entrada sea array
    const flat = ([] as any[]).concat(...graficas);

    return {
      ...(Object.keys(filtrosGlobales).length > 0 ? { filtrosGlobales } : {}),
      graficas: flat,
    };
  }, [selectedMetrics, selectedComparison, estado, fechaInicio, fechaFin, selectedMunicipios]);

  const toggleMetric = (value: string) => {
    setSelectedMetrics((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Constructor de Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="font-medium text-gray-800 mb-2">Métricas</div>
            <div className="space-y-2 max-h-44 overflow-auto pr-2">
              {METRIC_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-800">
                  <input type="checkbox" checked={selectedMetrics.includes(opt.value)} onChange={() => toggleMetric(opt.value)} />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-800 mb-2">Comparación</div>
            <select
              value={selectedComparison}
              onChange={(e) => setSelectedComparison(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400"
            >
              {COMPARISON_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-gray-800">Filtros Globales</div>
            <select value={estado} onChange={(e) => { setEstado(e.target.value); setSelectedMunicipios([]); }} className="w-full border rounded px-3 py-2 text-sm text-gray-800">
              <option value="">Estado (selecciona)</option>
              {obtenerEstados().map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="border rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400" />
              <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="border rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400" />
            </div>
            <div>
              <div className="text-sm text-gray-700 mb-1">Municipios</div>
              <div className="max-h-32 overflow-auto border rounded p-2">
                {estado && obtenerMunicipios(estado).map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm text-gray-800 py-0.5">
                    <input
                      type="checkbox"
                      checked={selectedMunicipios.includes(m)}
                      onChange={(e) => {
                        setSelectedMunicipios((prev) =>
                          e.target.checked ? [...prev, m] : prev.filter((x) => x !== m)
                        );
                      }}
                    />
                    <span>{m}</span>
                  </label>
                ))}
                {!estado && (
                  <div className="text-xs text-gray-500">Selecciona un estado para ver municipios</div>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1">Consejo: marca "Total de Inmuebles" para comparar municipios seleccionados.</p>
            </div>
          </div>
        </div>
      </div>

      <CustomChartsDashboard requestBody={requestBody} />
    </div>
  );
}


