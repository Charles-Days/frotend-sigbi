'use client';

import { useEffect, useState } from 'react';
import VistaReportes from '@/components/crud/bienes/vistaInmuebles/VistaReportes';

export default function ReportesPage() {
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
  };
  
  const [bienes, setBienes] = useState<Inmueble[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarBienes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar proxy interno (incluye JWT desde cookie)
      const res = await fetch(`/api/caracteristicas-inmueble/completitud`, { 
        headers: { 'Content-Type': 'application/json' }, 
        cache: 'no-store' 
      });
      const completitudData = await res.json();
      const registros = completitudData?.data?.registros || [];
      
      // Para reportes: mostrar TODOS los registros (no solo los completos)
      const todosLosRegistros = registros;
      
      // Mapear al formato esperado por la tabla
      type ApiRegistro = {
        inmuebleId: string;
        numeroRegistro: string;
        propietario: string;
        completado: number;
        pasosFaltantes?: string[];
        tipoInmueble?: string;
        estado?: string;
        municipio?: string;
        ultimaActualizacion: string;
        camposEspecificos?: Record<string, string | null>;
        camposFaltantes?: string[];
        completitudEspecificos?: number;
        completadoPorPasos?: number;
        pasos?: Record<string, boolean>;
      };
      
      const bienesMapeados = (todosLosRegistros as ApiRegistro[]).map((registro) => ({
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
        // específicos
        camposEspecificos: registro.camposEspecificos || {},
        camposFaltantes: registro.camposFaltantes || [],
        completitudEspecificos: registro.completitudEspecificos || 0,
        // por pasos
        completadoPorPasos: registro.completadoPorPasos || 0,
        pasos: registro.pasos || {},
      }));

      console.log('[Reportes] Datos cargados para exportación:', bienesMapeados);
      setBienes(bienesMapeados);
      setTotal(bienesMapeados.length);
    } catch (error) {
      console.error('Error al cargar bienes para reportes:', error);
      setError('No se pudieron obtener los inmuebles');
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
        <VistaReportes
          bienes={bienes}
          total={total}
          loading={loading}
          error={error}
          onCargarBienes={cargarBienes}
        />
      </div>
    </div>
  );
}
