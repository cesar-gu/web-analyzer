<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col"
  >
    <main
      class="min-h-screen flex items-center justify-center px-4 py-12"
      role="main"
    >
      <div class="w-full max-w-2xl">
        <div class="text-center mb-8 sm:mb-12">
          <h1 class="text-3xl sm:text-5xl font-bold text-white mb-2 sm:mb-4">
            Analizador Web
          </h1>
          <p class="text-md sm:text-xl text-gray-300">
            Analiza cualquier sitio web - Explicado para humanos
          </p>
        </div>

        <div class="space-y-6">
          <URLInput
            :initial-url="state !== 'empty' ? currentUrl : ''"
            :is-loading="state === 'loading'"
            @analyze="handleAnalyze"
          />

          <AnalysisLoader v-if="state === 'loading'" :url="currentUrl" />
          <ErrorMessage v-else-if="state === 'error'" :error="error" />
          <ResultsPanel
            v-else-if="state === 'success' && analysisResult"
            :analysis="analysisResult"
            @show-full-report="showModal = true"
          />
        </div>
      </div>
    </main>

    <Footer />

    <ModalFullReport
      v-if="showModal && analysisResult"
      :analysis="analysisResult"
      @close="showModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { AnalysisResult } from '../types/index';
import URLInput from './URLInput.vue';
import { pageSpeedService } from '../services/PageSpeedService';
import AnalysisLoader from './AnalysisLoader.vue';
import ResultsPanel from './ResultsPanel.vue';
import ErrorMessage from './ErrorMessage.vue';
import ModalFullReport from './ModalFullReport.vue';
import Footer from './Footer.vue';

type State = 'empty' | 'loading' | 'error' | 'success';

const state = ref<State>('empty');
const currentUrl = ref('');
const analysisResult = ref<AnalysisResult | null>(null);
const error = ref<string>('');
const showModal = ref(false);
let analysisStartTime: number = 0;

const handleAnalyze = async (url: string) => {
  currentUrl.value = url;
  state.value = 'loading';
  error.value = '';
  analysisStartTime = performance.now();

  try {
    const data = await pageSpeedService.analyzeURL(url);
    const elapsedTime = performance.now() - analysisStartTime;

    const result = data as AnalysisResult;
    result.fetchTime = elapsedTime.toString();

    analysisResult.value = result;
    state.value = 'success';
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'An unknown error occurred';
    error.value = errorMessage;
    state.value = 'error';
  }
};
</script>
