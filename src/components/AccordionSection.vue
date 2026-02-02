<template>
  <div
    class="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden"
  >
    <button
      class="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
      :aria-expanded="isOpen"
      :aria-controls="`accordion-content-${title}`"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center gap-3">
        <span class="text-xl" aria-hidden="true">{{ icon }}</span>
        <div class="text-left">
          <h4 class="font-semibold text-white">{{ title }}</h4>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="bg-purple-500/30 text-purple-200 px-2 py-1 rounded text-xs font-semibold"
          :aria-label="`${count} recomendaciones`"
        >
          {{ count }}
        </span>
        <svg
          :class="{ 'rotate-180': isOpen }"
          class="w-5 h-5 text-gray-400 transition-transform duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </button>

    <!-- Expanded content -->
    <div
      v-if="isOpen"
      :id="`accordion-content-${title}`"
      class="border-t border-slate-700 px-4 py-3 space-y-2 bg-slate-900/50"
      role="region"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title: string;
  count: number;
  icon: string;
}

withDefaults(defineProps<Props>(), {});

const isOpen = ref(false);
</script>
