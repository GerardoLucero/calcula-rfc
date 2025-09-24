'use strict';

/**
 * Validación completa de RFC, CURP, NSS y otros identificadores fiscales mexicanos
 * 
 * Esta librería proporciona validación robusta para los principales identificadores
 * fiscales y de identidad utilizados en México.
 *
 * @author Gerardo Lucero
 * @version 1.0.0
 */

// Expresiones regulares para validación
const RFC_REGEX = /^[A-Z&Ñ]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
const CURP_REGEX = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;
const NSS_REGEX = /^[0-9]{11}$/;
const CEDULA_REGEX = /^[0-9]{7,8}$/;

// Estados de México para validación de CURP
const ESTADOS_MEXICO = {
  'AS': 'AGUASCALIENTES', 'BC': 'BAJA CALIFORNIA', 'BS': 'BAJA CALIFORNIA SUR',
  'CC': 'CAMPECHE', 'CL': 'COAHUILA', 'CM': 'COLIMA', 'CS': 'CHIAPAS',
  'CH': 'CHIHUAHUA', 'DF': 'DISTRITO FEDERAL', 'DG': 'DURANGO',
  'GT': 'GUANAJUATO', 'GR': 'GUERRERO', 'HG': 'HIDALGO', 'JC': 'JALISCO',
  'MC': 'MEXICO', 'MN': 'MICHOACAN', 'MS': 'MORELOS', 'NT': 'NAYARIT',
  'NL': 'NUEVO LEON', 'OC': 'OAXACA', 'PL': 'PUEBLA', 'QT': 'QUERETARO',
  'QR': 'QUINTANA ROO', 'SP': 'SAN LUIS POTOSI', 'SL': 'SINALOA',
  'SR': 'SONORA', 'TC': 'TABASCO', 'TS': 'TAMAULIPAS', 'TL': 'TLAXCALA',
  'VZ': 'VERACRUZ', 'YN': 'YUCATAN', 'ZS': 'ZACATECAS', 'NE': 'NACIDO EN EL EXTRANJERO'
};

// Palabras inconvenientes que no se permiten en RFC/CURP
const PALABRAS_INCONVENIENTES = [
  'BUEI', 'BUEY', 'CACA', 'CACO', 'CAGA', 'CAGO', 'CAKA', 'CAKO',
  'COGE', 'COGI', 'COJA', 'COJE', 'COJI', 'COJO', 'COLA', 'CULO',
  'FALO', 'FETO', 'GETA', 'GUEI', 'GUEY', 'JETA', 'JOTO', 'KACA',
  'KACO', 'KAGA', 'KAGO', 'KAKA', 'KAKO', 'KOGE', 'KOGI', 'KOJA',
  'KOJE', 'KOJI', 'KOJO', 'KOLA', 'KULO', 'LILO', 'LOCA', 'LOCO',
  'LOKA', 'LOKO', 'MAME', 'MAMO', 'MEAR', 'MEAS', 'MEON', 'MIAR',
  'MION', 'MOCO', 'MOKO', 'MULA', 'MULO', 'NACA', 'NACO', 'PEDA',
  'PEDO', 'PENE', 'PIPI', 'PITO', 'POPO', 'PUTA', 'PUTO', 'QULO',
  'RATA', 'ROBA', 'ROBE', 'ROBO', 'RUIN', 'SENO', 'TETA', 'VACA',
  'VAGA', 'VAGO', 'VAKA', 'VUEI', 'VUEY', 'WUEI', 'WUEY'
];

/**
 * Valida un RFC mexicano
 * @param {string} rfc - RFC a validar
 * @returns {boolean} True si es válido, false en caso contrario
 */
export function validarRFC(rfc) {
  if (!rfc || typeof rfc !== 'string') {
    return false;
  }
  
  const rfcLimpio = rfc.trim().toUpperCase().replace(/\s+/g, '');
  
  // Validar formato básico
  if (!RFC_REGEX.test(rfcLimpio)) {
    return false;
  }
  
  // Extraer partes del RFC
  const isPersonaMoral = rfcLimpio.length === 12;
  const fechaInicio = isPersonaMoral ? 3 : 4;
  const fechaParte = rfcLimpio.substring(fechaInicio, fechaInicio + 6);
  
  // Validar fecha
  if (!validarFechaRFC(fechaParte)) {
    return false;
  }
  
  // Validar que no sea una palabra inconveniente
  const iniciales = rfcLimpio.substring(0, isPersonaMoral ? 3 : 4);
  if (PALABRAS_INCONVENIENTES.includes(iniciales)) {
    return false;
  }
  
  return true;
}

/**
 * Valida una CURP mexicana
 * @param {string} curp - CURP a validar
 * @returns {boolean} True si es válido, false en caso contrario
 */
export function validarCURP(curp) {
  if (!curp || typeof curp !== 'string') {
    return false;
  }
  
  const curpLimpia = curp.trim().toUpperCase().replace(/\s+/g, '');
  
  // Validar formato básico
  if (!CURP_REGEX.test(curpLimpia)) {
    return false;
  }
  
  // Validar fecha de nacimiento
  const fechaParte = curpLimpia.substring(4, 10);
  if (!validarFechaCURP(fechaParte)) {
    return false;
  }
  
  // Validar estado de nacimiento
  const estadoCodigo = curpLimpia.substring(11, 13);
  if (!ESTADOS_MEXICO[estadoCodigo]) {
    return false;
  }
  
  // Validar que no sea una palabra inconveniente
  const iniciales = curpLimpia.substring(0, 4);
  if (PALABRAS_INCONVENIENTES.includes(iniciales)) {
    return false;
  }
  
  // Validar dígito verificador
  return validarDigitoVerificadorCURP(curpLimpia);
}

/**
 * Valida un NSS (Número de Seguridad Social)
 * @param {string} nss - NSS a validar
 * @returns {boolean} True si es válido, false en caso contrario
 */
export function validarNSS(nss) {
  if (!nss || typeof nss !== 'string') {
    return false;
  }
  
  const nssLimpio = nss.trim().replace(/[-\s]/g, '');
  
  // Validar formato básico
  if (!NSS_REGEX.test(nssLimpio)) {
    return false;
  }
  
  // Validar que no sean todos ceros o números consecutivos
  if (nssLimpio === '00000000000' || 
      nssLimpio === '11111111111' || 
      nssLimpio === '12345678901') {
    return false;
  }
  
  return validarDigitoVerificadorNSS(nssLimpio);
}

