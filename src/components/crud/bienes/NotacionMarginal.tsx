'use client';

import { StepProps } from './types';
import { uploadFile } from '@/services/api';

const getFileName = (url?: string) => {
  if (!url) return '';
  try {
    const parts = url.split('/');
    return parts[parts.length - 1];
  } catch {
    return url;
  }
};

export default function NotacionMarginal({ datos, actualizarDatos, errores, setArchivo }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#676D47] mb-2">Notación Marginal</h3>
        <p className="text-gray-600">Anotaciones especiales y referencias del inmueble</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            ¿Tiene Notación Marginal?
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="notacionMarginal"
                checked={datos.notacionMarginal === true}
                onChange={() => actualizarDatos('notacionMarginal', true)}
                className="w-4 h-4 text-[#676D47] border-gray-300 focus:ring-[#676D47]"
              />
              <span className="text-gray-700">Sí</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="notacionMarginal"
                checked={datos.notacionMarginal === false}
                onChange={() => actualizarDatos('notacionMarginal', false)}
                className="w-4 h-4 text-[#676D47] border-gray-300 focus:ring-[#676D47]"
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        </div>

        {datos.notacionMarginal && (
          <>
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-gray-900">
                Anotación Marginal
              </label>
              <textarea
                value={datos.anotacionMarginal || ''}
                onChange={(e) => actualizarDatos('anotacionMarginal', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 bg-white"
                placeholder="Describa la anotación marginal especial sobre el inmueble..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900">
                Instrumento Objeto de Anotación
              </label>
              <input
                type="text"
                maxLength={255}
                value={datos.instrumentoObjetoAnotacion || ''}
                onChange={(e) => actualizarDatos('instrumentoObjetoAnotacion', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
                placeholder="Escritura complementaria, etc."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900">
                Relación con el Mismo Registro
              </label>
              <input
                type="text"
                maxLength={255}
                value={datos.relacionMismoRegistro || ''}
                onChange={(e) => actualizarDatos('relacionMismoRegistro', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
                placeholder="Relacionado con expediente 456"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-gray-900">Instrumento General</label>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center px-4 py-2 bg-[#676D47] text-white rounded-md cursor-pointer hover:bg-[#5a6140]">
                  <input
                    type="file"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                  setArchivo && setArchivo('notacion_marginal:instrumento_general', file);
                  actualizarDatos('instrumentoGeneral', file.name);
                    }}
                  />
                  Subir instrumento
                </label>
                {(datos.instrumentoGeneral || (datos as any).instrumento_general) && (
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                    <span className="text-sm text-gray-700 truncate max-w-xs">{getFileName(datos.instrumentoGeneral || (datos as any).instrumento_general)}</span>
                    <a href={datos.instrumentoGeneral || (datos as any).instrumento_general} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Ver</a>
                    <button type="button" onClick={() => actualizarDatos('instrumentoGeneral', '')} className="text-red-600 text-sm hover:underline">Quitar</button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">PDF/DOC máx 10MB.</p>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-bold text-gray-900">
                Liga de Referencia
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={datos.ligaReferencia || ''}
                  onChange={(e) => actualizarDatos('ligaReferencia', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
                  placeholder="https://ejemplo.com/referencia"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">🔗</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Summary card */}
      {datos.notacionMarginal && (datos.anotacionMarginal || datos.instrumentoObjetoAnotacion || datos.relacionMismoRegistro) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-3">Resumen de Notación Marginal</h4>
          <div className="space-y-2 text-sm text-amber-700">
            {datos.anotacionMarginal && (
              <p>📝 <strong>Anotación:</strong> {datos.anotacionMarginal}</p>
            )}
            {datos.instrumentoObjetoAnotacion && (
              <p>📜 <strong>Instrumento:</strong> {datos.instrumentoObjetoAnotacion}</p>
            )}
            {datos.relacionMismoRegistro && (
              <p>🔗 <strong>Relación:</strong> {datos.relacionMismoRegistro}</p>
            )}
            {((datos.instrumentoGeneral || (datos as any).instrumento_general) || datos.ligaReferencia) && (
              <div className="pt-2 border-t border-amber-200">
                <h5 className="font-medium text-amber-700 mb-1">Documentos de Referencia</h5>
                {(datos.instrumentoGeneral || (datos as any).instrumento_general) && (
                  <p className="text-amber-600">
                    📎 <a 
                      href={datos.instrumentoGeneral || (datos as any).instrumento_general} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Ver instrumento general
                    </a>
                  </p>
                )}
                {datos.ligaReferencia && (
                  <p className="text-amber-600">
                    🔗 <a 
                      href={datos.ligaReferencia} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Ver referencia
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {datos.notacionMarginal === false && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">ℹ️</span>
            <p className="text-gray-700 text-sm">
              <strong>Sin notación marginal:</strong> Este inmueble no tiene anotaciones marginales especiales.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
