import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://cesar-gu.github.io/web-analyzer',
  base: '/web-analyzer',
  output: 'static',
  integrations: [vue(), tailwind()],
});