/**
 * Valida una cédula profesional
 * @param {string} cedula - Cédula profesional a validar
 * @returns {boolean} True si es válido, false en caso contrario
 */
export function validarCedula(cedula) {
  if (!cedula || typeof cedula !== 'string') {
    return false;
  }
  
  const cedulaLimpia = cedula.trim().replace(/\s+/g, '');
  
  // Validar formato básico (7 u 8 dígitos)
  if (!CEDULA_REGEX.test(cedulaLimpia)) {
    return false;
  }
  
  // Validar que no sean todos iguales
  const primerDigito = cedulaLimpia[0];
  if (cedulaLimpia.split('').every(digit => digit === primerDigito)) {
    return false;
  }
  
  return true;
}

/**
 * Detecta automáticamente el tipo de identificador fiscal
 * @param {string} identificador - Identificador a analizar
 * @returns {string} Tipo detectado: 'RFC', 'CURP', 'NSS', 'CEDULA' o 'DESCONOCIDO'
 */
export function detectarTipo(identificador) {
  if (!identificador || typeof identificador !== 'string') {
    return 'DESCONOCIDO';
  }
  
  const id = identificador.trim().toUpperCase().replace(/\s+/g, '');
  
  if (RFC_REGEX.test(id)) return 'RFC';
  if (CURP_REGEX.test(id)) return 'CURP';
  if (NSS_REGEX.test(id.replace(/[-]/g, ''))) return 'NSS';
  if (CEDULA_REGEX.test(id)) return 'CEDULA';
  
  return 'DESCONOCIDO';
}

/**
 * Valida cualquier identificador fiscal mexicano
 * @param {string} identificador - Identificador a validar
 * @returns {Object} Objeto con el resultado de la validación
 */
export function validarIdentificador(identificador) {
  const tipo = detectarTipo(identificador);
  let esValido = false;
  let detalles = {};
  
  const idLimpio = identificador ? identificador.trim().toUpperCase().replace(/\s+/g, '') : '';
  
  switch (tipo) {
    case 'RFC':
      esValido = validarRFC(identificador);
      detalles = extraerDetallesRFC(idLimpio);
      break;
    case 'CURP':
      esValido = validarCURP(identificador);
      detalles = extraerDetallesCURP(idLimpio);
      break;
    case 'NSS':
      esValido = validarNSS(identificador);
      detalles = extraerDetallesNSS(idLimpio);
      break;
    case 'CEDULA':
      esValido = validarCedula(identificador);
      break;
    default:
      esValido = false;
  }
  
  return {
    identificador: idLimpio,
    tipo,
    esValido,
    detalles
  };
}

/**
 * Extrae detalles de un RFC válido
 * @param {string} rfc - RFC válido
 * @returns {Object} Detalles del RFC
 */
function extraerDetallesRFC(rfc) {
  if (!validarRFC(rfc)) return {};
  
  const isPersonaMoral = rfc.length === 12;
  const fechaInicio = isPersonaMoral ? 3 : 4;
  const fechaParte = rfc.substring(fechaInicio, fechaInicio + 6);
  
  return {
    tipoPersona: isPersonaMoral ? 'MORAL' : 'FISICA',
    iniciales: rfc.substring(0, fechaInicio),
    fechaNacimiento: parsearFechaRFC(fechaParte),
    homoclave: rfc.substring(fechaInicio + 6, fechaInicio + 8),
    digitoVerificador: rfc.substring(fechaInicio + 8)
  };
}

/**
 * Extrae detalles de una CURP válida
 * @param {string} curp - CURP válida
 * @returns {Object} Detalles de la CURP
 */
function extraerDetallesCURP(curp) {
  if (!validarCURP(curp)) return {};
  
  const fechaParte = curp.substring(4, 10);
  const sexo = curp.charAt(10);
  const estadoCodigo = curp.substring(11, 13);
  
  return {
    iniciales: curp.substring(0, 4),
    fechaNacimiento: parsearFechaCURP(fechaParte),
    sexo: sexo === 'H' ? 'HOMBRE' : 'MUJER',
    estadoNacimiento: ESTADOS_MEXICO[estadoCodigo] || 'DESCONOCIDO',
    consonantesInternas: curp.substring(13, 16),
    digitoVerificador: curp.charAt(17)
  };
}

/**
 * Extrae detalles de un NSS válido
 * @param {string} nss - NSS válido
 * @returns {Object} Detalles del NSS
 */
function extraerDetallesNSS(nss) {
  if (!validarNSS(nss)) return {};
  
  return {
    subdelegacion: nss.substring(0, 2),
    año: '19' + nss.substring(2, 4),
    numeroConsecutivo: nss.substring(4, 9),
    digitoVerificador: nss.substring(9, 11)
  };
}

/**
 * Valida la fecha en formato RFC (AAMMDD)
 * @param {string} fecha - Fecha en formato AAMMDD
 * @returns {boolean} True si es válida
 */
function validarFechaRFC(fecha) {
  if (fecha.length !== 6) return false;
  
  const año = parseInt(fecha.substring(0, 2));
  const mes = parseInt(fecha.substring(2, 4));
  const dia = parseInt(fecha.substring(4, 6));
  
  // Determinar siglo (asumimos que años 00-30 son 2000-2030, 31-99 son 1931-1999)
  const añoCompleto = año <= 30 ? 2000 + año : 1900 + año;
  
  return validarFechaCompleta(añoCompleto, mes, dia);
}

/**
 * Valida la fecha en formato CURP (AAMMDD)
 * @param {string} fecha - Fecha en formato AAMMDD
 * @returns {boolean} True si es válida
 */
function validarFechaCURP(fecha) {
  return validarFechaRFC(fecha);
}

/**
 * Valida una fecha completa
 * @param {number} año - Año completo
 * @param {number} mes - Mes (1-12)
 * @param {number} dia - Día (1-31)
 * @returns {boolean} True si es válida
 */
function validarFechaCompleta(año, mes, dia) {
  if (año < 1900 || año > new Date().getFullYear()) return false;
  if (mes < 1 || mes > 12) return false;
  if (dia < 1 || dia > 31) return false;
  
  // Validar días por mes
  const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Año bisiesto
  if (mes === 2 && esBisiesto(año)) {
    diasPorMes[1] = 29;
  }
  
  return dia <= diasPorMes[mes - 1];
}

/**
 * Verifica si un año es bisiesto
 * @param {number} año - Año a verificar
 * @returns {boolean} True si es bisiesto
 */
function esBisiesto(año) {
  return (año % 4 === 0 && año % 100 !== 0) || (año % 400 === 0);
}

