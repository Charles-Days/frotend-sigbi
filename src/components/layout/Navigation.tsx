'use client';

import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-[#F5F1EE] border-b border-gray-200 relative z-20" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo y Nombre del Sistema - Lado Izquierdo */}
          <div className="flex items-center space-x-3">
            <Image 
              src="/logobasico.svg" 
              alt="Logo SIGBI" 
              width={120} 
              height={120} 
              className="w-12 sm:w-16 h-auto"
            />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-[#737B4C]">
                SIGBI
              </h1>
              <p className="text-xs sm:text-sm text-[#CDA077] hidden sm:block">
                Sistema de Gestión de Bienes Inmuebles
              </p>
            </div>
          </div>

          {/* Información del Usuario y Acciones - Lado Derecho */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-800">
                {user?.username || 'Usuario'}
              </p>
              <p className="text-xs text-gray-600">
                {user?.roles?.join(', ') || 'Sin rol'}
              </p>
            </div>
            
            {/* Icono de Perfil */}
            <button
              onClick={() => router.push('/perfil')}
              className="p-2 rounded-full text-gray-600 hover:text-[#676D47] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#676D47] transition-colors"
              title="Ver Perfil"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#676D47] hover:bg-[#5a6140] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#676D47] transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
