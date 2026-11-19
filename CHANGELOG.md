# Cambios

## 3.0.0

Corrige RFC que se calculaban mal y agrega validacion.

### Correcciones (cambian el resultado en algunos casos)
- La lista de palabras inconvenientes era la de CURP. Ahora es la del RFC (41 palabras):
  por ejemplo, LOCA o MAMA ya no se cambian por LOCX o MAMX.
- La Ñ vale 40 en la homoclave y 38 en el digito verificador; antes se trataba como N.
- El ampersand (&) vale 24 en el digito verificador.
- Punto, apostrofo, guion y coma se eliminan del nombre sin dejar espacio (O'Connor-Juarez).
- Se agrega la particula MI.

### Cambios incompatibles
- Ya no se aceptan fechas MM/DD/AAAA ni otros formatos ambiguos. Formatos validos:
  Date, AAAA-MM-DD y DD/MM/AAAA. Una fecha inexistente lanza error.

### Nuevo
- `validarRFC(rfc)`: estructura, fecha y digito verificador; persona fisica, moral y genericos del SAT.
- `calcularHomoclave` y `calcularDigitoVerificador` exportadas.
- `calculaRFC` acepta un objeto `{ nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento }`.
- Sin dependencias (se quito dayjs).
- Tipos de TypeScript reescritos.
