"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { InmuebleData } from '@/components/crud/bienes/types';
import DatosBasicos from '@/components/crud/bienes/DatosBasicos';
import Juridico from '@/components/crud/bienes/Juridico';
import NotacionMarginal from '@/components/crud/bienes/NotacionMarginal';
import Valuacion from '@/components/crud/bienes/Valuacion';
import Ocupacion from '@/components/crud/bienes/Ocupacion';
import Catastral from '@/components/crud/bienes/Catastral';
import Registral from '@/components/crud/bienes/Registral';
import Inspecciones from '@/components/crud/bienes/Inspecciones';
import InmuebleEspecial from '@/components/crud/bienes/InmuebleEspecial';
import ModalTipoInmueble from '@/components/ui/ModalTipoInmueble';
import Toast from '@/components/ui/Toast';
// import api from '@/services/api';

const pasos = [
  { id: 1, nombre: 'Datos Básicos', descripcion: 'Información general del inmueble' },
  { id: 2, nombre: 'Jurídico', descripcion: 'Documentos y actos jurídicos' },
  { id: 3, nombre: 'Notación Marginal', descripcion: 'Anotaciones especiales' },
  { id: 4, nombre: 'Valuación', descripcion: 'Valoraciones del inmueble' },
  { id: 5, nombre: 'Ocupación', descripcion: 'Uso y ocupación actual' },
  { id: 6, nombre: 'Catastral', descripcion: 'Información catastral' },
  { id: 7, nombre: 'Registral', descripcion: 'Registros públicos' },
  { id: 8, nombre: 'Inspección', descripcion: 'Inspecciones físicas' }
];

