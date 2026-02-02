<template>
  <div class="space-y-4" role="alert" aria-live="assertive">
    <div
      class="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3"
    >
      <svg
        class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clip-rule="evenodd"
        />
      </svg>
      <div>
        <h3 class="text-red-100 font-semibold mb-1">Error en el Análisis</h3>
        <p class="text-red-50 text-sm">{{ error }}</p>
        <div class="text-red-100 text-xs mt-2">
          <p class="mb-2">
            Por favor verifica la URL e intenta de nuevo. Problemas comunes:
          </p>
          <ul class="list-disc list-inside space-y-0.5">
            <li>El sitio web no es accesible</li>
            <li>El formato de la URL es incorrecto</li>
            <li>Se ha excedido el límite de solicitudes de la API</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string;
}>();
</script>
