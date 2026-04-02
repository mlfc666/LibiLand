import type { SentimentLabel } from '../../types/comment';
import { getSentimentConfig } from '../../utils/sentiment';
import { Smile, Meh, Frown } from 'lucide-react';

interface SentimentBarProps {
  score: number;
  label?: SentimentLabel;
  className?: string;
  showLabel?: boolean;
}

const iconMap = {
  smile: Smile,
  meh: Meh,
  frown: Frown,
};

export function SentimentBar({ score, label, className = '', showLabel = true }: SentimentBarProps) {
  const config = getSentimentConfig(score);
  const percentage = Math.round(score * 100);
  const Icon = iconMap[config.emoji as keyof typeof iconMap] || Meh;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <Icon className={`w-3 h-3 ${config.color}`} />
        {showLabel && (
          <span className={`text-xs ${config.color}`}>{config.label}</span>
        )}
      </div>
      <div className="tooltip tooltip-bottom" data-tip={`情感评分: ${percentage}%`}>
        <progress
          className={`progress ${config.bgClass} w-16 h-1.5`}
          value={percentage}
          max="100"
        />
      </div>
    </div>
  );
}
