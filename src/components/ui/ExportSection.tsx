'use client';

import { useState } from 'react';

interface ExportSectionProps {
  selectedCount: number;
  totalCount: number;
  onExportSelected: (format: 'excel' | 'pdf') => void;
  onExportAll: (format: 'excel' | 'pdf') => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  loading?: boolean;
}

export default function ExportSection({
  selectedCount,
  totalCount,
  onExportSelected,
  onExportAll,
  onSelectAll,
  onDeselectAll,
  loading = false
}: ExportSectionProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'excel' | 'pdf', type: 'selected' | 'all') => {
    setIsExporting(true);
    try {
      if (type === 'selected') {
        await onExportSelected(format);
      } else {
        await onExportAll(format);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        Exportar Datos
      </h4>
      
      {/* Información de selección */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#676D47] text-white">
            {selectedCount} registros seleccionados
          </span>
          <div className="flex space-x-2">
            <button
              onClick={onSelectAll}
              disabled={loading || isExporting}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Seleccionar Todos
            </button>
            <button
              onClick={onDeselectAll}
              disabled={loading || isExporting}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Deseleccionar Todos
            </button>
          </div>
        </div>
      </div>

      {/* Botones de exportación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exportar Seleccionados */}
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900 text-center">Registros Seleccionados</h5>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('excel', 'selected')}
              disabled={loading || isExporting || selectedCount === 0}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span>Excel</span>
            </button>
            <button
              onClick={() => handleExport('pdf', 'selected')}
              disabled={loading || isExporting || selectedCount === 0}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Exportar Todos */}
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900 text-center">Todos los Registros</h5>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('excel', 'all')}
              disabled={loading || isExporting || totalCount === 0}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              <span>Excel</span>
            </button>
            <button
              onClick={() => handleExport('pdf', 'all')}
              disabled={loading || isExporting || totalCount === 0}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )}
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Los archivos se descargarán automáticamente</p>
        {selectedCount === 0 && (
          <p className="text-amber-600 mt-1">
            Selecciona registros para exportar solo los elegidos
          </p>
        )}
      </div>
    </div>
  );
}
