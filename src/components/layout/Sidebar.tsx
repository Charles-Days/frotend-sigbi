'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createPortal } from 'react-dom';
import { MENU_ITEMS, MenuItem } from '@/constants/index';

const menuItems: MenuItem[] = MENU_ITEMS;

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set());
  const itemRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const submenuRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cerrar tooltip al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clickedItem) {
        const target = event.target as HTMLElement;
        const isInsideTooltip = target.closest('[data-tooltip]');
        const isInsideSidebar = target.closest('[data-sidebar]');
        
        if (!isInsideTooltip && !isInsideSidebar) {
          closeTooltip();
        }
      }
    };

    if (clickedItem) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [clickedItem]);

  // Cerrar todos los submenús cuando se colapsa el sidebar
  useEffect(() => {
    if (collapsed) {
      setExpandedItems([]);
      setClickedItem(null);
      setHoveredItem(null);
    }
  }, [collapsed]);

  // Controlar el estado de transición
  useEffect(() => {
    if (collapsed) {
      // Al colapsar, ocultar inmediatamente
      setIsTransitioning(false);
    } else {
      // Al expandir, mostrar después de un pequeño delay
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 200); // Delay más corto para que aparezcan más rápido

      return () => clearTimeout(timer);
    }
  }, [collapsed]);

  const toggleExpanded = (itemId: string) => {
    const isCurrentlyExpanded = expandedItems.includes(itemId);
    
    if (isCurrentlyExpanded) {
      // Animación de cierre - más rápida
      setAnimatingItems(prev => new Set(prev).add(itemId));
      setTimeout(() => {
        setExpandedItems(prev => prev.filter(id => id !== itemId));
        setAnimatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 100); // Reducido de 150ms a 100ms
    } else {
      // Animación de apertura - inmediata
      setExpandedItems(prev => [...prev, itemId]);
      // No agregamos delay para la apertura, se muestra inmediatamente
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId); // Removemos inmediatamente para que se muestre
        return newSet;
      });
    }
  };

  const hasAccess = (item: MenuItem): boolean => {
    if (!user?.roles) return false;
    return item.roles.some((role: string) => user.roles?.includes(role));
  };

  const isActive = useCallback((href: string): boolean => {
    return pathname === href;
  }, [pathname]);

  const isParentActive = useCallback((item: MenuItem): boolean => {
    // Si el item principal está activo
    if (item.href && isActive(item.href)) {
      return true;
    }
    
    // Si algún submenú está activo
    if (item.submenu) {
      return item.submenu.some(subItem => subItem.href && isActive(subItem.href));
    }
    
    return false;
  }, [isActive]);

  // Mantener solo expandidos los menús cuyo submenú está activo en la ruta actual
  useEffect(() => {
    const activeParentIds = menuItems
      .filter(item => isParentActive(item) && item.submenu && item.submenu.length > 0)
      .map(item => item.id);
    
    if (!collapsed) {
      // Reemplazar en lugar de mergear para evitar que se quede abierto un menú previo
      setExpandedItems(activeParentIds);
    }
  }, [pathname, collapsed, isParentActive]);

  const updateTooltipPosition = (itemId: string) => {
    const element = itemRefs.current[itemId];
    if (element) {
      const rect = element.getBoundingClientRect();
      setTooltipPosition({
        x: rect.right + 8, // 8px de separación del sidebar
        y: rect.top
      });
    }
  };

  const handleMouseEnter = (itemId: string) => {
    if (collapsed) {
      setHoveredItem(itemId);
      updateTooltipPosition(itemId);
    }
  };

  const handleMouseLeave = () => {
    if (collapsed && !clickedItem) {
      setHoveredItem(null);
    }
  };

  const handleClick = (itemId: string) => {
    if (collapsed) {
      const item = menuItems.find(i => i.id === itemId);
      const hasSubmenu = item?.submenu && item.submenu.length > 0;
      
      if (hasSubmenu) {
        if (clickedItem === itemId) {
          setClickedItem(null);
        } else {
          setClickedItem(itemId);
          updateTooltipPosition(itemId);
        }
      }
    } else {
      toggleExpanded(itemId);
    }
  };

  const closeTooltip = () => {
    setClickedItem(null);
    setHoveredItem(null);
  };

  const renderMenuItem = (item: MenuItem) => {
    if (!hasAccess(item)) return null;

    const isExpanded = expandedItems.includes(item.id);
    const hasSubmenu = item.submenu && item.submenu.length > 0;

    return (
      <div key={item.id} className="relative">
        {hasSubmenu ? (
          <button
            ref={(el) => { itemRefs.current[item.id] = el; }}
            onClick={() => handleClick(item.id)}
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-out transform hover:scale-105 hover:shadow-lg ${
              (isParentActive(item) || ((isExpanded && !collapsed) || (collapsed && clickedItem === item.id)))
                ? 'bg-gradient-to-r from-[#676D47] to-[#5A6140] text-white shadow-xl'
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-[#676D47] hover:shadow-md'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
              <div className="transition-transform duration-200 hover:scale-110">
                {item.icon}
              </div>
              {!collapsed && (
                <span className={`transition-all duration-300 ease-out ${
                  isTransitioning 
                    ? 'opacity-0 translate-x-2' 
                    : 'opacity-100 translate-x-0'
                }`}>
                  {item.label}
                </span>
              )}
            </div>
            {!collapsed && (
              <svg
                className={`w-4 h-4 transition-all duration-300 ease-out ${
                  isTransitioning 
                    ? 'opacity-0 scale-75' 
                    : 'opacity-100 scale-100'
                } ${isExpanded ? 'rotate-180' : ''} hover:scale-110`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        ) : (
          <Link
            ref={(el) => { itemRefs.current[item.id] = el; }}
            href={item.href || '#'}
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
            className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-out transform hover:scale-105 hover:shadow-lg ${
              isActive(item.href || '')
                ? 'bg-gradient-to-r from-[#676D47] to-[#5A6140] text-white shadow-xl'
                : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-[#676D47] hover:shadow-md'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <div className="transition-transform duration-200 hover:scale-110">
              {item.icon}
            </div>
            {!collapsed && (
              <span className={`transition-all duration-300 ease-out ${
                isTransitioning 
                  ? 'opacity-0 translate-x-2' 
                  : 'opacity-100 translate-x-0'
              }`}>
                {item.label}
              </span>
            )}
          </Link>
        )}

        {/* Submenús en modo expandido */}
        {hasSubmenu && isExpanded && !collapsed && (
          <div 
            ref={(el) => { submenuRefs.current[item.id] = el; }}
            className={`ml-6 mt-1 overflow-hidden transition-all duration-200 ease-out ${
              animatingItems.has(item.id) 
                ? 'animate-in slide-in-from-top-2 fade-in-0' 
                : ''
            }`}
            style={{
              maxHeight: animatingItems.has(item.id) ? '0px' : '500px',
              opacity: animatingItems.has(item.id) ? 0 : 1,
            }}
          >
            <div className="space-y-1 py-1">
              {item.submenu?.map((subItem: MenuItem, index: number) => {
                if (!hasAccess(subItem)) return null;
                
                return (
                  <Link
                    key={subItem.id}
                    href={subItem.href || '#'}
                    className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-all duration-200 ease-out transform hover:scale-105 hover:translate-x-1 ${
                      isActive(subItem.href || '')
                        ? 'bg-gradient-to-r from-[#676D47] to-[#5A6140] text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#676D47] hover:shadow-sm'
                    }`}
                    style={{
                      animationDelay: `${index * 20}ms`,
                      animation: animatingItems.has(item.id) 
                        ? 'none' 
                        : 'slideInFromLeft 0.2s ease-out forwards',
                      opacity: animatingItems.has(item.id) ? 0 : 1,
                    }}
                  >
                    <div className="transition-all duration-200 hover:scale-110 hover:rotate-3">
                      {subItem.icon}
                    </div>
                    <span className="transition-all duration-200 font-medium">{subItem.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    );
  };

  const renderTooltip = () => {
    if (!mounted || !collapsed || (!hoveredItem && !clickedItem)) return null;

    const activeItem = hoveredItem || clickedItem;
    const item = menuItems.find(i => i.id === activeItem);
    if (!item) return null;

    const hasSubmenu = item.submenu && item.submenu.length > 0;

    if (hasSubmenu) {
      return createPortal(
        <div
          data-tooltip
          className="fixed z-50 animate-in fade-in-0 slide-in-from-left-2 duration-300 ease-out"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 py-2 min-w-48 transform transition-all duration-300 ease-out hover:scale-105">
            <div className="px-3 py-2 text-sm font-semibold text-gray-800 border-b border-gray-100 bg-gradient-to-r from-[#676D47] to-[#CDA077] bg-clip-text text-transparent">
              {item.label}
            </div>
            <div className="py-1">
              {item.submenu?.map((subItem: MenuItem, index: number) => {
                if (!hasAccess(subItem)) return null;
                
                return (
                  <Link
                    key={subItem.id}
                    href={subItem.href || '#'}
                    onClick={closeTooltip}
                    className={`flex items-center space-x-3 px-3 py-2 text-sm transition-all duration-200 ease-out hover:bg-gray-50 hover:text-[#676D47] hover:translate-x-1 hover:shadow-sm ${
                      isActive(subItem.href || '')
                        ? 'bg-[#676D47]/10 text-[#676D47] font-medium border-l-2 border-[#676D47]'
                        : 'text-gray-700'
                    }`}
                    style={{
                      animationDelay: `${index * 15}ms`,
                      animation: 'slideInFromLeft 0.15s ease-out forwards',
                    }}
                  >
                    <div className="w-4 h-4 flex-shrink-0 transition-transform duration-200 hover:scale-110 hover:rotate-3">
                      {subItem.icon}
                    </div>
                    <span className="font-medium">{subItem.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      );
    } else {
      return createPortal(
        <div
          className="fixed z-50 animate-in fade-in-0 slide-in-from-left-2 duration-300 ease-out"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap transform transition-all duration-300 ease-out hover:scale-105 border border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#CDA077] rounded-full animate-pulse"></div>
              <span className="font-medium">{item.label}</span>
            </div>
          </div>
        </div>,
        document.body
      );
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.98);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div 
        data-sidebar
        className={`${collapsed ? 'w-16' : 'w-64'} bg-[#F5F1EE] shadow-lg h-full flex flex-col transition-all duration-300 ease-in-out relative z-20`}
        style={{
          background: 'linear-gradient(90deg, rgba(245, 241, 238, 1) 0%, rgba(245, 241, 238, 1) 40%, rgba(245, 241, 238, 0.95) 60%, rgba(245, 241, 238, 0.8) 80%, rgba(245, 241, 238, 0.6) 100%)',
          boxShadow: 'inset -1px 0 0 rgba(255, 255, 255, 0.2), 1px 0 3px rgba(0, 0, 0, 0.05), 4px 0 15px rgba(0, 0, 0, 0.08)'
        }}
      >
        <div className="p-4 flex-1 overflow-hidden">
          {!collapsed && (
            <h2 className={`text-lg font-semibold text-gray-800 mb-4 transition-all duration-300 ease-out ${
              isTransitioning 
                ? 'opacity-0 translate-y-2' 
                : 'opacity-100 translate-y-0'
            }`}>
              Menú Principal
            </h2>
          )}
          <nav className="space-y-2">
            {menuItems.map(renderMenuItem)}
            
            {/* Botón de toggle dentro del sidebar */}
            <div className="mt-4 pt-2 border-t border-gray-200">
              <button
                onClick={onToggle}
                className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-out transform hover:scale-105 text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:text-[#676D47] hover:shadow-lg`}
                title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
              >
                <div className="transition-transform duration-200 hover:scale-110">
                  {collapsed ? (
                    // Icono de menú hamburguesa cuando está colapsado
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    // Flecha cuando está expandido
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  )}
                </div>
                {!collapsed && (
                  <span className={`transition-all duration-300 ease-out ${
                    isTransitioning 
                      ? 'opacity-0 translate-x-2' 
                      : 'opacity-100 translate-x-0'
                  }`}>
                    {collapsed ? 'Expandir' : 'Colapsar'}
                  </span>
                )}
              </button>
            </div>
          </nav>
        </div>
      </div>
      {renderTooltip()}
    </>
  );
}
