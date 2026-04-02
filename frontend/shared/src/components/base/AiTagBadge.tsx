interface AiTagBadgeProps {
  tag: string;
  onClick?: (tag: string) => void;
  className?: string;
}

export function AiTagBadge({ tag, onClick, className = '' }: AiTagBadgeProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(tag)}
      className={`badge badge-primary badge-outline text-xs hover:badge-filled ${className}`}
    >
      {tag}
    </button>
  );
}
