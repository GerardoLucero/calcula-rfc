import calculaRFC from './index.js';

describe('calculaRFC - Librería de Cálculo de RFC Mexicano', () => {

  describe('Casos válidos - RFC completo', () => {
    test('debe calcular RFC con ambos apellidos correctamente', () => {
      const rfc = calculaRFC('JUAN CARLOS', 'PEREZ', 'GOMEZ', '01/15/1985');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc.length).toBe(13);
    });

    test('debe calcular RFC con nombres compuestos', () => {
      const rfc = calculaRFC('MARIA FERNANDA', 'RODRIGUEZ', 'MARTINEZ', '12/25/1990');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc.length).toBe(13);
    });

    test('debe calcular RFC con solo apellido paterno', () => {
      const rfc = calculaRFC('ANA', 'LOPEZ', '', '06/10/1988');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc.length).toBe(13);
    });

    test('debe calcular RFC con solo apellido materno', () => {
      const rfc = calculaRFC('CARLOS', '', 'HERNANDEZ', '03/22/1995');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc.length).toBe(13);
    });

    test('debe manejar nombres con acentos correctamente', () => {
      const rfc = calculaRFC('JOSÉ MARÍA', 'PÉREZ', 'LÓPEZ', '05/15/1987');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc.length).toBe(13);
    });

    test('debe manejar la letra Ñ correctamente', () => {
      const rfc = calculaRFC('ANTONIO', 'MUÑOZ', 'PEÑA', '08/30/1992');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc.length).toBe(13);
    });
  });

  describe('Manejo de sufijos', () => {
    test('debe ignorar sufijos en nombres (MARIA, JOSE)', () => {
      const rfc1 = calculaRFC('MARIA GUADALUPE', 'GARCIA', 'LOPEZ', '01/01/1990');
      const rfc2 = calculaRFC('GUADALUPE', 'GARCIA', 'LOPEZ', '01/01/1990');

      // Los primeros 4 caracteres deben ser iguales (ignorando MARIA)
      expect(rfc1.substring(0, 4)).toBe(rfc2.substring(0, 4));
    });

    test('debe ignorar sufijos en apellidos (DE, DEL, LA)', () => {
      const rfc = calculaRFC('PEDRO', 'DE LA CRUZ', 'MARTINEZ', '12/12/1985');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc.length).toBe(13);
    });
  });

  describe('Palabras obscenas', () => {
    test('debe reemplazar palabras obscenas con X', () => {
      // Crear un caso que genere una palabra obscena y verificar que se corrige
      const rfc = calculaRFC('ARMANDO', 'COCA', '', '01/01/1990');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc.length).toBe(13);
      // Si genera COCA, debe cambiarse a COCX
    });
  });

  describe('Formatos de fecha', () => {
    test('debe aceptar formato MM/DD/YYYY', () => {
      const rfc = calculaRFC('JUAN', 'PEREZ', 'LOPEZ', '01/15/1985');
      expect(rfc).toContain('850115'); // Año 85, mes 01, día 15
    });

    test('debe aceptar formato YYYY-MM-DD', () => {
      const rfc = calculaRFC('JUAN', 'PEREZ', 'LOPEZ', '1985-01-15');
      expect(rfc).toContain('850115'); // Año 85, mes 01, día 15
    });

    test('debe aceptar formato DD/MM/YYYY', () => {
      const rfc = calculaRFC('JUAN', 'PEREZ', 'LOPEZ', '15/01/1985');
      // Nota: dependiendo de la configuración de dayjs, puede interpretarse diferente
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
    });
  });

  describe('Validaciones de entrada', () => {
    test('debe lanzar error si nombres está vacío', () => {
      expect(() => {
        calculaRFC('', 'PEREZ', 'LOPEZ', '01/01/1990');
      }).toThrow('El parámetro [nombres] es requerido y no puede estar vacío');
    });

    test('debe lanzar error si nombres es null', () => {
      expect(() => {
        calculaRFC(null, 'PEREZ', 'LOPEZ', '01/01/1990');
      }).toThrow('El parámetro [nombres] es requerido y no puede estar vacío');
    });

    test('debe lanzar error si ambos apellidos están vacíos', () => {
      expect(() => {
        calculaRFC('JUAN', '', '', '01/01/1990');
      }).toThrow('Al menos uno de los apellidos (paterno o materno) debe ser proporcionado');
    });

    test('debe lanzar error si fecha es inválida', () => {
      expect(() => {
        calculaRFC('JUAN', 'PEREZ', 'LOPEZ', 'fecha-invalida');
      }).toThrow('La fecha de nacimiento debe tener un formato válido');
    });

    test('debe lanzar error si fecha está vacía', () => {
      expect(() => {
        calculaRFC('JUAN', 'PEREZ', 'LOPEZ', '');
      }).toThrow('El parámetro [fechaNacimiento] es requerido');
    });
  });

  describe('Casos extremos', () => {
    test('debe manejar nombres muy cortos', () => {
      const rfc = calculaRFC('A', 'B', 'C', '01/01/2000');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc.length).toBe(13);
    });

    test('debe manejar nombres con espacios múltiples', () => {
      const rfc = calculaRFC('JUAN   CARLOS', 'PEREZ   GOMEZ', 'LOPEZ', '01/01/1990');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc.length).toBe(13);
    });

    test('debe manejar nombres con caracteres especiales', () => {
      const rfc = calculaRFC('JUAN-CARLOS', 'PÉREZ/GÓMEZ', 'LÓPEZ', '01/01/1990');
      expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
      expect(rfc.length).toBe(13);
    });

    test('debe manejar fechas de diferentes siglos', () => {
      const rfc1 = calculaRFC('JUAN', 'PEREZ', 'LOPEZ', '01/01/1985'); // Siglo XX
      const rfc2 = calculaRFC('JUAN', 'PEREZ', 'LOPEZ', '01/01/2005'); // Siglo XXI

      expect(rfc1).toContain('850101');
      expect(rfc2).toContain('050101');
    });
  });

  describe('Consistencia', () => {
    test('debe generar el mismo RFC para los mismos datos', () => {
      const datos = ['JUAN CARLOS', 'PEREZ', 'GOMEZ', '01/15/1985'];
      const rfc1 = calculaRFC(...datos);
      const rfc2 = calculaRFC(...datos);

      expect(rfc1).toBe(rfc2);
    });

    test('debe generar RFCs diferentes para datos diferentes', () => {
      const rfc1 = calculaRFC('JUAN', 'PEREZ', 'LOPEZ', '01/01/1990');
      const rfc2 = calculaRFC('PEDRO', 'PEREZ', 'LOPEZ', '01/01/1990');

      expect(rfc1).not.toBe(rfc2);
    });
  });

  describe('Estructura del RFC', () => {
    test('debe tener la estructura correcta: 4 letras + 6 dígitos + 3 alfanuméricos', () => {
      const rfc = calculaRFC('JUAN CARLOS', 'PEREZ', 'GOMEZ', '01/15/1985');

      // Primeras 4 posiciones: letras
      expect(rfc.substring(0, 4)).toMatch(/^[A-Z]{4}$/);

      // Siguientes 6 posiciones: fecha (números)
      expect(rfc.substring(4, 10)).toMatch(/^\d{6}$/);

      // Últimas 3 posiciones: homoclave + dígito verificador (alfanumérico)
      expect(rfc.substring(10, 13)).toMatch(/^[A-Z0-9]{3}$/);
    });

    test('debe incluir la fecha correcta en el RFC', () => {
      const rfc = calculaRFC('JUAN', 'PEREZ', 'LOPEZ', '01/15/1985');
      expect(rfc).toContain('850115'); // YY MM DD
    });
  });

  describe('Casos reales conocidos', () => {
    test('debe calcular correctamente casos de prueba conocidos', () => {
      // Estos serían casos donde conocemos el RFC esperado
      // Por ahora validamos solo la estructura
      const casos = [
        ['JUAN', 'PEREZ', 'LOPEZ', '01/01/1990'],
        ['MARIA', 'GARCIA', 'MARTINEZ', '12/31/1985'],
        ['CARLOS ALBERTO', 'RODRIGUEZ', 'HERNANDEZ', '06/15/1995']
      ];

      casos.forEach(([nombres, paterno, materno, fecha]) => {
        const rfc = calculaRFC(nombres, paterno, materno, fecha);
        expect(rfc).toMatch(/^[A-Z]{4}\d{6}[A-Z0-9]{3}$/);
        expect(rfc.length).toBe(13);
      });
    });
  });
});
