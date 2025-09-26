// Ejemplos de constantes JSON que podrías necesitar
// Este archivo es solo para referencia, puedes eliminarlo o usarlo como base

// Ejemplo 1: Tipos de inmueble
export const tiposInmueble = {
    // Aquí agregarías los tipos de inmueble
    // Ejemplo:
    // "NORMAL": "Normal",
    // "ESPECIAL": "Especial",
    // "HISTORICO": "Histórico",
    // "GUBERNAMENTAL": "Gubernamental",
};

// Ejemplo 2: Estados actuales de inmuebles
export const estadosActuales = {
    // Aquí agregarías los estados actuales
    // Ejemplo:
    // "DISPONIBLE": "Disponible",
    // "OCUPADO": "Ocupado",
    // "INVADIDO": "Invadido",
    // "MANTENIMIENTO": "En Mantenimiento",
};

// Ejemplo 3: Dependencias gubernamentales
export const dependencias = {
    // Aquí agregarías las dependencias
    // Ejemplo:
    // "SECRETARIA_EDUCACION": "Secretaría de Educación",
    // "SECRETARIA_SALUD": "Secretaría de Salud",
    // "SECRETARIA_DESARROLLO": "Secretaría de Desarrollo Social",
};

// Ejemplo 4: Organismos
export const organismos = {
    // Aquí agregarías los organismos
    // Ejemplo:
    // "IMSS": "Instituto Mexicano del Seguro Social",
    // "ISSSTE": "Instituto de Seguridad y Servicios Sociales de los Trabajadores del Estado",
    // "PEMEX": "Petróleos Mexicanos",
};

// Ejemplo 5: Unidades de medida
export const unidadesMedida = {
    // Aquí agregarías las unidades de medida
    // Ejemplo:
    // "METROS_CUADRADOS": "m²",
    // "HECTAREAS": "hectáreas",
    // "ACRES": "acres",
};

// Función helper genérica para crear opciones de select
export const crearOpcionesSelect = (objeto: Record<string, string>) => {
    return Object.entries(objeto).map(([valor, etiqueta]) => ({
        valor,
        etiqueta,
    }));
};

// Función helper para obtener etiqueta por valor
export const obtenerEtiqueta = (objeto: Record<string, string>, valor: string): string => {
    return objeto[valor] || valor;
};
