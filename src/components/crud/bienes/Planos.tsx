'use client';

import { StepProps } from './types';

export default function Catastral({ datos, actualizarDatos, errores }: StepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#676D47] mb-2">Información Catastral</h3>
        <p className="text-gray-600">Datos catastrales y técnicos del inmueble</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Dirección del Plano Catastral
          </label>
          <div className="relative">
            <input
              type="text"
              value={datos.direccionPlanoCatastral || ''}
              onChange={(e) => actualizarDatos('direccionPlanoCatastral', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="Av. Hidalgo #123, Centro"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">📋</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Clave Catastral
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={100}
              value={datos.claveCatastral || ''}
              onChange={(e) => actualizarDatos('claveCatastral', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="14-039-001"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">🔢</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Fecha del Plano Catastral
          </label>
          <input
            type="date"
            value={datos.fechaPlanoCatastral || ''}
            onChange={(e) => actualizarDatos('fechaPlanoCatastral', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Valor Catastral
          </label>
          <div className="relative">
            <input
              type="text"
              value={datos.valorCatastral || ''}
              onChange={(e) => actualizarDatos('valorCatastral', e.target.value)}
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="$800,000"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">💰</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Base Gravable
          </label>
          <div className="relative">
            <input
              type="text"
              value={datos.baseGravable || ''}
              onChange={(e) => actualizarDatos('baseGravable', e.target.value)}
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="$750,000"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">💵</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Superficie
          </label>
          <div className="relative">
            <input
              type="text"
              value={datos.superficie || ''}
              onChange={(e) => actualizarDatos('superficie', e.target.value)}
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">📐</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Plano Catastral
          </label>
          <div className="relative">
            <input
              type="url"
              value={datos.planoCatastral || ''}
              onChange={(e) => actualizarDatos('planoCatastral', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="https://ejemplo.com/plano-catastral.pdf"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">📎</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Levantamiento Topográfico
          </label>
          <textarea
            value={datos.levantamientoTopografico || ''}
            onChange={(e) => actualizarDatos('levantamientoTopografico', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Realizado por ing. topógrafo"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Fecha del Levantamiento Topográfico
          </label>
          <input
            type="date"
            value={datos.fechaLevantamientoTopografico || ''}
            onChange={(e) => actualizarDatos('fechaLevantamientoTopografico', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Archivo PDF Completo
          </label>
          <div className="relative">
            <input
              type="url"
              value={datos.pdf || ''}
              onChange={(e) => actualizarDatos('pdf', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="https://ejemplo.com/catastral-completo.pdf"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">📄</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info card */}
      {(datos.claveCatastral || datos.valorCatastral || datos.baseGravable || datos.superficie || datos.levantamientoTopografico) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-3">Información Catastral</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {datos.claveCatastral && (
              <div className="text-yellow-700">
                <p className="font-medium">🔢 Clave Catastral</p>
                <p>{datos.claveCatastral}</p>
              </div>
            )}
            {datos.fechaPlanoCatastral && (
              <div className="text-yellow-700">
                <p className="font-medium">📅 Fecha del Plano</p>
                <p>{new Date(datos.fechaPlanoCatastral).toLocaleDateString()}</p>
              </div>
            )}
            {datos.valorCatastral && (
              <div className="text-yellow-700">
                <p className="font-medium">💰 Valor Catastral</p>
                <p className="font-bold">{datos.valorCatastral}</p>
              </div>
            )}
            {datos.baseGravable && (
              <div className="text-yellow-700">
                <p className="font-medium">💵 Base Gravable</p>
                <p>{datos.baseGravable}</p>
              </div>
            )}
            {datos.superficie && (
              <div className="text-yellow-700">
                <p className="font-medium">📐 Superficie</p>
                <p>{datos.superficie} m²</p>
              </div>
            )}
          </div>
          
          {datos.levantamientoTopografico && (
            <div className="mt-3 pt-3 border-t border-yellow-200">
              <p className="text-yellow-700 text-sm">
                <strong>🏔️ Levantamiento Topográfico:</strong> {datos.levantamientoTopografico}
              </p>
              {datos.fechaLevantamientoTopografico && (
                <p className="text-yellow-700 text-sm mt-1">
                  <strong>📅 Fecha:</strong> {new Date(datos.fechaLevantamientoTopografico).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          
          {(datos.planoCatastral || datos.pdf) && (
            <div className="mt-3 pt-3 border-t border-yellow-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {datos.planoCatastral && (
                  <div className="text-yellow-700">
                    <p className="font-medium">📎 Plano Catastral</p>
                    <a 
                      href={datos.planoCatastral} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Ver plano
                    </a>
                  </div>
                )}
                {datos.pdf && (
                  <div className="text-yellow-700">
                    <p className="font-medium">📄 PDF Completo</p>
                    <a 
                      href={datos.pdf} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Ver documento completo
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}