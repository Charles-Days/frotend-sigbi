'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface RegistroTooltipProps {
  completado: number;
  pasosFaltantes?: string[];
  children: React.ReactNode;
  completitudEspecificos?: number;
  completadoPorPasos?: number;
}

const pasosNombres: Record<string, string> = {
  basico: 'Datos Básicos',
  terreno: 'Terreno',
  localizacion: 'Localización',
  catastral: 'Planos',
  avaluo: 'Avalúos',
  registro_legal: 'Registros',
  documentos: 'Documentos',
  ocupacion: 'Ocupación',
  inspeccion: 'Inspecciones'
};

export default function RegistroTooltip({ completado, pasosFaltantes = [], children, completitudEspecificos, completadoPorPasos }: RegistroTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<'above' | 'below'>('above');
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const updateTooltipPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      
      let top = 0;
      let left = rect.left + (rect.width / 2);
      
      // Si hay menos de 300px arriba, mostrar abajo
      if (spaceAbove < 300) {
        setPosition('below');
        top = rect.bottom + 8;
      } else {
        setPosition('above');
        top = rect.top - 8;
      }
      
      // Ajustar horizontalmente si se sale
      if (left < 16) {
        left = 16;
      } else if (left > window.innerWidth - 16) {
        left = window.innerWidth - 16;
      }
      
      setTooltipPosition({ top, left });
    }
  };

  const openTooltip = () => {
    // Cancelar cierre pendiente si el mouse reingresa
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
    updateTooltipPosition();
  };

  const scheduleHide = () => {
    // Pequeño retardo para permitir pasar del trigger al tooltip sin parpadeo
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
      hideTimeoutRef.current = null;
    }, 150);
  };

  useEffect(() => {
    if (isVisible) {
      const handleResize = () => updateTooltipPosition();
      const handleScroll = () => updateTooltipPosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const getEstadoColor = (completado: number) => {
    if (completado === 100) return 'text-green-600';
    if (completado >= 70) return 'text-yellow-600';
    if (completado >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getEstadoBg = (completado: number) => {
    if (completado === 100) return 'bg-green-50 border-green-200';
    if (completado >= 70) return 'bg-yellow-50 border-yellow-200';
    if (completado >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <>
      <div 
        ref={triggerRef}
        className="relative inline-block group"
        onMouseEnter={openTooltip}
        onMouseLeave={scheduleHide}
      >
        {children}
      </div>
      
      {isVisible && typeof window !== 'undefined' && createPortal(
        <div
          className={`fixed z-50 p-4 rounded-lg shadow-lg border-2 max-w-sm w-[22rem] whitespace-normal break-words max-h-80 overflow-auto ${getEstadoBg(completado)}`}
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translateX(-50%)',
            maxWidth: 'calc(100vw - 2rem)',
            maxHeight: 'calc(100vh - 2rem)'
          }}
          onMouseEnter={openTooltip}
          onMouseLeave={scheduleHide}
        >
          {/* Header con porcentaje */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Progreso del Registro</h4>
            <span className={`text-lg font-bold ${getEstadoColor(completado)}`}>
              {completado}%
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                completado === 100 ? 'bg-green-500' :
                completado >= 70 ? 'bg-yellow-500' :
                completado >= 40 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${completado}%` }}
            ></div>
          </div>

          {/* Desglose de métricas si existen */}
          {(typeof completitudEspecificos === 'number' || typeof completadoPorPasos === 'number') && (
            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              {typeof completitudEspecificos === 'number' && (
                <div className="flex items-center justify-between bg-gray-100 rounded px-2 py-1">
                  <span className="text-gray-700">Específicos</span>
                  <span className="font-semibold">{completitudEspecificos}%</span>
                </div>
              )}
              {typeof completadoPorPasos === 'number' && (
                <div className="flex items-center justify-between bg-gray-100 rounded px-2 py-1">
                  <span className="text-gray-700">Por pasos</span>
                  <span className="font-semibold">{completadoPorPasos}%</span>
                </div>
              )}
            </div>
          )}

          {/* Pasos faltantes */}
          {pasosFaltantes.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Pasos pendientes ({pasosFaltantes.length}):
              </p>
              <div className="space-y-1">
                {pasosFaltantes.map((paso) => (
                  <div key={paso} className="flex items-center text-sm text-gray-600 break-all">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    {pasosNombres[paso] || paso}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              ¡Registro completo!
            </div>
          )}

          {/* Flecha del tooltip */}
          <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l-2 border-t-2 border-gray-200 rotate-45 ${
            position === 'above' ? '-bottom-2' : '-top-2'
          }`}></div>
        </div>,
        document.body
      )}
    </>
  );
}
