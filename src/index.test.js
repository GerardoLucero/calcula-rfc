import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import calculaRFCDefault, {
  calculaRFC,
  validarRFC,
  calcularHomoclave,
  calcularDigitoVerificador
} from './index.js';

// Los casos de referencia vienen de la suite de pruebas de josketres/rfc-facil (Apache-2.0),
// la implementacion de referencia mas usada del algoritmo del SAT.

const persona = (nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento = '1970-12-13') =>
  calculaRFC({ nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento });
const clave = (...args) => persona(...args).slice(0, 10);

describe('calculaRFC: RFC completos de referencia', () => {
  it.each([
    ['MA GLORIA', 'NAVARRO', 'VILLASANA', '1956-03-29', 'NAVG560329621'],
    ['Josué', 'Zarzosa', 'de la Torre', '1987-08-05', 'ZATJ870805CK6'],
    ['ELIUD', 'OROZCO', 'GOMEZ', '1952-07-11', 'OOGE520711151'],
    ['SATURNINA', 'ANGEL', 'CRUZ', '1921-11-12', 'AECS211112JPA']
  ])('%s %s %s -> %s', (nombre, paterno, materno, fecha, esperado) => {
    expect(persona(nombre, paterno, materno, fecha)).toBe(esperado);
  });
});

describe('calculaRFC: las 10 primeras posiciones', () => {
  it.each([
    [['Juan', 'Barrios', 'Fernandez'], 'BAFJ701213'],
    [['Eric', 'Mc Gregor', 'Von Juarez'], 'GEJE701213'],
    [['Josue', 'de la Torre', 'Zarzosa'], 'TOZJ701213'],
    [['Antonio', 'Jiménez', 'Ponce de León'], 'JIPA701213'],
    [['Antonio', 'Ponce de León', 'Juarez'], 'POJA701213'],
    [['Alvaro', 'de la O', 'Lozano'], 'OLAL701213'],
    [['Ernesto', 'Ek', 'Rivera'], 'ERER701213'],
    [['Luz María', 'Fernández', 'Juárez'], 'FEJL701213'],
    [['José Antonio', 'Camargo', 'Hernández'], 'CAHA701213'],
    [['María Luisa', 'Ramírez', 'Sánchez'], 'RASL701213'],
    [['Juan', '', 'Martínez'], 'MAJU701213'],
    [['Gerarda', 'Zafra', ''], 'ZAGE701213'],
    [['Marco Antonio', 'Cano', 'Barraza'], 'CABM701213']
  ])('%j -> %s', (args, esperado) => {
    expect(clave(...args)).toBe(esperado);
  });

  it('usa el anio en dos digitos despues del 2000', () => {
    expect(persona('Juan', 'Barrios', 'Fernandez', '2001-12-01').slice(0, 10)).toBe('BAFJ011201');
  });

  it('acepta apellidos ausentes como null o undefined', () => {
    expect(clave('Juan', null, 'Martínez')).toBe('MAJU701213');
    expect(clave('Gerarda', 'Zafra', undefined)).toBe('ZAGE701213');
  });
});

describe('calculaRFC: palabras inconvenientes del SAT', () => {
  it('cambia la ultima letra por X cuando forma una palabra de la lista', () => {
    expect(clave('Ingrid', 'Bueno', 'Ezquerra')).toBe('BUEX701213');
  });

  it('no altera palabras que solo estan en la lista de CURP', () => {
    // LOCA no esta en la lista del RFC.
    expect(clave('Ana', 'Lopez', 'Castro')).toBe('LOCA701213');
  });
});

