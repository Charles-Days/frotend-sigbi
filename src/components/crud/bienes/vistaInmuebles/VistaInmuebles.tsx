'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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

interface VistaInmueblesProps {
  bienes: Inmueble[];
  total: number;
  loading: boolean;
  error: string | null;
  onCargarBienes: () => void;
}

export default function VistaInmuebles({ 
  bienes, 
  total, 
  loading, 
  error, 
  onCargarBienes 
}: VistaInmueblesProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(50);

  const params = useMemo(() => {
    const baseParams: Record<string, unknown> = {};
    if (searchTerm) baseParams.search = searchTerm;
    return baseParams;
  }, [searchTerm]);

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
    setSelectedIds(ids);
  };

  const handleSelectAll = () => {
    const allIds = bienes.map(bien => bien.id);
    setSelectedIds(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleRowClick = (inmueble: Inmueble) => {
    // Navegar a la página de edición
    localStorage.setItem('inmuebleId', inmueble.id);
    window.location.href = '/bienes/crear';
  };

  const handleExportFiltered = async () => {
    // Redirigir a la página de reportes para exportar
    window.location.href = '/reportes';
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(0);
  };

  // Limpiar selección cuando cambien los datos
  useEffect(() => {
    setSelectedIds([]);
  }, [bienes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Bienes
          </h1>
          <p className="text-lg text-gray-600">
            Administra el inventario de bienes inmuebles
          </p>
        </div>
        <Link
          href="/bienes/crear?new=1"
          onClick={() => {
            if (typeof window !== 'undefined') {
              try { localStorage.removeItem('inmuebleId'); } catch {}
            }
          }}
          className="bg-[#737B4C] text-white px-6 py-3 rounded-lg hover:bg-[#5a6140] transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Crear Bien</span>
        </Link>
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
    
    </div>
  );
}
