<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-white flex items-center gap-2">
      <svg
        class="w-6 h-6 text-blue-400"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.633l4-12a1 1 0 011.265-.632zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
      Métricas Web Principales
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- LCP Card -->
      <div
        v-if="coreWebVitals.lcp"
        class="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="text-gray-400 text-sm">{{ coreWebVitals.lcp.name }}</p>
            <p
              :class="getVitalColor(coreWebVitals.lcp.status)"
              class="text-3xl font-bold mt-1"
            >
              {{ coreWebVitals.lcp.value
              }}<span class="text-lg ml-1">{{ coreWebVitals.lcp.unit }}</span>
            </p>
          </div>
          <span
            :class="getVitalStatusIcon(coreWebVitals.lcp.status)"
            class="text-2xl"
            :aria-label="`Estado: ${coreWebVitals.lcp.status}`"
            aria-hidden="false"
          >
          </span>
        </div>
        <p class="text-xs text-gray-400">
          Umbral óptimo: ≤ {{ coreWebVitals.lcp.threshold }}ms
        </p>
        <p class="text-xs text-gray-500 mt-2">
          Largest Contentful Paint - mide cuándo el contenido principal se hace
          visible
        </p>
      </div>

      <!-- FCP Card -->
      <div
        v-if="coreWebVitals.fcp"
        class="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="text-gray-400 text-sm">{{ coreWebVitals.fcp.name }}</p>
            <p
              :class="getVitalColor(coreWebVitals.fcp.status)"
              class="text-3xl font-bold mt-1"
            >
              {{ coreWebVitals.fcp.value
              }}<span class="text-lg ml-1">{{ coreWebVitals.fcp.unit }}</span>
            </p>
          </div>
          <span
            :class="getVitalStatusIcon(coreWebVitals.fcp.status)"
            class="text-2xl"
            :aria-label="`Estado: ${coreWebVitals.fcp.status}`"
            aria-hidden="false"
          >
          </span>
        </div>
        <p class="text-xs text-gray-400">
          Umbral óptimo: ≤ {{ coreWebVitals.fcp.threshold }}ms
        </p>
        <p class="text-xs text-gray-500 mt-2">
          First Input Delay - mide la capacidad de respuesta a la interacción
          del usuario
        </p>
      </div>

      <!-- CLS Card -->
      <div
        v-if="coreWebVitals.cls"
        class="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
      >
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="text-gray-400 text-sm">{{ coreWebVitals.cls.name }}</p>
            <p
              :class="getVitalColor(coreWebVitals.cls.status)"
              class="text-3xl font-bold mt-1"
            >
              {{ coreWebVitals.cls.value
              }}<span class="text-lg ml-1">{{ coreWebVitals.cls.unit }}</span>
            </p>
          </div>
          <span
            :class="getVitalStatusIcon(coreWebVitals.cls.status)"
            class="text-2xl"
            :aria-label="`Estado: ${coreWebVitals.cls.status}`"
            aria-hidden="false"
          >
          </span>
        </div>
        <p class="text-xs text-gray-400">
          Umbral óptimo: ≤ {{ coreWebVitals.cls.threshold }}
        </p>
        <p class="text-xs text-gray-500 mt-2">
          Cumulative Layout Shift - mide la estabilidad visual
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnalysisResult } from '../types/index';
import { getColorFromStatus, getStatusIconClass } from '../utils/score';

interface Props {
  coreWebVitals: AnalysisResult['coreWebVitals'];
}

defineProps<Props>();

const getVitalColor = (status: 'good' | 'needs-improvement' | 'poor') =>
  getColorFromStatus(status);

const getVitalStatusIcon = (status: 'good' | 'needs-improvement' | 'poor') =>
  getStatusIconClass(status);
</script>
