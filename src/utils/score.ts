export type ScoreStatus = 'good' | 'needs-improvement' | 'poor';

export const getScoreStatus = (score = 0): ScoreStatus => {
  if (score >= 85) return 'good';
  if (score >= 50) return 'needs-improvement';
  return 'poor';
};

export const getStatusText = (score = 0): string => {
  if (score >= 85) return 'Bueno';
  if (score >= 50) return 'Mejorable';
  return 'Pobre';
};

export const getScoreColorClass = (score = 0): string => {
  if (score >= 85) return 'text-green-400';
  if (score >= 50) return 'text-orange-400';
  return 'text-red-400';
};

export const getBarColorClass = (score = 0): string => {
  if (score >= 85) return 'bg-gradient-to-r from-green-500 to-green-400';
  if (score >= 50) return 'bg-gradient-to-r from-orange-500 to-yellow-400';
  return 'bg-gradient-to-r from-red-500 to-red-400';
};

export const getStatusColorClass = (score = 0): string => {
  if (score >= 85)
    return 'text-green-300 bg-green-500/10 border border-green-500/30';
  if (score >= 50)
    return 'text-orange-300 bg-orange-500/10 border border-orange-500/30';
  return 'text-red-300 bg-red-500/10 border border-red-500/30';
};

export const getColorFromStatus = (
  status: 'good' | 'needs-improvement' | 'poor'
) => {
  switch (status) {
    case 'good':
      return 'text-green-400';
    case 'needs-improvement':
      return 'text-orange-400';
    case 'poor':
      return 'text-red-400';
  }
};

export const getStatusIconClass = (
  status: 'good' | 'needs-improvement' | 'poor'
) => {
  switch (status) {
    case 'good':
      return 'text-green-400';
    case 'needs-improvement':
      return 'text-orange-400 text-2xl';
    case 'poor':
      return 'text-red-400';
  }
};

export default {
  getScoreStatus,
  getStatusText,
  getScoreColorClass,
  getBarColorClass,
  getStatusColorClass,
};
