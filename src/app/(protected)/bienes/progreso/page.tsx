'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
// import api from '@/services/api';
import DataTable from '@/components/ui/DataTable';
import Pagination from '@/components/ui/Pagination';

export default function BienesProgresoPage() {
  type Inmueble = {
    id: string;
    numeroRegistro?: string;
    tipoInmueble?: string;
    propietario?: string;
    estado?: string;
    municipio?: string;
    completado?: number;
    pasosFaltantes?: string[];
    createdAt?: string;
    updatedAt?: string;
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
      
      // Filtrar solo registros incompletos (completado < 100)
      const registrosIncompletos = registros.filter((r: { completado: number }) => r.completado < 100);
      
      // Debug: Ver registros filtrados
      console.log('🚧 Registros en progreso (completado < 100):', registrosIncompletos);
      
      // Mapear al formato esperado por la tabla
      const bienesEnProgreso = registrosIncompletos.map((registro: { 
        inmuebleId: string; 
        numeroRegistro: string; 
        propietario: string; 
        completado: number; 
        pasosFaltantes?: string[]; 
        tipoInmueble?: string; 
        estado?: string; 
        municipio?: string; 
        ultimaActualizacion: string; 
      }) => ({
        id: registro.inmuebleId,
        numeroRegistro: registro.numeroRegistro,
        propietario: registro.propietario,
        completado: registro.completado,
        pasosFaltantes: registro.pasosFaltantes || [],
        tipoInmueble: registro.tipoInmueble,
        estado: registro.estado,
        municipio: registro.municipio,
        createdAt: registro.ultimaActualizacion,
        updatedAt: registro.ultimaActualizacion,
      }));

      setBienes(bienesEnProgreso);
      if (meta) {
        setTotalItems(meta.total ?? registros.length);
        setTotalPages(meta.totalPages ?? Math.ceil((meta.total ?? registros.length) / pageSize));
      } else {
        setTotalItems(registros.length);
        setTotalPages(Math.ceil(registros.length / pageSize));
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
  }, [params]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EE' }}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Listado de Bienes en Progreso</h1>
            <p className="text-sm text-gray-600">Registros aún no completados</p>
          </div>
          <Link href="/bienes/crear" className="bg-[#737B4C] text-white px-4 py-2 rounded-lg hover:bg-[#5a6140] transition-colors">
            Registrar Bien
          </Link>
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

        {/* Tabla sin filtros ni exportaciones */}
        <div className="bg-white rounded-xl shadow p-4">
          <DataTable
            data={bienes}
            loading={loading}
            onSort={(field, order) => { setSortField(field); setSortOrder(order); }}
            // Deshabilitar navegación por clic en esta vista
            enableRowClick={false}
            showViewAction={false}
            onSelectionChange={() => {}}
            sortField={sortField}
            sortOrder={sortOrder}
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
    </div>
  );
}


