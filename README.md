# Web Analyzer

Mini-Lighthouse para humanos: una web estática (Astro + Vue) que analiza páginas mediante la API Google PageSpeed.

## Requisitos

- Node.js 20.x (usar `nvm use`)
- Google PageSpeed API key (setear en `.env` o secret de GitHub Actions)

> **Nota de seguridad:** El servicio usa la variable de entorno `VITE_GOOGLE_PAGESPEED_API_KEY`. Actualmente `src/services/PageSpeedService.ts` contiene un fallback hardcodeado como valor por defecto si la variable no está presente. Eso es un riesgo de seguridad — elimínese el valor embebido y asegúrese de definir `VITE_GOOGLE_PAGESPEED_API_KEY` en `.env` o en los Secrets de CI.

## Instalación

1. `nvm install 20 && nvm use 20`
2. `npm install --legacy-peer-deps`
3. Copiar `.env.example` a `.env` y añadir tu API key a la variable `VITE_GOOGLE_PAGESPEED_API_KEY`

## Scripts

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Genera site estático
- `npm run preview` - Muestra build local
- `npm run lint` - Ejecuta ESLint
- `npm run format` - Ejecuta Prettier

## Despliegue

- Usar GitHub Actions (`.github/workflows/deploy.yml`) para publicar en GitHub Pages.

## Estructura

Ver `AGENTS.md` para instrucciones para agentes y estructura del repo.
