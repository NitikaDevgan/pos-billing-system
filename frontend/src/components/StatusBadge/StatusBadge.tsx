interface StatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({ active, activeLabel = 'Active', inactiveLabel = 'Inactive' }: StatusBadgeProps) {
  return (
    <span className={active ? 'status-badge status-badge--active' : 'status-badge status-badge--inactive'}>
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
