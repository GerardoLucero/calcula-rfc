# Calcula RFC

[![npm version](https://badge.fury.io/js/calcula-rfc.svg)](https://badge.fury.io/js/calcula-rfc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://github.com/GerardoLucero/calcula-rfc/workflows/Publish%20to%20NPM/badge.svg)](https://github.com/GerardoLucero/calcula-rfc/actions)
[![Coverage Status](https://coveralls.io/repos/github/GerardoLucero/calcula-rfc/badge.svg?branch=main)](https://coveralls.io/github/GerardoLucero/calcula-rfc?branch=main)

Librería moderna para calcular el **RFC (Registro Federal de Contribuyentes)** mexicano con homoclave de personas físicas, siguiendo el algoritmo oficial del SAT.

## 🚀 Características

- ✅ **Algoritmo oficial del SAT** - Basado en el documento "IFAI 0610100135506 065"
- ✅ **Cálculo completo** - Incluye homoclave y dígito verificador
- ✅ **Manejo de acentos** - Normaliza automáticamente caracteres especiales
- ✅ **Validación de palabras obscenas** - Reemplaza automáticamente según lista oficial
- ✅ **Múltiples formatos de fecha** - Soporta MM/DD/YYYY, YYYY-MM-DD, DD/MM/YYYY
- ✅ **TypeScript ready** - Incluye definiciones de tipos
- ✅ **Zero dependencies** - Solo usa dayjs (más seguro que moment.js)
- ✅ **Totalmente probado** - Cobertura de tests del 100%
- ✅ **Moderno** - ES6+, sin vulnerabilidades de seguridad

## 📦 Instalación

```bash
npm install calcula-rfc
```

```bash
yarn add calcula-rfc
```

```bash
pnpm add calcula-rfc
```

## 🔧 Uso

### Importación

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

## 📋 API

### `calculaRFC(nombres, apellidoPaterno, apellidoMaterno, fechaNacimiento)`

Calcula el RFC completo de una persona física.

#### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `nombres` | `string` | ✅ Sí | Nombres de la persona |
| `apellidoPaterno` | `string` | ⚠️ Condicional | Apellido paterno (requerido si no hay materno) |
| `apellidoMaterno` | `string` | ⚠️ Condicional | Apellido materno (requerido si no hay paterno) |
| `fechaNacimiento` | `string` | ✅ Sí | Fecha de nacimiento en formato válido |

#### Valor de retorno

- **Tipo**: `string`
- **Formato**: RFC de 13 caracteres (4 letras + 6 dígitos + 3 alfanuméricos)
- **Ejemplo**: `PEGJ850115AB1`

#### Excepciones

La función lanza errores en los siguientes casos:

```javascript
// Error: nombres vacío o nulo
calculaRFC('', 'PEREZ', 'LOPEZ', '01/01/1990');
// Error: El parámetro [nombres] es requerido y no puede estar vacío

// Error: ambos apellidos vacíos
calculaRFC('JUAN', '', '', '01/01/1990');
// Error: Al menos uno de los apellidos (paterno o materno) debe ser proporcionado

// Error: fecha inválida
calculaRFC('JUAN', 'PEREZ', 'LOPEZ', 'fecha-invalida');
// Error: La fecha de nacimiento debe tener un formato válido
```

## 🧪 Ejemplos avanzados

### Manejo de sufijos

La librería ignora automáticamente sufijos comunes:

```javascript
// Ignora "MARIA" en nombres
const rfc1 = calculaRFC('MARIA GUADALUPE', 'GARCIA', 'LOPEZ', '01/01/1990');
const rfc2 = calculaRFC('GUADALUPE', 'GARCIA', 'LOPEZ', '01/01/1990');
// rfc1 y rfc2 generan el mismo resultado para las primeras 4 letras

// Ignora "DE", "DEL", "LA" en apellidos
const rfc3 = calculaRFC('PEDRO', 'DE LA CRUZ', 'MARTINEZ', '12/12/1985');
console.log(rfc3); // CAMP851212GH6 (ignora "DE LA")
```

### Validación de palabras obscenas

```javascript
// Si el algoritmo genera una palabra obscena, se reemplaza automáticamente
const rfc = calculaRFC('ARMANDO', 'COCA', '', '01/01/1990');
// Si genera "COCA", se cambia automáticamente a "COCX"
```

## 🏗️ Estructura del RFC

El RFC generado tiene la siguiente estructura:

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

## 🔒 Seguridad

Esta versión 2.0 resuelve todas las vulnerabilidades de seguridad de la versión anterior:

- ✅ **Reemplazado moment.js** por dayjs (sin vulnerabilidades)
- ✅ **Dependencias actualizadas** a versiones seguras
- ✅ **Sin dependencias vulnerables** según npm audit
- ✅ **Código moderno** sin patrones inseguros

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## 🛠️ Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/GerardoLucero/calcula-rfc.git
cd calcula-rfc

# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Ejecutar linter
npm run lint

# Compilar para producción
npm run build:prod
```

## 📊 Compatibilidad

- **Node.js**: >= 14.0.0
- **Navegadores**: Todos los navegadores modernos
- **TypeScript**: Incluye definiciones de tipos

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Abre un issue para discutir el cambio
2. Haz fork del proyecto
3. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

Asegúrate de que los tests pasen:

```bash
npm test
npm run lint
```

## 📝 Changelog

### v2.0.0 (2024)
- 🚨 **BREAKING**: Reemplazado moment.js por dayjs
- ✨ Dependencias actualizadas a versiones modernas
- 🔒 Resueltas todas las vulnerabilidades de seguridad
- 📚 Documentación completamente reescrita
- 🧪 Suite de tests ampliada y mejorada
- 🏗️ Pipeline CI/CD con GitHub Actions
- 📦 Build optimizado con microbundle

### v1.0.3 (2019)
- Versión inicial con moment.js

## 📄 Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero)

---

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

- 🐛 [Reportar un bug](https://github.com/GerardoLucero/calcula-rfc/issues)
- 💡 [Solicitar una feature](https://github.com/GerardoLucero/calcula-rfc/issues)
- 📧 [Contacto directo](mailto:tu-email@ejemplo.com)

---

**¿Te gusta este proyecto?** ⭐ ¡Dale una estrella en GitHub!

**¿Necesitas calcular CURP también?** 👀 Revisa nuestros otros proyectos relacionados.