/**
 * Parsea una fecha RFC a formato legible
 * @param {string} fecha - Fecha en formato AAMMDD
 * @returns {string} Fecha en formato DD/MM/AAAA
 */
function parsearFechaRFC(fecha) {
  const año = parseInt(fecha.substring(0, 2));
  const mes = fecha.substring(2, 4);
  const dia = fecha.substring(4, 6);
  const añoCompleto = año <= 30 ? 2000 + año : 1900 + año;
  
  return `${dia}/${mes}/${añoCompleto}`;
}

/**
 * Parsea una fecha CURP a formato legible
 * @param {string} fecha - Fecha en formato AAMMDD
 * @returns {string} Fecha en formato DD/MM/AAAA
 */
function parsearFechaCURP(fecha) {
  return parsearFechaRFC(fecha);
}

/**
 * Valida el dígito verificador de una CURP
 * @param {string} curp - CURP completa
 * @returns {boolean} True si el dígito verificador es correcto
 */
function validarDigitoVerificadorCURP(curp) {
  const valores = '0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  let suma = 0;
  
  for (let i = 0; i < 17; i++) {
    const valor = valores.indexOf(curp.charAt(i));
    suma += valor * (18 - i);
  }
  
  const residuo = suma % 10;
  const digitoCalculado = residuo === 0 ? '0' : (10 - residuo).toString();
  
  return digitoCalculado === curp.charAt(17);
}

/**
 * Valida el dígito verificador de un NSS
 * @param {string} nss - NSS completo
 * @returns {boolean} True si el dígito verificador es correcto
 */
function validarDigitoVerificadorNSS(nss) {
  const base = nss.substring(0, 9);
  let suma = 0;
  
  for (let i = 0; i < 9; i++) {
    suma += parseInt(base.charAt(i)) * (10 - i);
  }
  
  const residuo = suma % 11;
  let digitoCalculado;
  
  if (residuo === 0) {
    digitoCalculado = '00';
  } else if (residuo === 1) {
    digitoCalculado = '00'; // Caso especial
  } else {
    const digito = 11 - residuo;
    digitoCalculado = digito.toString().padStart(2, '0');
  }
  
  return digitoCalculado === nss.substring(9, 11);
}

/**
 * Calculadora completa de nómina mexicana 2024
 * Incluye IMSS, ISR, Infonavit, y todas las deducciones oficiales
 */

// Constantes 2024
const UMA_2024 = {
  diaria: 108.57,
  mensual: 3297.57,
  anual: 39570.84
};

const SALARIO_MINIMO_2024 = {
  general: 248.93,
  fronterizo: 374.89
};

// Tarifas IMSS 2024
const TARIFAS_IMSS = {
  cuotasFijas: {
    enfermedadMaternidad: {
      patronal: 0.204,
      obrera: 0.0075,
      gobierno: 0.0013
    },
    invalidezVida: {
      patronal: 0.0175,
      obrera: 0.00625,
      gobierno: 0.00125
    },
    retiroCesantiaVejez: {
      retiro: 0.02,
      cesantiaVejez: 0.03,
      obrera: 0.01125
    },
    guarderias: {
      patronal: 0.01
    },
    riesgoTrabajo: {
      claseI: 0.0054,
      claseII: 0.0109,
      claseIII: 0.0193,
      claseIV: 0.0252,
      claseV: 0.0749
    },
    infonavit: {
      patronal: 0.05
    }
  },
  excedentes: {
    enfermedadMaternidad: {
      patronal: 0.0106,
      obrera: 0.0038,
      gobierno: 0.0014
    },
    invalidezVida: {
      patronal: 0.007,
      obrera: 0.0025,
      gobierno: 0.0005
    }
  }
};

// Tarifas ISR 2024 (simplificadas para nómina)
const TARIFAS_ISR_2024 = [
  { limite_inferior: 0.01, limite_superior: 746.04, cuota_fija: 0, porcentaje: 1.92 },
  { limite_inferior: 746.05, limite_superior: 6332.05, cuota_fija: 14.32, porcentaje: 6.40 },
  { limite_inferior: 6332.06, limite_superior: 11128.01, cuota_fija: 371.83, porcentaje: 10.88 },
  { limite_inferior: 11128.02, limite_superior: 12935.82, cuota_fija: 893.63, porcentaje: 16.00 },
  { limite_inferior: 12935.83, limite_superior: 15487.71, cuota_fija: 1182.88, porcentaje: 21.36 },
  { limite_inferior: 15487.72, limite_superior: 31236.49, cuota_fija: 1727.83, porcentaje: 23.52 },
  { limite_inferior: 31236.50, limite_superior: 49233.00, cuota_fija: 5429.49, porcentaje: 30.00 },
  { limite_inferior: 49233.01, limite_superior: 93993.90, cuota_fija: 10828.32, porcentaje: 32.00 },
  { limite_inferior: 93993.91, limite_superior: 125325.20, cuota_fija: 25123.80, porcentaje: 34.00 },
  { limite_inferior: 125325.21, limite_superior: Infinity, cuota_fija: 35775.24, porcentaje: 35.00 }
];

const SUBSIDIO_EMPLEO_2024 = [
  { limite_inferior: 0.01, limite_superior: 1768.96, subsidio: 407.02 },
  { limite_inferior: 1768.97, limite_superior: 2653.38, subsidio: 406.83 },
  { limite_inferior: 2653.39, limite_superior: 3472.84, subsidio: 406.62 },
  { limite_inferior: 3472.85, limite_superior: 3537.87, subsidio: 392.77 },
  { limite_inferior: 3537.88, limite_superior: 4446.15, subsidio: 382.46 },
  { limite_inferior: 4446.16, limite_superior: 4717.18, subsidio: 354.23 },
  { limite_inferior: 4717.19, limite_superior: 5335.42, subsidio: 324.87 },
  { limite_inferior: 5335.43, limite_superior: 6224.67, subsidio: 294.63 },
  { limite_inferior: 6224.68, limite_superior: 7113.90, subsidio: 253.54 },
  { limite_inferior: 7113.91, limite_superior: 7382.33, subsidio: 217.61 },
  { limite_inferior: 7382.34, limite_superior: Infinity, subsidio: 0 }
];

/**
 * Calcula las cuotas IMSS para empleado y patrón
 * @param {number} salarioIntegrado - Salario base de cotización
 * @param {string} claseRiesgo - Clase de riesgo (I, II, III, IV, V)
 * @returns {Object} Cuotas IMSS desglosadas
 */
