// Archivo principal de constantes
// Exporta todas las constantes del proyecto

// Estados y municipios
export * from "./estadosMunicipios";

// Menús y constantes de la aplicación
export * from "./menuItems";

// Aquí puedes agregar más constantes según necesites
// Ejemplo:
// export * from './tiposInmueble';
// export * from './estadosActuales';
// export * from './dependencias';
// export * from './organismos';

// Constantes generales del sistema
export const CONSTANTS = {
  // Configuración de la aplicación
  APP_NAME: "SIGBI",
  VERSION: "1.0.0",

  // Configuración de paginación
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    LIMITS: [10, 20, 50, 100],
  },

  // Configuración de archivos
  FILE_UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  },

  // Estados de registro
  REGISTRO_STATUS: {
    EN_PROGRESO: "en_progreso",
    COMPLETO: "completo",
    CANCELADO: "cancelado",
  },

  // Pasos del registro de inmuebles
  PASOS_REGISTRO: {
    BASICO: "basico",
    TERRENO: "terreno",
    LOCALIZACION: "localizacion",
    CATASTRAL: "catastral",
    AVALUO: "avaluo",
    REGISTRO_LEGAL: "registro_legal",
    DOCUMENTOS: "documentos",
    OCUPACION: "ocupacion",
    INSPECCION: "inspeccion",
  },
} as const;

// Tipos derivados de las constantes
export type RegistroStatus =
  (typeof CONSTANTS.REGISTRO_STATUS)[keyof typeof CONSTANTS.REGISTRO_STATUS];
export type PasoRegistro =
  (typeof CONSTANTS.PASOS_REGISTRO)[keyof typeof CONSTANTS.PASOS_REGISTRO];
