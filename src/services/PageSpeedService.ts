import axios from 'axios';
import type {
  PageSpeedResponse,
  AnalysisResult,
  Recommendation,
} from '../types/index';
import { THRESHOLDS } from '../types/index';

export class PageSpeedService {
  private apiKey: string;
  private apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_PAGESPEED_API_KEY || '';
  }

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

    if (!this.apiKey) {
      throw new Error(
        'API key not configured. Please set VITE_GOOGLE_PAGESPEED_API_KEY in .env'
      );
    }

    try {
      const params = new URLSearchParams();
      params.append('url', normalizedUrl);
      params.append('key', this.apiKey);
      params.append('strategy', 'mobile');
      params.append('locale', 'es');
      params.append('category', 'performance');
      params.append('category', 'accessibility');
      params.append('category', 'seo');
      params.append('category', 'best-practices');

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
        throw new Error(`PageSpeed API Error: ${errorMessage}`);
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
      lighthouseResult.audits
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
    audits: Record<string, unknown> | undefined
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    if (!audits) return recommendations;

    // Map of audit IDs to categories - used for categorization but not limiting which audits to include
    const categoryMap: Record<string, string> = {
      // Performance audits
      'unused-css': 'performance',
      'unused-javascript': 'performance',
      'modern-image-formats': 'performance',
      'offscreen-images': 'performance',
      'render-blocking-resources': 'performance',
      'render-blocking-insight': 'performance',
      'cumulative-layout-shift': 'performance',
      'first-contentful-paint': 'performance',
      'largest-contentful-paint': 'performance',
      'speed-index': 'performance',
      interactive: 'performance',
      'bootup-time': 'performance',
      'mainthread-work-breakdown': 'performance',
      'unminified-javascript': 'performance',
      'unminified-css': 'performance',
      'total-byte-weight': 'performance',
      'total-blocking-time': 'performance',
      'image-delivery-insight': 'performance',
      'cache-insight': 'performance',
      'font-display-insight': 'performance',
      'network-server-latency': 'performance',
      'legacy-javascript-insight': 'performance',
      'duplicated-javascript-insight': 'performance',
      'server-response-time': 'performance',
      redirects: 'performance',
      'lcp-discovery-insight': 'performance',
      'lcp-breakdown-insight': 'performance',
      'network-dependency-tree-insight': 'performance',
      'resource-summary': 'performance',
      'network-rtt': 'performance',
      'third-parties-insight': 'performance',
      'forced-reflow-insight': 'performance',
      'dom-size-insight': 'performance',

      // Accessibility audits
      'color-contrast': 'accessibility',
      'form-field-labels': 'accessibility',
      'keyboard-navigation': 'accessibility',
      'aria-allowed-role': 'accessibility',
      'aria-hidden-focus': 'accessibility',
      'aria-required-attr': 'accessibility',
      'aria-required-children': 'accessibility',
      'aria-required-parent': 'accessibility',
      'aria-roles': 'accessibility',
      'aria-valid-attr': 'accessibility',
      'aria-valid-attr-value': 'accessibility',
      'aria-allowed-attr': 'accessibility',
      'aria-hidden-body': 'accessibility',
      'aria-deprecated-role': 'accessibility',
      'aria-conditional-attr': 'accessibility',
      'aria-prohibited-attr': 'accessibility',
      'image-alt': 'accessibility',
      'input-image-alt': 'accessibility',
      'link-name': 'accessibility',
      'button-name': 'accessibility',
      'form-field-multiple-labels': 'accessibility',
      'select-name': 'accessibility',
      'target-size': 'accessibility',
      'html-has-lang': 'accessibility',
      'html-lang-valid': 'accessibility',
      'html-xml-lang-mismatch': 'accessibility',
      'meta-viewport': 'accessibility',
      'frame-title': 'accessibility',
      'logical-tab-order': 'accessibility',
      'use-landmarks': 'accessibility',
      'heading-order': 'accessibility',
      list: 'accessibility',
      listitem: 'accessibility',
      'definition-list': 'accessibility',
      dlitem: 'accessibility',
      'video-caption': 'accessibility',
      label: 'accessibility',
      'link-text': 'accessibility',
      'empty-heading': 'accessibility',
      bypass: 'accessibility',
      'focus-traps': 'accessibility',
      'managed-focus': 'accessibility',
      'interactive-element-affordance': 'accessibility',
      'custom-controls-roles': 'accessibility',
      'custom-controls-labels': 'accessibility',
      'visual-order-follows-dom': 'accessibility',
      'offscreen-content-hidden': 'accessibility',
      'crawlable-anchors': 'accessibility',
      'identical-links-same-purpose': 'accessibility',
      'aria-input-field-name': 'accessibility',
      'aria-meter-name': 'accessibility',
      'aria-progressbar-name': 'accessibility',
      'aria-toggle-field-name': 'accessibility',
      'aria-command-name': 'accessibility',
      'aria-dialog-name': 'accessibility',
      'aria-text': 'accessibility',
      'aria-treeitem-name': 'accessibility',
      'label-content-name-mismatch': 'accessibility',
      'object-alt': 'accessibility',
      'table-duplicate-name': 'accessibility',
      'table-fake-caption': 'accessibility',
      'td-has-header': 'accessibility',
      'td-headers-attr': 'accessibility',
      'th-has-data-cells': 'accessibility',
      'paste-preventing-inputs': 'accessibility',
      tabindex: 'accessibility',
      'skip-link': 'accessibility',

      // SEO audits
      'meta-description': 'seo',
      'font-size': 'seo',
      'robots-txt': 'seo',
      canonical: 'seo',
      hreflang: 'seo',
      'http-status-code': 'seo',
      'is-crawlable': 'seo',
      'redirects-http': 'seo',
      'structured-data': 'seo',
      'seo-content': 'seo',
      'seo-crawl': 'seo',
      'seo-mobile': 'seo',

      // Best Practices
      https: 'practices',
      'no-vulnerable-libraries': 'practices',
      doctype: 'practices',
      'errors-in-console': 'practices',
      'valid-source-maps': 'practices',
      'inspector-issues': 'practices',
      deprecations: 'practices',
      'notification-on-start': 'practices',
      charset: 'practices',
      'image-aspect-ratio': 'practices',
      'image-size-responsive': 'practices',
      'unsized-images': 'practices',
      'clickjacking-mitigation': 'practices',
      'csp-xss': 'practices',
      'trusted-types-xss': 'practices',
      'has-hsts': 'practices',
      'origin-isolation': 'practices',
      'third-party-cookies': 'practices',

      // Metrics and diagnostics
      metrics: 'performance',
      diagnostics: 'performance',
      'main-thread-tasks': 'performance',
      'user-timings': 'performance',
      'viewport-insight': 'accessibility',
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

    for (const [auditId, audit] of Object.entries(audits)) {
      const auditData = audit as any;

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

      // Determine category - use map if available, otherwise try to infer from common patterns
      let category: 'performance' | 'accessibility' | 'seo' | 'practices' =
        'practices';

      if (categoryMap[auditId]) {
        category = categoryMap[auditId] as
          | 'performance'
          | 'accessibility'
          | 'seo'
          | 'practices';
      } else {
        // Infer category based on audit ID patterns
        if (
          auditId.includes('aria') ||
          auditId.includes('a11y') ||
          auditId.includes('contrast') ||
          auditId.includes('alt')
        ) {
          category = 'accessibility';
        } else if (
          auditId.includes('seo') ||
          auditId.includes('crawl') ||
          auditId.includes('robots')
        ) {
          category = 'seo';
        } else if (
          auditId.includes('performance') ||
          auditId.includes('image') ||
          auditId.includes('font') ||
          auditId.includes('cache')
        ) {
          category = 'performance';
        }
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
