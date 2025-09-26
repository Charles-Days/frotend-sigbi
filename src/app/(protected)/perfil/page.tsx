'use client';

import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function PerfilPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#676D47]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No se pudo cargar la información del usuario</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header del perfil */}
          <div className="bg-gradient-to-r from-[#737B4C] to-[#676D47] px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <Image 
                    src="/LogoQuetzal.svg" 
                    alt="Avatar" 
                    width={60} 
                    height={60} 
                    className="w-12 h-12"
                  />
                </div>
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <p className="text-lg opacity-90">Perfil de Usuario</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.roles?.map((role, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Información personal */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Información Personal</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Usuario</label>
                    <p className="mt-1 text-lg text-gray-900">{user.username}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Correo Electrónico</label>
                    <p className="mt-1 text-lg text-gray-900">{user.correo || 'No especificado'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">ID de Usuario</label>
                    <p className="mt-1 text-sm text-gray-500 font-mono">{user.userId || user.sub}</p>
                  </div>
                </div>
              </div>

              {/* Información del sistema */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Información del Sistema</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Roles Asignados</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {user.roles?.map((role, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#CDA077] bg-opacity-10 text-[#CDA077] border border-[#CDA077] border-opacity-30"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Estado de la Cuenta</label>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Activa
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Última Actualización</label>
                    <p className="mt-1 text-sm text-gray-500">
                      {user.exp ? new Date(user.exp * 1000).toLocaleString('es-MX') : 'No disponible'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#676D47] hover:bg-[#5a6140] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#676D47] transition-colors">
                  Editar Perfil
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#676D47] transition-colors">
                  Cambiar Contraseña
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
