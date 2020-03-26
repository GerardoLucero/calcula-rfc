"use strict"
import moment from 'moment'
/**
 * Clase para calcular el RFC incluyendo la homoclave de una persona en base a
 * su nombre completo y fecha de nacimiento. La generaci&oacute;n del RFC se
 * basa en el documento "IFAI 0610100135506 065 Algoritmo". 
 *
 * @author Javier Islas García
 * @version 1.0.0 26/02/2014
 */

// Lista de vocales.
const VOCALES = ["A", "E", "I", "O", "U" ]

//Lista de palabras obscenas.
const PALABRAS_OBSCENAS = [ "BUEI", "BATO", "BOFE", "BUEY", "CACA", "CACO", "CAGO",
			"CAKO", "CAGA", "CAKA", "COGI", "COJA", "COJI", "COJO", "COLA", "CULO", "COGE", "COJE", "COJO", "FALO",
			"FOCA", "FETO", "GATA", "GETA", "GUEI", "GUEY", "JETA", "JOTO", "KAKA", "KAGA", "KACA", "KOGE", "KOGI",
			"KOJA", "KOJE", "KOJI", "KACO", "KOLA", "KAGO", "KOJO", "KULO", "LILO", "LOBA", "LOCA", "LOKA", "LOKO",
			"LORA", "LORO", "LOCO", "LOKO", "MALA", "MAMA", "MEAR", "MEON", "MIAR", "MOCO", "MOKO", "MULA", "MULO",
			"MAMO", "MAME", "MEAS", "MION", "MULA", "BUEY", "CACO", "CAGO", "CAKO", "COJA", "COJI", "CULO", "GUEY",
			"KACA", "KAGA", "KOGE", "KAKA", "LOCA", "LOKA", "MAME", "MEAR", "MEON", "MOCO", "NACA", "NACO", "PEDA",
			"PIPI", "PITO", "POPO", "PEDO", "PUTA", "QULO", "RUIN", "PENE", "PUTO", "RATA", "R" + "OBA", "ROBE",
			"ROBO", "SAPO", "SENO", "SOPE", "TETA", "VACA", "VAGA", "VAGO", "VUEI", "VUEY", "WUEI", "WUEY" ]


// Lista de sufijos para no ser considerados como nombre en el c&aacute;lculo en el RFC.
const SUFIJOS_NOMBRES = ["MARIA", "JOSE", "DE", "DEL", "LOS", "LAS", "LA", "MA","MA.", "J.", "J" ]

// Lista de sufijos para no ser considerados como apellidos en el c&aacute;lculo en el RFC.
const SUFIJOS_APELLIDOS = [ "DE", "LA", "LAS", "MC", "VON", "DEL", "LOS", "Y", "MAC","VAN" ]

