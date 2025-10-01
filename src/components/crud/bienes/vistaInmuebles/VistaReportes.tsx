'use client';

import { useState, useEffect, useRef } from 'react';
import AdvancedFilters from '@/components/ui/AdvancedFilters';
import TablaInmuebles from './TablaInmuebles';
import ExportSection from '@/components/ui/ExportSection';
import Pagination from '@/components/ui/Pagination';

interface Inmueble {
  id: string;
  numeroRegistro?: string;
  tipoInmueble?: string;
  propietario?: string;
  estado?: string;
  estadoActual?: string;
  observaciones?: string;
  localizacion?: { municipio?: string } | null;
  completado?: number;
  pasos?: Record<string, boolean>;
  pasosFaltantes?: string[];
  camposEspecificos?: Record<string, string | null>;
  camposFaltantes?: string[];
  completitudEspecificos?: number;
  completadoPorPasos?: number;
}

interface VistaReportesProps {
  bienes: Inmueble[];
  total: number;
  loading: boolean;
  error: string | null;
  onCargarBienes: () => void;
}

export default function VistaReportes({
  bienes,
  total,
  loading,
  error
}: VistaReportesProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(50);
  const isProgrammaticSelection = useRef(false);


  // Funciones de manejo de eventos
  const handleFiltersChange = (newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(0);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(0);
  };

  const handleSort = (field: string, order: 'asc' | 'desc') => {
    setSortField(field);
    setSortOrder(order);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectionChange = (ids: string[]) => {
    console.log('[VistaReportes] onSelectionChange (desde TablaInmuebles):', ids.length, ids);
    if (isProgrammaticSelection.current) {
      // Ignorar eco del hijo cuando el padre inició la selección
      isProgrammaticSelection.current = false;
      return;
    }
    setSelectedIds((prev) => {
      const sameLength = ids.length === prev.length;
      const sameSet = sameLength && ids.every(id => prev.includes(id));
      return sameSet ? prev : ids;
    });
  };

  const handleSelectAll = () => {
    const allIds = bienes.map(bien => bien.id);
    console.log('[VistaReportes] handleSelectAll click. bienes:', bienes.length, 'ids seleccionados:', allIds.length);
    isProgrammaticSelection.current = true;
    setSelectedIds(allIds);
  };

  const handleDeselectAll = () => {
    console.log('[VistaReportes] handleDeselectAll click');
    isProgrammaticSelection.current = true;
    setSelectedIds([]);
  };

  const handleRowClick = (inmueble: Inmueble) => {
    // Navegar a la página de edición
    localStorage.setItem('inmuebleId', inmueble.id);
    window.location.href = '/bienes/crear';
  };

  // Funciones de exportación
  const handleExportSelected = async (format: 'excel' | 'pdf') => {
    try {
      if (selectedIds.length === 0) {
        return;
      }
      const selectedFields = JSON.parse(sessionStorage.getItem('export_selected_fields') || '[]');
      const endpoint = format === 'excel'
        ? '/api/inmuebles/export/excel'
        : '/api/inmuebles/export/pdf';
      const response = await fetch(endpoint, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ selectedIds, filters, searchTerm, selectedFields }) 
      });
      if (!response.ok) throw new Error('Error al exportar');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_inmuebles_seleccionados_${selectedIds.length}_${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  const handleExportAll = async (format: 'excel' | 'pdf') => {
    try {
      const selectedFields = JSON.parse(sessionStorage.getItem('export_selected_fields') || '[]');
      const endpoint = format === 'excel'
        ? '/api/inmuebles/export/excel'
        : '/api/inmuebles/export/pdf';
      const response = await fetch(endpoint, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ filters, searchTerm, selectedFields }) 
      });
      if (!response.ok) throw new Error('Error al exportar');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_inmuebles_completo_${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  const handleExportFiltered = async () => {
    await handleExportAll('excel');
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(0);
  };

  // Limpiar selección cuando cambien los datos
  useEffect(() => {
    console.log('[VistaReportes] bienes cambiaron. Limpio selección. bienes:', bienes.length);
    setSelectedIds([]);
  }, [bienes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reportes de Bienes
          </h1>
          <p className="text-lg text-gray-600">
            Exporta y genera reportes de los bienes inmuebles
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{total}</span> registros disponibles
          </div>
        </div>
      </div>

      {/* Filtros Avanzados */}
      <AdvancedFilters
        onFiltersChange={handleFiltersChange}
        onSearchChange={handleSearchChange}
        onPageSizeChange={handlePageSizeChange}
        onExportFiltered={handleExportFiltered}
        onClearFilters={handleClearFilters}
        loading={loading}
        totalRecords={total}
        filteredRecords={bienes.length}
      />

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Datos */}
      <TablaInmuebles
        data={bienes}
        loading={loading}
        onSort={handleSort}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
        selectedIdsExternal={selectedIds}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      {/* Paginación */}
      {bienes.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(total / pageSize)}
          totalItems={total}
          itemsPerPage={pageSize}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handlePageSizeChange}
          loading={loading}
        />
      )}

      {/* Sección de Exportación */}
      <div className="mt-8">
        <ExportSection
          selectedCount={selectedIds.length}
          totalCount={total}
          onExportSelected={handleExportSelected}
          onExportAll={handleExportAll}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          loading={loading}
        />
      </div>
    </div>
  );
}
