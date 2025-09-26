'use client';

import { StepProps } from './types';

export default function Juridico({ datos, actualizarDatos, errores: _errores, setArchivo }: StepProps) {
  // marcar como utilizado para evitar warning de linter
  void _errores;
  const getFileName = (url?: string) => {
    if (!url) return '';
    try {
      const parts = url.split('/');
      return parts[parts.length - 1];
    } catch {
      return url;
    }
  };
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#676D47] mb-2">Módulo Jurídico</h3>
        <p className="text-gray-600">Documentos y actos jurídicos del inmueble</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Número de Escritura
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={100}
              value={datos.numeroEscritura || ''}
              onChange={(e) => actualizarDatos('numeroEscritura', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="Número de escritura pública"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">🔢</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Volumen
          </label>
          <input
            type="text"
            maxLength={50}
            value={datos.volumen || ''}
            onChange={(e) => actualizarDatos('volumen', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Volumen"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Página
          </label>
          <input
            type="text"
            maxLength={50}
            value={datos.pagina || ''}
            onChange={(e) => actualizarDatos('pagina', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Página"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Número de Notaría
          </label>
          <input
            type="text"
            maxLength={100}
            value={datos.numeroNotaria || ''}
            onChange={(e) => actualizarDatos('numeroNotaria', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Número de notaría"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Fedatario Público
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={255}
              value={datos.fedatarioPublico || ''}
              onChange={(e) => actualizarDatos('fedatarioPublico', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="Nombre del notario o fedatario público"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">👨‍💼</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Autoridad Emisora
          </label>
          <input
            type="text"
            maxLength={255}
            value={datos.autoridadEmisora || ''}
            onChange={(e) => actualizarDatos('autoridadEmisora', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Autoridad que emitió el documento"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Partes que Intervienen
          </label>
          <textarea
            value={datos.partesIntervienen || ''}
            onChange={(e) => actualizarDatos('partesIntervienen', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Personas o entidades que intervienen en el documento..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Fecha del Documento
          </label>
          <input
            type="date"
            value={datos.fecha || ''}
            onChange={(e) => actualizarDatos('fecha', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Fecha de Firma
          </label>
          <input
            type="date"
            value={datos.fechaFirma || ''}
            onChange={(e) => actualizarDatos('fechaFirma', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Opciones de Adquisición
          </label>
          <textarea
            value={datos.opcionesAdquisicion || ''}
            onChange={(e) => actualizarDatos('opcionesAdquisicion', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Opciones de adquisición del inmueble..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Área Resguardante
          </label>
          <input
            type="text"
            maxLength={255}
            value={datos.areaResguardante || ''}
            onChange={(e) => actualizarDatos('areaResguardante', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Área resguardante"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Secretarías/Organismos Auxiliares/Fideicomiso
          </label>
          <input
            type="text"
            maxLength={255}
            value={datos.secretariasOrganismosAuxiFideico || ''}
            onChange={(e) => actualizarDatos('secretariasOrganismosAuxiFideico', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="SEPLADER, etc."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Superficie en Uso
          </label>
          <input
            type="text"
            value={datos.superficieEnUso || ''}
            onChange={(e) => actualizarDatos('superficieEnUso', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="500 m²"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Vigencia
          </label>
          <input
            type="date"
            value={datos.vigencia || ''}
            onChange={(e) => actualizarDatos('vigencia', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Instrumento que Otorga el Uso
          </label>
          <input
            type="text"
            maxLength={255}
            value={datos.instrumentoOtorgaUso || ''}
            onChange={(e) => actualizarDatos('instrumentoOtorgaUso', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Contrato de comodato, etc."
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">Archivo Jurídico</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center px-4 py-2 bg-[#676D47] text-white rounded-md cursor-pointer hover:bg-[#5a6140]">
              <input
                type="file"
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (setArchivo) {
                    setArchivo('juridico:archivo_juridico', file);
                  }
                  actualizarDatos('archivoJuridico', file.name);
                }}
              />
              Subir archivo
            </label>
            {(datos.archivoJuridico || datos.archivo_juridico) && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                <span className="text-sm text-gray-700 truncate max-w-xs">{getFileName(datos.archivoJuridico || datos.archivo_juridico)}</span>
                <a href={datos.archivoJuridico || datos.archivo_juridico} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Ver</a>
                <button type="button" onClick={() => actualizarDatos('archivoJuridico', '')} className="text-red-600 text-sm hover:underline">Quitar</button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">PDF/DOC máx 10MB.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Destino del Inmueble
          </label>
          <input
            type="text"
            maxLength={255}
            value={datos.destinoInmueble || ''}
            onChange={(e) => actualizarDatos('destinoInmueble', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Oficinas administrativas, etc."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Acto Jurídico
          </label>
          <div className="relative">
            <select
              value={datos.actoJuridico || ''}
              onChange={(e) => actualizarDatos('actoJuridico', e.target.value)}
              className="w-full appearance-none pr-10 pl-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white hover:border-gray-300"
            >
              <option value="">Seleccionar acto</option>
              <option value="Compra o Venta">Compra o Venta</option>
              <option value="Donacion">Donacion</option>
              <option value="Exportacion">Exportacion</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">Instrumento Jurídico de Uso</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center px-4 py-2 bg-[#676D47] text-white rounded-md cursor-pointer hover:bg-[#5a6140]">
              <input
                type="file"
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (setArchivo) {
                    setArchivo('juridico:instrumento_juridico_uso', file);
                  }
                  actualizarDatos('instrumentoJuridicoUso', file.name);
                }}
              />
              Subir documento
            </label>
            {(datos.instrumentoJuridicoUso || datos.instrumento_juridico_uso) && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                <span className="text-sm text-gray-700 truncate max-w-xs">{getFileName(datos.instrumentoJuridicoUso || datos.instrumento_juridico_uso)}</span>
                <a href={datos.instrumentoJuridicoUso || datos.instrumento_juridico_uso} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Ver</a>
                <button type="button" onClick={() => actualizarDatos('instrumentoJuridicoUso', '')} className="text-red-600 text-sm hover:underline">Quitar</button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">PDF/DOC máx 10MB.</p>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">Instrumento Jurídico que Acredita</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center px-4 py-2 bg-[#676D47] text-white rounded-md cursor-pointer hover:bg-[#5a6140]">
              <input
                type="file"
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (setArchivo) {
                    setArchivo('juridico:instrumento_juridico_acredita', file);
                  }
                  actualizarDatos('instrumentoJuridicoAcredita', file.name);
                }}
              />
              Subir documento
            </label>
            {(datos.instrumentoJuridicoAcredita || datos.instrumento_juridico_acredita) && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                <span className="text-sm text-gray-700 truncate max-w-xs">{getFileName(datos.instrumentoJuridicoAcredita || datos.instrumento_juridico_acredita)}</span>
                <a href={datos.instrumentoJuridicoAcredita || datos.instrumento_juridico_acredita} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Ver</a>
                <button type="button" onClick={() => actualizarDatos('instrumentoJuridicoAcredita', '')} className="text-red-600 text-sm hover:underline">Quitar</button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">PDF/DOC máx 10MB.</p>
        </div>
      </div>

      {/* Document summary */}
      {(datos.numeroEscritura || datos.fedatarioPublico || datos.fecha) && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-3">Resumen del Documento Jurídico</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
            {datos.numeroEscritura && (
              <p>📜 <strong>Escritura:</strong> {datos.numeroEscritura}</p>
            )}
            {datos.fecha && (
              <p>📅 <strong>Fecha:</strong> {new Date(datos.fecha).toLocaleDateString()}</p>
            )}
            {datos.fedatarioPublico && (
              <p className="md:col-span-2">👨‍💼 <strong>Fedatario:</strong> {datos.fedatarioPublico}</p>
            )}
            {datos.actoJuridico && (
              <p>⚖️ <strong>Acto Jurídico:</strong> {datos.actoJuridico}</p>
            )}
            {datos.destinoInmueble && (
              <p>🎯 <strong>Destino:</strong> {datos.destinoInmueble}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
