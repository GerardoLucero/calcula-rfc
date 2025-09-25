# mx-feriados

[![npm version](https://badge.fury.io/js/mx-feriados.svg)](https://badge.fury.io/js/mx-feriados)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Librería completa para el manejo de días festivos oficiales mexicanos con cálculo automático de fechas móviles y días hábiles.

## Características

- Catálogo completo de feriados oficiales mexicanos
- Cálculo automático de fechas móviles (Semana Santa, etc.)
- Detección de días feriados
- Cálculo de días hábiles entre fechas
- Filtrado por tipo de feriado (oficial, religioso, opcional)
- Estadísticas anuales de feriados
- Soporte para años futuros y pasados

## Instalación

```bash
npm install mx-feriados
```

## Uso Básico

```javascript
import { 
  getFeriados, 
  esFeriado, 
  calcularDiasHabiles,
  siguienteFeriado 
} from 'mx-feriados';

// Obtener feriados del año actual
const feriados2024 = getFeriados(2024);
console.log(feriados2024.length); // 24+ feriados

// Verificar si una fecha es feriado
const esAnoNuevo = esFeriado(new Date(2024, 0, 1));
console.log(esAnoNuevo.nombre); // "Año Nuevo"

// Calcular días hábiles entre fechas
const diasHabiles = calcularDiasHabiles(
  new Date(2024, 0, 1),
  new Date(2024, 0, 31)
);
console.log(diasHabiles.diasHabiles); // 22

// Encontrar el siguiente feriado
const proximo = siguienteFeriado(new Date());
console.log(proximo.nombre, proximo.fecha);
```

## API

### getFeriados(año?, opciones?)

Retorna todos los feriados de un año específico.

```javascript
const feriados = getFeriados(2024);
// Retorna: Array de objetos feriado

const feriadosOficiales = getFeriados(2024, { soloOficiales: true });
// Solo feriados oficiales obligatorios
```

### esFeriado(fecha, opciones?)

Verifica si una fecha específica es feriado.

```javascript
const resultado = esFeriado(new Date(2024, 0, 1));
// Retorna: objeto con datos del feriado o null

if (resultado) {
  console.log(resultado.nombre); // "Año Nuevo"
  console.log(resultado.tipo);   // "oficial"
}
```

### siguienteFeriado(fecha?, opciones?)

Encuentra el próximo feriado desde una fecha dada.

```javascript
const proximo = siguienteFeriado(new Date());
// Retorna: { fecha, nombre, tipo, ... }
```

### calcularDiasHabiles(fechaInicio, fechaFin, opciones?)

Calcula días hábiles entre dos fechas excluyendo feriados.

```javascript
const resultado = calcularDiasHabiles(
  new Date(2024, 0, 1),
  new Date(2024, 0, 31)
);

console.log(resultado.diasHabiles);     // 22
console.log(resultado.feriadosEnRango); // Array de feriados en el rango
console.log(resultado.finesSemana);     // Cantidad de fines de semana
```

### getFeriadosPorTipo(año, tipo)

Filtra feriados por tipo específico.

```javascript
const oficiales = getFeriadosPorTipo(2024, 'oficial');
const religiosos = getFeriadosPorTipo(2024, 'religioso');
const opcionales = getFeriadosPorTipo(2024, 'opcional');
```

### getEstadisticasFeriados(año)

Obtiene estadísticas completas de feriados del año.

```javascript
const stats = getEstadisticasFeriados(2024);
console.log(stats);
/*
{
  año: 2024,
  total: 24,
  oficiales: 7,
  religiosos: 4,
  opcionales: 13,
  feriadosPorMes: { enero: 2, febrero: 2, ... },
  feriadosMovidos: 0
}
*/
```

## Tipos de Feriados

### Oficiales
Feriados establecidos por ley federal:
- Año Nuevo (1 enero)
- Día de la Constitución (primer lunes de febrero)
- Natalicio de Benito Juárez (tercer lunes de marzo)
- Día del Trabajo (1 mayo)
- Día de la Independencia (16 septiembre)
- Día de la Revolución (tercer lunes de noviembre)
- Navidad (25 diciembre)

### Religiosos
Fechas móviles basadas en el calendario litúrgico:
- Jueves Santo
- Viernes Santo
- Sábado de Gloria
- Domingo de Resurrección

### Opcionales
Celebraciones tradicionales no oficiales:
- Día de Reyes (6 enero)
- Día de la Candelaria (2 febrero)
- Día de San Valentín (14 febrero)
- Día de las Madres (10 mayo)
- Y muchos más...

## Cálculo de Semana Santa

La librería incluye el algoritmo completo para calcular las fechas de Semana Santa:

```javascript
// Las fechas se calculan automáticamente cada año
const feriados = getFeriados(2024);
const semanaSanta = feriados.filter(f => f.tipo === 'religioso');

semanaSanta.forEach(feriado => {
  console.log(feriado.nombre, feriado.fecha);
});
```

## Opciones de Configuración

```javascript
const opciones = {
  incluirOpcionales: true,    // Incluir feriados no oficiales
  soloOficiales: false,       // Solo feriados oficiales
  incluirReligiosos: true,    // Incluir feriados religiosos
  incluirFinesSemana: true    // Considerar fines de semana en cálculos
};

const feriados = getFeriados(2024, opciones);
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Linting
npm run lint

# Build
npm run build
```

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## Licencia

MIT - ver [LICENSE](LICENSE) para más detalles.

## Soporte

- [Issues](https://github.com/GerardoLucero/mx-feriados/issues)
- [Documentación](https://github.com/GerardoLucero/mx-feriados#readme)

