'use client';

import { useEffect, useState } from 'react';
import VistaInmuebles from '@/components/crud/bienes/vistaInmuebles/VistaInmuebles';
import TablaValidacion from '@/components/crud/bienes/vistaInmuebles/TablaValidacion';

export default function BienesValidacionPage() {
  type Inmueble = {
    id: string;
    numeroRegistro?: string;
    tipoInmueble?: string;
    propietario?: string;
    libroRegistro?: string | null;
    observaciones?: string;
    foja?: string | null;
    tomo?: string | null;
    serie?: string | null;
    seccion?: string | null;
    construccion?: string | null;
    estadoActualInmueble?: string;
    tipoSuperficie?: string;
    estado?: string;
    municipio?: string;
    medidasColindancias?: string | null;
    ubicacionRegistral?: string | null;
    ubicacionMaps?: string | null;
    createdAt?: string;
    updatedAt?: string;
    
    // Relaciones incluidas
    juridico?: {
      id?: string | null;
      numeroEscritura?: string | null;
      volumen?: string | null;
      pagina?: string | null;
      fedatarioPublico?: string | null;
      autoridadEmisora?: string | null;
      numeroNotaria?: string | null;
      partesIntervienen?: string | null;
      fecha?: string | null;
      opcionesAdquisicion?: string | null;
      areaResguardante?: string | null;
      secretariasOrganismosAuxiFideico?: string | null;
      superficieEnUso?: string | null;
      fechaFirma?: string | null;
      vigencia?: string | null;
      instrumentoOtorgaUso?: string | null;
      archivoJuridico?: string | null;
      destinoInmueble?: string | null;
      actoJuridico?: string | null;
      instrumentoJuridicoUso?: string | null;
      instrumentoJuridicoAcredita?: string | null;
    } | null;
    
    notacionMarginal?: {
      id?: string | null;
      notacionMarginal?: boolean;
      anotacionMarginal?: string | null;
      instrumentoObjetoAnotacion?: string | null;
      instrumentoGeneral?: string | null;
      ligaReferencia?: string | null;
      relacionMismoRegistro?: string | null;
    } | null;
    
    ocupacionUso?: {
      id?: string | null;
      senalamientoInmueble?: boolean;
      nombreOcupante?: string | null;
      tipoOcupante?: string | null;
      espacioDisponibleInmueble?: string | null;
    } | null;
    
    valuaciones?: Array<{
      id?: string;
      pdf?: string | null;
      [key: string]: string | number | boolean | null | undefined;
    }>;
    
    catastrales?: Array<{
      id?: string;
      planoCatastral?: string | null;
      pdf?: string | null;
      [key: string]: string | number | boolean | null | undefined;
    }>;
    
    registrales?: Array<{
      id?: string;
      certificadoLibertadGravamen?: string | null;
      archivoAntecedenteRegistral?: string | null;
      [key: string]: string | number | boolean | null | undefined;
    }>;
    
    inspecciones?: Array<{
      id?: string;
      evidenciasFotograficas?: string | null;
      informeInspeccion?: string | null;
      [key: string]: string | number | boolean | null | undefined;
    }>;
    
    // Campos para compatibilidad con el sistema actual
    completado?: number;
    pasos?: Record<string, boolean>;
    pasosFaltantes?: string[];
    // Específicos
    camposEspecificos?: Record<string, string | null>;
    camposFaltantes?: string[];
    completitudEspecificos?: number; // porcentaje 0-100
    // Por pasos unificados
    completadoPorPasos?: number; // porcentaje 0-100
    // Campos de aprobación
    estadoAprobacion?: string;
    aprobadoPorId?: string | null;
    fechaAprobacion?: string | null;
    comentariosAprobacion?: string | null;
  };
  
  const [bienes, setBienes] = useState<Inmueble[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Funciones de aprobación
  const handleAprobar = async (inmuebleId: string, comentarios?: string) => {
    try {
      const response = await fetch(`/api/v1/caracteristicas-inmueble/${inmuebleId}/cambiar-estado-aprobacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevoEstado: 'APROBADO',
          comentarios: comentarios || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al aprobar el inmueble');
      }

      const data = await response.json();
      
      if (data.success) {
        alert('Inmueble aprobado exitosamente');
        // Recargar la lista
        await cargarBienes();
      } else {
        throw new Error(data.message || 'Error al aprobar el inmueble');
      }
    } catch (error) {
      console.error('Error al aprobar inmueble:', error);
      alert(error instanceof Error ? error.message : 'Error al aprobar el inmueble');
    }
  };

  const handleRechazar = async (inmuebleId: string, comentarios: string) => {
    try {
      const response = await fetch(`/api/v1/caracteristicas-inmueble/${inmuebleId}/cambiar-estado-aprobacion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nuevoEstado: 'RECHAZADO',
          comentarios: comentarios
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al rechazar el inmueble');
      }

      const data = await response.json();
      
      if (data.success) {
        alert('Inmueble rechazado exitosamente');
        // Recargar la lista
        await cargarBienes();
      } else {
        throw new Error(data.message || 'Error al rechazar el inmueble');
      }
    } catch (error) {
      console.error('Error al rechazar inmueble:', error);
      alert(error instanceof Error ? error.message : 'Error al rechazar el inmueble');
    }
  };

  const cargarBienes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar el nuevo endpoint para inmuebles pendientes de aprobación
      const res = await fetch(`/api/v1/caracteristicas-inmueble/pendientes-aprobacion`, { 
        headers: { 'Content-Type': 'application/json' }, 
        cache: 'no-store' 
      });
      
      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Error al obtener inmuebles pendientes');
      }
      
      const registros = data.data?.data || [];
      
      // Mapear al formato esperado por la tabla
      const bienesEnValidacion = registros.map((registro: any) => ({
        id: registro.id,
        numeroRegistro: registro.numeroRegistro,
        propietario: registro.propietario,
        completado: registro.completitud || 100, // Los pendientes de aprobación están completos
        pasosFaltantes: [],
        tipoInmueble: registro.tipoInmueble,
        estado: registro.estado,
        municipio: registro.municipio,
        estadoActualInmueble: registro.estadoActualInmueble,
        estadoAprobacion: registro.estadoAprobacion,
        aprobadoPorId: registro.aprobadoPorId,
        fechaAprobacion: registro.fechaAprobacion,
        comentariosAprobacion: registro.comentariosAprobacion,
        createdAt: registro.createdAt,
        updatedAt: registro.updatedAt,
        // específicos
        camposEspecificos: {},
        camposFaltantes: [],
        completitudEspecificos: 100,
        // por pasos
        completadoPorPasos: 100,
        pasos: {},
        // Relaciones incluidas
        juridico: registro.juridico,
        catastrales: registro.catastrales,
      }));

      console.log('[Validación] Datos cargados para validación:', bienesEnValidacion);
      setBienes(bienesEnValidacion);
      setTotal(data.data?.total || bienesEnValidacion.length);
    } catch (error) {
      console.error('Error al cargar bienes para validación:', error);
      setError('No se pudieron obtener los inmuebles en validación');
      setBienes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarBienes();
  }, []);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F5F1EE'}}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Validación de Bienes
              </h1>
              <p className="text-lg text-gray-600">
                Revisa y aprueba los inmuebles pendientes de validación
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium">{total}</span> registros pendientes
              </div>
            </div>
          </div>

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

          {/* Tabla de Validación */}
          <TablaValidacion
            data={bienes}
            loading={loading}
            onAprobar={handleAprobar}
            onRechazar={handleRechazar}
          />
        </div>
      </div>
    </div>
  );
}