export function calcularIMSS(salarioIntegrado, claseRiesgo = 'I') {
  if (!salarioIntegrado || salarioIntegrado <= 0) {
    throw new Error('El salario integrado debe ser mayor a cero');
  }

  const limiteSuperior = UMA_2024.mensual * 25; // 25 UMAs
  const baseCotizacion = Math.min(salarioIntegrado, limiteSuperior);
  const excedente = Math.max(0, salarioIntegrado - (UMA_2024.mensual * 3));

  // Cuotas fijas
  const enfermedadMaternidad = {
    patronal: baseCotizacion * TARIFAS_IMSS.cuotasFijas.enfermedadMaternidad.patronal,
    obrera: baseCotizacion * TARIFAS_IMSS.cuotasFijas.enfermedadMaternidad.obrera,
    gobierno: baseCotizacion * TARIFAS_IMSS.cuotasFijas.enfermedadMaternidad.gobierno
  };

  // Excedentes (sobre 3 UMAs)
  const excedenteEnfermedad = {
    patronal: excedente * TARIFAS_IMSS.excedentes.enfermedadMaternidad.patronal,
    obrera: excedente * TARIFAS_IMSS.excedentes.enfermedadMaternidad.obrera,
    gobierno: excedente * TARIFAS_IMSS.excedentes.enfermedadMaternidad.gobierno
  };

  const invalidezVida = {
    patronal: baseCotizacion * TARIFAS_IMSS.cuotasFijas.invalidezVida.patronal,
    obrera: baseCotizacion * TARIFAS_IMSS.cuotasFijas.invalidezVida.obrera,
    gobierno: baseCotizacion * TARIFAS_IMSS.cuotasFijas.invalidezVida.gobierno
  };

  const excedenteInvalidez = {
    patronal: excedente * TARIFAS_IMSS.excedentes.invalidezVida.patronal,
    obrera: excedente * TARIFAS_IMSS.excedentes.invalidezVida.obrera,
    gobierno: excedente * TARIFAS_IMSS.excedentes.invalidezVida.gobierno
  };

  const retiroCesantia = {
    retiro: baseCotizacion * TARIFAS_IMSS.cuotasFijas.retiroCesantiaVejez.retiro,
    cesantiaVejez: baseCotizacion * TARIFAS_IMSS.cuotasFijas.retiroCesantiaVejez.cesantiaVejez,
    obrera: baseCotizacion * TARIFAS_IMSS.cuotasFijas.retiroCesantiaVejez.obrera
  };

  const guarderias = {
    patronal: baseCotizacion * TARIFAS_IMSS.cuotasFijas.guarderias.patronal
  };

  const riesgoTrabajo = {
    patronal: baseCotizacion * TARIFAS_IMSS.cuotasFijas.riesgoTrabajo[`clase${claseRiesgo}`]
  };

  const infonavit = {
    patronal: baseCotizacion * TARIFAS_IMSS.cuotasFijas.infonavit.patronal
  };

  // Totales
  const totalPatronal = enfermedadMaternidad.patronal + excedenteEnfermedad.patronal +
                       invalidezVida.patronal + excedenteInvalidez.patronal +
                       retiroCesantia.retiro + retiroCesantia.cesantiaVejez +
                       guarderias.patronal + riesgoTrabajo.patronal + infonavit.patronal;

  const totalObrera = enfermedadMaternidad.obrera + excedenteEnfermedad.obrera +
                     invalidezVida.obrera + excedenteInvalidez.obrera +
                     retiroCesantia.obrera;

  return {
    salarioIntegrado: parseFloat(salarioIntegrado.toFixed(2)),
    baseCotizacion: parseFloat(baseCotizacion.toFixed(2)),
    excedente: parseFloat(excedente.toFixed(2)),
    cuotas: {
      enfermedadMaternidad: {
        patronal: parseFloat(enfermedadMaternidad.patronal.toFixed(2)),
        obrera: parseFloat(enfermedadMaternidad.obrera.toFixed(2)),
        gobierno: parseFloat(enfermedadMaternidad.gobierno.toFixed(2))
      },
      excedenteEnfermedad: {
        patronal: parseFloat(excedenteEnfermedad.patronal.toFixed(2)),
        obrera: parseFloat(excedenteEnfermedad.obrera.toFixed(2)),
        gobierno: parseFloat(excedenteEnfermedad.gobierno.toFixed(2))
      },
      invalidezVida: {
        patronal: parseFloat(invalidezVida.patronal.toFixed(2)),
        obrera: parseFloat(invalidezVida.obrera.toFixed(2)),
        gobierno: parseFloat(invalidezVida.gobierno.toFixed(2))
      },
      excedenteInvalidez: {
        patronal: parseFloat(excedenteInvalidez.patronal.toFixed(2)),
        obrera: parseFloat(excedenteInvalidez.obrera.toFixed(2)),
        gobierno: parseFloat(excedenteInvalidez.gobierno.toFixed(2))
      },
      retiroCesantia: {
        retiro: parseFloat(retiroCesantia.retiro.toFixed(2)),
        cesantiaVejez: parseFloat(retiroCesantia.cesantiaVejez.toFixed(2)),
        obrera: parseFloat(retiroCesantia.obrera.toFixed(2))
      },
      guarderias: {
        patronal: parseFloat(guarderias.patronal.toFixed(2))
      },
      riesgoTrabajo: {
        patronal: parseFloat(riesgoTrabajo.patronal.toFixed(2))
      },
      infonavit: {
        patronal: parseFloat(infonavit.patronal.toFixed(2))
      }
    },
    totales: {
      patronal: parseFloat(totalPatronal.toFixed(2)),
      obrera: parseFloat(totalObrera.toFixed(2)),
      total: parseFloat((totalPatronal + totalObrera).toFixed(2))
    }
  };
}

/**
 * Calcula ISR mensual para nómina
 * @param {number} ingresoGravable - Ingreso gravable mensual
 * @returns {Object} Cálculo de ISR
 */
