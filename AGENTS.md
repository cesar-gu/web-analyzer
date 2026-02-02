# AGENTS

Este documento explica la estructura del proyecto y cómo debe interactuar un agente automatizado (o desarrollador) con el repositorio.

## Resumen

- Proyecto: Web Analyzer — sitio estático (Astro + Vue) que analiza páginas usando la API de Google PageSpeed.
- Propósito: Mostrar métricas y recomendaciones (Rendimiento, Accesibilidad, SEO, Buenas Prácticas) con explicaciones y acciones claras.

## Archivos y carpetas clave

- `src/components/` — Componentes Vue usados por la app.
  - `App.vue` — Shell principal y manejo de estado.
  - `URLInput.vue` — Entrada de URL y validación básica.
  - `AnalysisLoader.vue` — Spinner de carga y UI de progreso.
  - `ResultsPanel.vue` — Agrega resultados y abre el modal de reporte completo.
  - `ScoreCard.vue` — Muestra barras de puntuación coloreadas.
  - `CoreWebVitals.vue` — Muestra LCP, FCP, CLS.
  - `ModalFullReport.vue` — Modal con el informe completo de Lighthouse y recomendaciones.
  - `RecommendationsAccordion.vue`, `AccordionSection.vue`, `RecommendationItem.vue` — Agrupan y renderizan recomendaciones por categoría.

- `src/services/PageSpeedService.ts` — Servicio responsable de llamar a la API de PageSpeed y parsear la respuesta. Lee la clave de entorno `VITE_GOOGLE_PAGESPEED_API_KEY` (ver nota de seguridad más abajo).

- `src/types/index.ts` — Interfaces TypeScript para modelar respuestas de la API y estructuras de UI.

- `src/pages/index.astro` — Página de entrada que monta `App.vue` con `client:load`.

- `src/pages/api/analyze.ts` — Archivo placeholder: la lógica de análisis se ejecuta en cliente; este archivo se mantiene por historial y no exporta un handler HTTP.

- `src/styles/global.css` — Imports globales de Tailwind y animaciones personalizadas.

- `astro.config.mjs` — Configuración de Astro para build estático e integraciones.

- `.env.example` — Plantilla de variables de entorno. Copiar a `.env` para desarrollo local.

- `.nvmrc` — Versión de Node (20) usada por CI y desarrolladores. Ejecutar `nvm use` antes de comandos de Node.

- `.github/workflows/deploy.yml` — Workflow de GitHub Actions para build y despliegue (GitHub Pages).

## Ejecutar localmente (instrucciones rápidas)

1. Asegurar Node 20 activo:
   - `nvm install 20 && nvm use 20`

2. Instalar dependencias:
   - `npm install --legacy-peer-deps`

3. Crear `.env` (copiar desde `.env.example`) y definir `VITE_GOOGLE_PAGESPEED_API_KEY`.

4. Ejecutar servidor de desarrollo:
   - `npm run dev`

5. Para build de producción:
   - `npm run build`

## Notas importantes para agentes y mantenedores

- La clave de la API de PageSpeed debe mantenerse en variables de entorno y no debe ser commiteada. Use `.env` en desarrollo y GitHub Secrets en CI.
- Atención: el archivo `src/services/PageSpeedService.ts` actualmente contiene un valor por defecto hardcodeado como fallback si no se encuentra `VITE_GOOGLE_PAGESPEED_API_KEY`. Esto es un riesgo de seguridad y debe eliminarse o reemplazarse por una configuración segura. Recomendación: lanzar un error si la variable de entorno no existe y documentar en `README.md`.
- El análisis se realiza en el cliente para permitir despliegues estáticos en GitHub Pages; `src/pages/api/analyze.ts` es un placeholder que no expone endpoint.
- El proyecto evita caching deliberadamente para obtener datos frescos en cada petición.

## Dónde añadir pruebas

- `src/services/__tests__/PageSpeedService.test.ts` — Tests unitarios para la lógica de parsing y manejo de errores.
- `src/components/__tests__/` — Tests de snapshots y comportamiento para los componentes Vue.
