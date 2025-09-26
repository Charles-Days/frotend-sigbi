'use client';

import { useState } from 'react';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: Record<string, unknown>) => void;
  onSearchChange: (search: string) => void;
  onPageSizeChange: (pageSize: number) => void;
  onExportFiltered: () => void;
  onClearFilters: () => void;
  loading?: boolean;
  totalRecords?: number;
  filteredRecords?: number;
}

const filterFields = [
  { key: 'tipoInmueble', label: 'Tipo de Inmueble', type: 'select', options: ['Normal', 'Especial'] },
  { key: 'estadoActual', label: 'Estado Actual', type: 'select', options: ['Disponible', 'Invadido', 'Ocupado'] },
  { key: 'municipio', label: 'Municipio', type: 'text' },
  { key: 'numeroExpediente', label: 'Número de Expediente', type: 'text' },
  { key: 'volumen', label: 'Volúmen', type: 'text' },
  { key: 'ubicacionRegistral', label: 'Ubicación Registral', type: 'text' },
  { key: 'claveCatastral', label: 'Clave Catastral', type: 'text' },
  { key: 'superficie', label: 'Superficie (m²)', type: 'range', min: 0, max: 10000 },
  { key: 'folioElectronico', label: 'Folio Electrónico', type: 'text' },
  { key: 'destinoInmueble', label: 'Destino del Inmueble', type: 'text' },
  { key: 'nombreOcupante', label: 'Nombre de Ocupante', type: 'text' },
  { key: 'propietario', label: 'Propietario', type: 'text' },
  { key: 'anotacionMarginal', label: 'Anotación Marginal', type: 'text' },
  { key: 'valorCatastral', label: 'Valor Catastral', type: 'range', min: 0, max: 1000000 },
];

export default function AdvancedFilters({
  onFiltersChange,
  onSearchChange,
  onPageSizeChange,
  onExportFiltered,
  onClearFilters,
  loading = false,
  totalRecords = 0,
  filteredRecords = 0
}: AdvancedFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(50);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [showFilterOptions, setShowFilterOptions] = useState<Record<string, boolean>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    onPageSizeChange(value);
  };

  const handleFilterChange = (key: string, value: unknown) => {
    const newFilters = { ...filters };
    if (value === '' || value === null || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleRangeFilterChange = (key: string, min?: number, max?: number) => {
    const newFilters = { ...filters };
    if (min !== undefined || max !== undefined) {
      newFilters[key] = { min, max };
    } else {
      delete newFilters[key];
    }
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setFilters({});
    setSearchTerm('');
    onClearFilters();
  };

  // Contar filtros activos
  const activeFiltersCount = Object.keys(filters).length + (searchTerm ? 1 : 0);

  const renderFilterField = (field: typeof filterFields[0]) => {
    switch (field.type) {
      case 'select':
        return (
          <div className="filter-item">
            <label className="block text-sm font-bold text-gray-900 mb-1">
              {field.label}
            </label>
            <div className="relative">
              <input
                type="text"
                value={(filters[field.key] as string) || ''}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                onFocus={() => setShowFilterOptions(prev => ({ ...prev, [field.key]: true }))}
                onBlur={() => setTimeout(() => setShowFilterOptions(prev => ({ ...prev, [field.key]: false })), 200)}
                placeholder="Todos"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Dropdown de opciones */}
              {showFilterOptions[field.key] && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => handleFilterChange(field.key, '')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150"
                  >
                    <span className="text-gray-900">Todos</span>
                  </button>
                  {field.options?.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleFilterChange(field.key, option)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150"
                    >
                      <span className="text-gray-900">{option}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="filter-item">
            <label className="block text-sm font-bold text-gray-900 mb-1">
              {field.label}
            </label>
            <input
              type="text"
              value={(filters[field.key] as string) || ''}
              onChange={(e) => handleFilterChange(field.key, e.target.value)}
              placeholder={`Buscar en ${field.label}...`}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            />
          </div>
        );

      case 'range':
        return (
          <div className="filter-item">
            <label className="block text-sm font-bold text-gray-900 mb-1">
              {field.label}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Mín"
                value={(filters[field.key] as { min?: number; max?: number })?.min || ''}
                onChange={(e) => handleRangeFilterChange(
                  field.key,
                  e.target.value ? Number(e.target.value) : undefined,
                  (filters[field.key] as { min?: number; max?: number })?.max
                )}
                className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white text-sm"
                min={field.min}
                max={field.max}
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Máx"
                value={(filters[field.key] as { min?: number; max?: number })?.max || ''}
                onChange={(e) => handleRangeFilterChange(
                  field.key,
                  (filters[field.key] as { min?: number; max?: number })?.min,
                  e.target.value ? Number(e.target.value) : undefined
                )}
                className="w-20 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white text-sm"
                min={field.min}
                max={field.max}
              />
              <button
                onClick={() => handleRangeFilterChange(field.key, undefined, undefined)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors duration-200"
                title="Limpiar rango"
              >
                ×
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Búsqueda Global */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Búsqueda Global
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Buscar en: expediente, volúmen, ubicación, municipio, clave catastral, superficie, folio, destino, ocupante, propietario, anotación..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Registros por página
            </label>
            <div className="relative">
              <input
                type="text"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                onFocus={() => setShowFilterOptions(prev => ({ ...prev, pageSize: true }))}
                onBlur={() => setTimeout(() => setShowFilterOptions(prev => ({ ...prev, pageSize: false })), 200)}
                placeholder="Seleccionar..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Dropdown de opciones */}
              {showFilterOptions.pageSize && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {[25, 50, 100, 200].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handlePageSizeChange(size)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150"
                    >
                      <span className="text-gray-900">{size}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros Avanzados */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h4 className="text-lg font-semibold text-gray-900">Filtros Avanzados</h4>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-[#676D47] hover:text-[#5a6140] hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <span>{showAdvancedFilters ? 'Ocultar' : 'Mostrar'} Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium text-white bg-[#676D47] rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {filteredRecords > 0 && (
              <span>
                Mostrando {filteredRecords} de {totalRecords} registros
              </span>
            )}
          </div>
        </div>

        {/* Contenedor colapsable de filtros */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showAdvancedFilters ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {filterFields.map((field) => (
              <div key={field.key}>
                {renderFilterField(field)}
              </div>
            ))}
          </div>

          {/* Controles de Filtros */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onFiltersChange(filters)}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-[#676D47] text-white rounded-lg hover:bg-[#5a6140] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              <span>Aplicar Filtros</span>
            </button>

            <button
              onClick={clearAllFilters}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Limpiar Filtros</span>
            </button>

            <button
              onClick={onExportFiltered}
              disabled={loading || filteredRecords === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Exportar Filtrados</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
