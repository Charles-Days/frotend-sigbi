'use client';

import { useState, useEffect } from 'react';
import RegistroTooltip from './RegistroTooltip';

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
  // Campos específicos (opcionales)
  camposEspecificos?: Record<string, string | null>;
  camposFaltantes?: string[];
  completitudEspecificos?: number;
  completadoPorPasos?: number;
}

interface DataTableProps {
  data: Inmueble[];
  loading?: boolean;
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  onRowClick?: (inmueble: Inmueble) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  showViewAction?: boolean; // mostrar/ocultar botón "Ver"
  enableRowClick?: boolean; // habilitar/deshabilitar navegación al hacer clic en la fila
  onEnviarValidacion?: (inmueble: Inmueble) => void; // acción para mandar a validación
}

export default function DataTable({
  data,
  loading = false,
  onSort,
  onRowClick,
  onSelectionChange,
  sortField,
  sortOrder = 'asc',
  showViewAction = true,
  enableRowClick = true,
  onEnviarValidacion,
}: DataTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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

  // En esta tabla, el estado mostrado es el geográfico (estado del país), por lo que no usamos chips de color

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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#676D47] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros</h3>
          <p className="text-gray-500">No se encontraron inmuebles con los filtros aplicados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header de la tabla */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Gestión de Bienes Inmuebles
          </h3>
          <div className="text-sm text-gray-500">
            {data.length} registros
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
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
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('numeroRegistro')}
              >
                <div className="flex items-center space-x-1">
                  <span>Expediente</span>
                  <SortIcon field="numeroRegistro" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('tipoInmueble')}
              >
                <div className="flex items-center space-x-1">
                  <span>Tipo</span>
                  <SortIcon field="tipoInmueble" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('estado')}
              >
                <div className="flex items-center space-x-1">
                  <span>Estado</span>
                  <SortIcon field="estado" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('municipio')}
              >
                <div className="flex items-center space-x-1">
                  <span>Municipio</span>
                  <SortIcon field="municipio" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propietario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volúmen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clave Catastral
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Superficie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Folio Electrónico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progreso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((inmueble) => (
              <tr 
                key={inmueble.id} 
                className={`hover:bg-gray-50 ${enableRowClick ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={enableRowClick ? () => onRowClick?.(inmueble) : undefined}
              >
                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(inmueble.id)}
                    onChange={(e) => handleSelectRow(inmueble.id, e.target.checked)}
                    className="h-4 w-4 text-[#676D47] focus:ring-[#676D47] border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {inmueble.numeroRegistro || 'Sin número de registro'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {inmueble.observaciones || '—'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inmueble.tipoInmueble || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inmueble.estado || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inmueble.localizacion?.municipio || inmueble.camposEspecificos?.['Municipio'] || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inmueble.camposEspecificos?.['Propietario'] || inmueble.propietario || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inmueble.camposEspecificos?.['Volúmen'] || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inmueble.camposEspecificos?.['Clave catastral'] || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inmueble.camposEspecificos?.['Superficie'] || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {inmueble.camposEspecificos?.['Folio electrónico'] || '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <RegistroTooltip 
                  completado={inmueble.completado || 0} 
                  pasosFaltantes={inmueble.pasosFaltantes || []}
                  completitudEspecificos={inmueble.completitudEspecificos}
                  completadoPorPasos={inmueble.completadoPorPasos}
                >
                    <div className="flex items-center space-x-2 cursor-help">
                      {inmueble.completado === 100 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Completo
                        </span>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {showViewAction && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick?.(inmueble);
                        }}
                        className="text-[#676D47] hover:text-[#5a6140]"
                      >
                        Ver
                      </button>
                    )}
                    {inmueble.completado !== 100 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Guardar el ID del inmueble en localStorage para continuar el registro
                          localStorage.setItem('inmuebleId', inmueble.id);
                          // Navegar a la página de crear/continuar registro
                          window.location.href = '/bienes/crear';
                        }}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Continuar
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Guardar el ID del inmueble en localStorage para editar el registro
                          localStorage.setItem('inmuebleId', inmueble.id);
                          // Navegar a la página de crear/editar registro
                          window.location.href = '/bienes/crear';
                        }}
                        className="text-green-600 hover:text-green-900 font-medium"
                      >
                        Editar
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); onEnviarValidacion?.(inmueble); }}
                      className="text-amber-700 hover:text-amber-900 font-medium"
                    >
                      Mandar a validación
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
