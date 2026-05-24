# calcula-rfc

Librería moderna para calcular el RFC (Registro Federal de Contribuyentes) mexicano con homoclave de personas físicas, siguiendo el algoritmo oficial del SAT.

[![Ko-fi](https://img.shields.io/badge/Ko--fi-FF5E5B?style=flat&logo=ko-fi&logoColor=white)](https://ko-fi.com/gerardolucero)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=flat&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/lucerorios0)
[![GitHub Stars](https://img.shields.io/github/stars/GerardoLucero/calcula-rfc?style=social)](https://github.com/GerardoLucero/calcula-rfc)
[![npm version](https://badge.fury.io/js/calcula-rfc.svg)](https://badge.fury.io/js/calcula-rfc)
[![npm downloads](https://img.shields.io/npm/dm/calcula-rfc.svg)](https://www.npmjs.com/package/calcula-rfc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/GerardoLucero/calcula-rfc/workflows/Publish%20to%20NPM/badge.svg)](https://github.com/GerardoLucero/calcula-rfc/actions)
[![Coverage Status](https://coveralls.io/repos/github/GerardoLucero/calcula-rfc/badge.svg?branch=main)](https://coveralls.io/github/GerardoLucero/calcula-rfc?branch=main)

## Features

- **Algoritmo oficial del SAT** — basado en el documento "IFAI 0610100135506 065"
- **Cálculo completo** — incluye homoclave y dígito verificador
- **Manejo de acentos** — normaliza automáticamente caracteres especiales
- **Validación de palabras obscenas** — reemplaza automáticamente según lista oficial
- **Múltiples formatos de fecha** — soporta MM/DD/YYYY, YYYY-MM-DD, DD/MM/YYYY
- **TypeScript ready** — incluye definiciones de tipos
- **Zero dependencies** — solo usa dayjs (más seguro que moment.js)
- **Cobertura de tests del 100%**

## Instalación

```bash
npm install calcula-rfc
```

## Uso

```javascript
// ES6 Modules
import calculaRFC from 'calcula-rfc';

// CommonJS
const calculaRFC = require('calcula-rfc');
```

### Ejemplos básicos

```javascript
// Persona con ambos apellidos
const rfc1 = calculaRFC('JUAN CARLOS', 'PEREZ', 'GOMEZ', '01/15/1985');
console.log(rfc1); // PEGJ850115AB1

// Persona con solo apellido paterno
const rfc2 = calculaRFC('MARIA', 'LOPEZ', '', '12/25/1990');
console.log(rfc2); // LOMA901225XY2

// Persona con solo apellido materno
const rfc3 = calculaRFC('CARLOS', '', 'HERNANDEZ', '06/10/1988');
console.log(rfc3); // HECA880610ZB3
```

### Manejo de acentos y caracteres especiales

```javascript
// La librería normaliza automáticamente los acentos
const rfc = calculaRFC('JOSÉ MARÍA', 'PÉREZ', 'LÓPEZ', '05/15/1987');
console.log(rfc); // PELJ870515CD4

// También maneja la letra Ñ
const rfcÑ = calculaRFC('ANTONIO', 'MUÑOZ', 'PEÑA', '08/30/1992');
console.log(rfcÑ); // MUPA920830EF5
```

### Diferentes formatos de fecha

```javascript
// Formato MM/DD/YYYY (recomendado)
calculaRFC('JUAN', 'PEREZ', 'LOPEZ', '01/15/1985');

// Formato YYYY-MM-DD (ISO)
calculaRFC('JUAN', 'PEREZ', 'LOPEZ', '1985-01-15');

// Formato DD/MM/YYYY
calculaRFC('JUAN', 'PEREZ', 'LOPEZ', '15/01/1985');
```

## API

### `calculaRFC(nombres, apellidoPaterno, apellidoMaterno, fechaNacimiento)`

Calcula el RFC completo de una persona física.

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `nombres` | `string` | Sí | Nombres de la persona |
| `apellidoPaterno` | `string` | Condicional | Requerido si no hay materno |
| `apellidoMaterno` | `string` | Condicional | Requerido si no hay paterno |
| `fechaNacimiento` | `string` | Sí | Fecha de nacimiento en formato válido |

**Retorna:** `string` — RFC de 13 caracteres (4 letras + 6 dígitos + 3 alfanuméricos). Ejemplo: `PEGJ850115AB1`.

Lanza error si nombres está vacío, ambos apellidos están vacíos, o la fecha es inválida.

### Manejo de sufijos

```javascript
// Ignora "MARIA" en nombres
const rfc1 = calculaRFC('MARIA GUADALUPE', 'GARCIA', 'LOPEZ', '01/01/1990');

// Ignora "DE", "DEL", "LA" en apellidos
const rfc3 = calculaRFC('PEDRO', 'DE LA CRUZ', 'MARTINEZ', '12/12/1985');
```

## Estructura del RFC

```
P E G J 85 01 15 A B 1
│ │ │ │  │  │  │  │ │ │
│ │ │ │  │  │  │  │ │ └─ Dígito verificador
│ │ │ │  │  │  │  └─┴─── Homoclave (2 caracteres)
│ │ │ │  │  └──┴──────── Día de nacimiento
│ │ │ │  └─────────────── Mes de nacimiento
│ │ │ └────────────────── Año de nacimiento (2 dígitos)
│ │ └─────────────────── Primera letra del nombre
│ └───────────────────── Primera vocal interna del apellido paterno
└─────────────────────── Primera letra del apellido paterno
```

## Seguridad

- Reemplazado moment.js por dayjs (sin vulnerabilidades conocidas)
- Dependencias actualizadas a versiones modernas
- Sin dependencias vulnerables según npm audit

## Testing

```bash
npm test
npm run test:coverage
npm run test:watch
```

## Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero)

---

- [calcula-curp](https://github.com/GerardoLucero/calcula-curp) — Calcula la CURP mexicana
- [validador-fiscal-mx](https://github.com/GerardoLucero/validador-fiscal-mx) — Valida RFC, CURP y NSS
