import axios from 'axios';
import type {
  PageSpeedResponse,
  AnalysisResult,
  Recommendation,
} from '../types/index';
import { THRESHOLDS } from '../types/index';

export class PageSpeedService {
  private apiUrl = 'https://web-analyzer.cesargupe95.workers.dev';

  validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  async analyzeURL(url: string): Promise<AnalysisResult> {
    const normalizedUrl = this.normalizeUrl(url);

    if (!this.validateUrl(normalizedUrl)) {
      throw new Error('Invalid URL format');
    }

    try {
      const params = new URLSearchParams();
      params.append('url', normalizedUrl);

      const response = await axios.get<PageSpeedResponse>(
        `${this.apiUrl}?${params.toString()}`
      );

      return this.parseResponse(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error?.message ||
          error.message ||
          'Unknown error';
        throw new Error(`Analysis API Error: ${errorMessage}`);
      }
      throw error;
    }
  }

  private parseResponse(response: PageSpeedResponse): AnalysisResult {
    const lighthouseResult = response.lighthouseResult;

    if (!lighthouseResult) {
      throw new Error('Invalid API response: No lighthouse result');
    }

    const scores = {
      performance: Math.round(
        (lighthouseResult.categories?.performance?.score || 0) * 100
      ),
      accessibility: Math.round(
        (lighthouseResult.categories?.accessibility?.score || 0) * 100
      ),
      seo: Math.round((lighthouseResult.categories?.seo?.score || 0) * 100),
      bestPractices: Math.round(
        (lighthouseResult.categories?.['best-practices']?.score || 0) * 100
      ),
    };

    const coreWebVitals = this.extractCoreWebVitals(lighthouseResult.audits);
    const recommendations = this.extractRecommendations(
      lighthouseResult.audits,
      lighthouseResult.categories
    );
    const technicalInfo = this.extractTechnicalInfo(lighthouseResult);

    return {
      url: lighthouseResult.requestedUrl,
      finalUrl: lighthouseResult.finalUrl,
      fetchTime: lighthouseResult.fetchTime,
      scores,
      coreWebVitals,
      recommendations,
      technicalInfo,
      fullReport: response,
    };
  }

  private extractCoreWebVitals(
    audits: Record<string, unknown> | undefined
  ): AnalysisResult['coreWebVitals'] {
    const vitals: AnalysisResult['coreWebVitals'] = {};

    if (!audits) return vitals;

    // LCP - Largest Contentful Paint
    const lcpAudit = audits['largest-contentful-paint'] as any;
    if (lcpAudit?.numericValue !== undefined) {
      const lcpValue = Math.round(lcpAudit.numericValue);
      vitals.lcp = {
        name: 'Largest Contentful Paint',
        value: lcpValue,
        threshold: THRESHOLDS.LCP,
        unit: 'ms',
        status: this.getStatus(lcpValue, THRESHOLDS.LCP),
      };
    }

    // FCP - First Contentful Paint
    const fcpAudit = audits['first-contentful-paint'] as any;
    if (fcpAudit?.numericValue !== undefined) {
      const fcpValue = Math.round(fcpAudit.numericValue);
      vitals.fcp = {
        name: 'First Contentful Paint',
        value: fcpValue,
        threshold: THRESHOLDS.FCP,
        unit: 'ms',
        status: this.getStatus(fcpValue, THRESHOLDS.FCP),
      };
    }

    const clsAudit = audits['cumulative-layout-shift'] as any;
    if (clsAudit?.numericValue !== undefined) {
      const clsValue = Math.round(clsAudit.numericValue * 1000) / 1000;
      vitals.cls = {
        name: 'Cumulative Layout Shift',
        value: clsValue,
        threshold: THRESHOLDS.CLS,
        unit: '',
        status: this.getStatus(clsValue, THRESHOLDS.CLS, true),
      };
    }

    return vitals;
  }

