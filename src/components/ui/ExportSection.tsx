'use client';

import { useEffect, useState } from 'react';

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
  const [availableFields, setAvailableFields] = useState<{ key: string; label: string; category: string }[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<'excel' | 'pdf' | null>(null);
  const [pendingType, setPendingType] = useState<'selected' | 'all' | null>(null);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    const loadFields = async () => {
      try {
        const res = await fetch('/api/caracteristicas-inmueble/campos-exportacion', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const raw = (data?.data || data || []) as Array<{
          key?: string;
          field?: string;
          name?: string;
          id?: string;
          label?: string;
          title?: string;
          category?: string;
          categoria?: string;
        }>;
        const fields = raw.map((it) => {
          const valueFallback: string | undefined = (it as unknown as { value?: string })?.value;
          const key = it.key || it.field || it.name || it.id || valueFallback || '';
          const label = it.label || it.title || String(it.key || it.field || valueFallback || it.name || it.id || '');
          const category = it.category || it.categoria || 'General';
          return { key, label, category };
        }) as { key: string; label: string; category: string }[];
        const unique = fields.filter((f) => !!f.key);
        setAvailableFields(unique);
        // Inicializar selección desde sessionStorage si existe
        const saved = JSON.parse(sessionStorage.getItem('export_selected_fields') || '[]');
        if (Array.isArray(saved) && saved.length > 0) {
          const valid = saved.filter((k: string) => unique.some((f) => f.key === k));
          setSelectedFields(valid);
          setSelectAllChecked(valid.length > 0 && valid.length === unique.length);
        }
      } catch {}
    };
    loadFields();
  }, []);

  const confirmExport = async () => {
    if (!pendingFormat || !pendingType) return;
    setIsExporting(true);
    try {
      sessionStorage.setItem('export_selected_fields', JSON.stringify(selectedFields));
      if (pendingType === 'selected') {
        await onExportSelected(pendingFormat);
      } else {
        await onExportAll(pendingFormat);
      }
      setShowModal(false);
    } finally {
      setIsExporting(false);
      setPendingFormat(null);
      setPendingType(null);
    }
  };

  const handleExport = (format: 'excel' | 'pdf', type: 'selected' | 'all') => {
    // Abrir modal de selección de campos antes de exportar
    // Sincronizar selección con sessionStorage al abrir
    try {
      const saved = JSON.parse(sessionStorage.getItem('export_selected_fields') || '[]');
      if (Array.isArray(saved)) {
        const valid = saved.filter((k: string) => availableFields.some((f) => f.key === k));
        setSelectedFields(valid);
        setSelectAllChecked(valid.length > 0 && valid.length === availableFields.length);
      } else {
        setSelectAllChecked(false);
      }
    } catch {
      setSelectAllChecked(false);
    }
    setPendingFormat(format);
    setPendingType(type);
    setShowModal(true);
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

      {/* Modal de selección de campos */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden mx-4 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Seleccionar campos para exportación</h3>
                <p className="text-sm text-gray-500">{pendingFormat?.toUpperCase()} • {pendingType === 'selected' ? 'Registros seleccionados' : 'Todos los registros'}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                title="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <label className="inline-flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectAllChecked}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSelectAllChecked(checked);
                      if (checked) {
                        setSelectedFields(availableFields.map(f => f.key));
                      } else {
                        setSelectedFields([]);
                      }
                    }}
                    className="h-4 w-4 text-[#676D47] focus:ring-[#676D47] border-gray-300 rounded"
                  />
                  <span>Seleccionar todos</span>
                </label>
                
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-72 overflow-auto border rounded-lg p-3">
                {availableFields.map((f) => (
                  <label key={f.key} className="inline-flex items-center space-x-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(f.key)}
                    onChange={(e) => {
                        const checked = e.target.checked;
                      setSelectedFields((prev) => {
                        const next = checked ? [...prev, f.key] : prev.filter((k) => k !== f.key);
                        setSelectAllChecked(next.length > 0 && next.length === availableFields.length);
                        return next;
                      });
                      }}
                      className="h-4 w-4 text-[#676D47] focus:ring-[#676D47] border-gray-300 rounded"
                    />
                    <span>{f.label}</span>
                    <span className="text-xs text-gray-400">({f.category})</span>
                  </label>
                ))}
                {availableFields.length === 0 && (
                  <div className="text-sm text-gray-500">Cargando campos...</div>
                )}
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={confirmExport}
                disabled={isExporting}
                className="px-4 py-2 bg-[#676D47] text-white rounded-lg hover:bg-[#575d3d] disabled:opacity-50"
              >
                {isExporting ? 'Exportando...' : 'Exportar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
