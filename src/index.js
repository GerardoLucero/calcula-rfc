/**
 * calcula-rfc
 *
 * Calcula y valida el RFC (Registro Federal de Contribuyentes) de personas fisicas en Mexico,
 * con homoclave y digito verificador, segun el algoritmo publicado por el SAT
 * (documento de respuesta IFAI 0610100135506 065).
 *
 * Sin dependencias.
 */

/** @typedef {{ nombre: string, apellidoPaterno?: string, apellidoMaterno?: string, fechaNacimiento: string | Date }} DatosPersona */

/**
 * @typedef {Object} ResultadoValidacion
 * @property {boolean} valido
 * @property {'fisica' | 'moral' | 'generico' | null} tipo
 * @property {string[]} errores
 */

// Palabras que el SAT sustituye (ultima letra por X) cuando forman las 4 primeras letras.
const PALABRAS_INCONVENIENTES = new Set([
  'BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO', 'COGE', 'COJA',
  'COJE', 'COJI', 'COJO', 'CULO', 'FETO', 'GUEY', 'JOTO', 'KACA', 'KACO', 'KAGA',
  'KAGO', 'KOGE', 'KOJO', 'KAKA', 'KULO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON',
  'MION', 'MOCO', 'MULA', 'PEDA', 'PEDO', 'PENE', 'PUTA', 'PUTO', 'QULO', 'RATA',
  'RUIN'
]);

// Particulas que no se toman en cuenta en apellidos y nombres.
const PARTICULAS = ['DE', 'LA', 'LAS', 'MC', 'VON', 'DEL', 'LOS', 'Y', 'MAC', 'VAN', 'MI'];

// Primeros nombres que se omiten cuando la persona tiene mas de un nombre.
const NOMBRES_OMITIDOS = ['MARIA', 'MA.', 'MA', 'JOSE', 'J.', 'J'];

const VALOR_HOMOCLAVE = {
  ' ': '00', '0': '00', '1': '01', '2': '02', '3': '03', '4': '04', '5': '05',
  '6': '06', '7': '07', '8': '08', '9': '09', '&': '10',
  'A': '11', 'B': '12', 'C': '13', 'D': '14', 'E': '15', 'F': '16', 'G': '17',
  'H': '18', 'I': '19', 'J': '21', 'K': '22', 'L': '23', 'M': '24', 'N': '25',
  'O': '26', 'P': '27', 'Q': '28', 'R': '29', 'S': '32', 'T': '33', 'U': '34',
  'V': '35', 'W': '36', 'X': '37', 'Y': '38', 'Z': '39', 'Ñ': '40'
};

const DIGITOS_HOMOCLAVE = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';

const VALOR_VERIFICADOR = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17, 'I': 18,
  'J': 19, 'K': 20, 'L': 21, 'M': 22, 'N': 23, '&': 24, 'O': 25, 'P': 26, 'Q': 27,
  'R': 28, 'S': 29, 'T': 30, 'U': 31, 'V': 32, 'W': 33, 'X': 34, 'Y': 35, 'Z': 36,
  ' ': 37, 'Ñ': 38
};

// RFC genericos publicados por el SAT.
const RFC_GENERICOS = new Set(['XAXX010101000', 'XEXX010101000']);

const PATRON_FISICA = /^([A-ZÑ&]{4})(\d{6})([A-Z\d]{2})([A\d])$/;
const PATRON_MORAL = /^([A-ZÑ&]{3})(\d{6})([A-Z\d]{2})([A\d])$/;

/** Quita acentos y dieresis, pero conserva la Ñ. Devuelve mayusculas. */
function quitarAcentos(texto) {
  return texto
    .toUpperCase()
    .normalize('NFD')
    .replace(/Ñ/g, 'Ñ')
    .replace(/[̀-ͯ]/g, '');
}

