/** Datos de una persona fisica para calcular su RFC. */
export interface DatosPersona {
  nombre: string;
  apellidoPaterno?: string | null;
  apellidoMaterno?: string | null;
  /** Date, "AAAA-MM-DD" o "DD/MM/AAAA". */
  fechaNacimiento: string | Date;
}

export interface ResultadoValidacion {
  valido: boolean;
  tipo: 'fisica' | 'moral' | 'generico' | null;
  errores: string[];
}

/**
 * Calcula el RFC de 13 caracteres de una persona fisica (letras, fecha, homoclave y digito verificador).
 *
 * @example
 * calculaRFC({ nombre: 'Eliud', apellidoPaterno: 'Orozco', apellidoMaterno: 'Gomez', fechaNacimiento: '1952-07-11' });
 * // 'OOGE520711151'
 */
export function calculaRFC(datos: DatosPersona): string;
export function calculaRFC(
  nombre: string,
  apellidoPaterno: string | null | undefined,
  apellidoMaterno: string | null | undefined,
  fechaNacimiento: string | Date
): string;

/**
 * Valida estructura, fecha y digito verificador de un RFC de persona fisica, moral o generico.
 * Confirma que esta bien formado, no que exista en el padron del SAT.
 */
export function validarRFC(rfc: string): ResultadoValidacion;

/** Calcula la homoclave (2 caracteres) a partir del nombre completo. */
export function calcularHomoclave(nombre: string, apellidoPaterno?: string | null, apellidoMaterno?: string | null): string;

/** Calcula el digito verificador de 12 caracteres (persona fisica) u 11 (persona moral). */
export function calcularDigitoVerificador(rfcSinDigito: string): string;

export default calculaRFC;
