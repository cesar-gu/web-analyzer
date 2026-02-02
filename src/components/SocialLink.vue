<template>
  <a
    :href="href"
    :aria-label="ariaLabel"
    :title="title"
    target="_blank"
    rel="noopener noreferrer"
    class="group relative w-10 h-10 bg-gray-700 hover:bg-purple-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-400"
  >
    <!-- LinkedIn -->
    <svg
      v-if="network === 'linkedin'"
      class="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"
      />
    </svg>

    <!-- GitHub -->
    <svg
      v-else-if="network === 'github'"
      class="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
      />
    </svg>

    <!-- GitLab -->
    <svg
      v-else-if="network === 'gitlab'"
      class="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"
      />
    </svg>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  href: string;
  network: string;
}

const props = defineProps<Props>();

const ariaLabel = computed(() => {
  return `Conectar en ${props.network}`;
});

const title = computed(() => {
  return props.network.charAt(0).toUpperCase() + props.network.slice(1);
});
</script>
