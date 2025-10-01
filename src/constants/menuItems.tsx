// Constantes y objetos JSON para la aplicación SIGBI
import React from 'react';
import { CircleDashed, Users} from 'lucide-react';

// Interfaz para los elementos del menú
export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
  roles: string[];
  submenu?: MenuItem[];
}

// Ejemplo de objeto JSON para usuarios
export const USER_ROLES = {
  ADMIN: 'Admin',
  CAPTURISTA: 'Capturista',
  ANALISTA: 'Analista',
  VISTA: 'Vista'
} as const;

// Ejemplo de configuración de la aplicación
export const APP_CONFIG = {
  name: 'SIGBI',
  fullName: 'Sistema de Gestión de Bienes Inmuebles',
  version: '1.0.0',
  description: 'Sistema para la gestión de bienes inmuebles del estado de Morelos'
} as const;

// Menús del sistema con iconos SVG
export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'estadisticas',
    label: 'Estadísticas',
    href: '/estadisticas/general',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    roles: ['Admin', 'Vista', 'Analista']
  },
  {
    id: 'bienes',
    label: 'Gestión de Bienes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    roles: ['Admin', 'Capturista', 'Analista', 'Vista'],
    submenu: [
      {
        id: 'bienes-listado',
        label: 'Listado de Bienes',
        href: '/bienes',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
        roles: ['Admin', 'Capturista', 'Analista', 'Vista']
      },
      {
        id: 'bienes-progreso',
        label: 'Listado en Progreso',
        href: '/bienes/progreso',
        icon: <CircleDashed className="w-4 h-4" />,
        roles: ['Admin', 'Capturista', 'Analista', 'Vista']
      },
      {
        id: 'bienes-validacion',
        label: 'Listado en Validación',
        href: '/bienes/validacion',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        roles: ['Admin', 'Analista']
      },
      {
        id: 'bienes-crear',
        label: 'Registrar Bien',
        href: '/bienes/crear',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        ),
        roles: ['Admin', 'Capturista']
      },
      
    ]
  },
  {
    id: 'reportes',
    label: 'Reportes',
    href: '/reportes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    roles: ['Analista', 'Capturista', 'Admin']
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    href: '/users',
    icon: <Users className="w-5 h-5" />,
    roles: ['Admin']
  },
  {
    id: 'bitacora',
    label: 'Bitácora',
    href: '/bitacora',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    roles: ['Admin']
  },
];

// Ejemplo de configuración de API
export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  LOGIN: '/users/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me'
} as const;

// Ejemplo de mensajes del sistema
export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Inicio de sesión exitoso',
    LOGOUT: 'Sesión cerrada correctamente',
    SAVE: 'Datos guardados correctamente'
  },
  ERROR: {
    LOGIN: 'Error en el inicio de sesión',
    NETWORK: 'Error de conexión',
    VALIDATION: 'Error de validación'
  }
} as const;

// Ejemplo de configuración de colores
export const COLORS = {
  PRIMARY: '#737B4C',
  SECONDARY: '#CDA077',
  BACKGROUND: '#F5F1EE',
  CARD: '#5C635B',
  TEXT: '#FFFFFF'
} as const;
