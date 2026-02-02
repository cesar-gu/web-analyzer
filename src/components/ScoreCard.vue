<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-col items-center mb-1">
      <h3 class="text-sm font-semibold text-white text-center">{{ title }}</h3>
      <span
        :class="scoreColorClass"
        class="text-md font-extrabold mt-1"
        role="status"
        :aria-label="`${title}: ${score} de 100`"
      >
        {{ score }}/100
      </span>
    </div>

    <!-- Progress bar with gradient -->
    <div
      class="w-full bg-slate-700 rounded-full h-2 overflow-hidden shadow-lg mb-3"
    >
      <div
        :class="barColorClass"
        class="h-full transition-all duration-1000 ease-out"
        :style="{ width: `${Math.min(100, score)}%` }"
      ></div>
    </div>

    <!-- Status indicator -->
    <div class="w-full flex items-center justify-center gap-1 mt-auto">
      <span
        :class="statusColorClass"
        class="flex w-full items-center justify-center gap-2 text-sm font-semibold px-3 py-1 rounded-md"
      >
        <span v-if="status === 'good'" class="text-lg">✓</span>
        <span v-else-if="status === 'needs-improvement'" class="text-lg"
          >⚠</span
        >
        <span v-else class="text-lg">✕</span>
        {{ statusText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  getScoreStatus,
  getStatusText,
  getScoreColorClass,
  getBarColorClass,
  getStatusColorClass,
} from '../utils/score';

interface Props {
  title: string;
  score: number;
}

const props = withDefaults(defineProps<Props>(), {});

const status = computed(() => getScoreStatus(props.score));
const statusText = computed(() => getStatusText(props.score));
const scoreColorClass = computed(() => getScoreColorClass(props.score));
const barColorClass = computed(() => getBarColorClass(props.score));
const statusColorClass = computed(() => getStatusColorClass(props.score));
</script>
