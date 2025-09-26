'use client';

import { useState, useEffect } from 'react';
import OpenStreetMapEmbed from '@/components/ui/OpenStreetMapEmbed';

interface Inmueble {
  id: string;
  numeroRegistro?: string;
  tipoInmueble?: string;
  propietario?: string;
  estado?: string;
  estadoActual?: string;
  observaciones?: string;
  localizacion?: { municipio?: string } | null;
  completado?: number;
  pasos?: Record<string, boolean>;
  pasosFaltantes?: string[];
  camposEspecificos?: Record<string, string | null>;
  camposFaltantes?: string[];
  completitudEspecificos?: number;
  completadoPorPasos?: number;
  
  // Datos completos del inmueble
  libroRegistro?: string;
  foja?: string;
  tomo?: string;
  serie?: string;
  seccion?: string;
  construccion?: string;
  tipoSuperficie?: string;
  municipio?: string;
  medidasColindancias?: string;
  ubicacionRegistral?: string;
  ubicacionMaps?: string;
  coordenadas?: string;
  
  // Relaciones
  juridico?: any;
  notacionMarginal?: any;
  ocupacionUso?: any;
  valuaciones?: any[];
  catastrales?: any[];
  registrales?: any[];
  inspecciones?: any[];
}

interface ModalDetalleInmuebleProps {
  inmueble: Inmueble | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalDetalleInmueble({ inmueble, isOpen, onClose }: ModalDetalleInmuebleProps) {
  const [inmuebleCompleto, setInmuebleCompleto] = useState<Inmueble | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('basica');

  const cargarDatosCompletos = async () => {
    if (!inmueble?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/v1/caracteristicas-inmueble/${inmueble.id}`, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar los datos del inmueble');
      }
      
      const data = await response.json();
      console.log('[ModalDetalleInmueble] Datos completos cargados:', data);
      
      if (data.success && data.data) {
        setInmuebleCompleto(data.data);
      } else {
        throw new Error(data.message || 'Error al obtener los datos');
      }
    } catch (err) {
      console.error('Error al cargar datos completos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos completos cuando se abre el modal
  useEffect(() => {
    if (isOpen && inmueble?.id) {
      cargarDatosCompletos();
    }
  }, [isOpen, inmueble?.id]);

  if (!isOpen || !inmueble) return null;

  const datosAMostrar = inmuebleCompleto || inmueble;

  const tabs = [
    { id: 'basica', label: 'Información Básica', icon: '🏠' },
    { id: 'juridica', label: 'Jurídica', icon: '📋' },
    { id: 'notacion', label: 'Notación Marginal', icon: '📝' },
    { id: 'ocupacion', label: 'Ocupación', icon: '👥' },
    { id: 'avaluos', label: 'Avalúos', icon: '💰' },
    { id: 'catastral', label: 'Catastral', icon: '🗺️' },
    { id: 'registral', label: 'Registral', icon: '📄' },
    { id: 'inspecciones', label: 'Inspecciones', icon: '🔍' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative z-50 bg-white rounded-xl text-left shadow-2xl transform transition-all w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] flex flex-col mx-auto">
          {/* Header */}
          <div className="bg-[#676D47] px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">
                Detalles del Inmueble - {inmueble.numeroRegistro || 'Sin número'}
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-b border-gray-200">
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#676D47] text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm sm:text-base">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content - Con scroll interno */}
          <div className="bg-white px-4 sm:px-6 py-4 sm:py-6 flex-1 overflow-y-auto text-gray-900">
            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#676D47]"></div>
                <span className="ml-3 text-gray-600">Cargando información completa...</span>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'basica' && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-gray-900">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Información Básica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Libro de Registro:</span> {datosAMostrar.libroRegistro || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Foja:</span> {datosAMostrar.foja || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Tomo:</span> {datosAMostrar.tomo || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Serie:</span> {datosAMostrar.serie || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Sección:</span> {datosAMostrar.seccion || '—'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Construcción:</span> {datosAMostrar.construccion || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Estado Actual:</span> {(datosAMostrar as any).estadoActualInmueble || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Tipo de Superficie:</span> {datosAMostrar.tipoSuperficie || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Medidas y Colindancias:</span> {datosAMostrar.medidasColindancias || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Ubicación Registral:</span> {datosAMostrar.ubicacionRegistral || '—'}</p>
                  </div>
                </div>
                {datosAMostrar.ubicacionMaps && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ubicación en Maps:</p>
                    <a href={datosAMostrar.ubicacionMaps} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                      🗺️ Ver en Maps
                    </a>
                  </div>
                )}
                {datosAMostrar.coordenadas && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ubicación:</p>
                    <p className="text-sm text-gray-600 mb-3">{datosAMostrar.coordenadas}</p>
                    <OpenStreetMapEmbed 
                      coordinates={datosAMostrar.coordenadas} 
                      zoom={16} 
                      heightClassName="h-48" 
                    />
                  </div>
                )}
                {datosAMostrar.observaciones && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Observaciones:</p>
                    <p className="text-sm text-gray-600 mt-1">{datosAMostrar.observaciones}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab Jurídica */}
            {activeTab === 'juridica' && datosAMostrar.juridico && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-gray-900">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Información Jurídica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Número de Escritura:</span> {datosAMostrar.juridico.numeroEscritura || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Volumen:</span> {datosAMostrar.juridico.volumen || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Página:</span> {datosAMostrar.juridico.pagina || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Fedatario Público:</span> {datosAMostrar.juridico.fedatarioPublico || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Autoridad Emisora:</span> {datosAMostrar.juridico.autoridadEmisora || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Número de Notaría:</span> {datosAMostrar.juridico.numeroNotaria || '—'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Partes que Intervienen:</span> {datosAMostrar.juridico.partesIntervienen || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Fecha:</span> {datosAMostrar.juridico.fecha || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Opciones de Adquisición:</span> {datosAMostrar.juridico.opcionesAdquisicion || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Área Resguardante:</span> {datosAMostrar.juridico.areaResguardante || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Secretarías/Organismos:</span> {datosAMostrar.juridico.secretariasOrganismosAuxiFideico || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Superficie en Uso:</span> {datosAMostrar.juridico.superficieEnUso || '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Fecha de Firma:</span> {datosAMostrar.juridico.fechaFirma || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Vigencia:</span> {datosAMostrar.juridico.vigencia || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Instrumento Otorga Uso:</span> {datosAMostrar.juridico.instrumentoOtorgaUso || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Destino del Inmueble:</span> {datosAMostrar.juridico.destinoInmueble || '—'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Acto Jurídico:</span> {datosAMostrar.juridico.actoJuridico || '—'}</p>
                  </div>
                </div>
                {/* Archivos jurídicos */}
                {(datosAMostrar.juridico.archivo_juridico || datosAMostrar.juridico.instrumento_juridico_uso || datosAMostrar.juridico.instrumento_juridico_acredita) && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Documentos:</p>
                    <div className="flex flex-wrap gap-2">
                      {datosAMostrar.juridico.archivo_juridico && (
                        <a href={datosAMostrar.juridico.archivo_juridico} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                          📄 Archivo Jurídico
                        </a>
                      )}
                      {datosAMostrar.juridico.instrumento_juridico_uso && (
                        <a href={datosAMostrar.juridico.instrumento_juridico_uso} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 hover:bg-green-200">
                          📄 Instrumento de Uso
                        </a>
                      )}
                      {datosAMostrar.juridico.instrumento_juridico_acredita && (
                        <a href={datosAMostrar.juridico.instrumento_juridico_acredita} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800 hover:bg-purple-200">
                          📄 Instrumento Acredita
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab Notación Marginal */}
            {activeTab === 'notacion' && datosAMostrar.notacionMarginal && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-gray-900">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Notación Marginal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Notación Marginal:</span> {datosAMostrar.notacionMarginal.notacionMarginal ? 'Sí' : 'No'}</p>
                    <p className="text-sm"><span className="font-medium">Anotación Marginal:</span> {datosAMostrar.notacionMarginal.anotacionMarginal || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Instrumento Objeto Anotación:</span> {datosAMostrar.notacionMarginal.instrumentoObjetoAnotacion || '—'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Liga de Referencia:</span> {datosAMostrar.notacionMarginal.ligaReferencia || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Relación Mismo Registro:</span> {datosAMostrar.notacionMarginal.relacionMismoRegistro || '—'}</p>
                  </div>
                </div>
                {datosAMostrar.notacionMarginal.instrumento_general && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Documentos:</p>
                    <a href={datosAMostrar.notacionMarginal.instrumento_general} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800 hover:bg-orange-200">
                      📄 Instrumento General
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Tab Ocupación */}
            {activeTab === 'ocupacion' && datosAMostrar.ocupacionUso && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-gray-900">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Ocupación y Uso</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Señalamiento del Inmueble:</span> {datosAMostrar.ocupacionUso.senalamientoInmueble ? 'Sí' : 'No'}</p>
                    <p className="text-sm"><span className="font-medium">Nombre del Ocupante:</span> {datosAMostrar.ocupacionUso.nombreOcupante || '—'}</p>
                    <p className="text-sm"><span className="font-medium">Tipo de Ocupante:</span> {datosAMostrar.ocupacionUso.tipoOcupante || '—'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Espacio Disponible:</span> {datosAMostrar.ocupacionUso.espacioDisponibleInmueble || '—'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Avalúos */}
            {activeTab === 'avaluos' && datosAMostrar.valuaciones && datosAMostrar.valuaciones.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-gray-900">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Avalúos</h4>
                <div className="space-y-4">
                  {datosAMostrar.valuaciones.map((avaluo, index) => (
                    <div key={index} className="border border-gray-100 rounded-md p-3 bg-gray-50 text-gray-900">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm"><span className="font-medium">Número de Avalúo:</span> {avaluo.numeroAvaluo || '—'}</p>
                          <p className="text-sm"><span className="font-medium">Valor Señalado:</span> ${avaluo.valorSenaladoAvaluo ? Number(avaluo.valorSenaladoAvaluo).toLocaleString() : '—'}</p>
                          <p className="text-sm"><span className="font-medium">Fecha de Avalúo:</span> {avaluo.fechaAvaluo || '—'}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm"><span className="font-medium">Tipo de Valuación:</span> {avaluo.tipoValuacion || '—'}</p>
                          {avaluo.pdf_avaluo && (
                            <a href={avaluo.pdf_avaluo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800 hover:bg-orange-200">
                              📄 Ver Avalúo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Catastral */}
            {activeTab === 'catastral' && datosAMostrar.catastrales && datosAMostrar.catastrales.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-gray-900">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Información Catastral</h4>
                <div className="space-y-4">
                  {datosAMostrar.catastrales.map((catastral, index) => (
                    <div key={index} className="border border-gray-100 rounded-md p-3 bg-gray-50 text-gray-900">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm"><span className="font-medium">Dirección Plano Catastral:</span> {catastral.direccionPlanoCatastral || '—'}</p>
                          <p className="text-sm"><span className="font-medium">Clave Catastral:</span> {catastral.claveCatastral || '—'}</p>
                          <p className="text-sm"><span className="font-medium">Valor Catastral:</span> ${catastral.valorCatastral ? Number(catastral.valorCatastral).toLocaleString() : '—'}</p>
                          <p className="text-sm"><span className="font-medium">Base Gravable:</span> ${catastral.baseGravable ? Number(catastral.baseGravable).toLocaleString() : '—'}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm"><span className="font-medium">Fecha Plano Catastral:</span> {catastral.fechaPlanoCatastral || '—'}</p>
                          <p className="text-sm"><span className="font-medium">Superficie:</span> {catastral.superficie ? `${catastral.superficie} m²` : '—'}</p>
                          <p className="text-sm"><span className="font-medium">Levantamiento Topográfico:</span> {catastral.levantamientoTopografico || '—'}</p>
                          <p className="text-sm"><span className="font-medium">Fecha Levantamiento:</span> {catastral.fechaLevantamientoTopografico || '—'}</p>
                        </div>
                      </div>
                      {(catastral.plano_catastral || catastral.pdf_catastral) && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Documentos:</p>
                          <div className="flex flex-wrap gap-2">
                            {catastral.plano_catastral && (
                              <a href={catastral.plano_catastral} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                                📄 Plano Catastral
                              </a>
                            )}
                            {catastral.pdf_catastral && (
                              <a href={catastral.pdf_catastral} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 hover:bg-green-200">
                                📄 PDF Catastral
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Registral */}
            {activeTab === 'registral' && datosAMostrar.registrales && datosAMostrar.registrales.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-gray-900">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Información Registral</h4>
                <div className="space-y-4">
                  {datosAMostrar.registrales.map((registral, index) => (
                    <div key={index} className="border border-gray-100 rounded-md p-3 bg-gray-50 text-gray-900">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm"><span className="font-medium">Folio Electrónico:</span> {registral.folioElectronico || '—'}</p>
                          <p className="text-sm"><span className="font-medium">Fecha Certificado Libertad:</span> {registral.fechaCertificadoLibertad || '—'}</p>
                          <p className="text-sm"><span className="font-medium">Fecha Inscripción:</span> {registral.fechaInscripcionRegistroPublicoPropiedadInmobiliaria || '—'}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm"><span className="font-medium">Antecedente Registral:</span> {registral.antecedenteRegistral || '—'}</p>
                          <p className="text-sm"><span className="font-medium">Inscripción Decreto:</span> {registral.inscripcionDecreto || '—'}</p>
                        </div>
                      </div>
                      {(registral.certificado_libertad_gravamen || registral.archivo_antecedente_registral) && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Documentos:</p>
                          <div className="flex flex-wrap gap-2">
                            {registral.certificado_libertad_gravamen && (
                              <a href={registral.certificado_libertad_gravamen} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
                                📄 Certificado Libertad
                              </a>
                            )}
                            {registral.archivo_antecedente_registral && (
                              <a href={registral.archivo_antecedente_registral} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 hover:bg-green-200">
                                📄 Antecedente Registral
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Inspecciones */}
            {activeTab === 'inspecciones' && datosAMostrar.inspecciones && datosAMostrar.inspecciones.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-gray-900">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Inspecciones</h4>
                <div className="space-y-4">
                  {datosAMostrar.inspecciones.map((inspeccion, index) => (
                    <div key={index} className="border border-gray-100 rounded-md p-3 bg-gray-50 text-gray-900">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm"><span className="font-medium">Responsable:</span> {inspeccion.responsableInspeccion || '—'}</p>
                          <p className="text-sm"><span className="font-medium">Fecha Inspección:</span> {inspeccion.fechaInspeccionFisicaInmueble || '—'}</p>
                          <p className="text-sm"><span className="font-medium">Próxima Inspección:</span> {inspeccion.fechaProximaInspeccion || '—'}</p>
                        </div>
                        <div className="space-y-2">
                          {inspeccion.informe_inspeccion && (
                            <a href={inspeccion.informe_inspeccion} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 hover:bg-green-200">
                              📄 Informe de Inspección
                            </a>
                          )}
                        </div>
                      </div>
                      {inspeccion.evidencias_fotograficas && inspeccion.evidencias_fotograficas.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Evidencias Fotográficas ({inspeccion.evidencias_fotograficas.length}):</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {inspeccion.evidencias_fotograficas.map((evidencia: any, idx: number) => (
                              <a key={idx} href={evidencia.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 truncate">
                                📷 {evidencia.originalName || `Evidencia ${idx + 1}`}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      {inspeccion.observacionesInspeccion && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700">Observaciones:</p>
                          <p className="text-sm text-gray-600 mt-1">{inspeccion.observacionesInspeccion}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                localStorage.setItem('inmuebleId', inmueble.id);
                window.location.href = '/bienes/crear';
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-[#676D47] border border-transparent rounded-md hover:bg-[#5a6140]"
            >
              Editar Inmueble
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