  private getStatus(
    value: number,
    threshold: number,
    isInverse: boolean = false
  ): 'good' | 'needs-improvement' | 'poor' {
    if (isInverse) {
      return value <= threshold
        ? 'good'
        : value <= threshold * 1.5
          ? 'needs-improvement'
          : 'poor';
    }
    return value <= threshold
      ? 'good'
      : value <= threshold * 1.5
        ? 'needs-improvement'
        : 'poor';
  }

  private extractRecommendations(
    audits: Record<string, unknown> | undefined,
    categories: Record<string, any> | undefined
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (!audits || !categories) return recommendations;

    // Map category names to our internal format
    const categoryNameMap: Record<
      string,
      'performance' | 'accessibility' | 'seo' | 'practices'
    > = {
      performance: 'performance',
      accessibility: 'accessibility',
      seo: 'seo',
      'best-practices': 'practices',
    };

    // Helper function to determine impact level based on score
    const getImpactLevel = (auditData: any): 'high' | 'medium' | 'low' => {
      // If score is available, use it to determine impact
      if (typeof auditData.score === 'number') {
        if (auditData.score < 0.5) return 'high';
        if (auditData.score < 0.9) return 'medium';
        return 'low';
      }

      // For non-numeric scores, check scoreDisplayMode
      if (auditData.scoreDisplayMode === 'binary' && auditData.score === 0) {
        return 'high';
      }

      return 'medium';
    };

    // Iterate through each category and its auditRefs
    for (const [categoryKey, categoryData] of Object.entries(categories)) {
      const category = categoryNameMap[categoryKey];
      if (!category) continue; // Skip unknown categories

      const auditRefs = (categoryData as any)?.auditRefs;
      if (!Array.isArray(auditRefs)) continue; // Skip if no auditRefs

      for (const auditRef of auditRefs) {
        const auditId = auditRef.id;
        if (!auditId) continue;

        const auditData = audits[auditId] as any;
        if (!auditData) continue;

        // Skip passing audits and non-applicable ones
        if (
          auditData.score === 1 ||
          auditData.scoreDisplayMode === 'notApplicable'
        ) {
          continue;
        }

        // Skip manual audits and informative-only ones
        if (
          auditData.scoreDisplayMode === 'manual' ||
          auditData.scoreDisplayMode === 'informative'
        ) {
          continue;
        }

        // Skip audits without title or description
        if (!auditData.title || !auditData.description) {
          continue;
        }

        const impact = getImpactLevel(auditData);

        recommendations.push({
          id: auditId,
          title: auditData.title,
          description: auditData.description,
          impact,
          category,
        });
      }
    }

    // Sort by impact (high first), then by category, then by title
    recommendations.sort((a, b) => {
      const impactOrder = { high: 0, medium: 1, low: 2 };
      const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
      if (impactDiff !== 0) return impactDiff;

      const categoryOrder = {
        performance: 0,
        accessibility: 1,
        seo: 2,
        practices: 3,
      };
      const categoryDiff =
        categoryOrder[a.category] - categoryOrder[b.category];
      if (categoryDiff !== 0) return categoryDiff;

      return a.title.localeCompare(b.title);
    });

    return recommendations;
  }

  private extractTechnicalInfo(
    lighthouseResult: any
  ): AnalysisResult['technicalInfo'] {
    const audits = lighthouseResult.audits || {};

    let serverResponseTime = 0;
    let domContentLoaded = 0;
    let pageLoadTime = 0;

    const metricsAudit = audits['metrics'] as any;
    if (metricsAudit?.details?.items?.[0]) {
      const metrics = metricsAudit.details.items[0];
      serverResponseTime = metrics.speedIndex || 0;
      domContentLoaded = metrics.domContentLoaded || 0;
      pageLoadTime = metrics.firstMeaningfulPaint || 0;
    }

    if (!pageLoadTime && lighthouseResult.fetchTime) {
      try {
        pageLoadTime = parseInt(lighthouseResult.fetchTime);
      } catch {
        pageLoadTime = 0;
      }
    }

    return {
      serverResponseTime,
      domContentLoaded,
      pageLoadTime,
    };
  }
}

export const pageSpeedService = new PageSpeedService();
