/**
 * Calcula el RFC (Registro Federal de Contribuyentes) mexicano con homoclave
 * de personas físicas basado en el algoritmo oficial del SAT.
 * 
 * @param nombres - Nombres de la persona
 * @param apellidoPaterno - Apellido paterno (opcional si se proporciona apellidoMaterno)
 * @param apellidoMaterno - Apellido materno (opcional si se proporciona apellidoPaterno)
 * @param fechaNacimiento - Fecha de nacimiento en formato MM/DD/YYYY, YYYY-MM-DD, o DD/MM/YYYY
 * @returns RFC completo de 13 caracteres (4 letras + 6 dígitos + 3 alfanuméricos)
 * @throws Error si los parámetros son inválidos
 * 
 * @example
 * ```typescript
 * import calculaRFC from 'calcula-rfc';
 * 
 * // RFC con ambos apellidos
 * const rfc1 = calculaRFC('JUAN CARLOS', 'PEREZ', 'GOMEZ', '01/15/1985');
 * console.log(rfc1); // 'PEGJ850115AB1'
 * 
 * // RFC con solo apellido paterno
 * const rfc2 = calculaRFC('MARIA', 'LOPEZ', '', '12/25/1990');
 * console.log(rfc2); // 'LOMA901225XY2'
 * 
 * // RFC con solo apellido materno
 * const rfc3 = calculaRFC('CARLOS', '', 'HERNANDEZ', '06/10/1988');
 * console.log(rfc3); // 'HECA880610ZB3'
 * ```
 */
declare function calculaRFC(
  nombres: string,
  apellidoPaterno?: string,
  apellidoMaterno?: string,
  fechaNacimiento: string
): string;

export default calculaRFC; 