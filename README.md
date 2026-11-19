# calcula-rfc

Calcula y valida el RFC (Registro Federal de Contribuyentes) de personas físicas en México: las cuatro letras, la fecha, la homoclave y el dígito verificador, según el algoritmo que publica el SAT.

[![npm](https://img.shields.io/npm/v/calcula-rfc.svg)](https://www.npmjs.com/package/calcula-rfc)
[![CI](https://github.com/GerardoLucero/calcula-rfc/actions/workflows/ci.yml/badge.svg)](https://github.com/GerardoLucero/calcula-rfc/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

- Sin dependencias.
- Funciona con `import` y `require` en Node 20 o superior, y en navegadores con un bundler.
- Tipos de TypeScript incluidos.
- Cada versión se publica desde GitHub Actions con [procedencia firmada](https://docs.npmjs.com/generating-provenance-statements).

## Instalación

```bash
npm install calcula-rfc
```

## Calcular un RFC

```js
import { calculaRFC } from 'calcula-rfc';
// o: const { calculaRFC } = require('calcula-rfc');

calculaRFC({
  nombre: 'Eliud',
  apellidoPaterno: 'Orozco',
  apellidoMaterno: 'Gómez',
  fechaNacimiento: '1952-07-11'
});
// 'OOGE520711151'
```

También acepta argumentos posicionales y la exportación por defecto:

```js
import calculaRFC from 'calcula-rfc';

calculaRFC('María Luisa', 'Ramírez', 'Sánchez', '13/12/1970');
// 'RASL701213LM2'
```

### Fecha de nacimiento

| Formato | Ejemplo |
|---|---|
| `AAAA-MM-DD` | `'1970-12-13'` |
| `DD/MM/AAAA` (formato mexicano) | `'13/12/1970'` |
| Objeto `Date` | `new Date(1970, 11, 13)` |

Cualquier otro formato, o una fecha que no existe en el calendario, lanza un error. La librería no adivina: `'12/31/1990'` no se interpreta como fecha de EE. UU., sino como el día 12 del mes 31, y se rechaza.

### Reglas que aplica

| Caso | Ejemplo | Resultado |
|---|---|---|
| Nombre compuesto con María o José: se usa el segundo nombre | María Luisa Ramírez Sánchez | `RASL…` |
| Partículas en apellidos (de, la, del, Mc, Von, …) | Josué Zarzosa de la Torre | `ZATJ…` |
| Apellido paterno de una o dos letras | Ernesto Ek Rivera | `ERER…` |
| Un solo apellido | Gerarda Zafra | `ZAGE701213920` |
| Palabra inconveniente: la última letra cambia a X | Ingrid Bueno Ezquerra | `BUEX701213LT1` |
| Ñ en la homoclave (no equivale a N) | Juan Muñoz Ortega, 15/01/1985 | `MUOJ850115T67` |

## Validar un RFC

```js
import { validarRFC } from 'calcula-rfc';

validarRFC('AECS211112JPA');
// { valido: true, tipo: 'fisica', errores: [] }

validarRFC('APU640930KV9');
// { valido: true, tipo: 'moral', errores: [] }

validarRFC('XAXX010101000');
// { valido: true, tipo: 'generico', errores: [] }

validarRFC('AECS211112JP1');
// { valido: false, tipo: 'fisica', errores: ['El digito verificador no coincide (se esperaba A)'] }
```

Revisa la estructura (persona física de 13 caracteres, moral de 12 o genérico del SAT), que la fecha exista y que el dígito verificador sea correcto. Ignora mayúsculas, espacios y guiones.

`validarRFC` confirma que un RFC está **bien formado**. No consulta el padrón del SAT, así que no garantiza que el RFC esté registrado.

## API

| Función | Devuelve |
|---|---|
| `calculaRFC(datos)` o `calculaRFC(nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento)` | RFC de 13 caracteres |
| `validarRFC(rfc)` | `{ valido, tipo, errores }` |
| `calcularHomoclave(nombre, apellidoPaterno, apellidoMaterno)` | Homoclave de 2 caracteres, por ejemplo `'T6'` |
| `calcularDigitoVerificador(rfcSinDigito)` | Dígito verificador para 12 caracteres (física) u 11 (moral) |

`calculaRFC` lanza un `Error` si falta el nombre, si no hay ningún apellido, si la fecha no es válida o si el nombre tiene caracteres que el algoritmo no contempla.

## Exactitud

- La lista de palabras inconvenientes es la del RFC (41 palabras), que es distinta de la de CURP.
- Las pruebas usan casos de referencia de [rfc-facil](https://github.com/josketres/rfc-facil), la implementación más usada del algoritmo del SAT, incluidos RFC completos, homoclaves con Ñ y & y un dígito verificador `A`.
- El SAT puede asignar una homoclave distinta en casos de homonimia. Por eso el RFC oficial de una persona es el que aparece en su Constancia de Situación Fiscal.

## Limitaciones

- Solo calcula RFC de personas físicas. Para personas morales solo valida.
- Un RFC calculado coincide con el oficial en la gran mayoría de los casos, pero no lo sustituye.

## Licencia

MIT