export function calcularISRNomina(ingresoGravable) {
  if (!ingresoGravable || ingresoGravable < 0) {
    throw new Error('El ingreso gravable debe ser mayor o igual a cero');
  }

  // Encontrar tarifa aplicable
  const tarifa = TARIFAS_ISR_2024.find(t => 
    ingresoGravable >= t.limite_inferior && ingresoGravable <= t.limite_superior
  );

  if (!tarifa) {
    throw new Error('No se encontró tarifa aplicable');
  }

  // Calcular ISR
  const excedente = ingresoGravable - tarifa.limite_inferior + 0.01;
  const impuestoMarginal = excedente * (tarifa.porcentaje / 100);
  const isrAntesSubsidio = tarifa.cuota_fija + impuestoMarginal;

  // Calcular subsidio
  const tarifaSubsidio = SUBSIDIO_EMPLEO_2024.find(s => 
    ingresoGravable >= s.limite_inferior && ingresoGravable <= s.limite_superior
  );
  const subsidio = tarifaSubsidio ? tarifaSubsidio.subsidio : 0;

  const isrFinal = Math.max(0, isrAntesSubsidio - subsidio);

  return {
    ingresoGravable: parseFloat(ingresoGravable.toFixed(2)),
    isrAntesSubsidio: parseFloat(isrAntesSubsidio.toFixed(2)),
    subsidio: parseFloat(subsidio.toFixed(2)),
    isrFinal: parseFloat(isrFinal.toFixed(2)),
    tarifa: {
      limite_inferior: tarifa.limite_inferior,
      limite_superior: tarifa.limite_superior,
      cuota_fija: tarifa.cuota_fija,
      porcentaje: tarifa.porcentaje
    }
  };
}

/**
 * Calcula descuento de crédito Infonavit
 * @param {number} salarioIntegrado - Salario base de cotización
 * @param {number} factorDescuento - Factor de descuento (1-10)
 * @param {string} tipoCredito - Tipo de crédito ('veces_salario_minimo' o 'porcentaje')
 * @returns {Object} Cálculo del descuento
 */
export function calcularDescuentoInfonavit(salarioIntegrado, factorDescuento, tipoCredito = 'veces_salario_minimo') {
  if (!salarioIntegrado || salarioIntegrado <= 0) {
    throw new Error('El salario integrado debe ser mayor a cero');
  }

  if (!factorDescuento || factorDescuento <= 0) {
    throw new Error('El factor de descuento debe ser mayor a cero');
  }

  let descuento = 0;

  if (tipoCredito === 'veces_salario_minimo') {
    // Factor por veces salario mínimo
    const factoresSalarioMinimo = {
      1: 0.05, 2: 0.10, 3: 0.15, 4: 0.20, 5: 0.25,
      6: 0.30, 7: 0.35, 8: 0.40, 9: 0.45, 10: 0.50
    };
    
    const porcentaje = factoresSalarioMinimo[factorDescuento] || 0.05;
    descuento = salarioIntegrado * porcentaje;
  } else if (tipoCredito === 'porcentaje') {
    // Descuento directo por porcentaje
    descuento = salarioIntegrado * (factorDescuento / 100);
  }

  // Límite máximo del 20% del salario
  const limiteMaximo = salarioIntegrado * 0.20;
  descuento = Math.min(descuento, limiteMaximo);

  return {
    salarioIntegrado: parseFloat(salarioIntegrado.toFixed(2)),
    factorDescuento,
    tipoCredito,
    descuento: parseFloat(descuento.toFixed(2)),
    porcentajeDescuento: parseFloat(((descuento / salarioIntegrado) * 100).toFixed(2)),
    limiteMaximo: parseFloat(limiteMaximo.toFixed(2))
  };
}

/**
 * Calcula nómina completa de un empleado
 * @param {Object} empleado - Datos del empleado
 * @param {Object} opciones - Opciones adicionales
 * @returns {Object} Nómina completa calculada
 */
export function calcularNominaCompleta(empleado, opciones = {}) {
  const {
    nombre = 'Empleado',
    salarioDiario,
    diasTrabajados = 30,
    claseRiesgo = 'I',
    tieneInfonavit = false,
    factorInfonavit = 0,
    tipoCredito = 'veces_salario_minimo',
    prestaciones = {},
    deducciones = {}
  } = empleado;

  const {
    calcularAnual = false,
    aplicarSubsidio = true
  } = opciones;

  if (!salarioDiario || salarioDiario <= 0) {
    throw new Error('El salario diario debe ser mayor a cero');
  }

  // Cálculos base
  const salarioBase = salarioDiario * diasTrabajados;
  const salarioIntegrado = salarioBase * 1.0452; // Factor de integración promedio

  // Prestaciones
  const prestacionesCalculadas = {
    aguinaldo: prestaciones.aguinaldo || 0,
    vacaciones: prestaciones.vacaciones || 0,
    primaVacacional: prestaciones.primaVacacional || 0,
    valesDespensa: prestaciones.valesDespensa || 0,
    otrasPerceciones: prestaciones.otras || 0
  };

  const totalPrestaciones = Object.values(prestacionesCalculadas).reduce((sum, val) => sum + val, 0);
  const ingresoGravable = salarioBase + totalPrestaciones;

  // Cálculos de deducciones
  const imss = calcularIMSS(salarioIntegrado, claseRiesgo);
  const isr = calcularISRNomina(ingresoGravable);
  
  let infonavit = { descuento: 0 };
  if (tieneInfonavit && factorInfonavit > 0) {
    infonavit = calcularDescuentoInfonavit(salarioIntegrado, factorInfonavit, tipoCredito);
  }

  // Otras deducciones
  const otrasDeduccionesCalculadas = {
    prestamosPersonales: deducciones.prestamos || 0,
    pensionAlimenticia: deducciones.pension || 0,
    seguroVida: deducciones.seguroVida || 0,
    fondoAhorro: deducciones.fondoAhorro || 0,
    otras: deducciones.otras || 0
  };

  const totalOtrasDeducciones = Object.values(otrasDeduccionesCalculadas).reduce((sum, val) => sum + val, 0);

  // Totales
  const totalPerceciones = salarioBase + totalPrestaciones;
  const totalDeducciones = imss.totales.obrera + isr.isrFinal + infonavit.descuento + totalOtrasDeducciones;
  const sueldoNeto = totalPerceciones - totalDeducciones;

  // Cálculo anual (opcional)
  let calculoAnual = null;
  if (calcularAnual) {
    calculoAnual = {
      salarioAnual: salarioBase * 12,
      prestacionesAnuales: totalPrestaciones * 12,
      deduccionesAnuales: totalDeducciones * 12,
      sueldoNetoAnual: sueldoNeto * 12
    };
  }

  return {
    empleado: {
      nombre,
      salarioDiario: parseFloat(salarioDiario.toFixed(2)),
      diasTrabajados,
      claseRiesgo
    },
    percepciones: {
      salarioBase: parseFloat(salarioBase.toFixed(2)),
      prestaciones: prestacionesCalculadas,
      totalPrestaciones: parseFloat(totalPrestaciones.toFixed(2)),
      totalPerceciones: parseFloat(totalPerceciones.toFixed(2))
    },
    deducciones: {
      imss: {
        cuotaObrera: imss.totales.obrera,
        desglose: imss.cuotas
      },
      isr: {
        impuesto: isr.isrFinal,
        subsidio: isr.subsidio,
        desglose: isr
      },
      infonavit: {
        descuento: infonavit.descuento,
        desglose: infonavit
      },
      otras: otrasDeduccionesCalculadas,
      totalOtrasDeducciones: parseFloat(totalOtrasDeducciones.toFixed(2)),
      totalDeducciones: parseFloat(totalDeducciones.toFixed(2))
    },
    resultado: {
      sueldoNeto: parseFloat(sueldoNeto.toFixed(2)),
      porcentajeDeduccion: parseFloat(((totalDeducciones / totalPerceciones) * 100).toFixed(2))
    },
    costoPatronal: {
      cuotasIMSS: imss.totales.patronal,
      infonavit: imss.cuotas.infonavit.patronal,
      total: parseFloat((imss.totales.patronal + totalPerceciones).toFixed(2))
    },
    calculoAnual
  };
}

