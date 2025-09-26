// Tipos para el formulario de bien inmueble - Nueva estructura por pasos
export interface InmuebleData {
  // PASO 1: Datos Básicos
  numeroRegistro?: string;
  tipoInmueble?: "Normal" | "Especial";
  propietario?: string;
  libroRegistro?: string;
  observaciones?: string;
  foja?: string;
  tomo?: string;
  serie?: string;
  seccion?: string;
  construccion?: string;
  estadoActualInmueble?: "Disponible" | "Invadido" | "Ocupado";
  tipoSuperficie?: string;
  estado?: string;
  municipio?: string;
  medidasColindancias?: string;
  ubicacionRegistral?: string;
  ubicacionMaps?: string;
  coordenadas?: string; // "latitud, longitud" opcional, máx 255 caracteres

  // PASO 2: Jurídico
  numeroEscritura?: string;
  volumen?: string;
  pagina?: string;
  fedatarioPublico?: string;
  autoridadEmisora?: string;
  numeroNotaria?: string;
  partesIntervienen?: string;
  fecha?: string;
  opcionesAdquisicion?: string;
  areaResguardante?: string;
  secretariasOrganismosAuxiFideico?: string;
  superficieEnUso?: string;
  fechaFirma?: string;
  vigencia?: string;
  instrumentoOtorgaUso?: string;
  archivoJuridico?: string;
  archivo_juridico?: string; // Campo del backend
  destinoInmueble?: string;
  actoJuridico?: string;
  instrumentoJuridicoUso?: string;
  instrumento_juridico_uso?: string; // Campo del backend
  instrumentoJuridicoAcredita?: string;
  instrumento_juridico_acredita?: string; // Campo del backend

  // PASO 3: Notación Marginal
  notacionMarginal?: boolean;
  anotacionMarginal?: string;
  instrumentoObjetoAnotacion?: string;
  instrumentoGeneral?: string;
  instrumento_general?: string; // Campo del backend
  ligaReferencia?: string;
  relacionMismoRegistro?: string;

  // PASO 4: Valuación
  numeroAvaluo?: string;
  valorSenaladoAvaluo?: string;
  fechaAvaluo?: string;
  tipoValuacion?: string;
  pdf?: string;
  pdf_avaluo?: string; // Campo del backend

  // PASO 5: Ocupación
  senalamientoInmueble?: boolean;
  nombreOcupante?: string;
  tipoOcupante?: string;
  espacioDisponibleInmueble?: string;

  // PASO 6: Catastral
  direccionPlanoCatastral?: string;
  claveCatastral?: string;
  valorCatastral?: string;
  baseGravable?: string;
  planoCatastral?: string;
  plano_catastral?: string; // Campo del backend
  fechaPlanoCatastral?: string;
  superficie?: string;
  levantamientoTopografico?: string;
  fechaLevantamientoTopografico?: string;
  pdf?: string;
  pdf_catastral?: string; // Campo del backend

  // PASO 7: Registral
  folioElectronico?: string;
  folioReal?: string; // Campo alterno backend
  numeroInscripcion?: string; // Campo alterno backend
  fechaInscripcion?: string; // Campo alterno backend
  vigenciaInscripcion?: string; // Campo alterno backend
  fechaCertificadoLibertad?: string;
  certificadoLibertadGravamen?: string;
  certificado_libertad_gravamen?: string; // Backend
  archivoAntecedenteRegistral?: string;
  archivo_antecedente_registral?: string; // Backend
  fechaInscripcionRegistroPublicoPropiedadInmobiliaria?: string;
  antecedenteRegistral?: string;
  inscripcionDecreto?: string;

  // PASO 8: Inspección
  responsableInspeccion?: string;
  responsable_inspeccion?: string; // Backend
  evidenciasFotograficas?: {
    fotos?: string[];
    portada?: string;
  };
  evidencias_fotograficas?: {
    fotos?: string[];
    portada?: string;
  }; // Backend
  observacionesInspeccion?: string;
  observaciones_inspeccion?: string; // Backend
  fechaInspeccionFisicaInmueble?: string;
  fecha_inspeccion_fisica_inmueble?: string; // Backend
  fechaProximaInspeccion?: string;
  fecha_proxima_inspeccion?: string; // Backend
  informeInspeccion?: string;
  informe_inspeccion?: string; // Backend
}

export interface StepProps {
  datos: InmuebleData;
  actualizarDatos: (
    campo: keyof InmuebleData,
    valor:
      | string
      | number
      | boolean
      | Record<string, unknown>
      | string[]
      | undefined
  ) => void;
  setArchivo?: (campo: string, valor: File | File[]) => void;
  errores: Record<string, string>;
}
