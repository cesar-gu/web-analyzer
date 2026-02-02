<template>
  <div class="space-y-3">
    <!-- Performance Recommendations -->
    <AccordionSection
      v-if="performanceRecommendations.length > 0"
      title="Rendimiento"
      :count="performanceRecommendations.length"
      icon="⚡"
    >
      <RecommendationItem
        v-for="rec in performanceRecommendations"
        :key="rec.id"
        :recommendation="rec"
      />
    </AccordionSection>

    <!-- Accessibility Recommendations -->
    <AccordionSection
      v-if="accessibilityRecommendations.length > 0"
      title="Accesibilidad"
      :count="accessibilityRecommendations.length"
      icon="♿"
    >
      <RecommendationItem
        v-for="rec in accessibilityRecommendations"
        :key="rec.id"
        :recommendation="rec"
      />
    </AccordionSection>

    <!-- SEO Recommendations -->
    <AccordionSection
      v-if="seoRecommendations.length > 0"
      title="SEO"
      :count="seoRecommendations.length"
      icon="🔍"
    >
      <RecommendationItem
        v-for="rec in seoRecommendations"
        :key="rec.id"
        :recommendation="rec"
      />
    </AccordionSection>

    <!-- Best Practices Recommendations -->
    <AccordionSection
      v-if="practicesRecommendations.length > 0"
      title="Mejores Prácticas"
      :count="practicesRecommendations.length"
      icon="✓"
    >
      <RecommendationItem
        v-for="rec in practicesRecommendations"
        :key="rec.id"
        :recommendation="rec"
      />
    </AccordionSection>

    <!-- Empty state -->
    <div
      v-if="recommendations.length === 0"
      class="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center"
    >
      <p class="text-green-300 font-semibold">🎉 ¡Sin recomendaciones!</p>
      <p class="text-green-200 text-sm mt-1">
        ¡Tu sitio web está funcionando muy bien!
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Recommendation } from '../types/index';
import AccordionSection from './AccordionSection.vue';
import RecommendationItem from './RecommendationItem.vue';

interface Props {
  recommendations: Recommendation[];
}

const props = withDefaults(defineProps<Props>(), {});

const performanceRecommendations = computed(() =>
  props.recommendations.filter((r) => r.category === 'performance')
);

const accessibilityRecommendations = computed(() =>
  props.recommendations.filter((r) => r.category === 'accessibility')
);

const seoRecommendations = computed(() =>
  props.recommendations.filter((r) => r.category === 'seo')
);

const practicesRecommendations = computed(() =>
  props.recommendations.filter((r) => r.category === 'practices')
);
</script>
