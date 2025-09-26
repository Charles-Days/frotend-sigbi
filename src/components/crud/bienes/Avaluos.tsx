'use client';

import { useEffect } from 'react';
import { StepProps } from './types';

export default function Valuacion({ datos, actualizarDatos }: StepProps) {
  useEffect(() => {
    console.log('[Valuacion/UI] Render datos:', datos);
  }, [datos]);
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#676D47] mb-2">Valuación</h3>
        <p className="text-gray-600">Valoraciones y avalúos del inmueble</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Número del Avalúo
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={100}
              value={datos.numeroAvaluo || ''}
              onChange={(e) => actualizarDatos('numeroAvaluo', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="AV-2024-001"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">📄</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Fecha del Avalúo
          </label>
          <input
            type="date"
            value={datos.fechaAvaluo || ''}
            onChange={(e) => actualizarDatos('fechaAvaluo', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Valor Señalado en el Avalúo
          </label>
          <div className="relative">
            <input
              type="text"
              value={datos.valorSenaladoAvaluo || ''}
              onChange={(e) => actualizarDatos('valorSenaladoAvaluo', e.target.value)}
              className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="$1,500,000 MXN"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">💰</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Tipo de Valuación
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength={100}
              value={datos.tipoValuacion || ''}
              onChange={(e) => actualizarDatos('tipoValuacion', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="Valor Comercial, Catastral, Fiscal, Judicial..."
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">📊</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Archivo PDF del Avalúo
          </label>
          <div className="relative">
            <input
              type="url"
              value={datos.pdf || datos.pdf_avaluo || ''}
              onChange={(e) => actualizarDatos('pdf', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="https://ejemplo.com/avaluo.pdf"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 text-sm">📎</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Ingrese la URL del archivo PDF del avalúo
          </p>
        </div>
      </div>

      {/* Valuation summary */}
      {(datos.numeroAvaluo || datos.valorSenaladoAvaluo || datos.tipoValuacion || datos.pdf || datos.pdf_avaluo) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-3">Resumen de Valuación</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {datos.numeroAvaluo && (
              <div className="text-green-700">
                <p className="font-medium">📄 Número de Avalúo</p>
                <p className="font-bold">{datos.numeroAvaluo}</p>
              </div>
            )}
            {datos.fechaAvaluo && (
              <div className="text-green-700">
                <p className="font-medium">📅 Fecha del Avalúo</p>
                <p>{new Date(datos.fechaAvaluo).toLocaleDateString()}</p>
              </div>
            )}
            {datos.valorSenaladoAvaluo && (
              <div className="text-green-700">
                <p className="font-medium">💰 Valor Señalado</p>
                <p className="text-lg font-bold">{datos.valorSenaladoAvaluo}</p>
              </div>
            )}
            {datos.tipoValuacion && (
              <div className="text-green-700">
                <p className="font-medium">📊 Tipo de Valuación</p>
                <p>{datos.tipoValuacion}</p>
              </div>
            )}
          </div>
          
          {(datos.pdf || datos.pdf_avaluo) && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <div className="text-green-700">
                <p className="font-medium">📎 Archivo PDF</p>
                <a 
                  href={datos.pdf || datos.pdf_avaluo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Ver documento de avalúo
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}