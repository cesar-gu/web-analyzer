<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    role="presentation"
    @click.self="close"
    @keydown.esc="close"
  >
    <div
      class="w-full max-w-3xl bg-slate-900 border border-purple-500/30 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto my-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      @click.stop
    >
      <div
        class="sticky top-0 bg-slate-900 border-b border-purple-500/30 px-6 py-4 flex items-center justify-between"
      >
        <h2 id="modal-title" class="text-2xl font-bold text-white">
          Reporte Completo
        </h2>
        <button
          class="text-gray-400 hover:text-white transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:rounded"
          aria-label="Cerrar modal"
          @click="close"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-8">
        <div>
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-xl" aria-hidden="true">📊</span>
            Resumen de Puntuaciones
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="bg-slate-800 rounded-lg p-3">
              <p class="text-gray-400 text-xs mb-1">Rendimiento</p>
              <p
                :class="getScoreColorClass(analysis.scores.performance)"
                class="text-2xl font-bold"
              >
                {{ Math.round(analysis.scores.performance) }}/100
              </p>
            </div>
            <div class="bg-slate-800 rounded-lg p-3">
              <p class="text-gray-400 text-xs mb-1">Accesibilidad</p>
              <p
                :class="getScoreColorClass(analysis.scores.accessibility)"
                class="text-2xl font-bold"
              >
                {{ Math.round(analysis.scores.accessibility) }}/100
              </p>
            </div>
            <div class="bg-slate-800 rounded-lg p-3">
              <p class="text-gray-400 text-xs mb-1">SEO</p>
              <p
                :class="getScoreColorClass(analysis.scores.seo)"
                class="text-2xl font-bold"
              >
                {{ Math.round(analysis.scores.seo) }}/100
              </p>
            </div>
            <div class="bg-slate-800 rounded-lg p-3">
              <p class="text-gray-400 text-xs mb-1">Mejores Prácticas</p>
              <p
                :class="getScoreColorClass(analysis.scores.bestPractices)"
                class="text-2xl font-bold"
              >
                {{ Math.round(analysis.scores.bestPractices) }}/100
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-xl" aria-hidden="true">💡</span>
            Recomendaciones
          </h3>
          <RecommendationsAccordion
            :recommendations="analysis.recommendations"
          />
        </div>

        <div>
          <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span class="text-xl" aria-hidden="true">⚙️</span>
            Información Técnica
          </h3>
          <div class="bg-slate-800 rounded-lg p-4 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-400">URL del Sitio:</span>
              <span
                class="text-white font-mono text-sm break-all text-right max-w-xs"
                >{{ analysis.finalUrl }}</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Tiempo de Análisis:</span>
              <span class="text-white">{{ formattedFetchTime }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400"
                >Tiempo de Respuesta del Servidor:</span
              >
              <span class="text-white">{{ formattedServerResponseTime }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">DOM Cargado:</span>
              <span class="text-white">{{ formattedDomContentLoaded }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-400">Tiempo de Carga de Página:</span>
              <span class="text-white">{{ formattedPageLoadTime }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-slate-800/50 border-t border-purple-500/30 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <p class="text-gray-400 text-sm">
          Analizado con Google PageSpeed Insights API
        </p>
        <button
          class="px-4 py-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500"
          aria-label="Descargar reporte en PDF"
          :disabled="isGeneratingPdf"
          @click="downloadPdf"
        >
          <svg
            v-if="!isGeneratingPdf"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{{ isGeneratingPdf ? 'Generando...' : 'Descargar PDF' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, toRefs } from 'vue';
import type { AnalysisResult } from '../types/index';
import RecommendationsAccordion from './RecommendationsAccordion.vue';
import formatFetchTime from '../utils/format';
import { getScoreColorClass } from '../utils/score';
import { generatePdfReport } from '../services/PdfReportService';

interface Props {
  analysis: AnalysisResult;
}

const props = defineProps<Props>();
const { analysis } = toRefs(props);

const formattedFetchTime = computed(() =>
  formatFetchTime(analysis.value?.fetchTime)
);

const formattedServerResponseTime = computed(() =>
  formatFetchTime(analysis.value?.technicalInfo.serverResponseTime)
);

const formattedDomContentLoaded = computed(() =>
  formatFetchTime(analysis.value?.technicalInfo.domContentLoaded)
);

const formattedPageLoadTime = computed(() =>
  formatFetchTime(analysis.value?.technicalInfo.pageLoadTime)
);

const emit = defineEmits<{
  close: [];
}>();

const isOpen = ref(true);
const isGeneratingPdf = ref(false);

const close = () => {
  isOpen.value = false;
  emit('close');
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close();
};

watch(isOpen, (newValue) => {
  if (newValue) window.addEventListener('keydown', handleKeyDown);
  else window.removeEventListener('keydown', handleKeyDown);
});

const downloadPdf = async () => {
  try {
    isGeneratingPdf.value = true;
    await new Promise((resolve) => setTimeout(resolve, 100));
    generatePdfReport(analysis.value);
  } finally {
    isGeneratingPdf.value = false;
  }
};
</script>
