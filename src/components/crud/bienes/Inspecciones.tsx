'use client';

import { useEffect } from 'react';
import { StepProps } from './types';
// import { uploadFile, uploadMultiple } from '@/services/api';

const getFileName = (url?: string) => {
  if (!url) return '';
  try {
    const parts = url.split('/');
    return parts[parts.length - 1];
  } catch {
    return url;
  }
};

export default function Inspecciones({ datos, actualizarDatos, setArchivo }: StepProps) {
  useEffect(() => {
    // sin logs
  }, [datos]);
  const calcularDiasRestantes = (fecha: string) => {
    const fechaProxima = new Date(fecha);
    const hoy = new Date();
    const diferencia = fechaProxima.getTime() - hoy.getTime();
    const dias = Math.ceil(diferencia / (1000 * 3600 * 24));
    return dias;
  };

  // Normalizar evidencias de backend (array de objetos) o UI (obj con fotos: string[])
  const fotosBackend = Array.isArray((datos as unknown as { evidencias_fotograficas?: Array<{ url: string; originalName?: string }> }).evidencias_fotograficas)
    ? ((datos as unknown as { evidencias_fotograficas: Array<{ url: string; originalName?: string }> }).evidencias_fotograficas)
    : [];
  // const fotosUi = Array.isArray(datos.evidenciasFotograficas?.fotos)
  //   ? (datos.evidenciasFotograficas!.fotos as string[])
  //   : fotosBackend.map((f) => f.url);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#676D47] mb-2">Inspecciones Físicas</h3>
        <p className="text-gray-600">Historial y programación de inspecciones del inmueble</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Responsable de la Inspección
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={255}
              value={datos.responsableInspeccion || datos.responsable_inspeccion || ''}
              onChange={(e) => actualizarDatos('responsableInspeccion', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="Ing. María García"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">👷</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Fecha de Inspección Física del Inmueble
          </label>
          <input
            type="date"
            value={datos.fechaInspeccionFisicaInmueble || datos.fecha_inspeccion_fisica_inmueble || ''}
            onChange={(e) => actualizarDatos('fechaInspeccionFisicaInmueble', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Fecha Próxima Inspección
          </label>
          <input
            type="date"
            value={datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion || ''}
            onChange={(e) => actualizarDatos('fechaProximaInspeccion', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">Evidencias Fotográficas</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center px-4 py-2 bg-[#676D47] text-white rounded-md cursor-pointer hover:bg-[#5a6140]">
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length) return;
                  // Almacenar files para envío al backend
                  if (setArchivo) {
                    setArchivo('inspeccion:evidencias_fotograficas', files as File[]);
                  }
                }}
              />
              Subir evidencias
            </label>
          </div>
          {/* Mostrar evidencias existentes del backend */}
          {Array.isArray(fotosBackend) && fotosBackend.length > 0 && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              {fotosBackend.map((evidencia: { url: string; originalName?: string }, i: number) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                  <span className="text-sm text-gray-700 truncate mr-2">
                    {evidencia.originalName || getFileName(evidencia.url)}
                  </span>
                  <div className="flex items-center gap-3">
                    <a href={evidencia.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Ver</a>
                    <button type="button" className="text-red-600 text-sm hover:underline" onClick={() => {
                      // Remover de la lista (esto requeriría una llamada al backend)
                      console.log('Remover evidencia:', evidencia.url);
                    }}>Quitar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500">Puedes subir imágenes y videos. Se guardarán como evidencias fotográficas.</p>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Observaciones de la Inspección
          </label>
          <textarea
            value={datos.observacionesInspeccion || datos.observaciones_inspeccion || ''}
            onChange={(e) => actualizarDatos('observacionesInspeccion', e.target.value)}
            rows={5}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Inmueble en buenas condiciones..."
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">Informe de Inspección (PDF)</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center px-4 py-2 bg-[#676D47] text-white rounded-md cursor-pointer hover:bg-[#5a6140]">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  // Almacenar file para envío al backend
                  if (setArchivo) {
                    setArchivo('inspeccion:informe_inspeccion', file);
                  }
                }}
              />
              Subir informe
            </label>
            {(datos.informeInspeccion || datos.informe_inspeccion) && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                <span className="text-sm text-gray-700 truncate max-w-xs">{getFileName((datos.informeInspeccion || datos.informe_inspeccion) as string)}</span>
                <a href={(datos.informeInspeccion || datos.informe_inspeccion) as string} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Ver</a>
                <button type="button" onClick={() => actualizarDatos('informeInspeccion', '')} className="text-red-600 text-sm hover:underline">Quitar</button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">Solo PDF, máx 10MB.</p>
        </div>
      </div>

      {/* Inspection status */}
      {(datos.fechaInspeccionFisicaInmueble || datos.fechaProximaInspeccion || datos.responsableInspeccion) && (
        <div className="space-y-4">
          {/* Last inspection */}
          {(datos.fechaInspeccionFisicaInmueble || datos.fecha_inspeccion_fisica_inmueble) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Última Inspección</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <p>📅 <strong>Fecha:</strong> {new Date((datos.fechaInspeccionFisicaInmueble || datos.fecha_inspeccion_fisica_inmueble) as string).toLocaleDateString()}</p>
                {(datos.responsableInspeccion || datos.responsable_inspeccion) && (
                  <p>👷 <strong>Responsable:</strong> {datos.responsableInspeccion || datos.responsable_inspeccion}</p>
                )}
                {(datos.evidenciasFotograficas?.portada || datos.evidencias_fotograficas?.portada) && (
                  <p className="md:col-span-2">
                    📸 <a 
                      href={(datos.evidenciasFotograficas?.portada || datos.evidencias_fotograficas?.portada) as string} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Ver evidencia fotográfica (portada)
                    </a>
                  </p>
                )}
                {(datos.informeInspeccion || datos.informe_inspeccion) && (
                  <p className="md:col-span-2">
                    📄 <a 
                      href={(datos.informeInspeccion || datos.informe_inspeccion) as string} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Ver informe de inspección
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Next inspection */}
          {(datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) && (
            <div className={`border rounded-lg p-4 ${
              calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string) <= 7 
                ? 'bg-red-50 border-red-200' 
                : calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string) <= 30
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-green-50 border-green-200'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string) <= 7 
                  ? 'text-red-800' 
                  : calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string) <= 30
                  ? 'text-yellow-800'
                  : 'text-green-800'
              }`}>
                Próxima Inspección
              </h4>
              <div className={`text-sm ${
                calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string) <= 7 
                  ? 'text-red-700' 
                  : calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string) <= 30
                  ? 'text-yellow-700'
                  : 'text-green-700'
              }`}>
                <p>📅 <strong>Fecha programada:</strong> {new Date((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string).toLocaleDateString()}</p>
                <p>⏰ <strong>Días restantes:</strong> 
                  {calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string) > 0 
                    ? ` ${calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string)} días`
                    : calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string) === 0
                    ? ' ¡Hoy!'
                    : ` Vencida hace ${Math.abs(calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string))} días`
                  }
                  {calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string) <= 7 && calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string) > 0 && ' ⚠️'}
                  {calcularDiasRestantes((datos.fechaProximaInspeccion || datos.fecha_proxima_inspeccion) as string) <= 0 && ' 🚨'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}