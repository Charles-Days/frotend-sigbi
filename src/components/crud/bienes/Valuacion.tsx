'use client';

import { useEffect, useRef, useState } from 'react';
import { StepProps } from './types';

const getFileName = (url?: string) => {
  if (!url) return '';
  try {
    const parts = url.split('/');
    return parts[parts.length - 1];
  } catch {
    return url;
  }
};

export default function Valuacion({ datos, actualizarDatos, errores, setArchivo }: StepProps) {
  const [openTipo, setOpenTipo] = useState(false);
  const listaRef = useRef<HTMLUListElement | null>(null);
  
  const opciones = [
    { value: 'Para Arrendamiento', label: 'Para Arrendamiento' },
    { value: 'Para donacion', label: 'Para donación' },
    { value: 'Para venta', label: 'Para venta' },
    { value: 'Valor Comercial', label: 'Valor Comercial' },
  ];
  const labels = { 
    'Para Arrendamiento': 'Para Arrendamiento', 
    'Para donacion': 'Para donación', 
    'Para venta': 'Para venta', 
    'Valor Comercial': 'Valor Comercial' 
  } as const;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!listaRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!listaRef.current.parentElement?.contains(e.target)) setOpenTipo(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
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
          <label className="block text-sm font-bold text-gray-900">Tipo de Valuación</label>
          <div className="relative" tabIndex={0}>
            {/* Trigger */}
            <button
              type="button"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent bg-white text-gray-900"
              onClick={() => setOpenTipo((v) => !v)}
            >
              <span className={`truncate ${!datos.tipoValuacion ? 'text-gray-400' : ''}`}>
                {datos.tipoValuacion ? labels[datos.tipoValuacion as keyof typeof labels] : 'Selecciona una opción'}
              </span>
              <svg className={`w-4 h-4 ml-2 transition-transform ${openTipo ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd"/></svg>
            </button>
            {/* Options */}
            {openTipo && (
              <ul
                ref={listaRef}
                className="absolute z-20 mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden"
              >
                {opciones.map((op) => (
                  <li key={op.value}>
                    <button
                      type="button"
                      onClick={() => { actualizarDatos('tipoValuacion', op.value); setOpenTipo(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${datos.tipoValuacion === op.value ? 'bg-green-50 text-[#676D47] font-semibold' : 'text-gray-800'}`}
                    >
                      {op.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">Avalúo en PDF</label>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center px-4 py-2 bg-[#676D47] text-white rounded-md cursor-pointer hover:bg-[#5a6140]">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  // Guardar para envío integrado por FormData
                  setArchivo && setArchivo('valuacion:pdf', file);
                  // Mostrar nombre temporalmente
                  actualizarDatos('pdf', file.name);
                }}
              />
              Subir PDF
            </label>
            {(datos.pdf || datos.pdf_avaluo) && (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                <span className="text-sm text-gray-700 truncate max-w-xs">{getFileName(datos.pdf || datos.pdf_avaluo)}</span>
                {((/https?:\/\//.test(String(datos.pdf || datos.pdf_avaluo))) || String(datos.pdf || datos.pdf_avaluo).startsWith('/api/v1/files/')) && (
                  <a href={(datos.pdf || datos.pdf_avaluo) as string} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Ver</a>
                )}
                <button type="button" onClick={() => actualizarDatos('pdf', '')} className="text-red-600 text-sm hover:underline">Quitar</button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">Solo PDF, máx 10MB.</p>
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
                  href={(datos.pdf || datos.pdf_avaluo) as string} 
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