// Inicializa los mapas de equivalencias.
const EQUIVALENCIAS_NOMBRE_NUMERICO = {
        'A': "11",
        'B': "12",
        'C': "13",
        'D': "14",
        'E': "15",
        'F': "16",
        'G': "17",
        'H': "18",
        'I': "19",
        'J': "21",
        'K': "22",
        'L': "23",
        'M': "24",
        'N': "25",
        'O': "26",
        'P': "27",
		'Q': "28",
		'R': "29",
		'S': "32",
		'T': "33",
		'U': "34",
		'V': "35",
		'W': "36",
		'X': "37",
		'Y': "38",
		'Z': "39",
		'&': "10",
		'%': "10",
	}


	function getEquivalenciaCocienteResiduo(number) {
		switch (number) {
		case 0:
			return "1";
		case 1:
			return "2";
		case 2:
			return "3";
		case 3:
			return "4";
		case 4:
			return "5";
		case 5:
			return "6";
		case 6:
			return "7";
		case 7:
			return "8";
		case 8:
			return "9";
		case 9:
			return "A";
		case 10:
			return "B";
		case 11:
			return "C";
		case 12:
			return "D";
		case 13:
			return "E";
		case 14:
			return "F";
		case 15:
			return "G";
		case 16:
			return "H";
		case 17:
			return "I";
		case 18:
			return "J";
		case 19:
			return "K";
		case 20:
			return "L";
		case 21:
			return "M";
		case 22:
			return "N";
		case 23:
			return "P";
		case 24:
			return "Q";
		case 25:
			return "R";
		case 26:
			return "S";
		case 27:
			return "T";
		case 28:
			return "U";
		case 29:
			return "V";
		case 30:
			return "W";
		case 31:
			return "X";
		case 32:
			return "Y";
		default:
			return "Z";
		}
	}


	function getDigitoVerificador(rfc) {
		let digitoVerificador = "";
		let numero = 0;
		let parcial = 0;
		let character;

		// LOGGER.debug("rfc.length: " + rfc.length());

		for (let idx = 0; idx < 12; idx++) {
			if (idx >= rfc.length ) {
				numero = 24;
			} else {
				character = rfc.charAt(idx);

				// LOGGER.debug("character: " + character);

				if (character >= '0' && character <= '9') {
					numero = parseInt(character, 36)
				} else {
					switch (character) {
					case 'A':
						numero = 10;
						break;
					case 'B':
						numero = 11;
						break;
					case 'C':
						numero = 12;
						break;
					case 'D':
						numero = 13;
						break;
					case 'E':
						numero = 14;
						break;
					case 'F':
						numero = 15;
						break;
					case 'G':
						numero = 16;
						break;
					case 'H':
						numero = 17;
						break;
					case 'I':
						numero = 18;
						break;
					case 'J':
						numero = 19;
						break;
					case 'K':
						numero = 20;
						break;
					case 'L':
						numero = 21;
						break;
					case 'M':
						numero = 22;
						break;
					case 'N':
						numero = 23;
						break;
					case 'O':
						numero = 25;
						break;
					case 'P':
						numero = 26;
						break;
					case 'Q':
						numero = 27;
						break;
					case 'R':
						numero = 28;
						break;
					case 'S':
						numero = 29;
						break;
					case 'T':
						numero = 30;
						break;
					case 'U':
						numero = 31;
						break;
					case 'V':
						numero = 32;
						break;
					case 'W':
						numero = 33;
						break;
					case 'X':
						numero = 34;
						break;
					case 'Y':
						numero = 35;
						break;
					case 'Z':
						numero = 36;
						break;
					case ' ':
						numero = 37;
						break;
					default:
						numero = 0;
					}
				}
			}

			// Se contabiliza el nuevo digito.
			// LOGGER.debug("parcial: " + numero * (14 - (idx+1)));
			parcial += numero * (14 - (idx + 1));
		}

		// LOGGER.debug("parcial Total: " + parcial);

		let parcialRedondeado = parcial % 11;

		// LOGGER.debug("parcialRedondeado: " + parcialRedondeado);

		if (parcialRedondeado === 0) {
			digitoVerificador = "0";
		} else {
			parcial = 11 - parcialRedondeado;
			if (parcial === 10) {
				digitoVerificador = "A";
			} else {
				digitoVerificador = parcial
			}
		}

		return digitoVerificador;
	}

function getPrimerLetra(value) {
	return value.charAt(0)
}

function getSegundaLetra(value) {
	if (value.length <= 1) {
		return "X";
	}
	return value.charAt(1)
}


function getTerceraLetra(value) {
	if (value.length <= 2) {
		return null;
	}
	return value.charAt(2)
}

function replaceUltimaLetraConX(string) {
	// En el SP es la segunda letra la que cambia con X.
	string.replace(3, 4, "X");
}

function esPalabraObsena(palabra) {
	return PALABRAS_OBSCENAS.includes(palabra)
}

function getPrimerVocalInternaOrX( value) {
		let primerVocal = null;
		// El primer caracter no lo debe tomar en cuenta idx = 1.
		for (let idx = 1; idx < value.length; idx++) {
			if (VOCALES.includes(value.substring(idx, idx + 1))) {
				primerVocal = value.charAt(idx)
				break;
			}
		}
		if (primerVocal === null) {
			primerVocal = "X";
		}
		return primerVocal;
}

