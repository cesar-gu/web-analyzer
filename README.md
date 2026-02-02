# Web Analyzer

Mini-Lighthouse para humanos: una web estática (Astro + Vue) que analiza páginas mediante una API de Lighthouse.

## Requisitos

- Node.js 20.x (usar `nvm use`)

## Instalación

1. `nvm install 20 && nvm use 20`
2. `npm install --legacy-peer-deps`

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
