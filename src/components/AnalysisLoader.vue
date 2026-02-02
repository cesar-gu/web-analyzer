<template>
  <div class="space-y-8" role="status" aria-live="polite" aria-busy="true">
    <div class="bg-slate-800/50 border border-purple-500/30 rounded-lg p-6">
      <p class="text-gray-300 text-sm mb-2">Analizando:</p>
      <p class="text-white font-mono text-lg break-all">{{ url }}</p>
    </div>

    <div class="flex flex-col items-center justify-center space-y-6 py-12">
      <div class="relative w-20 h-20" aria-hidden="true">
        <!-- Outer rotating ring -->
        <div
          class="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"
        ></div>
        <!-- Middle pulsing ring -->
        <div
          class="absolute inset-2 rounded-full border-2 border-purple-500/30 animate-pulse"
        ></div>
        <!-- Inner dot -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div class="text-center">
        <p class="text-white font-semibold mb-2">Analizando el sitio web</p>
        <p class="text-gray-400 text-sm" aria-live="polite" aria-atomic="true">
          {{ loadingMessages[messageIndex] }}
        </p>
      </div>

      <div
        class="w-full max-w-xs bg-slate-700 rounded-full h-1 overflow-hidden"
      >
        <div
          class="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

defineProps<{
  url: string;
}>();

const loadingMessages = [
  'Obteniendo datos de la página...',
  'Analizando métricas de rendimiento...',
  'Verificando accesibilidad...',
  'Evaluando SEO...',
  'Escaneando mejores prácticas...',
  'Procesando resultados...',
];

const messageIndex = ref(0);
const progress = ref(0);
let messageInterval: ReturnType<typeof setInterval>;
let progressInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  messageInterval = setInterval(() => {
    messageIndex.value = (messageIndex.value + 1) % loadingMessages.length;
  }, 2000);

  progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 20;
    }
  }, 800);
});

onUnmounted(() => {
  if (messageInterval) clearInterval(messageInterval);
  if (progressInterval) clearInterval(progressInterval);
});
</script>
