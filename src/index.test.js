import calculaRFC from './index.js';

describe('calcula-rfc', () => {
  describe('calculaRFC', () => {
    test('debe calcular RFC válido para persona con nombres simples', () => {
      const rfc = calculaRFC('Juan', 'Perez', 'Garcia', '01/01/1980');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc).toBe('PEGJ800101LN4');
    });

    test('debe calcular RFC válido con acentos', () => {
      const rfc = calculaRFC('José', 'Hernández', 'López', '15/12/1975');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc).toBe('HELJ751215MM0');
    });

    test('debe calcular RFC válido con Ñ', () => {
      const rfc = calculaRFC('María', 'Peña', 'Muñoz', '23/08/1990');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc).toBe('PEMM900823PP5');
    });

    test('debe manejar nombres compuestos', () => {
      const rfc = calculaRFC('Juan Carlos', 'De la Torre', 'Martínez', '10/05/1985');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc).toBe('TOMJ851005314');
    });

    test('debe manejar sufijos en apellidos', () => {
      const rfc = calculaRFC('Pedro', 'González Jr.', 'López', '07/03/1988');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc).toBe('GOLP880703LE7');
    });

    test('debe evitar palabras obscenas', () => {
      const rfc = calculaRFC('Fulano', 'Bueno', 'Culo', '01/01/1990');
      expect(rfc).not.toMatch(/^BUCA/);
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
    });

    test('debe aceptar diferentes formatos de fecha', () => {
      const rfc1 = calculaRFC('Ana', 'López', 'García', '01/01/1990');
      const rfc2 = calculaRFC('Ana', 'López', 'García', '1990-01-01');
      const rfc3 = calculaRFC('Ana', 'López', 'García', '01-01-1990');
      
      expect(rfc1).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc2).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc3).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      
      // Todos deberían tener la misma fecha
      expect(rfc1.substring(4, 10)).toBe('900101');
      expect(rfc2.substring(4, 10)).toBe('900101');
      expect(rfc3.substring(4, 10)).toBe('900101');
    });

    test('debe rechazar parámetros vacíos o inválidos', () => {
      expect(() => calculaRFC('', 'López', 'García', '01/01/1990')).toThrow();
      expect(() => calculaRFC('Juan', 'López', 'García', '')).toThrow();
    });

    test('debe rechazar parámetros null o undefined', () => {
      expect(() => calculaRFC(null, 'López', 'García', '01/01/1990')).toThrow();
      expect(() => calculaRFC('Juan', 'López', 'García', null)).toThrow();
    });

    test('debe rechazar fechas claramente inválidas', () => {
      expect(() => calculaRFC('Juan', 'López', 'García', 'fecha-inválida')).toThrow();
    });

    test('debe manejar casos extremos de fechas', () => {
      const rfc1 = calculaRFC('Juan', 'López', 'García', '29/02/2000'); // Año bisiesto
      expect(rfc1).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc1.substring(4, 10)).toBe('000229');
    });

    test('debe ser consistente en múltiples llamadas', () => {
      const rfc1 = calculaRFC('María', 'González', 'Rodríguez', '15/07/1985');
      const rfc2 = calculaRFC('María', 'González', 'Rodríguez', '15/07/1985');
      expect(rfc1).toBe(rfc2);
    });

    test('debe generar RFC con estructura correcta', () => {
      const rfc = calculaRFC('Carlos', 'Martínez', 'Sánchez', '20/11/1992');
      
      // Verificar longitud
      expect(rfc).toHaveLength(13);
      
      // Verificar que las primeras 4 letras son del nombre
      expect(rfc.substring(0, 4)).toMatch(/^[A-Z]{4}$/);
      
      // Verificar que los siguientes 6 son la fecha YYMMDD
      expect(rfc.substring(4, 10)).toBe('921120');
      
      // Verificar que los últimos 3 son homoclave
      expect(rfc.substring(10, 13)).toMatch(/^[A-Z0-9]{3}$/);
    });
  });
});
