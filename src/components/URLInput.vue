<template>
  <div class="space-y-4">
    <form
      class="flex flex-col sm:flex-row gap-2"
      role="search"
      @submit.prevent="handleSubmit"
    >
      <div class="flex-1 flex flex-col">
        <label for="url-input" class="sr-only"
          >Ingresa la URL del sitio a analizar</label
        >
        <input
          id="url-input"
          v-model="urlInput"
          type="text"
          placeholder="Ingresa la URL del sitio (p. ej., ejemplo.com)"
          autocapitalize="off"
          class="flex-1 px-4 py-3 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors duration-200"
          aria-describedby="url-error-message"
        />
      </div>
      <button
        type="submit"
        :disabled="isButtonDisabled"
        class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500"
        aria-label="Analizar el sitio web"
      >
        <span>Analizar</span>
        <svg
          v-if="props.isLoading"
          class="w-4 h-4 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 2v20m10-10H2"
          />
        </svg>
      </button>
    </form>
    <p
      v-if="validationError"
      id="url-error-message"
      class="text-sm text-red-400"
      role="alert"
    >
      {{ validationError }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { isValidUrl, formatUrl } from '../utils/validation';

interface Props {
  initialUrl?: string;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialUrl: '',
  isLoading: false,
});

const emit = defineEmits<{
  analyze: [url: string];
}>();

const urlInput = ref('');
const validationError = ref('');

const isButtonDisabled = computed(
  () => props.isLoading || !urlInput.value.trim()
);

// Pre-fill with initial URL if provided
watch(
  () => props.initialUrl,
  (newUrl) => {
    if (newUrl && !urlInput.value) {
      urlInput.value = newUrl;
    }
  },
  { immediate: true }
);

// validation helpers imported from utils/validation.ts

const handleSubmit = () => {
  validationError.value = '';

  const trimmedUrl = urlInput.value.trim();

  if (!trimmedUrl) {
    validationError.value = 'Por favor ingresa una URL';
    return;
  }

  if (trimmedUrl.length < 4) {
    validationError.value = 'La URL es demasiado corta';
    return;
  }

  if (!isValidUrl(trimmedUrl)) {
    validationError.value = 'Por favor ingresa una URL válida';
    return;
  }

  emit('analyze', formatUrl(trimmedUrl));
};
</script>