function validaParametrosEntrada(nombres, apellidoPaterno, apellidoMaterno, fechaNacimiento)  {
    
		if (nombres === "") {
			throw new Error("El parametro [nombres] no puede ser nulo.");
		}
		if (nombres.trim() === "" ) {
			throw new Error("El parametro [nombres] no puede ser vacio.");
		}
		if (apellidoPaterno === "") {
			throw new Error("El parametro [apellidoPaterno] no puede ser nulo.");
		}
		if (apellidoPaterno.trim() === ""  && apellidoMaterno.trim() === "" ) {
			throw new Error("Los parametros [apellidoPaterno] y [apellidoMaterno] no pueden ser vacios ambos.");
		}
		if (fechaNacimiento === "") {
			throw new Error("El parametro [fechaNacimiento] no puede ser nulo.");
		}


}

function rtrimToUpperCase(value) {
	return slugify(value.replace("\\s+$","")).toUpperCase();
}


function replaceSpecialCharacters(value) {
	return value.replace("/", " ").replace("-", " ").replace("Ü", " ");
}



function slugify (str) {
    var map = {
        '-' : ' ',
        '-' : '_',
        'a' : 'á|à|ã|â|À|Á|Ã|Â',
        'e' : 'é|è|ê|É|È|Ê',
        'i' : 'í|ì|î|Í|Ì|Î',
        'o' : 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
        'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
        'c' : 'ç|Ç',
        'n' : 'ñ|Ñ'
    };
    
    str = str.toLowerCase();
    
    for (var pattern in map) {
        str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    };

    return str;
};




function getNombreSinSufijos(nombres) {
		// Se cambia el algoritmo para pertimir generar RFC como: HEA 800501HC6
		// debido al
		// doble espacio en el nombre como: 'MARIA GABRIELA'.
		let nombre = "";
		let palabra;
		let posicion = 0;
		nombre = nombres;
		while (nombre.indexOf(' ') >= 0) {
			posicion = nombre.indexOf(' ');
			palabra = nombre.substring(0, posicion);
			if (!SUFIJOS_NOMBRES.includes(palabra)) {
				break;
			} else {
				nombre = nombre.substring(posicion + 1, nombre.length);
			}
		}
		return nombre;
}


function getApellidoSinSufijos(apellidos) {
	// Se cambia el algoritmo al del SP calc_rfc del SEO.
	let apellido = null;
	let palabra;
	let posicion = 0;
	apellido = apellidos;
	while (apellido.indexOf(' ') >= 0) {
		posicion = apellido.indexOf(' ');
		palabra = apellido.substring(0, posicion);
		if (!SUFIJOS_APELLIDOS.includes(palabra)) {
			break;
		} else {
				apellido = apellido.substring(posicion + 1, apellido.length);
		}
	}
	return apellido;
}

function getNombreRFC( nombre, apellidoPaternoSinSufijos, apellidoMaternoSinSufijos) {
		let nombreRFC = ""

		// LOGGER.debug("nombre:" + nombre + ", paterno:" +
		// apellidoPaternoSinSufijos + ", materno:" +
		// apellidoMaternoSinSufijos);

		if (apellidoMaternoSinSufijos === "") {

			let primerApellidoPaterno = apellidoPaternoSinSufijos;

			nombreRFC+= getPrimerLetra(primerApellidoPaterno);
			nombreRFC+= getSegundaLetra(apellidoPaternoSinSufijos);

            nombreRFC+= getPrimerLetra(nombre)

			if (nombre.length  > 1) {
				nombreRFC+= getSegundaLetra(nombre)
			}
		}

		else if (apellidoPaternoSinSufijos === "") {

			nombreRFC+= getPrimerLetra(apellidoMaternoSinSufijos)
			nombreRFC+= getSegundaLetra(apellidoMaternoSinSufijos)
			nombreRFC+= getPrimerLetra(nombre)
			nombreRFC+= getSegundaLetra(nombre)
		}

		else {
			let primerApellidoPaterno = apellidoPaternoSinSufijos;
			nombreRFC+= getPrimerLetra(primerApellidoPaterno)
			if (primerApellidoPaterno.length === 1 || primerApellidoPaterno.length === 2) {
				nombreRFC+= getPrimerLetra(apellidoMaternoSinSufijos)
				nombreRFC+= getPrimerLetra(nombre)
				nombreRFC+= getSegundaLetra(nombre)
			} else {
				nombreRFC+= getPrimerVocalInternaOrX(primerApellidoPaterno)

				nombreRFC+= getPrimerLetra(apellidoMaternoSinSufijos)
				nombreRFC+= getPrimerLetra(nombre)
			}

		}

		if ((nombreRFC.charAt(3) === ' ') && (apellidoPaternoSinSufijos === "" || apellidoMaternoSinSufijos === "") && (nombre.charAt(1) === ' ')) {

			nombreRFC+= nombreRFC.substring(0, 2)
			nombreRFC+= "X"
			nombreRFC+= getTerceraLetra(nombre)
		}

		if (esPalabraObsena(nombreRFC)) {
			replaceUltimaLetraConX(nombreRFC)// Cambios
		}
		return nombreRFC
}


