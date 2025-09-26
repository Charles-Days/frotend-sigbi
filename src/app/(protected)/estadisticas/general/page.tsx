'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Importar ApexCharts dinámicamente para evitar problemas de SSR
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function EstadisticasGeneralesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    bienesPorEstado: Array<{ estado: string; cantidad: number }>;
    bienesPorMunicipio: Array<{ municipio: string; cantidad: number }>;
    completitudPromedio: number;
    bienesCompletados: number;
    bienesEnProgreso: number;
    totalBienes: number;
  }>({
    bienesPorEstado: [],
    bienesPorMunicipio: [],
    completitudPromedio: 0,
    bienesCompletados: 0,
    bienesEnProgreso: 0,
    totalBienes: 0
  });

  // Verificar permisos
  useEffect(() => {
    if (!authLoading && user) {
      const rolesPermitidos = ['Admin', 'Vista', 'Analista'];
      if (!rolesPermitidos.includes(user.roles[0])) {
        router.push('/bienes');
        return;
      }
    }
  }, [user, authLoading, router]);

  // Cargar datos de estadísticas
  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        setLoading(true);
        
        // Simular datos por ahora - aquí conectarías con tu API real
        const mockData = {
          bienesPorEstado: [
            { estado: 'Morelos', cantidad: 45 },
            { estado: 'México', cantidad: 32 },
            { estado: 'CDMX', cantidad: 28 },
            { estado: 'Puebla', cantidad: 15 }
          ],
          bienesPorMunicipio: [
            { municipio: 'Cuernavaca', cantidad: 25 },
            { municipio: 'Toluca', cantidad: 18 },
            { municipio: 'Puebla', cantidad: 12 },
            { municipio: 'Tlalnepantla', cantidad: 8 }
          ],
          completitudPromedio: 75,
          bienesCompletados: 85,
          bienesEnProgreso: 35,
          totalBienes: 120
        };
        
        setData(mockData);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) {
      cargarEstadisticas();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#F5F1EE'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#676D47] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Configuración de gráficas
  const chartOptions = {
    chart: {
      type: 'bar' as const,
      toolbar: {
        show: true
      }
    },
    colors: ['#676D47', '#87906a', '#5a6140', '#737B4C'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: [] as string[]
    },
    yaxis: {
      title: {
        text: 'Cantidad'
      }
    },
    legend: {
      position: 'top' as const
    }
  };

  const pieChartOptions = {
    chart: {
      type: 'pie' as const,
      toolbar: {
        show: true
      }
    },
    colors: ['#676D47', '#87906a', '#5a6140', '#737B4C'],
    labels: [] as string[],
    legend: {
      position: 'bottom' as const
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%"
      }
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F5F1EE'}}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Estadísticas Generales
              </h1>
              <p className="text-lg text-gray-600">
                Análisis y métricas del sistema de bienes inmuebles
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Usuario: {user.username} ({user.roles[0]})
            </div>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bienes</p>
                <p className="text-2xl font-semibold text-gray-900">{data.totalBienes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completados</p>
                <p className="text-2xl font-semibold text-gray-900">{data.bienesCompletados}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">En Progreso</p>
                <p className="text-2xl font-semibold text-gray-900">{data.bienesEnProgreso}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completitud Promedio</p>
                <p className="text-2xl font-semibold text-gray-900">{data.completitudPromedio}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfica de barras - Bienes por Estado */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bienes por Estado</h3>
            {typeof window !== 'undefined' && (
              <Chart
                options={{
                  ...chartOptions,
                  xaxis: {
                    categories: data.bienesPorEstado.map((item) => item.estado)
                  }
                }}
                series={[{
                  name: 'Cantidad',
                  data: data.bienesPorEstado.map((item) => item.cantidad)
                }]}
                type="bar"
                height={300}
              />
            )}
          </div>

          {/* Gráfica de barras - Bienes por Municipio */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bienes por Municipio</h3>
            {typeof window !== 'undefined' && (
              <Chart
                options={{
                  ...chartOptions,
                  xaxis: {
                    categories: data.bienesPorMunicipio.map((item) => item.municipio)
                  }
                }}
                series={[{
                  name: 'Cantidad',
                  data: data.bienesPorMunicipio.map((item) => item.cantidad)
                }]}
                type="bar"
                height={300}
              />
            )}
          </div>
        </div>

        {/* Gráfica circular - Distribución de completitud */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Registros</h3>
            {typeof window !== 'undefined' && (
              <Chart
                options={{
                  ...pieChartOptions,
                  labels: ['Completados', 'En Progreso']
                }}
                series={[data.bienesCompletados, data.bienesEnProgreso]}
                type="pie"
                height={300}
              />
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Actividad</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Registros completados</span>
                <span className="text-lg font-semibold text-green-600">{data.bienesCompletados}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Registros en progreso</span>
                <span className="text-lg font-semibold text-yellow-600">{data.bienesEnProgreso}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Completitud promedio</span>
                <span className="text-lg font-semibold text-blue-600">{data.completitudPromedio}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total de registros</span>
                <span className="text-lg font-semibold text-gray-900">{data.totalBienes}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