export default function CrearBienPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pasoActual, setPasoActual] = useState(1);
  const [datos, setDatos] = useState<InmuebleData>({});
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [inmuebleId, setInmuebleId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [progresoPorcentaje, setProgresoPorcentaje] = useState<number>(0);
  const [pasosEstado, setPasosEstado] = useState<Record<string, boolean> | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; message: string } | null>(null);
  const [mostrarModalNuevoRegistro, setMostrarModalNuevoRegistro] = useState(false);
  const [registroEnProgreso, setRegistroEnProgreso] = useState(false);
  const [mostrarModalTipoInmueble, setMostrarModalTipoInmueble] = useState(false);
  const [tipoInmuebleSeleccionado, setTipoInmuebleSeleccionado] = useState<'Normal' | 'Especial' | null>(null);
  // Evitar doble envío del paso básico
  const creandoBasicoRef = useRef(false);
  const crearBasicoPromiseRef = useRef<Promise<boolean> | null>(null);

  // Cargar inmuebleId desde localStorage al montar
  useEffect(() => {
    // Si viene ?new=1, limpiar todo antes
    const isNew = searchParams?.get('new') === '1';
    if (isNew) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('inmuebleId');
      }
      setPasoActual(1);
      setDatos({});
      setErrores({});
      setInmuebleId(null);
      setProgresoPorcentaje(0);
      setPasosEstado(null);
      setRegistroEnProgreso(false);
      setTipoInmuebleSeleccionado(null);
      // Mostrar modal de tipo de inmueble para nuevo registro
      setMostrarModalTipoInmueble(true);
    } else {
      const id = typeof window !== 'undefined' ? localStorage.getItem('inmuebleId') : null;
      if (id) {
        setInmuebleId(id);
        setRegistroEnProgreso(true);
        actualizarProgreso(id);
      } else {
        // Si no hay inmuebleId y no es un nuevo registro, mostrar modal
        setMostrarModalTipoInmueble(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar inmuebleId en localStorage cuando cambia
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (inmuebleId) {
      localStorage.setItem('inmuebleId', inmuebleId);
    }
  }, [inmuebleId]);

  const actualizarDatos = (
    campo: keyof InmuebleData,
    valor: string | number | boolean | string[] | Record<string, unknown> | undefined
  ) => {
    setDatos(prev => ({ ...prev, [campo]: valor }));
    // Limpiar error del campo cuando se actualiza
    if (errores[campo]) {
      setErrores(prev => {
        const nuevos = { ...prev };
        delete nuevos[campo];
        return nuevos;
      });
    }
  };

  // Obtener estado/progreso y datos completos desde backend
  const actualizarProgreso = async (id: string) => {
    try {
      const res = await fetch(`/api/caracteristicas-inmueble/${id}/estado-registro`, { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' });
      const result = await res.json();
      
      const estado = result?.data as {
        inmuebleId: string;
        completado: number;
        pasos: Record<string, boolean>;
        ultimaActualizacion: string;
        datos: {
          datosBasicos?: Record<string, unknown>;
          datosJuridico?: Record<string, unknown>;
          datosNotacionMarginal?: Record<string, unknown>;
          datosValuacion?: Record<string, unknown>;
          datosOcupacion?: Record<string, unknown>;
          datosCatastral?: Record<string, unknown>;
          datosRegistral?: Record<string, unknown>;
          datosInspeccion?: Record<string, unknown>;
        };
      } | null;
      
      if (!estado) return;
      // Asegurar que el UUID del inmueble quede sincronizado con backend
      if (estado.inmuebleId) {
        setInmuebleId(estado.inmuebleId);
      }
      
      setProgresoPorcentaje(estado.completado || 0);
      setPasosEstado(estado.pasos || null);

      // Cargar datos existentes en el formulario
      if (estado.datos) {
        const datosExistentes: InmuebleData = {};
        
        // Mapear datos de cada paso al formato del formulario
        if (estado.datos.datosBasicos) {
          Object.assign(datosExistentes, estado.datos.datosBasicos);
        }
        if (estado.datos.datosJuridico) {
          Object.assign(datosExistentes, estado.datos.datosJuridico);
        }
        if (estado.datos.datosNotacionMarginal) {
          Object.assign(datosExistentes, estado.datos.datosNotacionMarginal);
        }
        if (estado.datos.datosValuacion) {
          const fuenteValuacion = Array.isArray(estado.datos.datosValuacion)
            ? estado.datos.datosValuacion[estado.datos.datosValuacion.length - 1]
            : estado.datos.datosValuacion;
          if (fuenteValuacion && typeof fuenteValuacion === 'object') {
            Object.assign(datosExistentes, fuenteValuacion as Record<string, unknown>);
          }
        }
        if (estado.datos.datosOcupacion) {
          Object.assign(datosExistentes, estado.datos.datosOcupacion);
        }
        if (estado.datos.datosCatastral) {
          const fuenteCatastral = Array.isArray(estado.datos.datosCatastral)
            ? estado.datos.datosCatastral[estado.datos.datosCatastral.length - 1]
            : estado.datos.datosCatastral;
          if (fuenteCatastral && typeof fuenteCatastral === 'object') {
            Object.assign(datosExistentes, fuenteCatastral as Record<string, unknown>);
          }
        }
        if (estado.datos.datosRegistral) {
          const fuenteRegistral = Array.isArray(estado.datos.datosRegistral)
            ? estado.datos.datosRegistral[estado.datos.datosRegistral.length - 1]
            : estado.datos.datosRegistral;
          if (fuenteRegistral && typeof fuenteRegistral === 'object') {
            Object.assign(datosExistentes, fuenteRegistral as Record<string, unknown>);
          }
        }
        if (estado.datos.datosInspeccion) {
          const fuenteInspeccion = Array.isArray(estado.datos.datosInspeccion)
            ? estado.datos.datosInspeccion[estado.datos.datosInspeccion.length - 1]
            : estado.datos.datosInspeccion;
          if (fuenteInspeccion && typeof fuenteInspeccion === 'object') {
            Object.assign(datosExistentes, fuenteInspeccion as Record<string, unknown>);
          }
        }
        
        setDatos(datosExistentes);
      }

      // Avanzar automáticamente al siguiente paso incompleto
      const ordenPasosBackend: ReturnType<typeof obtenerPasoBackend>[] = [
        'basico',
        'juridico',
        'notacion_marginal',
        'valuacion',
        'ocupacion',
        'catastral',
        'registral',
        'inspeccion',
      ];
      
      if (estado.pasos) {
        // Encontrar el primer paso incompleto
        const idx = ordenPasosBackend.findIndex((p) => estado.pasos && !estado.pasos[p]);
        
        if (idx >= 0) {
          // Ir al siguiente paso incompleto
          setPasoActual(idx + 1);
          setToast({ 
            type: 'info', 
            message: `Continuando en el paso: ${pasos[idx]?.nombre || 'Desconocido'}` 
          });
        } else if (estado.completado === 100) {
          // Todos los pasos están completos al 100%, ir al último paso
          setPasoActual(ordenPasosBackend.length);
          setToast({ 
            type: 'success', 
            message: 'Registro completo al 100%. Puedes revisar o finalizar el registro.' 
          });
        } else {
          // Caso de fallback: ir al último paso
          setPasoActual(ordenPasosBackend.length);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del inmueble:', error);
      setToast({ type: 'error', message: 'Error al cargar los datos del inmueble' });
    }
  };

  const validarPaso = (paso: number): boolean => {
    const nuevosErrores: Record<string, string> = {};
    
    switch (paso) {
      case 1:
        // Validación básica - todos los campos son opcionales
        break;
      case 2:
        // Jurídico
        if (datos.numeroEscritura && datos.numeroEscritura.length < 2) {
          nuevosErrores.numeroEscritura = 'El número de escritura debe tener al menos 2 caracteres';
        }
        break;
      case 4: {
        // Valuación
        const valorAvaluo = datos.valorSenaladoAvaluo ? Number(datos.valorSenaladoAvaluo) : undefined;
        if (valorAvaluo !== undefined && !Number.isNaN(valorAvaluo) && valorAvaluo <= 0) {
          nuevosErrores.valorSenaladoAvaluo = 'El valor del avalúo debe ser mayor a 0';
        }
        break;
      }
      case 6: {
        // Catastral
        const superficie = datos.superficie ? Number(datos.superficie) : undefined;
        const valorCatastral = datos.valorCatastral ? Number(datos.valorCatastral) : undefined;
        if (superficie !== undefined && !Number.isNaN(superficie) && superficie <= 0) {
          nuevosErrores.superficie = 'La superficie debe ser mayor a 0';
        }
        if (valorCatastral !== undefined && !Number.isNaN(valorCatastral) && valorCatastral <= 0) {
          nuevosErrores.valorCatastral = 'El valor catastral debe ser mayor a 0';
        }
        break;
      }
      case 7:
        // Registral
        if (datos.folioElectronico && datos.folioElectronico.length < 3) {
          nuevosErrores.folioElectronico = 'El folio electrónico debe tener al menos 3 caracteres';
        }
        break;
      // Agregar más validaciones según sea necesario
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Mapeo entre índice de UI y paso del backend
  const obtenerPasoBackend = (indexPaso: number):
    | 'basico'
    | 'juridico'
    | 'notacion_marginal'
    | 'valuacion'
    | 'ocupacion'
    | 'catastral'
    | 'registral'
    | 'inspeccion' => {
    switch (indexPaso) {
      case 1:
        return 'basico';
      case 2:
        return 'juridico';
      case 3:
        return 'notacion_marginal';
      case 4:
        return 'valuacion';
      case 5:
        return 'ocupacion';
      case 6:
        return 'catastral';
      case 7:
        return 'registral';
      case 8:
        return 'inspeccion';
      default:
        return 'basico';
    }
  };

  // Construye el payload específico por paso
  const construirPayloadPaso = (
    paso: ReturnType<typeof obtenerPasoBackend>,
    datosFormulario: InmuebleData
  ): Record<string, unknown> => {
    const pick = <T extends object>(obj: T, keys: (keyof T)[]): Record<string, unknown> => {
      return keys.reduce((acc: Record<string, unknown>, key) => {
        const value = obj[key];
        if (value !== undefined && value !== null && value !== '') {
          acc[String(key)] = value as unknown;
        }
        return acc;
      }, {} as Record<string, unknown>);
    };

    switch (paso) {
      case 'basico': {
        const datosBasicos = pick(datosFormulario, [
          'numeroRegistro',
          'tipoInmueble',
          'propietario',
          'libroRegistro',
          'observaciones',
          'foja',
          'tomo',
          'serie',
          'seccion',
          'construccion',
          'estadoActualInmueble',
          'tipoSuperficie',
          'estado',
          'municipio',
          'medidasColindancias',
          'ubicacionRegistral',
          'ubicacionMaps',
          'coordenadas',
        ]);
        // Si ya existe un inmuebleId, incluirlo en el payload para actualizar
        if (inmuebleId) {
          return { paso: 'basico', inmuebleId, datosBasicos };
        }
        return { paso: 'basico', datosBasicos };
      }
      case 'juridico': {
        const datosJuridico = pick(datosFormulario, [
          'numeroEscritura',
          'volumen',
          'pagina',
          'fedatarioPublico',
          'autoridadEmisora',
          'numeroNotaria',
          'partesIntervienen',
          'fecha',
          'opcionesAdquisicion',
          'areaResguardante',
          'secretariasOrganismosAuxiFideico',
          'superficieEnUso',
          'fechaFirma',
          'vigencia',
          'instrumentoOtorgaUso',
          'archivoJuridico',
          'destinoInmueble',
          'actoJuridico',
          'instrumentoJuridicoUso',
          'instrumentoJuridicoAcredita',
        ]);
        return { paso: 'juridico', inmuebleId, datosJuridico };
      }
      case 'notacion_marginal': {
        const datosNotacionMarginal = pick(datosFormulario, [
          'notacionMarginal',
          'anotacionMarginal',
          'instrumentoObjetoAnotacion',
          'instrumentoGeneral',
          'ligaReferencia',
          'relacionMismoRegistro',
        ]);
        return { paso: 'notacion_marginal', inmuebleId, datosNotacionMarginal };
      }
      case 'valuacion': {
        const datosValuacion = pick(datosFormulario, [
          'numeroAvaluo',
          'valorSenaladoAvaluo',
          'fechaAvaluo',
          'tipoValuacion',
          'pdfValuacion',
        ]);
        return { paso: 'valuacion', inmuebleId, datosValuacion };
      }
      case 'ocupacion': {
        const datosOcupacion = pick(datosFormulario, [
          'senalamientoInmueble',
          'nombreOcupante',
          'tipoOcupante',
          'espacioDisponibleInmueble',
        ]);
        return { paso: 'ocupacion', inmuebleId, datosOcupacion };
      }
      case 'catastral': {
        // Mapear a los nombres válidos del backend (todo string donde aplica)
        const raw = datosFormulario as Record<string, unknown>;
        const toStringIfPresent = (v: unknown) => (v !== undefined && v !== null && v !== '' ? String(v) : undefined);
        const datosCatastral: Record<string, unknown> = {
          ...(toStringIfPresent(raw.direccionPlanoCatastral) ? { direccionPlanoCatastral: String(raw.direccionPlanoCatastral) } : {}),
          ...(toStringIfPresent(raw.claveCatastral) ? { claveCatastral: String(raw.claveCatastral) } : {}),
          ...(toStringIfPresent(raw.valorCatastral) ? { valorCatastral: String(raw.valorCatastral) } : {}),
          ...(toStringIfPresent(raw.baseGravable) ? { baseGravable: String(raw.baseGravable) } : {}),
          ...(toStringIfPresent(raw.planoCatastral) ? { planoCatastral: String(raw.planoCatastral) } : {}),
          ...(toStringIfPresent(raw.fechaPlanoCatastral) ? { fechaPlanoCatastral: String(raw.fechaPlanoCatastral) } : {}),
          ...(toStringIfPresent(raw.superficie) ? { superficie: String(raw.superficie) } : {}),
          ...(toStringIfPresent(raw.levantamientoTopografico) ? { levantamientoTopografico: String(raw.levantamientoTopografico) } : {}),
          ...(toStringIfPresent(raw.fechaLevantamientoTopografico) ? { fechaLevantamientoTopografico: String(raw.fechaLevantamientoTopografico) } : {}),
          // Backend espera pdf_catastral
          ...(toStringIfPresent(raw.pdf) ? { pdf_catastral: String(raw.pdf) } : {}),
        };
        console.log('[Catastral] Datos fuente (UI):', {
          direccionPlanoCatastral: raw.direccionPlanoCatastral,
          claveCatastral: raw.claveCatastral,
          valorCatastral: raw.valorCatastral,
          baseGravable: raw.baseGravable,
          planoCatastral: raw.planoCatastral,
          superficie: raw.superficie,
          fechaPlanoCatastral: raw.fechaPlanoCatastral,
          levantamientoTopografico: raw.levantamientoTopografico,
          fechaLevantamientoTopografico: raw.fechaLevantamientoTopografico,
          pdf: raw.pdf,
        });
        console.log('[Catastral] Payload a enviar:', { paso: 'catastral', inmuebleId, datosCatastral });
        return { paso: 'catastral', inmuebleId, datosCatastral };
      }
      case 'registral': {
        // Mapear a los nombres esperados por backend cuando sea posible
        const raw = datosFormulario as Record<string, unknown>;
        const datosRegistral: Record<string, unknown> = {
          ...(raw.folioReal ? { folioReal: raw.folioReal } : {}),
          ...(raw.numeroInscripcion ? { numeroInscripcion: raw.numeroInscripcion } : {}),
          ...(raw.fechaInscripcion ? { fechaInscripcion: raw.fechaInscripcion } : {}),
          ...(raw.vigenciaInscripcion ? { vigenciaInscripcion: raw.vigenciaInscripcion } : {}),
        };
        // Fallback: si la UI aún usa nombres antiguos, incluimos lo que exista
        if (Object.keys(datosRegistral).length === 0) {
          const legacy = pick(datosFormulario, [
            'folioElectronico',
            'fechaCertificadoLibertad',
            'certificadoLibertadGravamen',
            'archivoAntecedenteRegistral',
            'fechaInscripcionRegistroPublicoPropiedadInmobiliaria',
            'antecedenteRegistral',
            'inscripcionDecreto',
          ]);
          return { paso: 'registral', inmuebleId, datosRegistral: legacy };
        }
        return { paso: 'registral', inmuebleId, datosRegistral };
      }
      case 'inspeccion': {
        // Mapear a nombres válidos del backend y loguear payload
        const raw = datosFormulario as Record<string, unknown>;
        const toStringIfPresent = (v: unknown) => (v !== undefined && v !== null && v !== '' ? String(v) : undefined);
        let datosInspeccion: Record<string, unknown> = {
          ...(toStringIfPresent(raw.responsableInspeccion) ? { responsableInspeccion: String(raw.responsableInspeccion) } : {}),
          ...(raw.evidenciasFotograficas ? { evidenciasFotograficas: raw.evidenciasFotograficas } : {}),
          ...(toStringIfPresent(raw.observacionesInspeccion) ? { observacionesInspeccion: String(raw.observacionesInspeccion) } : {}),
          ...(toStringIfPresent(raw.fechaInspeccionFisicaInmueble) ? { fechaInspeccionFisicaInmueble: String(raw.fechaInspeccionFisicaInmueble) } : {}),
          ...(toStringIfPresent(raw.fechaProximaInspeccion) ? { fechaProximaInspeccion: String(raw.fechaProximaInspeccion) } : {}),
          ...(toStringIfPresent(raw.informeInspeccion) ? { informeInspeccion: String(raw.informeInspeccion) } : {}),
        };
        // Si vacío, intentar mapear desde nombres antiguos a los nuevos
        if (Object.keys(datosInspeccion).length === 0) {
          const legacyPayload: Record<string, unknown> = {};
          if (toStringIfPresent((raw as Record<string, unknown>).responsable)) legacyPayload.responsableInspeccion = String((raw as Record<string, unknown>).responsable);
          if (toStringIfPresent((raw as Record<string, unknown>).fechaInspeccion)) legacyPayload.fechaInspeccionFisicaInmueble = String((raw as Record<string, unknown>).fechaInspeccion);
          if (toStringIfPresent((raw as Record<string, unknown>).fechaProxima)) legacyPayload.fechaProximaInspeccion = String((raw as Record<string, unknown>).fechaProxima);
          if ((raw as Record<string, unknown>).evidenciaUrl) {
            legacyPayload.evidenciasFotograficas = {
              fotos: [
                {
                  url: String((raw as Record<string, unknown>).evidenciaUrl),
                  descripcion: 'Evidencia',
                },
              ],
            } as Record<string, unknown>;
          }
          if (toStringIfPresent((raw as Record<string, unknown>).observaciones)) legacyPayload.observacionesInspeccion = String((raw as Record<string, unknown>).observaciones);
          datosInspeccion = legacyPayload;
          console.log('[Inspeccion] Payload (legacy) a enviar:', { paso: 'inspeccion', inmuebleId, datosInspeccion });
          return { paso: 'inspeccion', inmuebleId, datosInspeccion };
        }
        console.log('[Inspeccion] Payload a enviar:', { paso: 'inspeccion', inmuebleId, datosInspeccion });
        return { paso: 'inspeccion', inmuebleId, datosInspeccion };
      }
      default:
        return { paso: 'basico' };
    }
  };

  // Crea el registro en backend con datos básicos
  const iniciarRegistro = async (): Promise<boolean> => {
    try {
      // Si ya hay una creación en curso, reutilizar la misma promesa
      if (crearBasicoPromiseRef.current) {
        return await crearBasicoPromiseRef.current;
      }
      if (creandoBasicoRef.current) {
        return false;
      }
      creandoBasicoRef.current = true;
      setGuardando(true);
      const payload = construirPayloadPaso('basico', datos);
      
      crearBasicoPromiseRef.current = (async () => {
        const res = await fetch('/api/caracteristicas-inmueble/registro-parcial', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await res.json();
        const nuevoId = result?.data?.inmuebleId as string | undefined;
        if (nuevoId) {
          setInmuebleId(nuevoId);
          setRegistroEnProgreso(true);
          await actualizarProgreso(nuevoId);
        }
        return true;
      })();
      return await crearBasicoPromiseRef.current;
    } catch (error) {
      console.error('Error al iniciar registro:', error);
      setToast({ type: 'error', message: 'Error al iniciar el registro.' });
      return false;
    } finally {
      creandoBasicoRef.current = false;
      crearBasicoPromiseRef.current = null;
      setGuardando(false);
    }
  };

  // Guarda el paso actual para un inmueble existente
  const guardarPaso = async (pasoIndex: number): Promise<boolean> => {
    const paso = obtenerPasoBackend(pasoIndex);
    
    // Si es el paso básico, solo crear nuevo registro si no existe uno
    if (paso === 'basico') {
      if (!inmuebleId) {
        // Si no existe un UUID aún, iniciar registro básico y TERMINAR aquí
        const created = await iniciarRegistro();
        return created;
      } else {
        // Ya existe un registro, solo actualizar el paso básico
        try {
          setGuardando(true);
      const payload = construirPayloadPaso(paso, datos);
      const res = await fetch('/api/caracteristicas-inmueble/registro-parcial', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json().catch(() => null);
          const returnedId = result?.data?.inmuebleId as string | undefined;
          if (returnedId) setInmuebleId(returnedId);
          await actualizarProgreso(returnedId || inmuebleId);
          return true;
        } catch (error) {
          console.error('Error al actualizar paso básico:', error);
          setToast({ type: 'error', message: 'Error al actualizar el paso básico.' });
          return false;
        } finally {
          setGuardando(false);
        }
      }
    }
    
    if (!inmuebleId) {
      // Intentar crear el registro base automáticamente si aún no existe
      const created = await iniciarRegistro();
      if (!created) return false;
    }
    
    try {
      setGuardando(true);
      
      // Construir payload base JSON
      const payload = construirPayloadPaso(paso, datos);
      
      // Enviar como FormData para soportar archivos (aunque no vayan en este paso)
      const formData = new FormData();
      formData.append('paso', String(payload.paso || paso));
      if (inmuebleId) formData.append('inmuebleId', String(inmuebleId));
      // Detectar clave de datos según paso y adjuntarla como JSON
      const claveDatos = (
        paso === 'juridico' ? 'datosJuridico' :
        paso === 'notacion_marginal' ? 'datosNotacionMarginal' :
        paso === 'valuacion' ? 'datosValuacion' :
        paso === 'ocupacion' ? 'datosOcupacion' :
        paso === 'catastral' ? 'datosCatastral' :
        paso === 'registral' ? 'datosRegistral' :
        paso === 'inspeccion' ? 'datosInspeccion' : 'datosBasicos'
      );
      const datosStep = (payload as Record<string, unknown>)[claveDatos] || {};
      // Enviar como string JSON plano (algunos parsers/multer lo requieren así)
      formData.append(claveDatos, JSON.stringify(datosStep));
      
      // Adjuntar archivos si hay en cola
      Object.entries(archivosRef.current).forEach(([campo, valor]) => {
        // campo con formato "paso:nombre_backend"
        const [, nombre] = campo.split(':');
        if (Array.isArray(valor)) {
          // múltiples (evidencias)
          valor.forEach((f) => {
            formData.append(nombre, f as File);
          });
        } else if (valor instanceof File) {
          formData.append(nombre, valor);
        }
      });
      
      const res = await fetch('/api/caracteristicas-inmueble/registro-parcial', { method: 'POST', body: formData });
      const result = await res.json().catch(() => null);
      const returnedId = result?.data?.inmuebleId as string | undefined;
      if (returnedId) setInmuebleId(returnedId);
      
      await actualizarProgreso(returnedId || inmuebleId!);
      // Limpiar archivos ya enviados
      archivosRef.current = {};
      return true;
    } catch {
      setToast({ type: 'error', message: 'Error al guardar el paso.' });
      return false;
    } finally {
      setGuardando(false);
    }
  };

  const siguientePaso = () => {
    const ejecutar = async () => {
      if (!validarPaso(pasoActual)) return;
      // Bloquear clics rápidos inmediatamente
      if (guardando) return;
      setGuardando(true);
      const ok = await guardarPaso(pasoActual);
      if (ok && pasoActual < pasos.length) {
        setPasoActual(pasoActual + 1);
      }
    };
    ejecutar();
  };

  const pasoAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  const enviarFormulario = () => {
    const ejecutar = async () => {
      if (!validarPaso(pasoActual)) return;
      const ok = await guardarPaso(pasoActual);
      if (ok) {
        setToast({ type: 'success', message: 'Registro guardado correctamente' });
        limpiarEstado();
        router.push('/bienes');
      }
    };
    ejecutar();
  };

  // Función para limpiar completamente el estado
  const limpiarEstado = () => {
    setPasoActual(1);
    setDatos({});
    setErrores({});
    setInmuebleId(null);
    setProgresoPorcentaje(0);
    setPasosEstado(null);
    setRegistroEnProgreso(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('inmuebleId');
    }
  };

  // Función para iniciar un nuevo registro
  const iniciarNuevoRegistro = () => {
    if (registroEnProgreso) {
      setMostrarModalNuevoRegistro(true);
    } else {
      // Mostrar modal para seleccionar tipo de inmueble
      setMostrarModalTipoInmueble(true);
    }
  };

  // Función para manejar la selección del tipo de inmueble
  const handleTipoInmuebleSeleccionado = (tipo: 'Normal' | 'Especial') => {
    setTipoInmuebleSeleccionado(tipo);
    setDatos(prev => ({ ...prev, tipoInmueble: tipo }));
    setMostrarModalTipoInmueble(false);
  };

  // Sincronizar tipoInmuebleSeleccionado con datos.tipoInmueble
  useEffect(() => {
    if (datos.tipoInmueble && !tipoInmuebleSeleccionado) {
      setTipoInmuebleSeleccionado(datos.tipoInmueble as 'Normal' | 'Especial');
    }
  }, [datos.tipoInmueble, tipoInmuebleSeleccionado]);

  // Función para confirmar nuevo registro (desde modal)
  const confirmarNuevoRegistro = () => {
    limpiarEstado();
    setMostrarModalNuevoRegistro(false);
    setToast({ type: 'info', message: 'Iniciando nuevo registro de inmueble' });
  };

  // Función para cancelar registro en progreso
  const cancelarRegistro = async () => {
    try {
      if (inmuebleId) {
        // Aquí podrías llamar al backend para marcar el registro como cancelado
        // await api.delete(`/api/v1/inmuebles/${inmuebleId}/cancelar`);
      }
      limpiarEstado();
      setToast({ type: 'info', message: 'Registro cancelado' });
    } catch {
      setToast({ type: 'error', message: 'Error al cancelar el registro' });
    }
  };

  // Almacén temporal de archivos por paso/campo
  const archivosRef = useRef<Record<string, File | File[]>>({});
  const setArchivo = (campo: string, valor: File | File[]) => {
    archivosRef.current[campo] = valor;
  };

  // Log de snapshot de datos del paso actual al cambiar de paso
  useEffect(() => {
    // sin logs
   
  }, [pasoActual]);

  const renderPaso = () => {
    const stepProps = { datos, actualizarDatos, errores, setArchivo };
    
    // Si es inmueble especial, mostrar componente especial
    if (tipoInmuebleSeleccionado === 'Especial') {
      return <InmuebleEspecial {...stepProps} />;
    }
    
    // Flujo normal para inmuebles normales
    switch (pasoActual) {
      case 1:
        return <DatosBasicos {...stepProps} />;
      case 2:
        return <Juridico {...stepProps} />;
      case 3:
        return <NotacionMarginal {...stepProps} />;
      case 4:
        return <Valuacion {...stepProps} />;
      case 5:
        return <Ocupacion {...stepProps} />;
      case 6:
        return <Catastral {...stepProps} />;
      case 7:
        return <Registral {...stepProps} />;
      case 8:
        return <Inspecciones {...stepProps} />;
      default:
        return <div>Paso no implementado</div>;
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#F5F1EE'}}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#676D47] mb-2">
                📋 Registrar Bien Inmueble
                {registroEnProgreso && (
                  <span className="ml-3 text-sm font-normal bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    En progreso ({progresoPorcentaje}%)
                  </span>
                )}
              </h1>
              <p className="text-lg text-gray-600">
                Complete la información del inmueble paso a paso
              </p>
              {tipoInmuebleSeleccionado && (
                <p className="mt-2 text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {tipoInmuebleSeleccionado === 'Especial' ? '⭐' : '🏢'} 
                    Tipo: {tipoInmuebleSeleccionado}
                  </span>
                </p>
              )}
              {inmuebleId && (
                <p className="mt-2 text-xs text-gray-500">
                  UUID: <span className="font-mono bg-gray-100 text-gray-800 px-2 py-1 rounded">{inmuebleId}</span>
                </p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {registroEnProgreso && (
                <button
                  onClick={cancelarRegistro}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200 text-red-700 hover:text-red-900"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancelar</span>
                </button>
              )}
              <button
                onClick={iniciarNuevoRegistro}
                className="flex items-center space-x-2 px-4 py-2 bg-[#676D47] hover:bg-[#5a6140] rounded-lg transition-colors duration-200 text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Nuevo Registro</span>
              </button>
              <Link
                href="/bienes"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-gray-700 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Volver a Bienes</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Indicador de pasos mejorado */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {pasos.map((paso) => (
              <div key={paso.id} className="flex flex-col items-center">
                <button 
                  onClick={() => setPasoActual(paso.id)}
                  className="flex flex-col items-center focus:outline-none w-full"
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                    ((pasosEstado && pasosEstado[obtenerPasoBackend(paso.id)]) || pasoActual > paso.id)
                      ? 'bg-[#676D47] border-[#676D47] text-white shadow-lg scale-110'
                      : pasoActual === paso.id
                      ? 'border-[#676D47] text-[#676D47] bg-green-50 hover:bg-green-100'
                      : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600'
                  }`}>
                    {((pasosEstado && pasosEstado[obtenerPasoBackend(paso.id)]) || pasoActual > paso.id) ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-bold">{paso.id}</span>
                    )}
                  </div>
                  <div className="mt-3 text-center w-full">
                    <p className={`text-xs font-semibold transition-colors duration-200 leading-tight ${
                      ((pasosEstado && pasosEstado[obtenerPasoBackend(paso.id)]) || pasoActual >= paso.id) ? 'text-[#676D47]' : 'text-gray-500'
                    }`}>
                      {paso.nombre}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-tight">{paso.descripcion}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario con mejor diseño */}
        <div className="bg-white shadow-xl rounded-xl p-8 mb-8">
      {renderPaso()}
        </div>

        {/* Navegación mejorada */}
        <div className="flex justify-between items-center bg-white rounded-xl shadow-sm p-6">
          <button
            onClick={pasoAnterior}
            disabled={pasoActual === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              pasoActual === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700 hover:scale-105 shadow-md'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Anterior</span>
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Paso {pasoActual} de {pasos.length}</p>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-[#676D47] h-2 rounded-full transition-all duration-500"
                style={{ width: `${progresoPorcentaje || (pasoActual / pasos.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {pasoActual === pasos.length ? (
            <button
              onClick={enviarFormulario}
              className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-bold transition-all duration-200 shadow-lg ${guardando ? 'bg-green-400 cursor-wait' : 'bg-green-600 hover:bg-green-700 text-white hover:scale-105'}`}
              disabled={guardando}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{guardando ? 'Guardando...' : 'Guardar Inmueble'}</span>
            </button>
          ) : (
            <button
              onClick={siguientePaso}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md ${guardando ? 'bg-[#87906a] cursor-wait' : 'bg-[#676D47] hover:bg-[#5a6140] text-white hover:scale-105'}`}
              disabled={guardando}
            >
              <span>{guardando ? 'Guardando...' : 'Siguiente'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        {/* Modal de confirmación para nuevo registro */}
        {mostrarModalNuevoRegistro && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    ¿Iniciar nuevo registro?
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tienes un registro en progreso que se perderá
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Advertencia:</strong> Si continúas, perderás todos los datos del registro actual. 
                  El registro parcial se mantendrá guardado en el sistema.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setMostrarModalNuevoRegistro(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarNuevoRegistro}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#676D47] hover:bg-[#5a6140] rounded-lg transition-colors duration-200"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para seleccionar tipo de inmueble */}
        <ModalTipoInmueble
          isOpen={mostrarModalTipoInmueble}
          onClose={() => setMostrarModalTipoInmueble(false)}
          onSelect={handleTipoInmuebleSeleccionado}
        />
      </div>
    </div>
  );
}