/**
 * Calcula finiquito de empleado
 * @param {Object} empleado - Datos del empleado
 * @param {Object} parametros - Parámetros del finiquito
 * @returns {Object} Cálculo de finiquito
 */
export function calcularFiniquito(empleado, parametros) {
  const {
    salarioDiario,
    fechaIngreso,
    fechaSalida,
    motivoDespido = 'renuncia',
    diasVacacionesPendientes = 0,
    aguinaldoProporcional = true
  } = empleado;

  const {
    pagarIndemnizacion = false,
    pagarPrimaAntiguedad = false
  } = parametros;

  if (!salarioDiario || !fechaIngreso || !fechaSalida) {
    throw new Error('Faltan datos requeridos para el cálculo');
  }

  const inicio = new Date(fechaIngreso);
  const salida = new Date(fechaSalida);
  const diasTrabajados = Math.ceil((salida - inicio) / (1000 * 60 * 60 * 24));
  const añosTrabajados = diasTrabajados / 365;

  // Conceptos del finiquito
  const conceptos = {
    salariosPendientes: 0, // Se debe especificar
    vacacionesPendientes: diasVacacionesPendientes * salarioDiario,
    primaVacacional: (diasVacacionesPendientes * salarioDiario) * 0.25,
    aguinaldoProporcional: 0,
    indemnizacion: 0,
    primaAntiguedad: 0
  };

  // Aguinaldo proporcional
  if (aguinaldoProporcional) {
    const diasAguinaldo = Math.min(15, añosTrabajados * 15); // Máximo 15 días
    const proporcionAño = (salida.getMonth() + 1) / 12;
    conceptos.aguinaldoProporcional = diasAguinaldo * salarioDiario * proporcionAño;
  }

  // Indemnización (3 meses de salario)
  if (pagarIndemnizacion) {
    conceptos.indemnizacion = salarioDiario * 90;
  }

  // Prima de antigüedad (12 días por año, máximo 2 salarios mínimos)
  if (pagarPrimaAntiguedad) {
    const diasPrima = Math.min(12 * añosTrabajados, 12 * 25); // Máximo 25 años
    const salarioMaximo = SALARIO_MINIMO_2024.general * 2;
    const salarioParaPrima = Math.min(salarioDiario, salarioMaximo);
    conceptos.primaAntiguedad = diasPrima * salarioParaPrima;
  }

  const totalFiniquito = Object.values(conceptos).reduce((sum, val) => sum + val, 0);

  return {
    empleado: {
      salarioDiario: parseFloat(salarioDiario.toFixed(2)),
      fechaIngreso: inicio.toISOString().split('T')[0],
      fechaSalida: salida.toISOString().split('T')[0],
      diasTrabajados,
      añosTrabajados: parseFloat(añosTrabajados.toFixed(2)),
      motivoDespido
    },
    conceptos: {
      salariosPendientes: parseFloat(conceptos.salariosPendientes.toFixed(2)),
      vacacionesPendientes: parseFloat(conceptos.vacacionesPendientes.toFixed(2)),
      primaVacacional: parseFloat(conceptos.primaVacacional.toFixed(2)),
      aguinaldoProporcional: parseFloat(conceptos.aguinaldoProporcional.toFixed(2)),
      indemnizacion: parseFloat(conceptos.indemnizacion.toFixed(2)),
      primaAntiguedad: parseFloat(conceptos.primaAntiguedad.toFixed(2))
    },
    total: parseFloat(totalFiniquito.toFixed(2))
  };
}

/**
 * Obtiene las constantes fiscales vigentes
 * @returns {Object} Constantes fiscales 2024
 */
export function obtenerConstantesFiscales() {
  return {
    año: 2024,
    uma: UMA_2024,
    salarioMinimo: SALARIO_MINIMO_2024,
    tarifasIMSS: TARIFAS_IMSS,
    tarifasISR: TARIFAS_ISR_2024,
    subsidioEmpleo: SUBSIDIO_EMPLEO_2024
  };
}

/**
 * Librería completa de códigos postales mexicanos
 * Incluye geolocalización, búsquedas y cálculo de distancias
 */

