'use client';

import { StepProps } from './types';
import { useState } from 'react';

const getFileName = (url?: string) => {
  if (!url) return '';
  try {
    const parts = url.split('/');
    return parts[parts.length - 1];
  } catch {
    return url;
  }
};

export default function Catastral({ datos, actualizarDatos, setArchivo }: StepProps) {
  const [cola, setCola] = useState<{ planoCatastral?: string[]; pdfCatastral?: string[] }>({});
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
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">Plano Catastral</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center px-4 py-2 bg-[#676D47] text-white rounded-md cursor-pointer hover:bg-[#5a6140]">
              <input
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setArchivo?.('catastral:plano_catastral', file);
                  setCola((prev) => ({ ...prev, planoCatastral: [ ...(prev.planoCatastral || []), file.name ] }));
                }}
              />
              Subir archivo
            </label>
            {(Boolean(datos.planoCatastral) || Boolean(datos.plano_catastral)) && (
              <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-800 truncate max-w-xs">{getFileName(datos.planoCatastral || datos.plano_catastral)}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => actualizarDatos('planoCatastral', '')} 
                  className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-200"
                  title="Quitar archivo"
                >
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {Array.isArray(cola.planoCatastral) && cola.planoCatastral.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {cola.planoCatastral.map((n, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                    <span className="text-xs text-gray-700 truncate max-w-xs">En cola: {n}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">PDF o imagen, máx 10MB.</p>
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
          <label className="block text-sm font-bold text-gray-900">Documento Catastral (PDF)</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center px-4 py-2 bg-[#676D47] text-white rounded-md cursor-pointer hover:bg-[#5a6140]">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  // backend espera pdf_catastral
                  setArchivo?.('catastral:pdf_catastral', file);
                  setCola((prev) => ({ ...prev, pdfCatastral: [ ...(prev.pdfCatastral || []), file.name ] }));
                }}
              />
              Subir PDF
            </label>
            {(Boolean(datos.pdfCatastral) || Boolean(datos.pdf_catastral)) && (
              <div className="flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-800 truncate max-w-xs">{getFileName(datos.pdfCatastral || datos.pdf_catastral)}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => actualizarDatos('pdfCatastral', '')} 
                  className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-200"
                  title="Quitar archivo"
                >
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {Array.isArray(cola.pdfCatastral) && cola.pdfCatastral.length > 0 && (
              <div className="flex flex-col gap-2 mt-2">
                {cola.pdfCatastral.map((n, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                    <span className="text-xs text-gray-700 truncate max-w-xs">En cola: {n}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">Solo PDF, máx 10MB.</p>
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
          
          {(Boolean(datos.planoCatastral) || Boolean(datos.plano_catastral) || Boolean(datos.pdfCatastral) || Boolean(datos.pdf_catastral)) && (
            <div className="mt-3 pt-3 border-t border-yellow-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {(Boolean(datos.planoCatastral) || Boolean(datos.plano_catastral)) && (
                  <div className="text-yellow-700">
                    <p className="font-medium">📎 Plano Catastral</p>
                    <a 
                      href={(datos.planoCatastral || datos.plano_catastral) as string} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Ver plano
                    </a>
                  </div>
                )}
                {(Boolean(datos.pdfCatastral) || Boolean(datos.pdf_catastral)) && (
                  <div className="text-yellow-700">
                    <p className="font-medium">📄 PDF Completo</p>
                    <a 
                      href={(datos.pdfCatastral || datos.pdf_catastral) as string} 
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