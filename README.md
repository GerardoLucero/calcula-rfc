# calcula-rfc

<!-- BADGES-DONATIONS-START -->
[![Ko-fi](https://img.shields.io/badge/Ko--fi-Donate-orange?logo=ko-fi)](https://ko-fi.com/gerardolucero)
[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-yellow?logo=buy-me-a-coffee)](https://buymeacoffee.com/lucerorios0)
<!-- BADGES-DONATIONS-END -->


[![npm version](https://badge.fury.io/js/calcula-rfc.svg)](https://badge.fury.io/js/calcula-rfc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Librería para calcular el RFC (Registro Federal de Contribuyentes) mexicano con homoclave de personas físicas.

## Instalación

```bash
npm install calcula-rfc
```

## Uso

```javascript
import calculaRFC from 'calcula-rfc';

const rfc = calculaRFC('Juan Carlos', 'López', 'Martínez', '01/15/1990');
console.log(rfc); // LOMJ900115B64
```

## API

### `calculaRFC(nombres, apellidoPaterno, apellidoMaterno, fechaNacimiento)`

Calcula el RFC completo con homoclave y dígito verificador.

**Parámetros:**
- `nombres` (string): Nombre(s) de la persona
- `apellidoPaterno` (string): Apellido paterno
- `apellidoMaterno` (string): Apellido materno
- `fechaNacimiento` (string): Fecha en formato MM/DD/YYYY, YYYY-MM-DD o DD/MM/YYYY

**Retorna:** String con el RFC completo (13 caracteres)

## Características

- ✅ Cálculo completo de RFC con homoclave
- ✅ Validación de fechas en múltiples formatos
- ✅ Manejo de nombres con acentos y caracteres especiales
- ✅ Filtrado de palabras inconvenientes
- ✅ Soporte para nombres compuestos
- ✅ Cálculo correcto del dígito verificador

## Licencia

MIT © Gerardo Lucero

<!-- DONATIONS-START -->
## 💖 Apoya el Ecosistema Mexicano OSS

Si estos paquetes te ayudan (RFC, ISR, Nómina, Bancos, Feriados, Nombres, Códigos Postales, Validadores), considera invitarme un café o apoyar el mantenimiento:

- [Ko-fi](https://ko-fi.com/gerardolucero)
- [Buy Me a Coffee](https://buymeacoffee.com/lucerorios0)

> Gracias por tu apoyo 🙌. Priorizaré issues/PRs con **contexto de uso en México** (SAT/IMSS/INFONAVIT, bancos, feriados) y publicaré avances en los READMEs.
<!-- DONATIONS-END -->
