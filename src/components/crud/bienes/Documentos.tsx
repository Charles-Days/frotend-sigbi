'use client';

import { StepProps } from './types';

export default function Documentos({ datos, actualizarDatos, errores }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#676D47] mb-2">Documentos Legales</h3>
        <p className="text-gray-600">Documentos legales y escrituras del inmueble</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Título de Propiedad
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={255}
              value={datos.tituloPropiedad || ''}
              onChange={(e) => actualizarDatos('tituloPropiedad', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="Descripción del título de propiedad"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">📜</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Número de Escritura
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={100}
              value={datos.noEscritura || ''}
              onChange={(e) => actualizarDatos('noEscritura', e.target.value)}
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
            Número de Resolución
          </label>
          <input
            type="text"
            maxLength={100}
            value={datos.noResolucion || ''}
            onChange={(e) => actualizarDatos('noResolucion', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Número de resolución"
          />
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
            Anotación Marginal
          </label>
          <textarea
            value={datos.anotacionMarginal || ''}
            onChange={(e) => actualizarDatos('anotacionMarginal', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Anotaciones marginales del documento..."
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

        {/* Nuevos campos agregados */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Foja
          </label>
          <input
            type="text"
            maxLength={50}
            value={datos.foja || ''}
            onChange={(e) => actualizarDatos('foja', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Número de foja"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Serie
          </label>
          <input
            type="text"
            maxLength={50}
            value={datos.serie || ''}
            onChange={(e) => actualizarDatos('serie', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Serie del documento"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Sección
          </label>
          <input
            type="text"
            maxLength={50}
            value={datos.seccion || ''}
            onChange={(e) => actualizarDatos('seccion', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Sección"
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
            Acto Jurídico
          </label>
          <input
            type="text"
            maxLength={255}
            value={datos.actoJuridico || ''}
            onChange={(e) => actualizarDatos('actoJuridico', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Acto jurídico"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Instrumento de Uso
          </label>
          <input
            type="text"
            maxLength={255}
            value={datos.instrumentoUso || ''}
            onChange={(e) => actualizarDatos('instrumentoUso', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Instrumento que otorga el uso"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Acto Jurídico Anotación
          </label>
          <input
            type="text"
            maxLength={255}
            value={datos.actoJuridicoAnota || ''}
            onChange={(e) => actualizarDatos('actoJuridicoAnota', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Acto jurídico que se registra"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Liga de Referencia
          </label>
          <textarea
            value={datos.ligaReferencia || ''}
            onChange={(e) => actualizarDatos('ligaReferencia', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Liga de referencia del documento..."
          />
        </div>
      </div>

      {/* Document summary */}
      {(datos.noEscritura || datos.fedatarioPublico || datos.fecha) && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-3">Resumen del Documento</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
            {datos.noEscritura && (
              <p>📜 <strong>Escritura:</strong> {datos.noEscritura}</p>
            )}
            {datos.fecha && (
              <p>📅 <strong>Fecha:</strong> {new Date(datos.fecha).toLocaleDateString()}</p>
            )}
            {datos.fedatarioPublico && (
              <p className="md:col-span-2">👨‍💼 <strong>Fedatario:</strong> {datos.fedatarioPublico}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}