
import { ChartDataPoint, BestFitPoint } from '../types';

/**
 * Calculates a simple linear regression line of best fit
 * y = mx + b
 */
export const calculateLineOfBestFit = (data: ChartDataPoint[]): BestFitPoint[] => {
  if (data.length < 2) return [];

  const n = data.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  data.forEach(p => {
    sumX += p.timestamp;
    sumY += p.timeOfDay;
    sumXY += p.timestamp * p.timeOfDay;
    sumX2 += p.timestamp * p.timestamp;
  });

  const denominator = (n * sumX2 - sumX * sumX);
  if (denominator === 0) return [];

  const m = (n * sumXY - sumX * sumY) / denominator;
  const b = (sumY - m * sumX) / n;

  // Generate two points to represent the line across the visible range
  const minX = Math.min(...data.map(d => d.timestamp));
  const maxX = Math.max(...data.map(d => d.timestamp));

  return [
    { x: minX, y: m * minX + b },
    { x: maxX, y: m * maxX + b }
  ];
};

export const formatTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${m.toString().padStart(2, '0')} ${ampm}`;
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
};
