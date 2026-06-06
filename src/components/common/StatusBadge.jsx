export default function StatusBadge({ current, total, label }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const color = pct === 100
    ? 'bg-ok/10 text-ok border-ok/20'
    : pct > 0
      ? 'bg-magenta-light text-magenta-dark border-magenta/20'
      : 'bg-mist text-ink-2 border-magenta/10';

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-2.5 py-1 border transition-all duration-300 ${color}`}>
      {label && <span className="font-medium opacity-80">{label}</span>}
      {current}/{total}
    </span>
  );
}
