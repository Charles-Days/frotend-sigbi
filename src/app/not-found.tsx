"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-[#F5F1EE] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-200">
          {/* Logo o icono */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-[#676D47] to-[#5A6140] rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Página no encontrada</h2>
          <p className="text-gray-600 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>

          {/* Botones de acción */}
          <div className="space-y-3">
            {user ? (
              <>
                <Link
                  href="/bienes"
                  className="inline-block w-full bg-gradient-to-r from-[#676D47] to-[#5A6140] text-white font-medium py-3 px-6 rounded-lg hover:from-[#5A6140] hover:to-[#4A5130] transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Ver Bienes
                </Link>
                
                <Link
                  href="/"
                  className="inline-block w-full bg-white border-2 border-[#676D47] text-[#676D47] font-medium py-3 px-6 rounded-lg hover:bg-[#676D47] hover:text-white transition-all duration-200 transform hover:scale-105"
                >
                  Ir al Inicio
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-block w-full bg-gradient-to-r from-[#676D47] to-[#5A6140] text-white font-medium py-3 px-6 rounded-lg hover:from-[#5A6140] hover:to-[#4A5130] transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          {/* Información adicional */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Si crees que esto es un error, contacta al administrador del sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
