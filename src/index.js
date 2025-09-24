'use strict';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/**
 * Librería para calcular el RFC (Registro Federal de Contribuyentes) mexicano
 * incluyendo la homoclave de personas físicas basado en el algoritmo oficial.
 *
 * Basado en el documento "IFAI 0610100135506 065 Algoritmo" del SAT.
 *
 * @author Gerardo Lucero (basado en trabajo de Javier Islas García)
 * @version 2.0.0
 */

// Constantes del algoritmo
const VOCALES = ['A', 'E', 'I', 'O', 'U'];

const PALABRAS_OBSCENAS = [
  'BUEI', 'BATO', 'BOFE', 'BUEY', 'CACA', 'CACO', 'CAGO', 'CAKO', 'CAGA', 'CAKA',
  'COGI', 'COJA', 'COJI', 'COJO', 'COLA', 'CULO', 'COGE', 'COJE', 'FALO', 'FOCA',
  'FETO', 'GATA', 'GETA', 'GUEI', 'GUEY', 'JETA', 'JOTO', 'KAKA', 'KAGA', 'KACA',
  'KOGE', 'KOGI', 'KOJA', 'KOJE', 'KOJI', 'KACO', 'KOLA', 'KAGO', 'KOJO', 'KULO',
  'LILO', 'LOBA', 'LOCA', 'LOKA', 'LOKO', 'LORA', 'LORO', 'LOCO', 'MALA', 'MAMA',
  'MEAR', 'MEON', 'MIAR', 'MOCO', 'MOKO', 'MULA', 'MULO', 'MAMO', 'MAME', 'MEAS',
  'MION', 'NACA', 'NACO', 'PEDA', 'PIPI', 'PITO', 'POPO', 'PEDO', 'PUTA', 'QULO',
  'RUIN', 'PENE', 'PUTO', 'RATA', 'ROBA', 'ROBE', 'ROBO', 'SAPO', 'SENO', 'SOPE',
  'TETA', 'VACA', 'VAGA', 'VAGO', 'VUEI', 'VUEY', 'WUEI', 'WUEY'
];

const SUFIJOS_NOMBRES = ['MARIA', 'JOSE', 'DE', 'DEL', 'LOS', 'LAS', 'LA', 'MA', 'MA.', 'J.', 'J'];

const SUFIJOS_APELLIDOS = ['DE', 'LA', 'LAS', 'MC', 'VON', 'DEL', 'LOS', 'Y', 'MAC', 'VAN'];

const EQUIVALENCIAS_NOMBRE_NUMERICO = {
  'A': '11', 'B': '12', 'C': '13', 'D': '14', 'E': '15', 'F': '16', 'G': '17',
  'H': '18', 'I': '19', 'J': '21', 'K': '22', 'L': '23', 'M': '24', 'N': '25',
  'O': '26', 'P': '27', 'Q': '28', 'R': '29', 'S': '32', 'T': '33', 'U': '34',
  'V': '35', 'W': '36', 'X': '37', 'Y': '38', 'Z': '39', '&': '10', '%': '10'
};

const EQUIVALENCIAS_COCIENTE_RESIDUO = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
  'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
  'W', 'X', 'Y', 'Z'
];

/**
 * Normaliza texto removiendo acentos y caracteres especiales
 * @param {string} str - Texto a normalizar
 * @returns {string} Texto normalizado
 */
function normalizeText(str) {
  const map = {
    'a': 'á|à|ã|â|À|Á|Ã|Â',
    'e': 'é|è|ê|É|È|Ê',
    'i': 'í|ì|î|Í|Ì|Î',
    'o': 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
    'u': 'ú|ù|û|ü|Ú|Ù|Û|Ü',
    'c': 'ç|Ç',
    'n': 'ñ|Ñ'
  };

  let normalized = str.toLowerCase();
  for (const [replacement, pattern] of Object.entries(map)) {
    normalized = normalized.replace(new RegExp(pattern, 'g'), replacement);
  }

  return normalized;
}

/**
 * Limpia y formatea texto para el cálculo del RFC
 * @param {string} value - Texto a limpiar
 * @returns {string} Texto limpio en mayúsculas
 */
