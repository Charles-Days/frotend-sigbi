'use client';

import { useState, useEffect } from 'react';
import OpenStreetMapEmbed from '@/components/ui/OpenStreetMapEmbed';
import { StepProps } from './types';
import { obtenerMunicipios, obtenerEstados } from '@/constants/estadosMunicipios';

export default function DatosBasicos({ datos, actualizarDatos, errores }: StepProps) {
  const [municipiosDisponibles, setMunicipiosDisponibles] = useState<string[]>([]);
  const [estados] = useState<string[]>(obtenerEstados());
  const [busquedaEstado, setBusquedaEstado] = useState('');
  const [busquedaMunicipio, setBusquedaMunicipio] = useState('');
  const [mostrarSugerenciasEstado, setMostrarSugerenciasEstado] = useState(false);
  const [mostrarSugerenciasMunicipio, setMostrarSugerenciasMunicipio] = useState(false);
  const [estadosFiltrados, setEstadosFiltrados] = useState<string[]>([]);
  const [municipiosFiltrados, setMunicipiosFiltrados] = useState<string[]>([]);

  // Actualizar municipios cuando cambie el estado
  useEffect(() => {
    if (datos.estado) {
      const municipios = obtenerMunicipios(datos.estado);
      setMunicipiosDisponibles(municipios);
      setMunicipiosFiltrados(municipios);
      
      // Si el municipio actual no está en la nueva lista, limpiarlo
      if (datos.municipio && !municipios.includes(datos.municipio)) {
        actualizarDatos('municipio', '');
        setBusquedaMunicipio('');
      }
    } else {
      setMunicipiosDisponibles([]);
      setMunicipiosFiltrados([]);
      if (datos.municipio) {
        actualizarDatos('municipio', '');
        setBusquedaMunicipio('');
      }
    }
  }, [datos.estado, datos.municipio, actualizarDatos]);

  // Filtrar estados según búsqueda
  useEffect(() => {
    if (busquedaEstado) {
      const filtrados = estados.filter(estado =>
        estado.toLowerCase().includes(busquedaEstado.toLowerCase())
      );
      setEstadosFiltrados(filtrados);
    } else {
      setEstadosFiltrados(estados);
    }
  }, [busquedaEstado, estados]);

  // Filtrar municipios según búsqueda
  useEffect(() => {
    if (busquedaMunicipio && municipiosDisponibles.length > 0) {
      const filtrados = municipiosDisponibles.filter(municipio =>
        municipio.toLowerCase().includes(busquedaMunicipio.toLowerCase())
      );
      setMunicipiosFiltrados(filtrados);
    } else {
      setMunicipiosFiltrados(municipiosDisponibles);
    }
  }, [busquedaMunicipio, municipiosDisponibles]);

  // Inicializar búsquedas con valores actuales
  useEffect(() => {
    if (datos.estado && !busquedaEstado) {
      setBusquedaEstado(datos.estado);
    }
    if (datos.municipio && !busquedaMunicipio) {
      setBusquedaMunicipio(datos.municipio);
    }
  }, [datos.estado, datos.municipio, busquedaEstado, busquedaMunicipio]);

  // Función para seleccionar estado
  const seleccionarEstado = (estado: string) => {
    setBusquedaEstado(estado);
    actualizarDatos('estado', estado);
    setMostrarSugerenciasEstado(false);
  };

  // Función para seleccionar municipio
  const seleccionarMunicipio = (municipio: string) => {
    setBusquedaMunicipio(municipio);
    actualizarDatos('municipio', municipio);
    setMostrarSugerenciasMunicipio(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#676D47] mb-2">Datos Básicos del Inmueble</h3>
        <p className="text-gray-600">Información general y características principales</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Número de Registro *
          </label>
          <input
            type="text"
            value={datos.numeroRegistro || ''}
            onChange={(e) => actualizarDatos('numeroRegistro', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Ingrese el número de registro"
          />
          {errores.numeroRegistro && (
            <p className="text-sm text-red-600">{errores.numeroRegistro}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Tipo de Inmueble
          </label>
          <select
            value={datos.tipoInmueble || ''}
            onChange={(e) => actualizarDatos('tipoInmueble', e.target.value as 'Normal' | 'Especial')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          >
            <option value="">Seleccionar tipo</option>
            <option value="Normal">Normal</option>
            <option value="Especial">Especial</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Propietario
          </label>
          <input
            type="text"
            value={datos.propietario || ''}
            onChange={(e) => actualizarDatos('propietario', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Nombre del propietario del inmueble"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Libro de Registro
          </label>
          <input
            type="url"
            value={datos.libroRegistro || ''}
            onChange={(e) => actualizarDatos('libroRegistro', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="https://ejemplo.com/libro.pdf"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Foja
          </label>
          <input
            type="text"
            value={datos.foja || ''}
            onChange={(e) => actualizarDatos('foja', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Número de foja"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Tomo
          </label>
          <input
            type="text"
            value={datos.tomo || ''}
            onChange={(e) => actualizarDatos('tomo', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Número de tomo"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Serie
          </label>
          <input
            type="text"
            value={datos.serie || ''}
            onChange={(e) => actualizarDatos('serie', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Serie del documento"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Sección
          </label>
          <input
            type="text"
            value={datos.seccion || ''}
            onChange={(e) => actualizarDatos('seccion', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Sección"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Construcción
          </label>
          <input
            type="text"
            value={datos.construccion || ''}
            onChange={(e) => actualizarDatos('construccion', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Descripción de la construcción"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Estado Actual del Inmueble
          </label>
          <select
            value={datos.estadoActualInmueble || ''}
            onChange={(e) => actualizarDatos('estadoActualInmueble', e.target.value as 'Disponible' | 'Invadido' | 'Ocupado')}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
          >
            <option value="">Seleccionar estado</option>
            <option value="Disponible">🟢 Disponible</option>
            <option value="Invadido">🔴 Invadido</option>
            <option value="Ocupado">🟡 Ocupado</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Tipo de Superficie
          </label>
          <input
            type="text"
            value={datos.tipoSuperficie || ''}
            onChange={(e) => actualizarDatos('tipoSuperficie', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Ej: Metros, Hectáreas"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Estado <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={busquedaEstado}
              onChange={(e) => {
                setBusquedaEstado(e.target.value);
                setMostrarSugerenciasEstado(true);
                if (!e.target.value) {
                  actualizarDatos('estado', '');
                }
              }}
              onFocus={() => setMostrarSugerenciasEstado(true)}
              onBlur={() => setTimeout(() => setMostrarSugerenciasEstado(false), 200)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="Buscar estado..."
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Sugerencias de estados */}
            {mostrarSugerenciasEstado && estadosFiltrados.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {estadosFiltrados.map((estado) => (
                  <button
                    key={estado}
                    type="button"
                    onClick={() => seleccionarEstado(estado)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150"
                  >
                    <span className="text-gray-900">{estado}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errores.estado && (
            <p className="text-red-500 text-sm mt-1">{errores.estado}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Municipio <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={busquedaMunicipio}
              onChange={(e) => {
                setBusquedaMunicipio(e.target.value);
                setMostrarSugerenciasMunicipio(true);
                if (!e.target.value) {
                  actualizarDatos('municipio', '');
                }
              }}
              onFocus={() => setMostrarSugerenciasMunicipio(true)}
              onBlur={() => setTimeout(() => setMostrarSugerenciasMunicipio(false), 200)}
              disabled={!datos.estado || municipiosDisponibles.length === 0}
              className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                !datos.estado || municipiosDisponibles.length === 0 
                  ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
                  : 'bg-white'
              }`}
              placeholder={
                !datos.estado 
                  ? 'Primero selecciona un estado' 
                  : municipiosDisponibles.length === 0 
                    ? 'No hay municipios disponibles' 
                    : 'Buscar municipio...'
              }
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Sugerencias de municipios */}
            {mostrarSugerenciasMunicipio && municipiosFiltrados.length > 0 && datos.estado && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {municipiosFiltrados.map((municipio) => (
                  <button
                    key={municipio}
                    type="button"
                    onClick={() => seleccionarMunicipio(municipio)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors duration-150"
                  >
                    <span className="text-gray-900">{municipio}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errores.municipio && (
            <p className="text-red-500 text-sm mt-1">{errores.municipio}</p>
          )}
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Medidas y Colindancias
          </label>
          <textarea
            value={datos.medidasColindancias || ''}
            onChange={(e) => actualizarDatos('medidasColindancias', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Describa las medidas y colindancias del inmueble..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Ubicación Registral
          </label>
          <input
            type="text"
            value={datos.ubicacionRegistral || ''}
            onChange={(e) => actualizarDatos('ubicacionRegistral', e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="Ubicación según registro"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            URL de Google Maps
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={datos.ubicacionMaps || ''}
              onChange={(e) => actualizarDatos('ubicacionMaps', e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
              placeholder="https://maps.google.com/..."
            />
            <button
              type="button"
              onClick={() => datos.ubicacionMaps && window.open(datos.ubicacionMaps, '_blank', 'noopener,noreferrer')}
              disabled={!datos.ubicacionMaps}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                datos.ubicacionMaps
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              title={datos.ubicacionMaps ? 'Abrir en Google Maps' : 'Ingresa una URL primero'}
            >
              Abrir
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-900">
            Coordenadas
          </label>
          <input
            type="text"
            value={datos.coordenadas || ''}
            onChange={(e) => actualizarDatos('coordenadas', e.target.value)}
            maxLength={255}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 bg-white"
            placeholder="19.4326, -99.1332"
          />
          <p className="text-xs text-gray-500">Formato: &quot;latitud, longitud&quot;</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-900">
          Observaciones Generales
        </label>
        <textarea
          value={datos.observaciones || ''}
          onChange={(e) => actualizarDatos('observaciones', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#676D47] focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder-gray-400 bg-white"
          placeholder="Observaciones generales del inmueble..."
        />
      </div>

      {/* Vista previa de mapa OSM si hay coordenadas válidas */}
      {datos.coordenadas && (
        <div className="pt-4">
          <h4 className="text-sm font-bold text-gray-900 mb-2">Vista previa en OpenStreetMap</h4>
          <OpenStreetMapEmbed coordinates={datos.coordenadas} heightClassName="h-72" />
        </div>
      )}
    </div>
  );
}