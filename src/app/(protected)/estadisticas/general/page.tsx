'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardGeneral from '@/components/analytics/DashboardGeneral';
import InmueblesEstadisticas from '@/components/analytics/InmueblesEstadisticas';
import ValuacionesTendencias from '@/components/analytics/ValuacionesTendencias';
import OcupacionDistribucion from '@/components/analytics/OcupacionDistribucion';
import InspeccionesCalendario from '@/components/analytics/InspeccionesCalendario';
import DistribucionGeografica from '@/components/analytics/DistribucionGeografica';
import AnalisisCatastral from '@/components/analytics/AnalisisCatastral';
import CustomChartsBuilder from '@/components/analytics/CustomChartsBuilder';

export default function EstadisticasGeneralesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      const rolesPermitidos = ['Admin', 'Vista', 'Analista'];
      if (!rolesPermitidos.includes(user.roles[0])) {
        router.push('/bienes');
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F1EE' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#676D47] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F1EE' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="mb-2">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Estadísticas Generales</h1>
              <p className="text-lg text-gray-600">Análisis y métricas del sistema de bienes inmuebles</p>
            </div>
            <div className="text-sm text-gray-500">Usuario: {user.username} ({user.roles[0]})</div>
          </div>
        </div>

        <DashboardGeneral />
        <InmueblesEstadisticas />
        <ValuacionesTendencias />
        <OcupacionDistribucion />
        <InspeccionesCalendario />
        <DistribucionGeografica />
        <AnalisisCatastral />

        {/* Builder interactivo para seleccionar métricas/comparaciones/filtros */}
        <CustomChartsBuilder />
      </div>
    </div>
  );
}
