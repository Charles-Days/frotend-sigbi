'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
// import api from '@/services/api';
import TablaInmuebles from '@/components/crud/bienes/vistaInmuebles/TablaInmuebles';
import Pagination from '@/components/ui/Pagination';
import Toast from '@/components/ui/Toast';

export default function BienesProgresoPage() {
  type Inmueble = {
    id: string;
    numeroRegistro?: string;
    tipoInmueble?: string;
    propietario?: string;
    estado?: string;
    estadoActual?: string;
    municipio?: string;
    completado?: number;
    pasosFaltantes?: string[];
    camposEspecificos?: Record<string, string | null>;
    completitudEspecificos?: number;
    completadoPorPasos?: number;
    createdAt?: string;
    updatedAt?: string;
    // Campos de aprobación
    estadoAprobacion?: string;
    aprobadoPorId?: string | null;
    fechaAprobacion?: string | null;
    comentariosAprobacion?: string | null;
  };

  const [bienes, setBienes] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(50);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; inmueble: Inmueble | null; mensaje: string }>({ open: false, inmueble: null, mensaje: '' });
  const [showRejected, setShowRejected] = useState<boolean>(false);
  const [rejectedCount, setRejectedCount] = useState<number>(0);
  const [comentariosModal, setComentariosModal] = useState<{ open: boolean; inmueble: Inmueble | null }>({ open: false, inmueble: null });
  const [infoModal, setInfoModal] = useState<{ open: boolean; inmueble: Inmueble | null }>({ open: false, inmueble: null });

  const params = useMemo(() => {
    const baseParams: Record<string, unknown> = {
      page: currentPage,
      pageSize,
    };
    if (searchTerm) baseParams.search = searchTerm;
    if (sortField) baseParams.sortField = sortField;
    if (sortOrder) baseParams.sortOrder = sortOrder;
    return baseParams;
  }, [searchTerm, currentPage, pageSize, sortField, sortOrder]);

  const cargarBienes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Usar proxy interno (incluye JWT desde cookie)
      const qs = new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString();
      const res = await fetch(`/api/caracteristicas-inmueble/completitud?${qs}`, { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' });
      const completitudData = await res.json();
      
      // Debug: Ver qué datos llegan del endpoint
      console.log('🔍 Datos completos del endpoint de completitud:', completitudData);
      console.log('📊 Registros encontrados:', completitudData?.data?.registros);
      
      const registros = completitudData?.data?.registros || [];
      const meta = completitudData?.data?.meta || completitudData?.meta;
      
      // Contar registros rechazados para el icono de notificación
      const registrosRechazados = registros.filter((r: { estadoAprobacion?: string }) => {
        const estadoAprob = String(r?.estadoAprobacion || '').toUpperCase();
        return estadoAprob === 'RECHAZADO';
      });
      setRejectedCount(registrosRechazados.length);
      
      // Filtrar registros según el filtro seleccionado
      let registrosFiltrados = registros;
      
      if (showRejected) {
        // Mostrar solo registros rechazados
        registrosFiltrados = registrosRechazados;
      } else {
        // Mostrar registros incompletos (completado < 100) y que NO estén en flujo de aprobación/publicación
        // EXCLUIR también los rechazados de la vista normal
        registrosFiltrados = registros.filter((r: { completado: number; estadoAprobacion?: string }) => {
          const estadoAprob = String(r?.estadoAprobacion || '').toUpperCase();
          const enAprobacionOPublicado = estadoAprob === 'PENDIENTE_APROBACION' || estadoAprob === 'APROBADO' || estadoAprob === 'PUBLICADO';
          const esRechazado = estadoAprob === 'RECHAZADO';
          return r.completado < 100 && !enAprobacionOPublicado && !esRechazado;
        });
      }
      
      // Debug: Ver registros filtrados
      console.log('🚧 Registros filtrados:', registrosFiltrados);
      
      // Mapear al formato esperado por la tabla
      const bienesEnProgreso = registrosFiltrados.map((registro: { 
        inmuebleId: string; 
        numeroRegistro: string; 
        propietario: string; 
        completado: number; 
        pasosFaltantes?: string[]; 
        tipoInmueble?: string; 
        estado?: string; 
        municipio?: string; 
        estadoActualInmueble?: string;
        camposEspecificos?: Record<string, string | null>;
        completitudEspecificos?: number;
        completadoPorPasos?: number;
        ultimaActualizacion: string;
        // Campos de aprobación
        estadoAprobacion?: string;
        aprobadoPorId?: string | null;
        fechaAprobacion?: string | null;
        comentariosAprobacion?: string | null;
      }) => ({
        id: registro.inmuebleId,
        numeroRegistro: registro.numeroRegistro,
        propietario: registro.propietario,
        completado: registro.completado,
        pasosFaltantes: registro.pasosFaltantes || [],
        tipoInmueble: registro.tipoInmueble,
        estado: registro.estado,
        estadoActual: registro.estadoActualInmueble,
        municipio: registro.municipio,
        camposEspecificos: registro.camposEspecificos || {},
        completitudEspecificos: registro.completitudEspecificos || 0,
        completadoPorPasos: registro.completadoPorPasos || 0,
        createdAt: registro.ultimaActualizacion,
        updatedAt: registro.ultimaActualizacion,
        // Campos de aprobación
        estadoAprobacion: registro.estadoAprobacion,
        aprobadoPorId: registro.aprobadoPorId,
        fechaAprobacion: registro.fechaAprobacion,
        comentariosAprobacion: registro.comentariosAprobacion,
      }));

      setBienes(bienesEnProgreso);
      if (meta) {
        setTotalItems(meta.total ?? registrosFiltrados.length);
        setTotalPages(meta.totalPages ?? Math.ceil((meta.total ?? registrosFiltrados.length) / pageSize));
      } else {
        setTotalItems(registrosFiltrados.length);
        setTotalPages(Math.ceil(registrosFiltrados.length / pageSize));
      }
    } catch (err) {
      console.error('Error al cargar bienes en progreso:', err);
      setError('No se pudieron obtener los inmuebles en progreso');
      setBienes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarBienes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, showRejected]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EE' }}>
      <div className="max-w-7xl mx-auto p-6">
        {toast && (
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        )}
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {showRejected ? 'Bienes Rechazados' : 'Listado de Bienes en Progreso'}
            </h1>
            <p className="text-sm text-gray-600">
              {showRejected ? 'Registros que fueron rechazados en validación' : 'Registros aún no completados'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Selector segmentado */}
            <div className="inline-flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => { setShowRejected(false); setCurrentPage(0); }}
                className={`${!showRejected ? 'bg-[#676D47] text-white' : 'text-gray-700 hover:bg-gray-50'} px-3 py-2 text-sm font-medium transition-colors`}
                aria-pressed={!showRejected}
              >
                En progreso
              </button>
              <div className="h-6 w-px bg-gray-200" aria-hidden="true" />
              <button
                type="button"
                onClick={() => { setShowRejected(true); setCurrentPage(0); }}
                className={`${showRejected ? 'bg-[#676D47] text-white' : 'text-gray-700 hover:bg-gray-50'} px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2`}
                aria-pressed={showRejected}
              >
                Rechazados
                {rejectedCount > 0 && (
                  <span className={`${showRejected ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'} rounded-full px-2 py-0.5 text-xs font-semibold`}>{rejectedCount}</span>
                )}
              </button>
            </div>
            <Link href="/bienes/crear" className="bg-[#737B4C] text-white px-4 py-2 rounded-lg hover:bg-[#5a6140] transition-colors">
              Registrar Bien
            </Link>
          </div>
        </div>

        {/* Buscador global simple */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
            placeholder="Buscar..."
            className="w-full md:w-96 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent bg-white text-gray-900 placeholder-gray-400 caret-gray-900"
          />
        </div>

        {/* Tabla con diseño unificado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <TablaInmuebles
            data={bienes}
            loading={loading}
            onSort={(field, order) => { setSortField(field); setSortOrder(order); }}
            // Deshabilitar navegación por clic en esta vista
            enableRowClick={false}
            sortField={sortField}
            sortOrder={sortOrder}
            onSelectionChange={() => {}}
            showSelection={false}
            onEnviarValidacion={showRejected ? undefined : (inmueble) => {
              // Solo permitir si tiene al menos 80% completado
              if ((inmueble.completado || 0) < 80) {
                setInfoModal({ open: true, inmueble });
                return;
              }
              
              const faltantes = inmueble.pasosFaltantes && inmueble.pasosFaltantes.length > 0
                ? `Aún faltan campos por completar:\n• ${inmueble.pasosFaltantes.join('\n• ')}`
                : '';
              const mensaje = faltantes
                ? `${faltantes}\n\n¿Deseas enviar a validación de todas formas?`
                : '¿Enviar este inmueble a validación?';
              setConfirmModal({ open: true, inmueble, mensaje });
            }}
            onVerComentarios={(inmueble) => {
              setComentariosModal({ open: true, inmueble });
            }}
            showComentarios={showRejected}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            onItemsPerPageChange={(n) => { setPageSize(n); setCurrentPage(0); }}
            loading={loading}
          />
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">{error}</div>
          )}
        </div>
      </div>
      {/* Modal de confirmación personalizado */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmModal({ open: false, inmueble: null, mensaje: '' })}></div>
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Enviar a validación</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{confirmModal.mensaje}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => setConfirmModal({ open: false, inmueble: null, mensaje: '' })}>Cancelar</button>
              <button
                className="px-4 py-2 text-sm rounded-lg text-white bg-amber-600 hover:bg-amber-700"
                onClick={async () => {
                  if (!confirmModal.inmueble) return;
                  try {
                    const resp = await fetch(`/api/v1/caracteristicas-inmueble/${confirmModal.inmueble.id}/cambiar-estado-aprobacion`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ nuevoEstado: 'PENDIENTE_APROBACION', comentarios: null })
                    });
                    if (!resp.ok) {
                      const data = await resp.json().catch(() => ({}));
                      throw new Error(data.message || 'No se pudo enviar a validación');
                    }
                    const data = await resp.json();
                    if (data.success) {
                      setToast({ type: 'success', message: 'Inmueble enviado a validación' });
                      setConfirmModal({ open: false, inmueble: null, mensaje: '' });
                      await cargarBienes();
                    } else {
                      throw new Error(data.message || 'No se pudo enviar a validación');
                    }
                  } catch (err) {
                    setToast({ type: 'error', message: err instanceof Error ? err.message : 'Error al enviar a validación' });
                  }
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Comentarios */}
      {comentariosModal.open && comentariosModal.inmueble && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setComentariosModal({ open: false, inmueble: null })}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Comentarios de {comentariosModal.inmueble.estadoAprobacion === 'APROBADO' ? 'Aprobación' : 'Rechazo'}
              </h3>
              <button
                onClick={() => setComentariosModal({ open: false, inmueble: null })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Registro
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {comentariosModal.inmueble.numeroRegistro || '—'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  comentariosModal.inmueble.estadoAprobacion === 'APROBADO' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {comentariosModal.inmueble.estadoAprobacion === 'APROBADO' ? 'Aprobado' : 'Rechazado'}
                </span>
              </div>
              
              {comentariosModal.inmueble.fechaAprobacion && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de {comentariosModal.inmueble.estadoAprobacion === 'APROBADO' ? 'Aprobación' : 'Rechazo'}
                  </label>
                  <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {new Date(comentariosModal.inmueble.fechaAprobacion).toLocaleString('es-ES')}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {comentariosModal.inmueble.comentariosAprobacion || 'Sin comentarios'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setComentariosModal({ open: false, inmueble: null })}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Información - 80% requerido */}
      {infoModal.open && infoModal.inmueble && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setInfoModal({ open: false, inmueble: null })}></div>
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Completado insuficiente
                </h3>
              </div>
              <button
                onClick={() => setInfoModal({ open: false, inmueble: null })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>No se puede enviar a validación</strong> porque el inmueble tiene solo un <strong>{infoModal.inmueble.completado || 0}%</strong> de completado.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Registro
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {infoModal.inmueble.numeroRegistro || '—'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progreso actual
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${infoModal.inmueble.completado || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {infoModal.inmueble.completado || 0}%
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      Requisito mínimo
                    </p>
                    <p className="text-sm text-blue-700">
                      Se requiere al menos un <strong>80% de completado</strong> para poder enviar el inmueble a validación.
                    </p>
                  </div>
                </div>
              </div>
              
              {infoModal.inmueble.pasosFaltantes && infoModal.inmueble.pasosFaltantes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pasos pendientes
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <ul className="text-sm text-gray-700 space-y-1">
                      {infoModal.inmueble.pasosFaltantes.map((paso, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span>{paso}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setInfoModal({ open: false, inmueble: null })}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Entendido
              </button>
              <button
                onClick={() => {
                  setInfoModal({ open: false, inmueble: null });
                  // Redirigir a editar el inmueble
                  if (infoModal.inmueble) {
                    window.location.href = `/bienes/crear?id=${infoModal.inmueble.id}`;
                  }
                }}
                className="px-4 py-2 text-sm rounded-lg bg-[#676D47] text-white hover:bg-[#5a6140] transition-colors"
              >
                Continuar registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


