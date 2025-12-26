export const CHART_COLORS = [
  '#0b868f',
  '#adc3de',
  '#7a3c53',
  '#8f6263',
  '#f39c12',
  '#94819d',
  '#e74c3c',
  '#3498db',
  '#2ecc71'
] as const;

export const CHART_CONFIG = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: {
    default: 2.5,
    mobile: 1.5
  }
} as const;