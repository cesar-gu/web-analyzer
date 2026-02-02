<template>
  <article class="bg-slate-700/30 border-l-2 border-purple-500 rounded p-3">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h5 class="font-semibold text-white">{{ recommendation.title }}</h5>
        <p class="text-gray-300 text-sm mt-1">
          {{ recommendation.description }}
        </p>
      </div>
      <span
        :class="impactBadgeClass"
        class="text-xs font-bold px-2 py-1 rounded whitespace-nowrap ml-2"
        :aria-label="`Impacto: ${impactLabel}`"
      >
        {{ impactLabel }}
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Recommendation } from '../types/index';

interface Props {
  recommendation: Recommendation;
}

const props = withDefaults(defineProps<Props>(), {});

const impactBadgeClass = computed(() => {
  switch (props.recommendation.impact) {
    case 'high':
      return 'bg-red-500/20 text-red-300 border border-red-500/30';
    case 'medium':
      return 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
    case 'low':
      return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
  }
});

const impactLabel = computed(() => {
  switch (props.recommendation.impact) {
    case 'high':
      return 'Alto';
    case 'medium':
      return 'Medio';
    case 'low':
      return 'Bajo';
  }
});
</script>