function getFechaNacimientoRFC(fechaNacimiento) {
	return moment(new Date( fechaNacimiento)).format('YYMMDD')
}


function getEquivalenciaNombreNumerico(character) {
		let equivalencia = null;

		if (Object.keys(EQUIVALENCIAS_NOMBRE_NUMERICO).includes(character)) {
			equivalencia = EQUIVALENCIAS_NOMBRE_NUMERICO[character]
		} else if (character >= '0' && character <= '9') {
			equivalencia = new DecimalFormat("00").format(parseInt(character, 36));
		} else if (character === ' ') {
			equivalencia = "00";
		}

		return equivalencia;
}


function getHomoClaveRFC(nombre_, apellidoPaterno_, apellidoMaterno_) {
		let nombre = rtrimToUpperCase(slugify(nombre_));
		let apellidoPaterno = rtrimToUpperCase(apellidoPaterno_);
		let apellidoMaterno = rtrimToUpperCase(apellidoMaterno_);

		let nombreCompleto = `${apellidoPaterno} ${apellidoMaterno} ${nombre}`



		// LOGGER.debug("nombreCompleto: " + nombreCompleto)
		// Se obtiene el nombre numerico a 52 posiciones
		let nombreNumerico = "0"
		let equivalenciaNombreNumerico = "";
		let nombreCompletoLength = nombreCompleto.length;
		for (let idx = 0; idx < nombreCompletoLength; idx++) {
			if (idx < nombreCompletoLength) {
				/*
				 * SI el caracter es 'Ñ', 'Ó' o cualquier caracter que no se
				 * encuentre en la tabla de equivalencias, la equivalencia es la
				 * equivalencia anterior, por eso no se obtiene la equivalencia
				 * para estos caracteres.
				 */
				if (getEquivalenciaNombreNumerico(nombreCompleto.charAt(idx)) !== null) {
					equivalenciaNombreNumerico = getEquivalenciaNombreNumerico(nombreCompleto.charAt(idx));
				}

				// LOGGER.debug("CARACTER:" + nombreCompleto.charAt(idx) +
				// ", valor:" + equivalenciaNombreNumerico);

				nombreNumerico+= equivalenciaNombreNumerico
			} else {
				nombreNumerico+= "00"
			}
		}

		// Se calcula la suma total el nombre numerico.
		let sumaTotal = 0;
		let homoClaveIdx = 0;
		let homoClaveIdxMas1 = 0;
		for (let idx = 0; nombreNumerico.length > idx + 1; idx++) {

			// LOGGER.debug("charAt: " + nombreNumerico.charAt(idx));
		    
			
			homoClaveIdx = parseInt(nombreNumerico.charAt(idx), 36)
			homoClaveIdxMas1 =  parseInt(nombreNumerico.charAt(idx + 1), 36)
			sumaTotal += ((homoClaveIdx * 10) + (homoClaveIdxMas1)) * homoClaveIdxMas1;

			// LOGGER.debug("sumaParcial: " + sumaTotal);
		}

		// LOGGER.debug("sumaTotal: " + sumaTotal);

		// Se obtiene el residuo de los ultimos 3 digitos.
		let cociente = Number(sumaTotal % 1000)

		// Se obtiene el residuo de los ultimos 3 digitos entre 34.
		let modulo = Number(cociente % 34)

		// Se obtiene el cociente entero.
		cociente = Number((cociente - modulo) / 34)

		// LOGGER.debug("cociente: " + cociente);
		// LOGGER.debug("modulo: " + modulo);

		let homoClave = ""
		homoClave+= getEquivalenciaCocienteResiduo(cociente)
		homoClave+= getEquivalenciaCocienteResiduo(modulo)

		return homoClave
}

