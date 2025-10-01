'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface BitacoraEntry {
  id: string;
  usuarioId: string | null;
  tipoAccion: 'CREAR' | 'EDITAR' | 'ELIMINAR' | 'LOGIN' | 'LOGOUT' | null;
  entidadAfectada: string;
  idEntidad: string | null;
  descripcion: string | null;
  cambiosJson: string | null;
  requestId: string | null;
  ip: string | null;
  userAgent: string | null;
  status: number | null;
  latenciaMs: number | null;
  fecha: string;
}

interface BitacoraResponse {
  success: boolean;
  data: BitacoraEntry[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export default function BitacoraPage() {
  const { user } = useAuth();
  const [bitacora, setBitacora] = useState<BitacoraEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterEntidad, setFilterEntidad] = useState('');
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [selectedEntry, setSelectedEntry] = useState<BitacoraEntry | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Verificar que solo el Admin pueda acceder
  useEffect(() => {
    if (user && !user.roles?.includes('Admin')) {
      window.location.href = '/';
    }
  }, [user]);

  const cargarBitacora = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String(currentPage * pageSize),
        ...(filterEntidad ? { entidad: filterEntidad } : {})
      });

      const response = await fetch(`/api/bitacora?${params}`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('Error al cargar bitácora');
      }

      const result: BitacoraResponse = await response.json();
      setBitacora(result.data || []);
      setTotalRegistros(result.meta?.total || 0);
    } catch (error) {
      console.error('Error al cargar bitácora:', error);
      setBitacora([]);
      setTotalRegistros(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarBitacora();
  }, [currentPage, pageSize, filterEntidad]);

  const filtrarBitacora = (entrada: BitacoraEntry) => {
    const cumpleBusqueda = !search || 
      entrada.entidadAfectada.toLowerCase().includes(search.toLowerCase()) ||
      (entrada.tipoAccion && entrada.tipoAccion.toLowerCase().includes(search.toLowerCase())) ||
      (entrada.descripcion && entrada.descripcion.toLowerCase().includes(search.toLowerCase()));
    
    const cumpleFecha = !filterDate || 
      new Date(entrada.fecha).toDateString() === new Date(filterDate).toDateString();
    
    const cumpleUsuario = !filterUser || 
      (entrada.descripcion && entrada.descripcion.toLowerCase().includes(filterUser.toLowerCase()));
    
    return cumpleBusqueda && cumpleFecha && cumpleUsuario;
  };

  const bitacoraFiltrada = bitacora.filter(filtrarBitacora);

  const getAccionColor = (accion: string | null) => {
    switch (accion) {
      case 'LOGIN':
        return 'bg-green-100 text-green-800';
      case 'LOGOUT':
        return 'bg-gray-100 text-gray-800';
      case 'CREAR':
        return 'bg-blue-100 text-blue-800';
      case 'EDITAR':
        return 'bg-yellow-100 text-yellow-800';
      case 'ELIMINAR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntidadColor = (entidad: string) => {
    switch (entidad) {
      case 'User':
        return 'bg-purple-100 text-purple-800';
      case 'CaracteristicaInmueble':
        return 'bg-blue-100 text-blue-800';
      case 'HTTP':
        return 'bg-orange-100 text-orange-800';
      case 'AUTH':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const mostrarDetalles = (entrada: BitacoraEntry) => {
    setSelectedEntry(entrada);
    setShowModal(true);
  };

  const parsearCambiosJson = (cambiosJson: string | null) => {
    if (!cambiosJson) return null;
    try {
      return JSON.parse(cambiosJson);
    } catch {
      return null;
    }
  };

  if (!user || !user.roles?.includes('Admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EE' }}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#676D47] mb-2">
                📋 Bitácora del Sistema
              </h1>
              <p className="text-lg text-gray-600">
                Registro de actividades y eventos del sistema
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-semibold">Total de registros:</span> {bitacoraFiltrada.length}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Entidad, acción o descripción..."
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entidad
              </label>
              <select
                value={filterEntidad}
                onChange={(e) => setFilterEntidad(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent text-gray-900"
              >
                <option value="">Todas las entidades</option>
                <option value="User">Usuarios</option>
                <option value="CaracteristicaInmueble">Inmuebles</option>
                <option value="HTTP">Peticiones HTTP</option>
                <option value="AUTH">Autenticación</option>
                <option value="Role">Roles</option>
                <option value="Catastral">Catastral</option>
                <option value="Inspeccion">Inspecciones</option>
                <option value="Juridico">Jurídico</option>
                <option value="NotacionMarginal">Notación Marginal</option>
                <option value="Registral">Registral</option>
                <option value="Valuacion">Valuación</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registros por página
              </label>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent text-gray-900"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Bitácora */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha y Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP / Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Cargando registros...
                    </td>
                  </tr>
                ) : bitacoraFiltrada.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No se encontraron registros
                    </td>
                  </tr>
                ) : (
                  bitacoraFiltrada.map((entrada) => (
                    <tr key={entrada.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(entrada.fecha).toLocaleString('es-MX')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntidadColor(entrada.entidadAfectada)}`}>
                          {entrada.entidadAfectada}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccionColor(entrada.tipoAccion)}`}>
                          {entrada.tipoAccion || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={entrada.descripcion || ''}>
                          {entrada.descripcion || 'Sin descripción'}
                        </div>
                        {entrada.idEntidad && (
                          <div className="text-xs text-gray-500 mt-1">
                            ID: {entrada.idEntidad.substring(0, 8)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {entrada.ip && <div>IP: {entrada.ip}</div>}
                          {entrada.status && <div>Status: {entrada.status}</div>}
                          {entrada.latenciaMs && <div>Latencia: {entrada.latenciaMs}ms</div>}
                          {!entrada.ip && !entrada.status && <div>N/A</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => mostrarDetalles(entrada)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#676D47]"
                          title="Ver detalles completos"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Mostrando {currentPage * pageSize + 1} a {Math.min((currentPage + 1) * pageSize, totalRegistros)} de {totalRegistros} registros
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Página {currentPage + 1} de {Math.ceil(totalRegistros / pageSize)}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(Math.ceil(totalRegistros / pageSize) - 1, currentPage + 1))}
                disabled={currentPage >= Math.ceil(totalRegistros / pageSize) - 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        {/* Modal de Detalles */}
        {showModal && selectedEntry && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4 flex flex-col">
              {/* Header fijo */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
                <h3 className="text-xl font-semibold text-gray-900">
                  📋 Detalles del Registro de Bitácora
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                  title="Cerrar modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Contenido scrolleable */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información Básica */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Información Básica
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID del Registro</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">{selectedEntry.id}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
                      <p className="mt-1 text-sm text-gray-900">{new Date(selectedEntry.fecha).toLocaleString('es-MX')}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Entidad Afectada</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEntidadColor(selectedEntry.entidadAfectada)}`}>
                        {selectedEntry.entidadAfectada}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo de Acción</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccionColor(selectedEntry.tipoAccion)}`}>
                        {selectedEntry.tipoAccion || 'N/A'}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID de Entidad</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                        {selectedEntry.idEntidad || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Usuario ID</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                        {selectedEntry.usuarioId || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Información Técnica */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      Información Técnica
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Request ID</label>
                      <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">
                        {selectedEntry.requestId || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Dirección IP</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedEntry.ip || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">User Agent</label>
                      <p className="mt-1 text-sm text-gray-900 break-all bg-gray-100 p-2 rounded">
                        {selectedEntry.userAgent || 'N/A'}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status HTTP</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedEntry.status || 'N/A'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Latencia</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedEntry.latenciaMs ? `${selectedEntry.latenciaMs}ms` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Descripción */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <p className="text-sm text-gray-900 bg-gray-100 p-3 rounded">
                    {selectedEntry.descripcion || 'Sin descripción'}
                  </p>
                </div>
                
                {/* Cambios JSON */}
                {selectedEntry.cambiosJson && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cambios Realizados (JSON)</label>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-xs whitespace-pre-wrap">
                        {JSON.stringify(parsearCambiosJson(selectedEntry.cambiosJson), null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer fijo */}
              <div className="flex justify-end p-6 border-t border-gray-200 bg-white flex-shrink-0">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
