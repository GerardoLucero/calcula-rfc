import lib from './index.js';

describe('mx-feriados', () => {
  describe('getFeriados', () => {
    test('debe retornar feriados para el año 2024', () => {
      const feriados = lib.getFeriados(2024);
      expect(Array.isArray(feriados)).toBe(true);
      expect(feriados.length).toBeGreaterThan(0);
      expect(feriados[0]).toHaveProperty('fecha');
      expect(feriados[0]).toHaveProperty('nombre');
      expect(feriados[0]).toHaveProperty('tipo');
    });

    test('debe manejar año sin parámetros (año actual)', () => {
      const feriados = lib.getFeriados();
      expect(Array.isArray(feriados)).toBe(true);
      expect(feriados.length).toBeGreaterThan(0);
    });
  });

  describe('esFeriado', () => {
    test('debe identificar Año Nuevo como feriado', () => {
      const esAnoNuevo = lib.esFeriado(new Date(2024, 0, 1)); // 1 enero 2024
      expect(esAnoNuevo).toBeTruthy(); // Retorna objeto con datos del feriado
      expect(esAnoNuevo).toHaveProperty('nombre');
      expect(esAnoNuevo.nombre).toBe('Año Nuevo');
    });

    test('debe identificar día normal como no feriado', () => {
      const esNormal = lib.esFeriado(new Date(2024, 0, 2)); // 2 enero 2024
      expect(esNormal).toBeNull(); // Retorna null para días no feriados
    });
  });

  describe('siguienteFeriado', () => {
    test('debe encontrar el siguiente feriado desde una fecha', () => {
      const siguiente = lib.siguienteFeriado(new Date(2024, 0, 2));
      expect(siguiente).toHaveProperty('fecha');
      expect(siguiente).toHaveProperty('nombre');
      expect(siguiente.fecha).toBeInstanceOf(Date);
    });
  });

  describe('calcularDiasHabiles', () => {
    test('debe calcular días hábiles entre fechas', () => {
      const inicio = new Date(2024, 0, 1); // 1 enero 2024
      const fin = new Date(2024, 0, 15); // 15 enero 2024
      const resultado = lib.calcularDiasHabiles(inicio, fin);
      
      expect(resultado).toHaveProperty('diasHabiles');
      expect(typeof resultado.diasHabiles).toBe('number');
      expect(resultado.diasHabiles).toBeGreaterThanOrEqual(0);
      expect(resultado.diasHabiles).toBeLessThanOrEqual(14);
    });
  });

  describe('getFeriadosPorTipo', () => {
    test('debe retornar feriados oficiales', () => {
      const feriadosOficiales = lib.getFeriadosPorTipo(2024, 'oficial');
      expect(Array.isArray(feriadosOficiales)).toBe(true);
      expect(feriadosOficiales.length).toBeGreaterThan(0);
      feriadosOficiales.forEach(feriado => {
        expect(feriado.tipo).toBe('oficial');
      });
    });

    test('debe retornar array vacío para tipo inexistente', () => {
      const feriadosInexistentes = lib.getFeriadosPorTipo(2024, 'inexistente');
      expect(Array.isArray(feriadosInexistentes)).toBe(true);
      expect(feriadosInexistentes.length).toBe(0);
    });
  });

  describe('getEstadisticasFeriados', () => {
    test('debe retornar estadísticas válidas', () => {
      const stats = lib.getEstadisticasFeriados(2024);
      expect(stats).toHaveProperty('año');
      expect(stats).toHaveProperty('total'); // No 'totalFeriados', sino 'total'
      expect(stats).toHaveProperty('oficiales');
      expect(stats.año).toBe(2024);
      expect(typeof stats.total).toBe('number');
      expect(stats.total).toBeGreaterThan(0);
    });
  });
});