describe('calcularHomoclave', () => {
  it.each([
    [['Juan', 'Perez', 'Garcia'], 'LN'],
    [['Jose Antonio', 'Del real', 'Anzures'], 'N9'],
    [['Juan', 'Muñoz', 'Ortega'], 'T6'],
    [['Juan', 'Muñoz', 'Muñoz'], 'RZ'],
    [['Jesus', 'Argüelles', 'Ortega'], 'JF'],
    [['Juan', 'Perez&Gomez', 'Garcia'], '2R']
  ])('%j -> %s', (args, esperado) => {
    expect(calcularHomoclave(...args)).toBe(esperado);
  });

  it('ignora acentos y dieresis', () => {
    expect(calcularHomoclave('Juan', 'Pérez', 'García')).toBe(calcularHomoclave('Juan', 'Perez', 'Garcia'));
    expect(calcularHomoclave('Jesus', 'Argüelles', 'Ortega')).toBe(calcularHomoclave('Jesus', 'Arguelles', 'Ortega'));
  });

  it('distingue la Ñ de la N', () => {
    expect(calcularHomoclave('Juan', 'Muñoz', 'Ortega')).not.toBe(calcularHomoclave('Juan', 'Munoz', 'Ortega'));
  });

  it('elimina punto, apostrofo y guion sin dejar espacios', () => {
    expect(calcularHomoclave('Juan', 'Mc.Gregor', 'O\'Connor-Juarez'))
      .toBe(calcularHomoclave('Juan', 'McGregor', 'OConnorJuarez'));
  });

  it('distingue el ampersand', () => {
    expect(calcularHomoclave('Juan', 'Perez&Gomez', 'Garcia')).not.toBe(calcularHomoclave('Juan', 'PerezGomez', 'Garcia'));
  });

  it('rechaza caracteres que el algoritmo no contempla', () => {
    expect(() => calcularHomoclave('Juan', 'Perez@', 'Garcia')).toThrow('Caracter no permitido');
  });
});

describe('calcularDigitoVerificador', () => {
  it.each([
    ['GODE561231GR', '8'],
    ['AECS211112JP', 'A'],
    ['OOGE52071115', '1'],
    ['APU640930KV', '9']
  ])('%s -> %s', (base, esperado) => {
    expect(calcularDigitoVerificador(base)).toBe(esperado);
  });

  it('exige 11 o 12 caracteres', () => {
    expect(() => calcularDigitoVerificador('ABC')).toThrow('Se esperan 12 caracteres');
  });
});

describe('calculaRFC: fechas', () => {
  it('acepta AAAA-MM-DD, DD/MM/AAAA y Date', () => {
    const esperado = 'BAFJ701213';
    expect(clave('Juan', 'Barrios', 'Fernandez', '1970-12-13')).toBe(esperado);
    expect(clave('Juan', 'Barrios', 'Fernandez', '13/12/1970')).toBe(esperado);
    expect(clave('Juan', 'Barrios', 'Fernandez', new Date('1970-12-13'))).toBe(esperado);
    expect(clave('Juan', 'Barrios', 'Fernandez', new Date(1970, 11, 13))).toBe(esperado);
  });

  it('lee DD/MM/AAAA al estilo mexicano', () => {
    expect(persona('Juan', 'Barrios', 'Fernandez', '05/06/1990').slice(4, 10)).toBe('900605');
  });

  it('rechaza formatos ambiguos o fechas inexistentes', () => {
    expect(() => persona('Juan', 'Barrios', 'Fernandez', '1990/06/05')).toThrow('AAAA-MM-DD');
    expect(() => persona('Juan', 'Barrios', 'Fernandez', '1990-02-30')).toThrow('no existe');
    expect(() => persona('Juan', 'Barrios', 'Fernandez', new Date('x'))).toThrow('no es valida');
    expect(() => calculaRFC({ nombre: 'Juan', apellidoPaterno: 'Barrios' })).toThrow('requerida');
  });
});