function calRFC(string){
	const cat = {
  ' ': '00',
  '0': '00',
  '1': '01',
  '2': '02',
  '3': '03',
  '4': '04',
  '5': '05',
  '6': '06',
  '7': '07',
  '8': '08',
  '9': '09',
  '&': '10',
  A: '11',
  B: '12',
  C: '13',
  D: '14',
  E: '15',
  F: '16',
  G: '17',
  H: '18',
  I: '19',
  J: '21',
  K: '22',
  L: '23',
  M: '24',
  N: '25',
  O: '26',
  P: '27',
  Q: '28',
  R: '29',
  S: '32',
  T: '33',
  U: '34',
  V: '35',
  W: '36',
  X: '37',
  Y: '38',
  Z: '39',
  Ñ: '40',
}

const dic = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]

  const codeString = string
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9ñ &]/gi, '')
    .split('')
    // eslint-disable-next-line security/detect-object-injection
    .reduce((str, current) => `${str}${cat[current]}`, '0')
    .split('')

  let acum = 0

  for (let index = 0; index < codeString.length - 1; index++) {
    // eslint-disable-next-line security/detect-object-injection
    const num1 = Number(codeString[index + 1])
    // eslint-disable-next-line security/detect-object-injection
    const num2 = Number(`${codeString[index]}${num1}`)
    acum += num1 * num2
  }

  const base = acum % 1000
  const elem1 = parseInt(base / 34)
  const elem2 = base % 34
  // eslint-disable-next-line security/detect-object-injection
  return `${dic[elem1]}${dic[elem2]}`
}


function calcularRFCPersonaFisica(nombres_, apellidoPaterno_, apellidoMaterno_,  fechaNacimiento_) {
    try{
        let rfc = null;
		let nombre;
		let apellidoPaterno;
		let apellidoMaterno;
		let apellidoPaternoSinSufijos;
		let apellidoMaternoSinSufijos;
		let nombreRFC;
		let homoclaveRFC;
		let fechaNacimientoRFC;
		let digitoVerificadorRFC;

		validaParametrosEntrada(nombres_, apellidoPaterno_, apellidoMaterno_, fechaNacimiento_)


        nombre = rtrimToUpperCase(nombres_)
		apellidoPaterno = replaceSpecialCharacters(rtrimToUpperCase(apellidoPaterno_))
		apellidoMaterno = rtrimToUpperCase(apellidoMaterno_)


        nombre = getNombreSinSufijos(nombre)
		apellidoPaternoSinSufijos = getApellidoSinSufijos(apellidoPaterno)
		apellidoMaternoSinSufijos = getApellidoSinSufijos(apellidoMaterno)

        nombreRFC = getNombreRFC(nombre, apellidoPaternoSinSufijos, apellidoMaternoSinSufijos)
        fechaNacimientoRFC = getFechaNacimientoRFC(fechaNacimiento_)


        homoclaveRFC = getHomoClaveRFC(nombres_, apellidoPaterno_, apellidoMaterno_)
		
        rfc = ""
		rfc+= nombreRFC
		rfc+= fechaNacimientoRFC
		rfc+= homoclaveRFC

		digitoVerificadorRFC = getDigitoVerificador(rfc);

		rfc+= digitoVerificadorRFC
		return rfc

    }catch(error){
        console.error(error.message)
    }
}

export default calcularRFCPersonaFisica;