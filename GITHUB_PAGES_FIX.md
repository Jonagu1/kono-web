# Solución al error de despliegue en GitHub Pages (Jekyll & `/docs`)

## 1. ¿Por qué ocurrió el error?

El log de error mostraba:
```text
Source: /github/workspace/./docs
Destination: /github/workspace/./docs/_site
...
github-pages 232 | Error: No such file or directory @ dir_chdir0 - /github/workspace/docs
```

### Causas:
1. **Configuración de GitHub Pages en modo legado ("Deploy from a branch")**:
   En GitHub (`Settings` → `Pages`), la fuente estaba configurada para desplegar desde la rama `main` buscando la carpeta `/docs`.
2. **Inexistencia de la carpeta `/docs`**:
   El repositorio no contenía una carpeta `docs/`, por lo que el motor de GitHub Pages intentó cambiar de directorio a `/docs` y arrojó `Error: No such file or directory @ dir_chdir0`.
3. **Uso de Jekyll en un proyecto Vite + React**:
   Por defecto, GitHub Pages ejecuta Jekyll sobre proyectos estáticos. Jekyll no sabe compilar TypeScript ni JSX, y además ignora por defecto archivos y carpetas que comiencen con guión bajo (`_`).

---

## 2. Soluciones aplicadas

### A. Creación del Workflow oficial de GitHub Actions (`.github/workflows/deploy.yml`)
Se configuró un flujo de integración continua que:
- Detecta cada `push` a la rama `main`.
- Instala dependencias con `npm ci`.
- Compila la aplicación con `npm run build` en la carpeta `dist/`.
- Despliega directamente los archivos compilados a GitHub Pages utilizando `actions/deploy-pages@v4`.

### B. Ajuste de rutas relativas en `vite.config.ts`
Se agregó `base: './'` para garantizar que los assets (imágenes, scripts y estilos) funcionen tanto en la raíz de un dominio como en subdirectorios de GitHub Pages (ej. `https://usuario.github.io/repositorio/`).

### C. Desactivación de Jekyll con `.nojekyll`
Se crearon archivos `.nojekyll` en la raíz, en `public/` y en `docs/` para indicarle a GitHub que no intente procesar los archivos con Jekyll.

### D. Creación de carpeta de respaldo `/docs`
Para asegurar compatibilidad inmediata (incluso si GitHub Pages sigue configurado temporalmente con "Deploy from a branch /docs"), se generó la carpeta `/docs` con la compilación lista para servir y con su respectivo `.nojekyll`.

---

## 3. Configuración recomendada en GitHub (1 solo paso)

Para aprovechar la compilación automática por GitHub Actions:

1. Entra a tu repositorio en GitHub: [https://github.com/Jonagu1/kono-web](https://github.com/Jonagu1/kono-web)
2. Ve a **Settings** (Configuración) → pestaña **Pages**.
3. En **Build and deployment** → **Source**, selecciona:
   - **`GitHub Actions`** (en lugar de *"Deploy from a branch"*).
4. ¡Listo! A partir de ese momento, cada `push` ejecutará automáticamente el workflow `.github/workflows/deploy.yml`, compilará Vite y publicará la web sin errores.
