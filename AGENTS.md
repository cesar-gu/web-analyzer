# AGENTS

Este documento explica la estructura del proyecto y cómo debe interactuar un agente automatizado (o desarrollador) con el repositorio.

## Resumen

- Proyecto: Web Analyzer — sitio estático (Astro + Vue) que analiza páginas usando una API de Lighthouse en Cloudflare Workers.
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

- `src/services/PageSpeedService.ts` — Servicio responsable de llamar a la API de Cloudflare Workers y parsear la respuesta de Lighthouse.

- `src/types/index.ts` — Interfaces TypeScript para modelar respuestas de la API y estructuras de UI.

- `src/pages/index.astro` — Página de entrada que monta `App.vue` con `client:load`.

- `src/pages/api/analyze.ts` — Archivo placeholder: la lógica de análisis se ejecuta en cliente; este archivo se mantiene por historial y no exporta un handler HTTP.

- `src/styles/global.css` — Imports globales de Tailwind y animaciones personalizadas.

- `astro.config.mjs` — Configuración de Astro para build estático e integraciones.

- `.nvmrc` — Versión de Node (20) usada por CI y desarrolladores. Ejecutar `nvm use` antes de comandos de Node.

- `.github/workflows/deploy.yml` — Workflow de GitHub Actions para build y despliegue (GitHub Pages).

## Ejecutar localmente (instrucciones rápidas)

1. Asegurar Node 20 activo:
   - `nvm install 20 && nvm use 20`

2. Instalar dependencias:
   - `npm install --legacy-peer-deps`

3. Ejecutar servidor de desarrollo:
   - `npm run dev`

4. Para build de producción:
   - `npm run build`

## Notas importantes para agentes y mantenedores

- La aplicación usa una API externa en Cloudflare Workers (`https://web-analyzer.cesargupe95.workers.dev`) que recibe una URL como parámetro y devuelve el reporte de Lighthouse en formato JSON.
- No se requieren variables de entorno ni claves de API. El servicio es serverless y delegado a la API externa.
- El análisis se realiza en el cliente para permitir despliegues estáticos en GitHub Pages; `src/pages/api/analyze.ts` es un placeholder que no expone endpoint.
- El proyecto evita caching deliberadamente para obtener datos frescos en cada petición.

## Dónde añadir pruebas

- `src/services/__tests__/PageSpeedService.test.ts` — Tests unitarios para la lógica de parsing y manejo de errores.
- `src/components/__tests__/` — Tests de snapshots y comportamiento para los componentes Vue.
