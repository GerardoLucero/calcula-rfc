import lib from './index.js';

describe('calculadora-isr', () => {
  describe('calcularISRMensual', () => {
    test('debe calcular ISR para ingreso de $15,000', () => {
      const resultado = lib.calcularISRMensual(15000);
      expect(resultado).toHaveProperty('ingresoMensual', 15000);
      expect(resultado).toHaveProperty('isrFinal');
      expect(resultado).toHaveProperty('ingresoNeto');
      expect(resultado).toHaveProperty('tasaEfectiva');
      expect(resultado.isrFinal).toBeGreaterThan(0);
      expect(resultado.ingresoNeto).toBeLessThan(15000);
    });

    test('debe aplicar subsidio para empleos', () => {
      const resultado = lib.calcularISRMensual(5000, { incluirSubsidio: true });
      const sinSubsidio = lib.calcularISRMensual(5000, { incluirSubsidio: false });
      expect(resultado.subsidio).toBeGreaterThan(0);
      expect(resultado.isrFinal).toBeLessThan(sinSubsidio.isrFinal);
    });

    test('debe manejar deducciones personales', () => {
      const resultado = lib.calcularISRMensual(20000, { deduccionPersonal: 2000 });
      expect(resultado.deduccionPersonal).toBe(2000);
      expect(resultado.ingresoGravable).toBe(18000);
    });

    test('debe rechazar ingresos negativos', () => {
      expect(() => lib.calcularISRMensual(-1000)).toThrow('El ingreso mensual debe ser un número positivo');
    });

    test('debe manejar ingresos muy bajos', () => {
      const resultado = lib.calcularISRMensual(100);
      expect(resultado.isrFinal).toBeGreaterThanOrEqual(0);
      expect(resultado.tasaEfectiva).toBeLessThan(5);
    });
  });

  describe('calcularISRAnual', () => {
    test('debe calcular ISR anual para $180,000', () => {
      const resultado = lib.calcularISRAnual(180000);
      expect(resultado).toHaveProperty('ingresoAnual', 180000);
      expect(resultado).toHaveProperty('isrAnual');
      expect(resultado).toHaveProperty('ingresoNetoAnual');
      expect(resultado.isrAnual).toBeGreaterThan(0);
    });

    test('debe aplicar exención de aguinaldo', () => {
      const resultado = lib.calcularISRAnual(200000, { 
        deducciones: 10000, 
        exentoAguinaldo: 15000 
      });
      expect(resultado.deducciones).toBe(10000);
      expect(resultado.aguinaldoExento).toBeGreaterThan(0);
      expect(resultado.ingresoGravable).toBeLessThan(200000);
    });

    test('debe rechazar ingresos negativos', () => {
      expect(() => lib.calcularISRAnual(-50000)).toThrow('El ingreso anual debe ser un número positivo');
    });
  });

  describe('calcularISRHonorarios', () => {
    test('debe calcular ISR para honorarios', () => {
      const resultado = lib.calcularISRHonorarios(25000, 5000);
      expect(resultado).toHaveProperty('ingresosMensuales', 25000);
      expect(resultado).toHaveProperty('deduccionesMensuales', 5000);
      expect(resultado).toHaveProperty('utilidad', 20000);
      expect(resultado).toHaveProperty('retencion');
      expect(resultado).toHaveProperty('isrAPagar');
      expect(resultado.retencion).toBe(2500); // 10% de 25000
    });

    test('debe manejar deducciones mayores a ingresos', () => {
      const resultado = lib.calcularISRHonorarios(10000, 12000);
      expect(resultado.utilidad).toBe(0);
    });

    test('debe rechazar ingresos negativos', () => {
      expect(() => lib.calcularISRHonorarios(-5000)).toThrow('Los ingresos deben ser un número positivo');
    });

    test('debe rechazar deducciones negativas', () => {
      expect(() => lib.calcularISRHonorarios(10000, -1000)).toThrow('Las deducciones no pueden ser negativas');
    });
  });

  describe('obtenerTarifasISR', () => {
    test('debe retornar tarifas ISR 2024', () => {
      const tarifas = lib.obtenerTarifasISR();
      expect(tarifas).toHaveProperty('año', 2024);
      expect(tarifas).toHaveProperty('tarifas');
      expect(tarifas).toHaveProperty('subsidioEmpleo');
      expect(tarifas).toHaveProperty('uma');
      expect(Array.isArray(tarifas.tarifas)).toBe(true);
      expect(tarifas.tarifas.length).toBeGreaterThan(0);
    });

    test('debe incluir límites de exención', () => {
      const tarifas = lib.obtenerTarifasISR();
      expect(tarifas).toHaveProperty('limitesExencion');
      expect(tarifas.limitesExencion).toHaveProperty('aguinaldo');
      expect(tarifas.limitesExencion).toHaveProperty('primaVacacional');
      expect(tarifas.limitesExencion).toHaveProperty('indemnizacion');
    });
  });

  describe('calcularIngresoDesdeISR', () => {
    test('debe calcular ingreso requerido para ISR específico', () => {
      const resultado = lib.calcularIngresoDesdeISR(1000);
      expect(resultado).toHaveProperty('ingresoRequerido');
      expect(resultado).toHaveProperty('isrCalculado');
      expect(resultado).toHaveProperty('iteraciones');
      expect(Math.abs(resultado.isrCalculado - 1000)).toBeLessThan(1);
    });

    test('debe rechazar ISR negativo', () => {
      expect(() => lib.calcularIngresoDesdeISR(-500)).toThrow('El ISR debe ser un número positivo');
    });

    test('debe manejar ISR muy alto', () => {
      const resultado = lib.calcularIngresoDesdeISR(50000);
      expect(resultado.ingresoRequerido).toBeGreaterThan(100000);
    });
  });

  describe('casos edge', () => {
    test('debe manejar ingreso exacto en límite de tarifa', () => {
      const resultado = lib.calcularISRMensual(746.04); // Límite primera tarifa
      expect(resultado.isrFinal).toBeGreaterThanOrEqual(0);
    });

    test('debe mantener precisión decimal', () => {
      const resultado = lib.calcularISRMensual(12345.67);
      expect(resultado.ingresoMensual).toBe(12345.67);
      expect(typeof resultado.isrFinal).toBe('number');
      expect(resultado.isrFinal.toString()).toMatch(/^\d+(\.\d{1,2})?$/);
    });

    test('debe calcular tasa efectiva correctamente', () => {
      const resultado = lib.calcularISRMensual(10000);
      const tasaCalculada = (resultado.isrFinal / resultado.ingresoMensual) * 100;
      expect(Math.abs(resultado.tasaEfectiva - tasaCalculada)).toBeLessThan(0.01);
    });
  });
});
