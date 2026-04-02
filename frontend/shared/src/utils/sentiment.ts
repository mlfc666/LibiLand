import type { SentimentLabel } from '../types/comment';

export interface SentimentConfig {
  color: string;
  bgClass: string;
  label: string;
  emoji: string;
}

export function getSentimentConfig(score: number): SentimentConfig {
  if (score >= 0.8) {
    return {
      color: 'text-green-500',
      bgClass: 'bg-green-500',
      label: '优质内容',
      emoji: 'smile',
    };
  }
  if (score >= 0.2) {
    return {
      color: 'text-yellow-500',
      bgClass: 'bg-yellow-500',
      label: '一般',
      emoji: 'meh',
    };
  }
  return {
    color: 'text-red-500',
    bgClass: 'bg-red-500',
    label: '劣质内容',
    emoji: 'frown',
  };
}

export function getSentimentLabel(score: number): SentimentLabel {
  if (score >= 0.8) return 'POSITIVE';
  if (score >= 0.2) return 'NORMAL';
  return 'NEGATIVE';
}
