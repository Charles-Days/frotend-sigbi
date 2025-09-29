'use client';

import { useState, useEffect } from 'react';
import RegistroTooltip from '@/components/ui/RegistroTooltip';
import ModalDetalleInmueble from './ModalDetalleInmueble';

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
  // Campos de aprobación
  estadoAprobacion?: string;
  aprobadoPorId?: string | null;
  fechaAprobacion?: string | null;
  comentariosAprobacion?: string | null;
}

interface TablaValidacionProps {
  data: Inmueble[];
  loading?: boolean;
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  onRowClick?: (inmueble: Inmueble) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  enableRowClick?: boolean;
  onAprobar?: (inmuebleId: string, comentarios?: string) => Promise<void>;
  onRechazar?: (inmuebleId: string, comentarios?: string) => Promise<void>;
}

export default function TablaValidacion({
  data,
  loading = false,
  onSort,
  onRowClick,
  onSelectionChange,
  sortField,
  sortOrder = 'asc',
  enableRowClick = true,
  onAprobar,
  onRechazar,
}: TablaValidacionProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedInmueble, setSelectedInmueble] = useState<Inmueble | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Sincronizar con el estado del componente padre
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedIds);
    }
  }, [selectedIds, onSelectionChange]);

  // Actualizar el estado de "Seleccionar todos" cuando cambian los datos o la selección
  useEffect(() => {
    if (data.length === 0) {
      setSelectAll(false);
    } else {
      const allSelected = data.every(item => selectedIds.includes(item.id));
      setSelectAll(allSelected);
    }
  }, [data, selectedIds]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = data.map(item => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => {
        if (!prev.includes(id)) {
          return [...prev, id];
        }
        return prev;
      });
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleSort = (field: string) => {
    if (onSort) {
      const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
      onSort(field, newOrder);
    }
  };

  const handleVerDetalle = (inmueble: Inmueble) => {
    setSelectedInmueble(inmueble);
    setIsModalOpen(true);
  };


  const handleAprobar = async (inmueble: Inmueble) => {
    if (!onAprobar) return;
    
    const comentarios = prompt('Comentarios de aprobación (opcional):');
    if (comentarios === null) return; // Usuario canceló
    
    setProcessingIds(prev => new Set(prev).add(inmueble.id));
    try {
      await onAprobar(inmueble.id, comentarios || undefined);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(inmueble.id);
        return newSet;
      });
    }
  };

  const handleRechazar = async (inmueble: Inmueble) => {
    if (!onRechazar) return;
    
    const comentarios = prompt('Motivo del rechazo (requerido):');
    if (!comentarios || comentarios.trim() === '') {
      alert('Debe proporcionar un motivo para el rechazo');
      return;
    }
    
    setProcessingIds(prev => new Set(prev).add(inmueble.id));
    try {
      await onRechazar(inmueble.id, comentarios);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(inmueble.id);
        return newSet;
      });
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-gray-100 text-gray-800';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
      case 'invadido':
        return 'bg-red-100 text-red-800';
      case 'ocupado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoAprobacionColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE_APROBACION':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APROBADO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'RECHAZADO':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PUBLICADO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BORRADOR':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return <span className="text-gray-400">↕</span>;
    }
    return sortOrder === 'asc' ? 
      <span className="text-[#676D47]">↑</span> : 
      <span className="text-[#676D47]">↓</span>;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#676D47] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay registros</h3>
          <p className="text-gray-500">No se encontraron inmuebles pendientes de validación.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header minimalista */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Inmuebles Pendientes de Validación
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {data.length} {data.length === 1 ? 'registro' : 'registros'} pendientes
              </p>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-[#676D47] focus:ring-[#676D47] border-gray-300 rounded"
                    />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                  onClick={() => handleSort('numeroRegistro')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Expediente</span>
                    <SortIcon field="numeroRegistro" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                  onClick={() => handleSort('tipoInmueble')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Tipo</span>
                    <SortIcon field="tipoInmueble" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                  onClick={() => handleSort('estadoActual')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Estado</span>
                    <SortIcon field="estadoActual" />
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
                  onClick={() => handleSort('municipio')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Municipio</span>
                    <SortIcon field="municipio" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Propietario
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Estado Aprobación
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Progreso
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((inmueble) => (
                <tr 
                  key={inmueble.id} 
                  className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${enableRowClick ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={enableRowClick ? () => onRowClick?.(inmueble) : undefined}
                >
                  <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(inmueble.id)}
                      onChange={(e) => handleSelectRow(inmueble.id, e.target.checked)}
                      className="h-4 w-4 text-[#676D47] focus:ring-[#676D47] border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {inmueble.numeroRegistro || 'Sin número de registro'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {inmueble.observaciones || '—'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-900">
                      {inmueble.tipoInmueble || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getEstadoColor(inmueble.estadoActual || inmueble.estado || '')}`}>
                      {inmueble.estadoActual || inmueble.estado || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-900">
                      {inmueble.localizacion?.municipio || inmueble.camposEspecificos?.['Municipio'] || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-900">
                      {inmueble.camposEspecificos?.['Propietario'] || inmueble.propietario || '—'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getEstadoAprobacionColor(inmueble.estadoAprobacion || '')}`}>
                      {inmueble.estadoAprobacion || 'PENDIENTE_APROBACION'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <RegistroTooltip 
                      completado={inmueble.completado || 0} 
                      pasosFaltantes={inmueble.pasosFaltantes || []}
                      completitudEspecificos={inmueble.completitudEspecificos}
                      completadoPorPasos={inmueble.completadoPorPasos}
                    >
                      <div className="flex items-center space-x-2 cursor-help">
                        {inmueble.completado === 100 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
                            <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Completo
                          </span>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors">
                              <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              En progreso
                            </span>
                            {inmueble.completado && (
                              <span className="text-xs text-gray-500 font-medium">
                                {inmueble.completado}%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </RegistroTooltip>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex space-x-1">
                      {/* Botón Ver - Icono de ojo */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerDetalle(inmueble);
                        }}
                        className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                        title="Ver detalles"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      
                      {/* Botón Aprobar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAprobar(inmueble);
                        }}
                        disabled={processingIds.has(inmueble.id)}
                        className="text-gray-400 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Aprobar inmueble"
                      >
                        {processingIds.has(inmueble.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      
                      {/* Botón Rechazar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRechazar(inmueble);
                        }}
                        disabled={processingIds.has(inmueble.id)}
                        className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Rechazar inmueble"
                      >
                        {processingIds.has(inmueble.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle */}
      <ModalDetalleInmueble
        inmueble={selectedInmueble}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedInmueble(null);
        }}
      />
    </>
  );
}
