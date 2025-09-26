'use client';

import { StepProps } from './types';

export default function InmuebleEspecial({ datos, actualizarDatos, errores, setArchivo }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#676D47] mb-2">Inmueble Especial</h3>
        <p className="text-gray-600">Registro de inmueble con características particulares</p>
      </div>
      
      {/* Contenido temporal */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">⭐</div>
        <h4 className="text-xl font-semibold text-gray-800 mb-2">Módulo en Desarrollo</h4>
        <p className="text-gray-600 mb-4">
          El componente para inmuebles especiales está en desarrollo.
        </p>
        <div className="bg-white/80 rounded-lg p-4 inline-block">
          <p className="text-sm text-gray-700">
            <strong>Tipo seleccionado:</strong> {datos.tipoInmueble || 'Especial'}
          </p>
        </div>
      </div>

      {/* Información del inmueble */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-4">Información del Inmueble</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Inmueble
            </label>
            <input
              type="text"
              value={datos.tipoInmueble || 'Especial'}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <input
              type="text"
              value="En desarrollo"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 text-xl">ℹ️</div>
          <div>
            <h5 className="font-medium text-blue-800 mb-1">Próximamente</h5>
            <p className="text-sm text-blue-700">
              Este módulo incluirá formularios especializados para inmuebles con características particulares,
              documentación adicional y procesos de validación específicos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