/** Normaliza un texto para el calculo: mayusculas, sin acentos, sin . ' - , y espacios simples. */
function normalizar(texto) {
  if (texto === undefined || texto === null) return '';
  return quitarAcentos(String(texto))
    .replace(/[.'\-,]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Elimina las particulas (DE, LA, MC, ...) como palabras completas. */
function quitarParticulas(texto) {
  return texto
    .split(' ')
    .filter((palabra) => palabra && !PARTICULAS.includes(palabra))
    .join(' ');
}

/** Para las letras iniciales, la Ñ cuenta como N (igual que el SAT al quitar diacriticos). */
function paraLetras(texto) {
  return quitarParticulas(texto).replace(/Ñ/g, 'N');
}

/** Omite MARIA o JOSE (y sus abreviaturas) cuando hay otro nombre despues. */
function nombreParaLetras(nombre) {
  const sinPuntos = quitarAcentos(String(nombre)).replace(/\s+/g, ' ').trim();
  const palabras = sinPuntos.split(' ');
  if (palabras.length > 1 && NOMBRES_OMITIDOS.includes(palabras[0])) {
    palabras.shift();
  }
  return paraLetras(normalizar(palabras.join(' ')));
}

function primeraVocalInterna(palabra) {
  for (let i = 1; i < palabra.length; i++) {
    if ('AEIOU'.includes(palabra[i])) return palabra[i];
  }
  return 'X';
}

function letras(texto, cantidad) {
  return texto.replace(/ /g, '').padEnd(cantidad, 'X').slice(0, cantidad);
}

function letrasIniciales(nombre, apellidoPaterno, apellidoMaterno) {
  const paterno = paraLetras(apellidoPaterno);
  const materno = paraLetras(apellidoMaterno);
  const nombreLimpio = nombreParaLetras(nombre);

  let clave;
  if (!paterno) {
    clave = letras(materno, 2) + letras(nombreLimpio, 2);
  } else if (!materno) {
    clave = letras(paterno, 2) + letras(nombreLimpio, 2);
  } else if (paterno.replace(/ /g, '').length <= 2) {
    clave = letras(paterno, 1) + letras(materno, 1) + letras(nombreLimpio, 2);
  } else {
    const primeraPalabra = paterno.split(' ')[0];
    clave = primeraPalabra[0] + primeraVocalInterna(primeraPalabra) + letras(materno, 1) + letras(nombreLimpio, 1);
  }

  return PALABRAS_INCONVENIENTES.has(clave) ? `${clave.slice(0, 3)}X` : clave;
}

/**
 * Convierte la fecha de nacimiento a AAMMDD.
 * Acepta un objeto Date, 'AAAA-MM-DD' o 'DD/MM/AAAA' (formato mexicano).
 */
function fechaParaRFC(fecha) {
  let anio;
  let mes;
  let dia;

  if (fecha instanceof Date) {
    if (Number.isNaN(fecha.getTime())) throw new Error('La fecha de nacimiento no es valida');
    // new Date('1990-05-15') queda a medianoche UTC; new Date(1990, 4, 15) a medianoche local.
    // Se leen los campos UTC solo en el primer caso, para no recorrer el dia segun la zona horaria.
    const esMedianocheUTC = fecha.getUTCHours() === 0 && fecha.getUTCMinutes() === 0 &&
      fecha.getUTCSeconds() === 0 && fecha.getUTCMilliseconds() === 0;
    anio = esMedianocheUTC ? fecha.getUTCFullYear() : fecha.getFullYear();
    mes = (esMedianocheUTC ? fecha.getUTCMonth() : fecha.getMonth()) + 1;
    dia = esMedianocheUTC ? fecha.getUTCDate() : fecha.getDate();
  } else if (typeof fecha === 'string') {
    const iso = fecha.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const mx = fecha.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (iso) {
      [, anio, mes, dia] = iso.map(Number);
    } else if (mx) {
      [, dia, mes, anio] = mx.map(Number);
    } else {
      throw new Error('La fecha de nacimiento debe ser un Date, "AAAA-MM-DD" o "DD/MM/AAAA"');
    }
  } else {
    throw new Error('La fecha de nacimiento es requerida');
  }

  if (!esFechaValida(anio, mes, dia)) {
    throw new Error('La fecha de nacimiento no existe en el calendario');
  }

  return String(anio % 100).padStart(2, '0') + String(mes).padStart(2, '0') + String(dia).padStart(2, '0');
}

function esFechaValida(anio, mes, dia) {
  if (mes < 1 || mes > 12 || dia < 1) return false;
  const diasDelMes = new Date(Date.UTC(anio, mes, 0)).getUTCDate();
  return dia <= diasDelMes;
}

/**
 * Calcula la homoclave (2 caracteres) a partir del nombre completo.
 * @param {string} nombre
 * @param {string} [apellidoPaterno]
 * @param {string} [apellidoMaterno]
 * @returns {string}
 */
export function calcularHomoclave(nombre, apellidoPaterno = '', apellidoMaterno = '') {
  const completo = [apellidoPaterno, apellidoMaterno, nombre].map(normalizar).filter(Boolean).join(' ');

  let numerico = '0';
  for (const caracter of completo) {
    const valor = VALOR_HOMOCLAVE[caracter];
    if (valor === undefined) {
      throw new Error(`Caracter no permitido en el nombre: "${caracter}"`);
    }
    numerico += valor;
  }

  let suma = 0;
  for (let i = 0; i < numerico.length - 1; i++) {
    suma += Number(numerico.slice(i, i + 2)) * Number(numerico[i + 1]);
  }

  const base = suma % 1000;
  return DIGITOS_HOMOCLAVE[Math.floor(base / 34)] + DIGITOS_HOMOCLAVE[base % 34];
}

/**
 * Calcula el digito verificador de un RFC.
 * Recibe los 12 caracteres de una persona fisica o los 11 de una persona moral.
 * @param {string} rfcSinDigito
 * @returns {string}
 */
export function calcularDigitoVerificador(rfcSinDigito) {
  const base = String(rfcSinDigito).toUpperCase();
  if (base.length !== 11 && base.length !== 12) {
    throw new Error('Se esperan 12 caracteres (persona fisica) u 11 (persona moral)');
  }
  const doce = base.padStart(12, ' ');

  let suma = 0;
  for (let i = 0; i < 12; i++) {
    const valor = VALOR_VERIFICADOR[doce[i]];
    if (valor === undefined) throw new Error(`Caracter no permitido en el RFC: "${doce[i]}"`);
    suma += valor * (13 - i);
  }

  const residuo = suma % 11;
  if (residuo === 0) return '0';
  const digito = 11 - residuo;
  return digito === 10 ? 'A' : String(digito);
}

function datosDesdeArgumentos(args) {
  if (args.length === 1 && args[0] && typeof args[0] === 'object' && !(args[0] instanceof Date)) {
    const { nombre, apellidoPaterno = '', apellidoMaterno = '', fechaNacimiento } = args[0];
    return { nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento };
  }
  const [nombre, apellidoPaterno = '', apellidoMaterno = '', fechaNacimiento] = args;
  return { nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento };
}

/**
 * Calcula el RFC de 13 caracteres de una persona fisica.
 *
 * Se puede llamar con un objeto o con argumentos posicionales:
 *   calculaRFC({ nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento })
 *   calculaRFC(nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento)
 *
 * @param {DatosPersona | string} datosONombre
 * @param {string} [apellidoPaterno]
 * @param {string} [apellidoMaterno]
 * @param {string | Date} [fechaNacimiento]
 * @returns {string}
 */
export function calculaRFC(datosONombre, apellidoPaterno, apellidoMaterno, fechaNacimiento) {
  const datos = datosDesdeArgumentos(
    arguments.length === 1 ? [datosONombre] : [datosONombre, apellidoPaterno, apellidoMaterno, fechaNacimiento]
  );

  if (!normalizar(datos.nombre)) {
    throw new Error('El nombre es requerido');
  }
  if (!paraLetras(normalizar(datos.apellidoPaterno)) && !paraLetras(normalizar(datos.apellidoMaterno))) {
    throw new Error('Se requiere al menos un apellido');
  }

  const clave = letrasIniciales(
    datos.nombre,
    normalizar(datos.apellidoPaterno),
    normalizar(datos.apellidoMaterno)
  );
  const base = clave + fechaParaRFC(datos.fechaNacimiento) +
    calcularHomoclave(datos.nombre, datos.apellidoPaterno, datos.apellidoMaterno);

  return base + calcularDigitoVerificador(base);
}

/**
 * Valida la estructura, la fecha y el digito verificador de un RFC.
 * Reconoce personas fisicas (13), morales (12) y los RFC genericos del SAT.
 *
 * Nota: confirma que el RFC esta bien formado, no que exista en el padron del SAT.
 *
 * @param {string} rfc
 * @returns {ResultadoValidacion}
 */
export function validarRFC(rfc) {
  const errores = [];
  if (typeof rfc !== 'string' || !rfc.trim()) {
    return { valido: false, tipo: null, errores: ['El RFC es requerido'] };
  }

  const limpio = rfc.trim().toUpperCase().replace(/[\s-]/g, '');
  if (RFC_GENERICOS.has(limpio)) {
    return { valido: true, tipo: 'generico', errores };
  }

  const fisica = limpio.match(PATRON_FISICA);
  const moral = limpio.match(PATRON_MORAL);
  const partes = fisica || moral;
  const tipo = fisica ? 'fisica' : moral ? 'moral' : null;

  if (!partes) {
    return { valido: false, tipo: null, errores: ['La estructura no corresponde a un RFC de persona fisica (13) ni moral (12)'] };
  }

  const [, , fecha] = partes;
  const anio = Number(fecha.slice(0, 2));
  const mes = Number(fecha.slice(2, 4));
  const dia = Number(fecha.slice(4, 6));
  // El RFC solo guarda dos digitos del anio: se valida contra un anio bisiesto si es posible.
  const anioCompleto = anio % 4 === 0 ? 2000 + anio : 1900 + anio;
  if (!esFechaValida(anioCompleto, mes, dia)) {
    errores.push('La fecha contenida en el RFC no es valida');
  }

  const esperado = calcularDigitoVerificador(limpio.slice(0, -1));
  if (esperado !== limpio.slice(-1)) {
    errores.push(`El digito verificador no coincide (se esperaba ${esperado})`);
  }

  return { valido: errores.length === 0, tipo, errores };
}

export default calculaRFC;
