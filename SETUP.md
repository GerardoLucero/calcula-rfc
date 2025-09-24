# 🚀 Configuración del Pipeline CI/CD

Este documento explica cómo configurar el pipeline de GitHub Actions para publicar automáticamente a NPM.

## 📋 Requisitos previos

1. **Cuenta de NPM** con permisos para publicar paquetes
2. **Repositorio en GitHub** configurado
3. **Token de NPM** con permisos de publicación

## 🔑 Configuración de Secretos en GitHub

Para que el pipeline funcione, necesitas configurar los siguientes secretos en tu repositorio de GitHub:

### 1. NPM_TOKEN

1. Ve a [npmjs.com](https://www.npmjs.com/) e inicia sesión
2. Ve a tu perfil → **Access Tokens**
3. Crea un nuevo token con tipo **Automation** o **Publish**
4. Copia el token generado
5. En GitHub, ve a tu repositorio → **Settings** → **Secrets and variables** → **Actions**
6. Crea un nuevo secreto llamado `NPM_TOKEN` y pega el token

### 2. GITHUB_TOKEN (Automático)

Este token se genera automáticamente por GitHub Actions, no necesitas configurarlo manualmente.

## 📝 Pasos de Configuración

### 1. Actualizar URLs en package.json

Actualiza las siguientes URLs en tu `package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/GerardoLucero/calcula-rfc.git"
  },
  "bugs": {
    "url": "https://github.com/GerardoLucero/calcula-rfc/issues"
  },
  "homepage": "https://github.com/GerardoLucero/calcula-rfc#readme",
  "author": {
    "name": "Tu Nombre",
    "email": "tu-email@ejemplo.com"
  }
}
```

### 2. Actualizar README.md

Actualiza las URLs de badges y enlaces en el README.md:

```markdown
[![npm version](https://badge.fury.io/js/calcula-rfc.svg)](https://badge.fury.io/js/calcula-rfc)
[![Node.js CI](https://github.com/GerardoLucero/calcula-rfc/workflows/Publish%20to%20NPM/badge.svg)](https://github.com/GerardoLucero/calcula-rfc/actions)
```

### 3. Verificar configuración del workflow

El archivo `.github/workflows/publish.yml` está configurado para:

- ✅ Ejecutarse en push a la rama `main`
- ✅ Ejecutar tests antes de publicar
- ✅ Verificar si la versión ya existe en NPM
- ✅ Publicar solo si es una versión nueva
- ✅ Crear un release en GitHub automáticamente

## 🔄 Flujo de Publicación

### Publicación Automática

1. **Actualiza la versión** en `package.json`:
   ```bash
   npm version patch  # Para bug fixes
   npm version minor  # Para nuevas features
   npm version major  # Para breaking changes
   ```

2. **Haz push a main**:
   ```bash
   git push origin main
   git push origin --tags
   ```

3. **El pipeline se ejecuta automáticamente** y:
   - Ejecuta tests
   - Verifica la calidad del código (lint)
   - Construye el paquete
   - Verifica si la versión ya existe
   - Publica a NPM (si es versión nueva)
   - Crea un release en GitHub

### Publicación Manual

También puedes ejecutar el workflow manualmente:

1. Ve a **Actions** en tu repositorio de GitHub
2. Selecciona el workflow "Publish to NPM"
3. Haz clic en "Run workflow"

## 🛠️ Comandos Útiles

```bash
# Instalar dependencias
npm install

# Ejecutar tests
npm test

# Ejecutar linter
npm run lint

# Build para desarrollo
npm run build

# Build para producción
npm run build:prod

# Verificar que todo está listo para publicar
npm run prepublishOnly
```

## 📊 Verificación

Después de configurar todo:

1. **Verifica que los tests pasan**:
   ```bash
   npm test
   ```

2. **Verifica el linter**:
   ```bash
   npm run lint
   ```

3. **Verifica el build**:
   ```bash
   npm run build:prod
   ```

4. **Haz un commit de prueba** a una rama diferente para probar el pipeline.

## 🔍 Troubleshooting

### Error: "npm publish failed"

- Verifica que el `NPM_TOKEN` esté configurado correctamente
- Asegúrate de que tienes permisos para publicar el paquete
- Verifica que la versión no exista ya en NPM

### Error: "tests failed"

- Ejecuta `npm test` localmente para identificar el problema
- Asegúrate de que todas las dependencias estén instaladas

### Error: "lint failed"

- Ejecuta `npm run lint:fix` para corregir problemas automáticamente
- Revisa manualmente los errores que no se pueden corregir automáticamente

## 🎯 Mejores Prácticas

1. **Siempre actualiza la versión** antes de hacer push a main
2. **Escribe tests** para nuevas funcionalidades
3. **Documenta los cambios** en el README o CHANGELOG
4. **Usa conventional commits** para mensajes claros
5. **Revisa los logs del pipeline** si algo falla

## 📞 Soporte

Si tienes problemas con la configuración:

1. Revisa los logs del workflow en GitHub Actions
2. Verifica que todos los secretos estén configurados
3. Asegúrate de que las URLs estén actualizadas
4. Contacta al mantenedor del proyecto si necesitas ayuda 