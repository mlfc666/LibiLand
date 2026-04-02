interface StatusBadgeProps {
  status: 0 | 1 | 2;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config: Record<number, { class: string; label: string }> = {
    0: { class: 'badge-warning', label: '待审核' },
    1: { class: 'badge-success', label: '已通过' },
    2: { class: 'badge-error', label: '已驳回' },
  };

  const { class: badgeClass, label } = config[status] || config[0];

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {label}
    </span>
  );
}