function cleanText(value) {
  if (!value || typeof value !== 'string') return '';

  return normalizeText(value)
    .replace(/[/\-Ü]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

/**
 * Valida los parámetros de entrada
 * @param {string} nombres - Nombres de la persona
 * @param {string} apellidoPaterno - Apellido paterno
 * @param {string} apellidoMaterno - Apellido materno
 * @param {string} fechaNacimiento - Fecha de nacimiento
 * @throws {Error} Si algún parámetro es inválido
 */
function validarParametros(nombres, apellidoPaterno, apellidoMaterno, fechaNacimiento) {
  if (!nombres || typeof nombres !== 'string' || nombres.trim() === '') {
    throw new Error('El parámetro [nombres] es requerido y no puede estar vacío');
  }

  if (!apellidoPaterno && !apellidoMaterno) {
    throw new Error('Al menos uno de los apellidos (paterno o materno) debe ser proporcionado');
  }

  if (!fechaNacimiento || typeof fechaNacimiento !== 'string') {
    throw new Error('El parámetro [fechaNacimiento] es requerido');
  }

  // Validar formato de fecha - probar múltiples formatos
  const formatos = ['MM/DD/YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM-DD-YYYY', 'DD-MM-YYYY'];
  let fecha = null;

  for (const formato of formatos) {
    fecha = dayjs(fechaNacimiento, formato, true);
    if (fecha.isValid()) {
      break;
    }
  }

  // Si ningún formato funciona, intentar parsing automático
  if (!fecha || !fecha.isValid()) {
    fecha = dayjs(fechaNacimiento);
  }

  if (!fecha.isValid()) {
    throw new Error('La fecha de nacimiento debe tener un formato válido (ej: MM/DD/YYYY, YYYY-MM-DD, DD/MM/YYYY)');
  }
}

/**
 * Obtiene la primera letra de una cadena
 * @param {string} value - Cadena de texto
 * @returns {string} Primera letra o 'X' si está vacía
 */
function getPrimerLetra(value) {
  return value && value.length > 0 ? value.charAt(0) : 'X';
}

/**
 * Obtiene la segunda letra de una cadena
 * @param {string} value - Cadena de texto
 * @returns {string} Segunda letra o 'X' si no existe
 */
function getSegundaLetra(value) {
  return value && value.length > 1 ? value.charAt(1) : 'X';
}

/**
 * Encuentra la primera vocal interna de una palabra
 * @param {string} value - Palabra a analizar
 * @returns {string} Primera vocal interna o 'X' si no existe
 */
function getPrimerVocalInterna(value) {
  if (!value || value.length <= 1) return 'X';

  for (let i = 1; i < value.length; i++) {
    if (VOCALES.includes(value.charAt(i))) {
      return value.charAt(i);
    }
  }
  return 'X';
}

/**
 * Verifica si una palabra es obscena según la lista del SAT
 * @param {string} palabra - Palabra a verificar
 * @returns {boolean} True si es obscena
 */
function esPalabraObscena(palabra) {
  return PALABRAS_OBSCENAS.includes(palabra);
}

/**
 * Remueve sufijos de nombres que no deben considerarse
 * @param {string} nombres - Nombres completos
 * @returns {string} Nombres sin sufijos
 */
function removerSufijosNombres(nombres) {
  let nombre = nombres;

  while (nombre.includes(' ')) {
    const posicion = nombre.indexOf(' ');
    const palabra = nombre.substring(0, posicion);

    if (!SUFIJOS_NOMBRES.includes(palabra)) {
      break;
    }
    nombre = nombre.substring(posicion + 1);
  }

  return nombre;
}

/**
 * Remueve sufijos de apellidos que no deben considerarse
 * @param {string} apellidos - Apellidos completos
 * @returns {string} Apellidos sin sufijos
 */
function removerSufijosApellidos(apellidos) {
  let apellido = apellidos;

  while (apellido.includes(' ')) {
    const posicion = apellido.indexOf(' ');
    const palabra = apellido.substring(0, posicion);

    if (!SUFIJOS_APELLIDOS.includes(palabra)) {
      break;
    }
    apellido = apellido.substring(posicion + 1);
  }

  return apellido;
}

/**
 * Genera las primeras 4 letras del RFC
 * @param {string} nombre - Nombre limpio
 * @param {string} apellidoPaterno - Apellido paterno limpio
 * @param {string} apellidoMaterno - Apellido materno limpio
 * @returns {string} Primeras 4 letras del RFC
 */
function generarLetrasRFC(nombre, apellidoPaterno, apellidoMaterno) {
  let letras = '';

  if (!apellidoMaterno) {
    // Solo apellido paterno
    letras += getPrimerLetra(apellidoPaterno);
    letras += getSegundaLetra(apellidoPaterno);
    letras += getPrimerLetra(nombre);
    letras += getSegundaLetra(nombre);
  } else if (!apellidoPaterno) {
    // Solo apellido materno
    letras += getPrimerLetra(apellidoMaterno);
    letras += getSegundaLetra(apellidoMaterno);
    letras += getPrimerLetra(nombre);
    letras += getSegundaLetra(nombre);
  } else {
    // Ambos apellidos
    letras += getPrimerLetra(apellidoPaterno);

    if (apellidoPaterno.length <= 2) {
      letras += getPrimerLetra(apellidoMaterno);
      letras += getPrimerLetra(nombre);
      letras += getSegundaLetra(nombre);
    } else {
      letras += getPrimerVocalInterna(apellidoPaterno);
      letras += getPrimerLetra(apellidoMaterno);
      letras += getPrimerLetra(nombre);
    }
  }

  // Verificar si es palabra obscena
  if (esPalabraObscena(letras)) {
    letras = `${letras.substring(0, 3)}X`;
  }

  return letras;
}

/**
 * Convierte fecha de nacimiento al formato del RFC (YYMMDD)
 * @param {string} fechaNacimiento - Fecha de nacimiento
 * @returns {string} Fecha en formato YYMMDD
 */
function generarFechaRFC(fechaNacimiento) {
  // Usar la misma lógica de validación que en validarParametros
  const formatos = ['MM/DD/YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM-DD-YYYY', 'DD-MM-YYYY'];
  let fecha = null;

  for (const formato of formatos) {
    fecha = dayjs(fechaNacimiento, formato, true);
    if (fecha.isValid()) {
      break;
    }
  }

  // Si ningún formato funciona, intentar parsing automático
  if (!fecha || !fecha.isValid()) {
    fecha = dayjs(fechaNacimiento);
  }

  return fecha.format('YYMMDD');
}

/**
 * Obtiene equivalencia numérica de un carácter
 * @param {string} caracter - Carácter a convertir
 * @returns {string} Equivalencia numérica
 */
function getEquivalenciaNumerica(caracter) {
  if (EQUIVALENCIAS_NOMBRE_NUMERICO[caracter]) {
    return EQUIVALENCIAS_NOMBRE_NUMERICO[caracter];
  }

  if (caracter >= '0' && caracter <= '9') {
    return caracter.padStart(2, '0');
  }

  if (caracter === ' ') {
    return '00';
  }

  return null;
}

/**
 * Calcula la homoclave del RFC
 * @param {string} nombres - Nombres originales
 * @param {string} apellidoPaterno - Apellido paterno original
 * @param {string} apellidoMaterno - Apellido materno original
 * @returns {string} Homoclave de 2 caracteres
 */
function calcularHomoclave(nombres, apellidoPaterno, apellidoMaterno) {
  const nombreCompleto = `${apellidoPaterno || ''} ${apellidoMaterno || ''} ${nombres}`.trim();

  // Convertir a equivalencia numérica
  let nombreNumerico = '0';
  for (let i = 0; i < nombreCompleto.length; i++) {
    const equivalencia = getEquivalenciaNumerica(nombreCompleto.charAt(i));
    if (equivalencia !== null) {
      nombreNumerico += equivalencia;
    }
  }

  // Calcular suma ponderada
  let suma = 0;
  for (let i = 0; i < nombreNumerico.length - 1; i++) {
    const digito1 = parseInt(nombreNumerico.charAt(i), 10);
    const digito2 = parseInt(nombreNumerico.charAt(i + 1), 10);
    suma += ((digito1 * 10) + digito2) * digito2;
  }

  // Calcular homoclave
  const base = suma % 1000;
  const cociente = Math.floor(base / 34);
  const residuo = base % 34;

  return EQUIVALENCIAS_COCIENTE_RESIDUO[cociente] + EQUIVALENCIAS_COCIENTE_RESIDUO[residuo];
}

/**
 * Calcula el dígito verificador del RFC
 * @param {string} rfc - RFC sin dígito verificador (12 caracteres)
 * @returns {string} Dígito verificador
 */
function calcularDigitoVerificador(rfc) {
  const valores = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17, 'I': 18,
    'J': 19, 'K': 20, 'L': 21, 'M': 22, 'N': 23, 'O': 25, 'P': 26, 'Q': 27, 'R': 28,
    'S': 29, 'T': 30, 'U': 31, 'V': 32, 'W': 33, 'X': 34, 'Y': 35, 'Z': 36, ' ': 37
  };

  let suma = 0;
  for (let i = 0; i < 12; i++) {
    const caracter = i < rfc.length ? rfc.charAt(i) : ' ';
    const valor = valores[caracter] || 0;
    suma += valor * (13 - i);
  }

  const residuo = suma % 11;

  if (residuo === 0) return '0';
  if (residuo === 1) return 'A';
  return (11 - residuo).toString();
}

/**
 * Calcula el RFC completo de una persona física
 * @param {string} nombres - Nombres de la persona
 * @param {string} apellidoPaterno - Apellido paterno
 * @param {string} apellidoMaterno - Apellido materno
 * @param {string} fechaNacimiento - Fecha de nacimiento (formatos: MM/DD/YYYY, YYYY-MM-DD, etc.)
 * @returns {string} RFC completo con homoclave y dígito verificador
 * @throws {Error} Si los parámetros son inválidos
 *
 * @example
 * // RFC con ambos apellidos
 * calculaRFC('JUAN CARLOS', 'PEREZ', 'GOMEZ', '01/15/1985');
 * // Retorna: 'PEGJ850115AB1'
 *
 * @example
 * // RFC con un solo apellido
 * calculaRFC('MARIA', 'LOPEZ', '', '12/25/1990');
 * // Retorna: 'LOMA901225XY2'
 */
function calculaRFC(nombres, apellidoPaterno = '', apellidoMaterno = '', fechaNacimiento) {
  try {
    // Validar parámetros
    validarParametros(nombres, apellidoPaterno, apellidoMaterno, fechaNacimiento);

    // Limpiar y normalizar datos
    const nombreLimpio = cleanText(nombres);
    const apellidoPaternoLimpio = cleanText(apellidoPaterno);
    const apellidoMaternoLimpio = cleanText(apellidoMaterno);

    // Remover sufijos
    const nombreSinSufijos = removerSufijosNombres(nombreLimpio);
    const apellidoPaternoSinSufijos = removerSufijosApellidos(apellidoPaternoLimpio);
    const apellidoMaternoSinSufijos = removerSufijosApellidos(apellidoMaternoLimpio);

    // Generar componentes del RFC
    const letras = generarLetrasRFC(nombreSinSufijos, apellidoPaternoSinSufijos, apellidoMaternoSinSufijos);
    const fecha = generarFechaRFC(fechaNacimiento);
    const homoclave = calcularHomoclave(nombreLimpio, apellidoPaternoLimpio, apellidoMaternoLimpio);

    // RFC sin dígito verificador
    const rfcSinDigito = letras + fecha + homoclave;

    // Calcular dígito verificador
    const digitoVerificador = calcularDigitoVerificador(rfcSinDigito);

    return rfcSinDigito + digitoVerificador;

  } catch (error) {
    throw new Error(`Error al calcular RFC: ${error.message}`);
  }
}

export default calculaRFC;