describe('calculaRFC: firmas y validaciones', () => {
  it('acepta argumentos posicionales y la exportacion por defecto', () => {
    expect(calculaRFC('ELIUD', 'OROZCO', 'GOMEZ', '1952-07-11')).toBe('OOGE520711151');
    expect(calculaRFCDefault('ELIUD', 'OROZCO', 'GOMEZ', '1952-07-11')).toBe('OOGE520711151');
  });

  it('exige nombre y al menos un apellido', () => {
    expect(() => persona('', 'Perez', 'Garcia')).toThrow('nombre es requerido');
    expect(() => persona('Juan', '', '')).toThrow('al menos un apellido');
  });

  it('siempre produce un RFC que pasa su propia validacion', () => {
    for (const rfc of [
      persona('Juan', 'Muñoz', 'Ortega'),
      persona('Juan', 'Perez&Gomez', 'Garcia'),
      persona('María Luisa', 'Ramírez', 'Sánchez')
    ]) {
      expect(validarRFC(rfc)).toEqual({ valido: true, tipo: 'fisica', errores: [] });
    }
  });
});

describe('validarRFC', () => {
  it('acepta RFC de persona fisica y moral', () => {
    expect(validarRFC('AECS211112JPA')).toEqual({ valido: true, tipo: 'fisica', errores: [] });
    expect(validarRFC('APU640930KV9')).toEqual({ valido: true, tipo: 'moral', errores: [] });
  });

  it('reconoce los RFC genericos del SAT', () => {
    expect(validarRFC('XAXX010101000').tipo).toBe('generico');
    expect(validarRFC('XEXX010101000').tipo).toBe('generico');
  });

  it('ignora minusculas, espacios y guiones', () => {
    expect(validarRFC(' aecs-211112-jpa ').valido).toBe(true);
  });

  it('detecta un digito verificador incorrecto', () => {
    const resultado = validarRFC('AECS211112JP1');
    expect(resultado.valido).toBe(false);
    expect(resultado.errores[0]).toContain('se esperaba A');
  });

  it('detecta una fecha inexistente', () => {
    const base = 'AECS211332JP';
    const resultado = validarRFC(base + calcularDigitoVerificador(base));
    expect(resultado.valido).toBe(false);
    expect(resultado.errores).toContain('La fecha contenida en el RFC no es valida');
  });

  it('rechaza estructuras invalidas y entradas vacias', () => {
    expect(validarRFC('ABC').valido).toBe(false);
    expect(validarRFC('').errores).toEqual(['El RFC es requerido']);
    expect(validarRFC(null).valido).toBe(false);
  });
});

describe('ejemplos del README', () => {
  const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');

  it.each([
    [() => calculaRFC({ nombre: 'Eliud', apellidoPaterno: 'Orozco', apellidoMaterno: 'Gómez', fechaNacimiento: '1952-07-11' }), 'OOGE520711151'],
    [() => calculaRFCDefault('María Luisa', 'Ramírez', 'Sánchez', '13/12/1970'), 'RASL701213LM2'],
    [() => calculaRFC({ nombre: 'Gerarda', apellidoPaterno: 'Zafra', fechaNacimiento: '1970-12-13' }), 'ZAGE701213920'],
    [() => calculaRFC({ nombre: 'Ingrid', apellidoPaterno: 'Bueno', apellidoMaterno: 'Ezquerra', fechaNacimiento: '1970-12-13' }), 'BUEX701213LT1'],
    [() => calculaRFC({ nombre: 'Juan', apellidoPaterno: 'Muñoz', apellidoMaterno: 'Ortega', fechaNacimiento: new Date(1985, 0, 15) }), 'MUOJ850115T67'],
    [() => calcularHomoclave('Juan', 'Muñoz', 'Ortega'), 'T6']
  ])('el README muestra el resultado real (%#)', (calcular, esperado) => {
    expect(calcular()).toBe(esperado);
    expect(readme).toContain(esperado);
  });

  it('los resultados de validarRFC del README son los reales', () => {
    expect(validarRFC('AECS211112JP1').errores).toEqual(['El digito verificador no coincide (se esperaba A)']);
    expect(readme).toContain('El digito verificador no coincide (se esperaba A)');
    expect(() => calculaRFC('Juan', 'Barrios', 'Fernandez', '12/31/1990')).toThrow();
  });
});
