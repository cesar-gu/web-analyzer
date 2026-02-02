// Core Web Vitals thresholds (in milliseconds)
export const THRESHOLDS = {
  LCP: 2500, // Largest Contentful Paint
  FCP: 1800, // First Contentful Paint
  CLS: 0.1, // Cumulative Layout Shift
};

// Score thresholds for color coding
// Score ranges and colors
export type ScoreRange = 'good' | 'needs-improvement' | 'poor';

// Core Web Vitals metrics
export interface CoreWebVital {
  name: string;
  value: number | string;
  threshold: number;
  unit: string;
  status: 'good' | 'needs-improvement' | 'poor';
}

// Recommendation object
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'performance' | 'accessibility' | 'seo' | 'practices';
}

// Audit result
export interface Audit {
  id: string;
  title: string;
  description: string;
  score: number;
  displayValue: string;
  category: string;
  details?: {
    items?: Array<Record<string, unknown>>;
  };
}

// PageSpeed API response
export interface PageSpeedResponse {
  captchaResult?: string;
  kind: string;
  id: string;
  loadingExperience?: Record<string, unknown>;
  originLoadingExperience?: Record<string, unknown>;
  lighthouseResult?: {
    requestedUrl: string;
    finalUrl: string;
    fetchTime: string;
    timing?: {
      total: number;
    };
    scores?: {
      performance?: number;
      accessibility?: number;
      seo?: number;
      'best-practices'?: number;
    };
    categories?: {
      performance?: {
        title: string;
        score: number;
      };
      accessibility?: {
        title: string;
        score: number;
      };
      seo?: {
        title: string;
        score: number;
      };
      'best-practices'?: {
        title: string;
        score: number;
      };
    };
    audits?: Record<string, Audit>;
  };
}

// Analyzed result for UI
export interface AnalysisResult {
  url: string;
  finalUrl: string;
  fetchTime: string;
  scores: {
    performance: number;
    accessibility: number;
    seo: number;
    bestPractices: number;
  };
  coreWebVitals: {
    lcp?: CoreWebVital;
    fcp?: CoreWebVital;
    cls?: CoreWebVital;
  };
  recommendations: Recommendation[];
  technicalInfo: {
    serverResponseTime: number;
    domContentLoaded: number;
    pageLoadTime: number;
  };
  fullReport: PageSpeedResponse;
}