// Base de datos de códigos postales mexicanos (muestra representativa)
const CODIGOS_POSTALES_DATA = {
  "01000": {
    codigoPostal: "01000",
    estado: "Ciudad de México",
    codigoEstado: "09",
    municipio: "Álvaro Obregón",
    ciudad: "Ciudad de México",
    colonia: "San Ángel",
    tipoAsentamiento: "Colonia",
    zona: "Urbano",
    coordenadas: { latitud: 19.3467, longitud: -99.1869 },
    region: "Centro"
  },
  "01010": {
    codigoPostal: "01010",
    estado: "Ciudad de México", 
    codigoEstado: "09",
    municipio: "Álvaro Obregón",
    ciudad: "Ciudad de México",
    colonia: "San Ángel Inn",
    tipoAsentamiento: "Colonia",
    zona: "Urbano",
    coordenadas: { latitud: 19.3501, longitud: -99.1901 },
    region: "Centro"
  },
  "20000": {
    codigoPostal: "20000",
    estado: "Aguascalientes",
    codigoEstado: "01", 
    municipio: "Aguascalientes",
    ciudad: "Aguascalientes",
    colonia: "Zona Centro",
    tipoAsentamiento: "Colonia",
    zona: "Urbano",
    coordenadas: { latitud: 21.8818, longitud: -102.2916 },
    region: "Bajío"
  },
  "22000": {
    codigoPostal: "22000",
    estado: "Baja California",
    codigoEstado: "02",
    municipio: "Tijuana", 
    ciudad: "Tijuana",
    colonia: "Zona Centro",
    tipoAsentamiento: "Colonia",
    zona: "Urbano",
    coordenadas: { latitud: 32.5149, longitud: -117.0382 },
    region: "Noroeste"
  },
  "44100": {
    codigoPostal: "44100",
    estado: "Jalisco",
    codigoEstado: "14",
    municipio: "Guadalajara",
    ciudad: "Guadalajara", 
    colonia: "Centro",
    tipoAsentamiento: "Colonia",
    zona: "Urbano",
    coordenadas: { latitud: 20.6597, longitud: -103.3496 },
    region: "Occidente"
  },
  "64000": {
    codigoPostal: "64000",
    estado: "Nuevo León",
    codigoEstado: "19",
    municipio: "Monterrey",
    ciudad: "Monterrey",
    colonia: "Centro",
    tipoAsentamiento: "Colonia", 
    zona: "Urbano",
    coordenadas: { latitud: 25.6714, longitud: -100.3089 },
    region: "Noreste"
  },
  "80000": {
    codigoPostal: "80000",
    estado: "Sinaloa",
    codigoEstado: "25",
    municipio: "Culiacán",
    ciudad: "Culiacán",
    colonia: "Centro",
    tipoAsentamiento: "Colonia",
    zona: "Urbano", 
    coordenadas: { latitud: 24.7999, longitud: -107.3841 },
    region: "Noroeste"
  },
  "97000": {
    codigoPostal: "97000",
    estado: "Yucatán",
    codigoEstado: "31",
    municipio: "Mérida",
    ciudad: "Mérida",
    colonia: "Centro",
    tipoAsentamiento: "Colonia",
    zona: "Urbano",
    coordenadas: { latitud: 20.9674, longitud: -89.5926 },
    region: "Sureste"
  }
};

// Estados mexicanos con códigos
const ESTADOS_MEXICO = {
  "01": { nombre: "Aguascalientes", abreviacion: "AGS" },
  "02": { nombre: "Baja California", abreviacion: "BC" },
  "03": { nombre: "Baja California Sur", abreviacion: "BCS" },
  "04": { nombre: "Campeche", abreviacion: "CAM" },
  "05": { nombre: "Coahuila", abreviacion: "COAH" },
  "06": { nombre: "Colima", abreviacion: "COL" },
  "07": { nombre: "Chiapas", abreviacion: "CHIS" },
  "08": { nombre: "Chihuahua", abreviacion: "CHIH" },
  "09": { nombre: "Ciudad de México", abreviacion: "CDMX" },
  "10": { nombre: "Durango", abreviacion: "DGO" },
  "11": { nombre: "Guanajuato", abreviacion: "GTO" },
  "12": { nombre: "Guerrero", abreviacion: "GRO" },
  "13": { nombre: "Hidalgo", abreviacion: "HGO" },
  "14": { nombre: "Jalisco", abreviacion: "JAL" },
  "15": { nombre: "México", abreviacion: "MEX" },
  "16": { nombre: "Michoacán", abreviacion: "MICH" },
  "17": { nombre: "Morelos", abreviacion: "MOR" },
  "18": { nombre: "Nayarit", abreviacion: "NAY" },
  "19": { nombre: "Nuevo León", abreviacion: "NL" },
  "20": { nombre: "Oaxaca", abreviacion: "OAX" },
  "21": { nombre: "Puebla", abreviacion: "PUE" },
  "22": { nombre: "Querétaro", abreviacion: "QRO" },
  "23": { nombre: "Quintana Roo", abreviacion: "QROO" },
  "24": { nombre: "San Luis Potosí", abreviacion: "SLP" },
  "25": { nombre: "Sinaloa", abreviacion: "SIN" },
  "26": { nombre: "Sonora", abreviacion: "SON" },
  "27": { nombre: "Tabasco", abreviacion: "TAB" },
  "28": { nombre: "Tamaulipas", abreviacion: "TAMPS" },
  "29": { nombre: "Tlaxcala", abreviacion: "TLAX" },
  "30": { nombre: "Veracruz", abreviacion: "VER" },
  "31": { nombre: "Yucatán", abreviacion: "YUC" },
  "32": { nombre: "Zacatecas", abreviacion: "ZAC" }
};

/**
 * Valida si un código postal mexicano es válido
 * @param {string} codigoPostal - Código postal a validar
 * @returns {boolean} True si es válido
 */
export function validarCodigoPostal(codigoPostal) {
  if (!codigoPostal || typeof codigoPostal !== 'string') {
    return false;
  }
  
  // Limpiar espacios y guiones
  const cp = codigoPostal.replace(/[\s-]/g, '');
  
  // Validar formato: 5 dígitos
  const regex = /^[0-9]{5}$/;
  if (!regex.test(cp)) {
    return false;
  }
  
  // Validar rango válido (01000-99999)
  const numero = parseInt(cp);
  return numero >= 1000 && numero <= 99999;
}

/**
 * Busca información de un código postal
 * @param {string} codigoPostal - Código postal a buscar
 * @returns {Object|null} Información del código postal o null
 */
export function buscarCodigoPostal(codigoPostal) {
  if (!validarCodigoPostal(codigoPostal)) {
    return null;
  }
  
  const cp = codigoPostal.replace(/[\s-]/g, '');
  const info = CODIGOS_POSTALES_DATA[cp];
  
  if (!info) {
    // Si no está en nuestra base, generar información básica basada en el código
    const estado = obtenerEstadoPorCP(cp);
    if (!estado) return null;
    
    return {
      codigoPostal: cp,
      estado: estado.nombre,
      codigoEstado: estado.codigo,
      municipio: "Información no disponible",
      ciudad: "Información no disponible",
      colonia: "Información no disponible",
      tipoAsentamiento: "No especificado",
      zona: "No especificado",
      coordenadas: null,
      region: estado.region || "No especificada"
    };
  }
  
  return { ...info };
}

/**
 * Obtiene códigos postales por estado
 * @param {string} estado - Nombre del estado o código
 * @returns {Array} Lista de códigos postales del estado
 */
