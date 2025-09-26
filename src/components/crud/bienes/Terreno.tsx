'use client';

import { StepProps } from './types';

export default function Terreno({ datos, actualizarDatos, errores }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#676D47] mb-2">Información del Terreno</h3>
        <p className="text-gray-600">Características físicas y dimensiones del terreno</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Superficie
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={datos.superficie || ''}
              onChange={(e) => actualizarDatos('superficie', parseFloat(e.target.value) || undefined)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white ${
                errores.superficie ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">📐</span>
            </div>
          </div>
          {errores.superficie && (
            <p className="text-sm text-red-600">{errores.superficie}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Unidad de Medida
          </label>
          <select
            value={datos.unidadMedida || ''}
            onChange={(e) => actualizarDatos('unidadMedida', e.target.value as 'm²' | 'hectáreas')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          >
            <option value="">Seleccionar unidad</option>
            <option value="m²">m² (metros cuadrados)</option>
            <option value="hectáreas">Hectáreas</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Uso Actual del Terreno
          </label>
          <div className="relative">
            <input
              type="text"
              value={datos.usoActual || ''}
              onChange={(e) => actualizarDatos('usoActual', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="Ej: Residencial, Comercial, Industrial, Agrícola..."
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">🏗️</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Construcción
          </label>
          <textarea
            value={datos.construccion || ''}
            onChange={(e) => actualizarDatos('construccion', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Describa las construcciones existentes en el terreno..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Tipo de Superficie
          </label>
          <input
            type="text"
            value={datos.tipoSuperficie || ''}
            onChange={(e) => actualizarDatos('tipoSuperficie', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Ej: Asfalto, Concreto, Tierra, Grava..."
          />
        </div>
      </div>

      {/* Summary card */}
      {(datos.superficie || datos.unidadMedida || datos.usoActual || datos.construccion || datos.tipoSuperficie) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Resumen del Terreno</h4>
          <div className="space-y-1 text-sm text-green-700">
            {datos.superficie && datos.unidadMedida && (
              <p>📐 <strong>Superficie:</strong> {datos.superficie} {datos.unidadMedida}</p>
            )}
            {datos.usoActual && (
              <p>🏗️ <strong>Uso actual:</strong> {datos.usoActual}</p>
            )}
            {datos.construccion && (
              <p>🏠 <strong>Construcción:</strong> {datos.construccion}</p>
            )}
            {datos.tipoSuperficie && (
              <p>🛣️ <strong>Tipo de Superficie:</strong> {datos.tipoSuperficie}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}