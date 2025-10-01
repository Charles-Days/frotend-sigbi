'use client';

import { StepProps } from './types';

export default function Ocupacion({ datos, actualizarDatos }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#676D47] mb-2">Ocupación</h3>
        <p className="text-gray-600">Información sobre el uso y ocupación actual del inmueble</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            ¿Tiene Señalamiento el Inmueble?
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="senalamientoInmueble"
                checked={datos.senalamientoInmueble === true}
                onChange={() => actualizarDatos('senalamientoInmueble', true)}
                className="w-4 h-4 text-[#676D47] border-gray-300 focus:ring-[#676D47]"
              />
              <span className="text-gray-700">Sí</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="senalamientoInmueble"
                checked={datos.senalamientoInmueble === false}
                onChange={() => actualizarDatos('senalamientoInmueble', false)}
                className="w-4 h-4 text-[#676D47] border-gray-300 focus:ring-[#676D47]"
              />
              <span className="text-gray-700">No</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Nombre del Ocupante
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={255}
              value={datos.nombreOcupante || ''}
              onChange={(e) => actualizarDatos('nombreOcupante', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="Secretaría de Educación, etc."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Tipo de Ocupante
          </label>
          <div className="relative">
            <select
              value={datos.tipoOcupante || ''}
              onChange={(e) => actualizarDatos('tipoOcupante', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
            >
              <option value="" disabled>Selecciona una opción</option>
              <option value="Dependencia">Dependencia</option>
              <option value="Fideicomiso">Fideicomiso</option>
              <option value="Municipio">Municipio</option>
              <option value="Organismo">Organismo</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Espacio Disponible en el Inmueble
          </label>
          <div className="relative">
            <input
              type="text"
              value={datos.espacioDisponibleInmueble || ''}
              onChange={(e) => actualizarDatos('espacioDisponibleInmueble', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="Planta baja disponible para almacén"
            />
          </div>
        </div>
      </div>

      {/* Occupancy summary */}
      {(datos.nombreOcupante || datos.tipoOcupante || datos.espacioDisponibleInmueble) && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-800 mb-3">Estado de Ocupación</h4>
          <div className="space-y-2 text-sm text-orange-700">
            {datos.nombreOcupante && (
              <p>👨‍💼 <strong>Ocupante:</strong> {datos.nombreOcupante}</p>
            )}
            {datos.tipoOcupante && (
              <p>👤 <strong>Tipo:</strong> {datos.tipoOcupante}</p>
            )}
            {datos.espacioDisponibleInmueble && (
              <p>📏 <strong>Espacio Disponible:</strong> {datos.espacioDisponibleInmueble}</p>
            )}
            {datos.senalamientoInmueble !== undefined && (
              <p>📍 <strong>Señalamiento:</strong> {datos.senalamientoInmueble ? 'Sí tiene señalamiento' : 'No tiene señalamiento'}</p>
            )}
          </div>
        </div>
      )}

      {datos.senalamientoInmueble === false && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">ℹ️</span>
            <p className="text-gray-700 text-sm">
              <strong>Sin señalamiento:</strong> Este inmueble no tiene señalamiento especial.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}