<template>
  <div class="space-y-4">
    <div class="space-y-6">
      <QuickStats
        :scores="analysis.scores"
        :final-url="analysis.finalUrl"
        :fetch-time="analysis.fetchTime"
      />

      <CoreWebVitals :core-web-vitals="analysis.coreWebVitals" />

      <button
        class="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500"
        @click="showFullReport"
        aria-label="Ver reporte completo del análisis"
      >
        <svg class="w-5 h-5" fill="#fff" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="m19 1h-14c-2.757 0-5 2.243-5 5v12c0 2.757 2.243 5 5 5h14c2.757 0 5-2.243 5-5v-12c0-2.757-2.243-5-5-5zm-14 2h14c1.654 0 3 1.346 3 3v2h-20v-2c0-1.654 1.346-3 3-3zm14 18h-14c-1.654 0-3-1.346-3-3v-8h20v8c0 1.654-1.346 3-3 3zm-16-15.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5zm4 0c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5zm2 10.5v2c0 .553-.448 1-1 1s-1-.447-1-1v-2c0-.553.448-1 1-1s1 .447 1 1zm4-3v5c0 .553-.448 1-1 1s-1-.447-1-1v-5c0-.553.448-1 1-1s1 .447 1 1zm4 2v3c0 .553-.448 1-1 1s-1-.447-1-1v-3c0-.553.448-1 1-1s1 .447 1 1z"
          />
        </svg>
        Ver Reporte Completo
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnalysisResult } from '../types/index';
import QuickStats from './QuickStats.vue';
import CoreWebVitals from './CoreWebVitals.vue';

interface Props {
  analysis: AnalysisResult;
}

defineProps<Props>();

const emit = defineEmits<{
  showFullReport: [];
}>();

const showFullReport = () => emit('showFullReport');
</script>
