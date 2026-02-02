<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer
    class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-gray-100 py-10 border-t border-purple-800/10"
    role="contentinfo"
  >
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Main content -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:items-center">
        <!-- About Section -->
        <div>
          <a
            href="https://cesar-gu.github.io/portfolio/"
            class="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent inline-block"
            :title="siteData.brandName"
            aria-label="Ir al portfolio de César Gutiérrez"
          >
            {{ siteData.brandName }}
          </a>
          <p class="text-sm text-gray-300 leading-relaxed">
            Herramienta gratuita para analizar el rendimiento, accesibilidad y
            SEO de cualquier sitio web.
          </p>
        </div>

        <!-- Social Links -->
        <div class="md:text-right">
          <h3 class="text-md font-semibold mb-4 text-gray-300">
            Conecta conmigo
          </h3>
          <div class="flex gap-4 md:justify-end items-center" role="list">
            <SocialLink
              v-for="profile in siteData.profiles"
              :key="profile.network"
              :href="profile.url"
              :network="profile.network"
              role="listitem"
            />
            <a
              :href="`mailto:${siteData.email}`"
              :aria-label="`Enviar email a ${siteData.email}`"
              class="group relative w-10 h-10 bg-gray-800 hover:bg-purple-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
              :title="`Email: ${siteData.email}`"
            >
              <svg
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="py-4 text-center border-t border-purple-800/10 mt-6">
        <p class="text-gray-400 text-xs">
          © {{ new Date().getFullYear() }} Analizador Web. Todos los derechos
          reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import SocialLink from './SocialLink.vue';
import { siteData } from '../data/site';
</script>

<style scoped>
/* Footer styles */
</style>