export function getCodigosPostalesPorEstado(estado) {
  if (!estado || typeof estado !== 'string') {
    return [];
  }
  
  const estadoNormalizado = estado.toLowerCase();
  
  return Object.values(CODIGOS_POSTALES_DATA).filter(cp => {
    return cp.estado.toLowerCase().includes(estadoNormalizado) ||
           cp.codigoEstado === estado ||
           (ESTADOS_MEXICO[cp.codigoEstado] && 
            ESTADOS_MEXICO[cp.codigoEstado].abreviacion.toLowerCase() === estadoNormalizado);
  });
}

/**
 * Busca códigos postales por municipio
 * @param {string} municipio - Nombre del municipio
 * @returns {Array} Lista de códigos postales del municipio
 */
export function buscarPorMunicipio(municipio) {
  if (!municipio || typeof municipio !== 'string') {
    return [];
  }
  
  const municipioNormalizado = municipio.toLowerCase();
  
  return Object.values(CODIGOS_POSTALES_DATA).filter(cp =>
    cp.municipio.toLowerCase().includes(municipioNormalizado)
  );
}

/**
 * Busca códigos postales por colonia
 * @param {string} colonia - Nombre de la colonia
 * @returns {Array} Lista de códigos postales de la colonia
 */
export function buscarPorColonia(colonia) {
  if (!colonia || typeof colonia !== 'string') {
    return [];
  }
  
  const coloniaNormalizada = colonia.toLowerCase();
  
  return Object.values(CODIGOS_POSTALES_DATA).filter(cp =>
    cp.colonia.toLowerCase().includes(coloniaNormalizada)
  );
}

/**
 * Calcula la distancia entre dos puntos usando la fórmula de Haversine
 * @param {number} lat1 - Latitud del primer punto
 * @param {number} lon1 - Longitud del primer punto
 * @param {number} lat2 - Latitud del segundo punto
 * @param {number} lon2 - Longitud del segundo punto
 * @returns {number} Distancia en kilómetros
 */
export function calcularDistancia(lat1, lon1, lat2, lon2) {
  if (typeof lat1 !== 'number' || typeof lon1 !== 'number' ||
      typeof lat2 !== 'number' || typeof lon2 !== 'number') {
    throw new Error('Las coordenadas deben ser números válidos');
  }
  
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distancia = R * c;
  
  return parseFloat(distancia.toFixed(2));
}

/**
 * Busca códigos postales cercanos a uno dado
 * @param {string} codigoPostal - Código postal de referencia
 * @param {number} radioKm - Radio de búsqueda en kilómetros
 * @returns {Array} Lista de códigos postales cercanos ordenados por distancia
 */
export function buscarCercanos(codigoPostal, radioKm = 10) {
  const cpBase = buscarCodigoPostal(codigoPostal);
  
  if (!cpBase || !cpBase.coordenadas) {
    return [];
  }
  
  const { latitud, longitud } = cpBase.coordenadas;
  const cercanos = [];
  
  Object.values(CODIGOS_POSTALES_DATA).forEach(cp => {
    if (cp.codigoPostal !== codigoPostal && cp.coordenadas) {
      const distancia = calcularDistancia(
        latitud, longitud,
        cp.coordenadas.latitud, cp.coordenadas.longitud
      );
      
      if (distancia <= radioKm) {
        cercanos.push({
          ...cp,
          distanciaKm: distancia
        });
      }
    }
  });
  
  // Ordenar por distancia
  return cercanos.sort((a, b) => a.distanciaKm - b.distanciaKm);
}

/**
 * Obtiene estadísticas de códigos postales
 * @returns {Object} Estadísticas generales
 */
export function getEstadisticas() {
  const codigos = Object.values(CODIGOS_POSTALES_DATA);
  const estadoStats = {};
  const zonaStats = {};
  const tipoStats = {};
  
  codigos.forEach(cp => {
    // Por estado
    estadoStats[cp.estado] = (estadoStats[cp.estado] || 0) + 1;
    
    // Por zona
    zonaStats[cp.zona] = (zonaStats[cp.zona] || 0) + 1;
    
    // Por tipo de asentamiento
    tipoStats[cp.tipoAsentamiento] = (tipoStats[cp.tipoAsentamiento] || 0) + 1;
  });
  
  return {
    totalCodigosPostales: codigos.length,
    estados: Object.keys(estadoStats).length,
    estadoConMasCodigos: Object.keys(estadoStats).reduce((a, b) => 
      estadoStats[a] > estadoStats[b] ? a : b
    ),
    distribuciones: {
      porEstado: estadoStats,
      porZona: zonaStats,
      porTipoAsentamiento: tipoStats
    },
    cobertura: {
      conCoordenadas: codigos.filter(cp => cp.coordenadas).length,
      sinCoordenadas: codigos.filter(cp => !cp.coordenadas).length
    }
  };
}

/**
 * Función auxiliar para obtener estado por código postal
 * @param {string} cp - Código postal
 * @returns {Object|null} Información del estado
 */
function obtenerEstadoPorCP(cp) {
  const primerosDosDigitos = cp.substring(0, 2);
  
  // Mapeo aproximado basado en rangos de códigos postales
  const rangos = {
    "01": { codigo: "09", nombre: "Ciudad de México", region: "Centro" },
    "02": { codigo: "15", nombre: "México", region: "Centro" },
    "03": { codigo: "13", nombre: "Hidalgo", region: "Centro" },
    "04": { codigo: "22", nombre: "Querétaro", region: "Bajío" },
    "05": { codigo: "13", nombre: "Hidalgo", region: "Centro" },
    "20": { codigo: "01", nombre: "Aguascalientes", region: "Bajío" },
    "21": { codigo: "02", nombre: "Baja California", region: "Noroeste" },
    "22": { codigo: "02", nombre: "Baja California", region: "Noroeste" },
    "44": { codigo: "14", nombre: "Jalisco", region: "Occidente" },
    "64": { codigo: "19", nombre: "Nuevo León", region: "Noreste" },
    "80": { codigo: "25", nombre: "Sinaloa", region: "Noroeste" },
    "97": { codigo: "31", nombre: "Yucatán", region: "Sureste" }
  };
  
  return rangos[primerosDosDigitos] || null;
}

export default {
  validarRFC,
  validarCURP,
  validarNSS,
  validarCedula,
  detectarTipo,
  validarIdentificador,
  calcularIMSS,
  calcularISRNomina,
  calcularDescuentoInfonavit,
  calcularNominaCompleta,
  calcularFiniquito,
  obtenerConstantesFiscales,
  validarCodigoPostal,
  buscarCodigoPostal,
  getCodigosPostalesPorEstado,
  buscarPorMunicipio,
  buscarPorColonia,
  calcularDistancia,
  buscarCercanos,
  getEstadisticas
};
