# validador-fiscal-mx

[![npm version](https://badge.fury.io/js/validador-fiscal-mx.svg)](https://www.npmjs.com/package/validador-fiscal-mx)
[![CI/CD Pipeline](https://github.com/GerardoLucero/validador-fiscal-mx/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/GerardoLucero/validador-fiscal-mx/actions)
[![codecov](https://codecov.io/gh/GerardoLucero/validador-fiscal-mx/branch/main/graph/badge.svg)](https://codecov.io/gh/GerardoLucero/validador-fiscal-mx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Validación completa de RFC, CURP, NSS y otros identificadores fiscales mexicanos con detección automática de tipo y extracción de información.

## ✨ Características

- 🔍 **Validación completa** de RFC, CURP, NSS y cédulas profesionales
- 🤖 **Detección automática** del tipo de identificador
- 📊 **Extracción de datos** (fecha de nacimiento, sexo, estado, etc.)
- 🛡️ **Validación robusta** con verificación de dígitos verificadores
- 🚫 **Filtrado de palabras inconvenientes**
- 📅 **Validación de fechas** incluyendo años bisiestos
- 🌐 **Compatible con ES Modules y CommonJS**
- 📦 **Sin dependencias externas**
- ⚡ **Ligero y rápido**

## 🚀 Instalación

```bash
npm install validador-fiscal-mx
```

## 📖 Uso Básico

```javascript
import validadorFiscal from 'validador-fiscal-mx';

// Validar RFC
const esRFCValido = validadorFiscal.validarRFC('PEGJ850115AB1');
console.log(esRFCValido); // true

// Validar CURP
const esCURPValida = validadorFiscal.validarCURP('PEGJ850115HJCRRL09');
console.log(esCURPValida); // true

// Detectar tipo automáticamente
const tipo = validadorFiscal.detectarTipo('12345678901');
console.log(tipo); // 'NSS'

// Validación completa con detalles
const resultado = validadorFiscal.validarIdentificador('PEGJ850115AB1');
console.log(resultado);
/*
{
  identificador: 'PEGJ850115AB1',
  tipo: 'RFC',
  esValido: true,
  detalles: {
    tipoPersona: 'FISICA',
    iniciales: 'PEGJ',
    fechaNacimiento: '15/01/1985',
    homoclave: 'AB',
    digitoVerificador: '1'
  }
}
*/
```

## 🔧 API Completa

### `validarRFC(rfc: string): boolean`

Valida un RFC mexicano (persona física o moral).

```javascript
validadorFiscal.validarRFC('PEGJ850115AB1'); // true - Persona física
validadorFiscal.validarRFC('ABC123456T1A'); // true - Persona moral
validadorFiscal.validarRFC('INVALID123');   // false
```

### `validarCURP(curp: string): boolean`

Valida una CURP mexicana con verificación completa.

```javascript
validadorFiscal.validarCURP('PEGJ850115HJCRRL09'); // true
validadorFiscal.validarCURP('GOJA920814MMCRNS04'); // true
validadorFiscal.validarCURP('INVALID123456789');   // false
```

### `validarNSS(nss: string): boolean`

Valida un Número de Seguridad Social del IMSS.

```javascript
validadorFiscal.validarNSS('12345678901');    // true
validadorFiscal.validarNSS('12-34-56-78901'); // true (con guiones)
validadorFiscal.validarNSS('00000000000');    // false (patrón inválido)
```

### `validarCedula(cedula: string): boolean`

Valida una cédula profesional SEP.

```javascript
validadorFiscal.validarCedula('1234567');  // true (7 dígitos)
validadorFiscal.validarCedula('12345678'); // true (8 dígitos)
validadorFiscal.validarCedula('1111111');  // false (todos iguales)
```

### `detectarTipo(identificador: string): string`

Detecta automáticamente el tipo de identificador.

```javascript
validadorFiscal.detectarTipo('PEGJ850115AB1');      // 'RFC'
validadorFiscal.detectarTipo('PEGJ850115HJCRRL09'); // 'CURP'
validadorFiscal.detectarTipo('12345678901');        // 'NSS'
validadorFiscal.detectarTipo('1234567');            // 'CEDULA'
validadorFiscal.detectarTipo('INVALID');            // 'DESCONOCIDO'
```

### `validarIdentificador(identificador: string): object`

Validación completa con extracción de información.

```javascript
const resultado = validadorFiscal.validarIdentificador('PEGJ850115HJCRRL09');
/*
{
  identificador: 'PEGJ850115HJCRRL09',
  tipo: 'CURP',
  esValido: true,
  detalles: {
    iniciales: 'PEGJ',
    fechaNacimiento: '15/01/1985',
    sexo: 'HOMBRE',
    estadoNacimiento: 'HIDALGO',
    consonantesInternas: 'RRL',
    digitoVerificador: '9'
  }
}
*/
```

## 🎯 Ejemplos Avanzados

### Validación por lotes

```javascript
const identificadores = [
  'PEGJ850115AB1',
  'PEGJ850115HJCRRL09',
  '12345678901',
  'INVALID123'
];

const resultados = identificadores.map(id => 
  validadorFiscal.validarIdentificador(id)
);

const validos = resultados.filter(r => r.esValido);
console.log(`${validos.length} de ${identificadores.length} son válidos`);
```

### Extracción de información específica

```javascript
function analizarRFC(rfc) {
  const resultado = validadorFiscal.validarIdentificador(rfc);
  
  if (resultado.esValido && resultado.tipo === 'RFC') {
    const { detalles } = resultado;
    return {
      esPersonaFisica: detalles.tipoPersona === 'FISICA',
      fechaNacimiento: detalles.fechaNacimiento,
      iniciales: detalles.iniciales
    };
  }
  
  return null;
}

const info = analizarRFC('PEGJ850115AB1');
console.log(info);
// { esPersonaFisica: true, fechaNacimiento: '15/01/1985', iniciales: 'PEGJ' }
```

### Validación con manejo de errores

```javascript
function validarDocumento(documento, tipoEsperado = null) {
  try {
    const resultado = validadorFiscal.validarIdentificador(documento);
    
    if (!resultado.esValido) {
      throw new Error(`Documento inválido: ${documento}`);
    }
    
    if (tipoEsperado && resultado.tipo !== tipoEsperado) {
      throw new Error(`Se esperaba ${tipoEsperado}, pero se detectó ${resultado.tipo}`);
    }
    
    return resultado;
    
  } catch (error) {
    console.error('Error de validación:', error.message);
    return null;
  }
}

// Uso
const resultado = validarDocumento('PEGJ850115AB1', 'RFC');
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

## 📋 Formatos Soportados

### RFC (Registro Federal de Contribuyentes)
- **Persona Física**: 4 letras + 6 dígitos + 3 caracteres alfanuméricos
- **Persona Moral**: 3 letras + 6 dígitos + 3 caracteres alfanuméricos
- Ejemplo: `PEGJ850115AB1`, `ABC123456T1A`

### CURP (Clave Única de Registro de Población)
- 18 caracteres: 4 letras + 6 dígitos + H/M + 2 letras + 3 letras + 1 dígito/letra + 1 dígito
- Ejemplo: `PEGJ850115HJCRRL09`

### NSS (Número de Seguridad Social)
- 11 dígitos (con o sin guiones)
- Ejemplo: `12345678901`, `12-34-56-78901`

### Cédula Profesional
- 7 u 8 dígitos
- Ejemplo: `1234567`, `12345678`

## 🔒 Validaciones Implementadas

- ✅ Formato y estructura correcta
- ✅ Fechas de nacimiento válidas (incluyendo años bisiestos)
- ✅ Estados válidos en CURP
- ✅ Sexo válido en CURP (H/M)
- ✅ Dígitos verificadores correctos
- ✅ Filtrado de palabras inconvenientes
- ✅ Patrones de números consecutivos o repetitivos
- ✅ Rangos de fechas lógicos

## 🌐 Compatibilidad

- ✅ Node.js 14+
- ✅ Navegadores modernos (ES2020+)
- ✅ ES Modules
- ✅ CommonJS
- ✅ TypeScript (definiciones incluidas)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Convenciones de Commits

- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bugs
- `docs:` - Cambios en documentación
- `test:` - Agregar o modificar tests
- `refactor:` - Refactoring de código
- `chore:` - Tareas de mantenimiento

## 📄 Licencia

MIT © [Gerardo Lucero](https://github.com/GerardoLucero)

## 🔗 Enlaces

- [Documentación completa](https://github.com/GerardoLucero/validador-fiscal-mx)
- [NPM Package](https://www.npmjs.com/package/validador-fiscal-mx)
- [Reportar Issues](https://github.com/GerardoLucero/validador-fiscal-mx/issues)
- [Changelog](https://github.com/GerardoLucero/validador-fiscal-mx/releases)

---

Desarrollado con ❤️ para la comunidad mexicana de desarrolladores.

