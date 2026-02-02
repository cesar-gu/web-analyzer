<template>
  <div class="space-y-4">
    <!-- Main scores grid -->
    <div
      class="grid grid-cols-2 md:grid-cols-4 gap-3"
      role="group"
      aria-label="Puntuaciones generales del análisis"
    >
      <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <ScoreCard title="Rendimiento" :score="scores.performance" />
      </div>
      <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <ScoreCard title="Accesibilidad" :score="scores.accessibility" />
      </div>
      <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <ScoreCard title="SEO" :score="scores.seo" />
      </div>
      <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <ScoreCard title="Mejores Prácticas" :score="scores.bestPractices" />
      </div>
    </div>

    <!-- Website info -->
    <div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <p class="text-gray-400 text-sm mb-2">Sitio web analizado:</p>
      <p
        class="text-white font-mono text-sm break-all"
        role="status"
        aria-label="URL del sitio web analizado"
      >
        {{ finalUrl }}
      </p>
      <p class="text-gray-500 text-xs mt-2" aria-label="Tiempo de análisis">
        Tiempo de análisis: {{ formattedTime }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { AnalysisResult } from '../types/index';
import ScoreCard from './ScoreCard.vue';

interface Props {
  scores: AnalysisResult['scores'];
  finalUrl: string;
  fetchTime: string;
}

const props = defineProps<Props>();

import formatFetchTime from '../utils/format';

const formattedTime = computed(() => formatFetchTime(props.fetchTime));
</script>
