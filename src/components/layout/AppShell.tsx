'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const hideNav = pathname?.startsWith('/login');

  if (hideNav) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex flex-col overflow-hidden relative">
      {/* Fondo difuminado para crear profundidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-gray-300/30 pointer-events-none z-10"></div>
      
      <Navigation />
      <div className="flex flex-1 min-h-0 relative z-0">
        {/* Sidebar para desktop */}
        <div className={`hidden lg:block transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'} lg:flex-shrink-0`}>
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        </div>

        {/* Sidebar móvil */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white h-full">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Contenido principal con efecto de elevación */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 relative">
          <div className="lg:hidden p-4 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <main className="flex-1 min-h-0 overflow-auto relative z-10">
            {/* Contenedor con efecto de elevación para el contenido */}
            <div 
              className="h-full bg-white/80 backdrop-blur-sm border border-white/20 rounded-tl-3xl"
              style={{
                boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1), inset 1px 0 0 rgba(255, 255, 255, 0.3)',
                background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.85) 100%)'
              }}
            >
              <div className="h-full overflow-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


