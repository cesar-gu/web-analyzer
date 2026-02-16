import jsPDF from 'jspdf';
import type { AnalysisResult, Recommendation } from '../types/index';

/**
 * Service to generate a visually attractive PDF report from Lighthouse analysis
 */
export class PdfReportService {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private currentY: number = 20;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  public generateReport(analysis: AnalysisResult): void {
    this.addHeader();
    this.addScoresSection(analysis);
    this.addCoreWebVitalsSection(analysis);
    this.addTechnicalInfoSection(analysis);
    this.addRecommendationsSectionGrouped(analysis);
    this.addFooter();

    const fileName = `lighthouse-report-${this.sanitizeFileName(analysis.url)}-${new Date().getTime()}.pdf`;
    this.doc.save(fileName);
  }

  private addHeader(): void {
    this.doc.setFillColor(88, 28, 135);
    this.doc.rect(0, 0, this.pageWidth, 45, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Reporte de Análisis Web', this.pageWidth / 2, 18, {
      align: 'center',
    });

    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(
      'Powered by Google PageSpeed Insights',
      this.pageWidth / 2,
      32,
      { align: 'center' }
    );

    this.currentY = 55;
  }

  private addScoresSection(analysis: AnalysisResult): void {
    this.addSectionTitle('Resumen de Puntuaciones');

    const scores = [
      { label: 'Rendimiento', value: analysis.scores.performance },
      { label: 'Accesibilidad', value: analysis.scores.accessibility },
      { label: 'SEO', value: analysis.scores.seo },
      { label: 'Mejores Prácticas', value: analysis.scores.bestPractices },
    ];

    const boxWidth = (this.pageWidth - this.margin * 2 - 15) / 4;
    const boxHeight = 35;
    const startX = this.margin;

    scores.forEach((score, index) => {
      const x = startX + index * (boxWidth + 5);
      const scoreValue = Math.round(score.value);
      const color = this.getScoreColor(scoreValue);

      this.doc.setFillColor(color.bg.r, color.bg.g, color.bg.b);
      this.doc.roundedRect(x, this.currentY, boxWidth, boxHeight, 3, 3, 'F');

      this.doc.setTextColor(100, 100, 100);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(score.label, x + boxWidth / 2, this.currentY + 12, {
        align: 'center',
      });

      this.doc.setTextColor(color.text.r, color.text.g, color.text.b);
      this.doc.setFontSize(16);
      this.doc.setFont('helvetica', 'bold');
      const scoreText = `${scoreValue} /100`;
      this.doc.text(scoreText, x + boxWidth / 2, this.currentY + 25, {
        align: 'center',
      });
    });

    this.currentY += boxHeight + 15;
  }

  private addCoreWebVitalsSection(analysis: AnalysisResult): void {
    if (
      !analysis.coreWebVitals.lcp &&
      !analysis.coreWebVitals.fcp &&
      !analysis.coreWebVitals.cls
    ) {
      return;
    }

    this.checkPageBreak(60);
    this.addSectionTitle('Core Web Vitals');

    const vitals = [
      { label: 'LCP', data: analysis.coreWebVitals.lcp },
      { label: 'FCP', data: analysis.coreWebVitals.fcp },
      { label: 'CLS', data: analysis.coreWebVitals.cls },
    ].filter((v) => v.data);

    vitals.forEach((vital) => {
      if (!vital.data) return;

      const statusColor = this.getStatusColor(vital.data.status);

      this.doc.setTextColor(50, 50, 50);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${vital.data.name}:`, this.margin, this.currentY);

      this.doc.setTextColor(statusColor.r, statusColor.g, statusColor.b);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(
        `${vital.data.value} ${vital.data.unit}`,
        this.margin + 70,
        this.currentY
      );

      this.doc.setFillColor(statusColor.r, statusColor.g, statusColor.b);
      this.doc.circle(
        this.pageWidth - this.margin - 5,
        this.currentY - 2,
        2,
        'F'
      );

      this.currentY += 10;
    });

    this.currentY += 8;
  }

  private addTechnicalInfoSection(analysis: AnalysisResult): void {
    this.checkPageBreak(70);
    this.addSectionTitle('Información Técnica');

    this.doc.setFillColor(245, 245, 245);
    this.doc.roundedRect(
      this.margin,
      this.currentY,
      this.pageWidth - this.margin * 2,
      55,
      3,
      3,
      'F'
    );

    this.currentY += 10;

    const technicalData = [
      { label: 'URL del Sitio:', value: analysis.finalUrl },
      { label: 'Tiempo de Análisis:', value: analysis.fetchTime },
      {
        label: 'Tiempo de Respuesta del Servidor:',
        value: `${analysis.technicalInfo.serverResponseTime.toFixed(2)} ms`,
      },
      {
        label: 'DOM Cargado:',
        value: `${analysis.technicalInfo.domContentLoaded.toFixed(2)} ms`,
      },
      {
        label: 'Tiempo de Carga de Página:',
        value: `${analysis.technicalInfo.pageLoadTime.toFixed(2)} ms`,
      },
    ];

    this.doc.setFontSize(9);
    technicalData.forEach((item) => {
      this.doc.setTextColor(100, 100, 100);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(item.label, this.margin + 5, this.currentY);

      this.doc.setTextColor(50, 50, 50);
      this.doc.setFont('helvetica', 'bold');
      const maxWidth = this.pageWidth - this.margin * 2 - 10;
      const valueText = this.truncateText(item.value, maxWidth - 80);
      this.doc.text(valueText, this.margin + 85, this.currentY);

      this.currentY += 8;
    });

    this.currentY += 10;
  }

  private addRecommendationsSectionGrouped(analysis: AnalysisResult): void {
    if (!analysis.recommendations || analysis.recommendations.length === 0) {
      return;
    }

    this.checkPageBreak(40);
    this.addSectionTitle('Recomendaciones por Categoría');

    const grouped = this.groupRecommendationsByCategory(
      analysis.recommendations
    );

    const categoryOrder: Array<
      'performance' | 'accessibility' | 'seo' | 'practices'
    > = ['performance', 'accessibility', 'seo', 'practices'];
    const categoryNames = {
      performance: 'Rendimiento',
      accessibility: 'Accesibilidad',
      seo: 'SEO',
      practices: 'Mejores Prácticas',
    };

    categoryOrder.forEach((category) => {
      const recommendations = grouped[category];
      if (!recommendations || recommendations.length === 0) return;

      this.checkPageBreak(30);

      this.doc.setFillColor(245, 245, 250);
      this.doc.roundedRect(
        this.margin,
        this.currentY,
        this.pageWidth - this.margin * 2,
        8,
        2,
        2,
        'F'
      );

      this.doc.setTextColor(88, 28, 135);
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(
        `${categoryNames[category]} (${recommendations.length})`,
        this.margin + 3,
        this.currentY + 5.5
      );

      this.currentY += 16;

      recommendations.forEach((rec, index) => {
        this.checkPageBreak(22);

        const indent = 3;

        const impactColor = this.getImpactColor(rec.impact);
        this.doc.setFillColor(impactColor.r, impactColor.g, impactColor.b);
        this.doc.roundedRect(
          this.margin + indent,
          this.currentY - 3,
          15,
          6,
          2,
          2,
          'F'
        );

        this.doc.setTextColor(255, 255, 255);
        this.doc.setFontSize(7);
        this.doc.setFont('helvetica', 'bold');
        const impactText =
          rec.impact === 'high'
            ? 'ALTA'
            : rec.impact === 'medium'
              ? 'MED'
              : 'BAJA';
        this.doc.text(
          impactText,
          this.margin + indent + 7.5,
          this.currentY + 1,
          {
            align: 'center',
          }
        );

        this.doc.setTextColor(50, 50, 50);
        this.doc.setFontSize(9);
        this.doc.setFont('helvetica', 'bold');
        const titleText = `${index + 1}. ${rec.title}`;
        const titleLines = this.doc.splitTextToSize(
          titleText,
          this.pageWidth - this.margin * 2 - 20 - indent
        );
        this.doc.text(
          titleLines[0],
          this.margin + indent + 20,
          this.currentY + 1
        );

        this.currentY += 7;

        this.doc.setTextColor(80, 80, 80);
        this.doc.setFontSize(7.5);
        this.doc.setFont('helvetica', 'normal');
        const descLines = this.doc.splitTextToSize(
          rec.description,
          this.pageWidth - this.margin * 2 - 5 - indent
        );
        const maxLines = 2;
        const limitedLines = descLines.slice(0, maxLines);
        this.doc.text(limitedLines, this.margin + indent + 5, this.currentY);

        this.currentY += limitedLines.length * 3.5 + 5;
      });

      this.currentY += 5;
    });
  }

  private groupRecommendationsByCategory(recommendations: Recommendation[]): {
    performance: Recommendation[];
    accessibility: Recommendation[];
    seo: Recommendation[];
    practices: Recommendation[];
  } {
    const grouped = {
      performance: [] as Recommendation[],
      accessibility: [] as Recommendation[],
      seo: [] as Recommendation[],
      practices: [] as Recommendation[],
    };

    recommendations.forEach((rec) => {
      grouped[rec.category].push(rec);
    });

    return grouped;
  }

  private addFooter(): void {
    const footerY = this.pageHeight - 15;

    this.doc.setFillColor(88, 28, 135);
    this.doc.rect(0, footerY - 5, this.pageWidth, 20, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');

    const date = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    this.doc.text(`Generado el ${date}`, this.pageWidth / 2, footerY + 2, {
      align: 'center',
    });
  }

  private addSectionTitle(title: string): void {
    this.doc.setTextColor(88, 28, 135);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, this.currentY);

    this.doc.setDrawColor(168, 85, 247);
    this.doc.setLineWidth(0.5);
    this.doc.line(
      this.margin,
      this.currentY + 2,
      this.pageWidth - this.margin,
      this.currentY + 2
    );

    this.currentY += 12;
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 25) {
      this.doc.addPage();
      this.currentY = 20;
    }
  }

  private getScoreColor(score: number): {
    bg: { r: number; g: number; b: number };
    text: { r: number; g: number; b: number };
  } {
    if (score >= 90) {
      return {
        bg: { r: 220, g: 252, b: 231 },
        text: { r: 22, g: 163, b: 74 },
      };
    } else if (score >= 50) {
      return {
        bg: { r: 254, g: 243, b: 199 },
        text: { r: 202, g: 138, b: 4 },
      };
    } else {
      return {
        bg: { r: 254, g: 226, b: 226 },
        text: { r: 220, g: 38, b: 38 },
      };
    }
  }

  private getStatusColor(status: string): { r: number; g: number; b: number } {
    switch (status) {
      case 'good':
        return { r: 22, g: 163, b: 74 };
      case 'needs-improvement':
        return { r: 202, g: 138, b: 4 };
      case 'poor':
        return { r: 220, g: 38, b: 38 };
      default:
        return { r: 100, g: 100, b: 100 };
    }
  }

  private getImpactColor(impact: string): { r: number; g: number; b: number } {
    switch (impact) {
      case 'high':
        return { r: 220, g: 38, b: 38 };
      case 'medium':
        return { r: 202, g: 138, b: 4 };
      case 'low':
        return { r: 59, g: 130, b: 246 };
      default:
        return { r: 100, g: 100, b: 100 };
    }
  }

  private truncateText(text: string, maxWidth: number): string {
    const textWidth = this.doc.getTextWidth(text);
    if (textWidth <= maxWidth) {
      return text;
    }

    let truncated = text;
    while (
      this.doc.getTextWidth(truncated + '...') > maxWidth &&
      truncated.length > 0
    ) {
      truncated = truncated.slice(0, -1);
    }
    return truncated + '...';
  }

  private sanitizeFileName(url: string): string {
    return url
      .replace(/^https?:\/\//, '')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .substring(0, 30);
  }
}

export function generatePdfReport(analysis: AnalysisResult): void {
  const service = new PdfReportService();
  service.generateReport(analysis);
}
