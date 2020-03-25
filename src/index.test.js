import calcularRFCPersonaFisica from ".";
describe("Calcular RFC", () => {
    
  it("", () => { expect(calcularRFCPersonaFisica('NOMBRES', 'APELLIDOPATERNO', 'APELLIDOMATERNO', 'MM/DD/YYY')).toBe("RFC")})
});