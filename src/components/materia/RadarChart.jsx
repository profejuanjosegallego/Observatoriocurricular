const COLORS = {
  grid: '#ddd5e3',
  gridStrong: '#c9bfd1',
  axis: '#c9bfd1',
  fill: 'rgba(230, 0, 126, 0.10)',
  stroke: '#E6007E',
  point: '#E6007E',
  label: '#1c1622',
  value: '#E6007E',
  scale: '#b0a8b8',
};

function wrapLabel(text, maxChars = 16) {
  if (text.length <= maxChars) return [text];
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const w of words) {
    if (current && (current + ' ' + w).length > maxChars) {
      lines.push(current);
      current = w;
    } else {
      current = current ? current + ' ' + w : w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export default function RadarChart({ scores, labels }) {
  const cx = 260, cy = 220, maxR = 140;
  const n = scores.length;
  const levels = [20, 40, 60, 80, 100];

  function polarToXY(i, value) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const r = (value / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  function polygon(value) {
    return Array.from({ length: n }, (_, i) => {
      const p = polarToXY(i, value);
      return `${p.x},${p.y}`;
    }).join(' ');
  }

  function labelAnchor(i) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const deg = (angle * 180) / Math.PI;
    if (deg > -100 && deg < -80) return 'middle';
    if (deg >= -80 && deg < 10) return 'start';
    if (deg >= 10 && deg < 100) return 'start';
    if (deg >= 100 && deg < 170) return 'end';
    return 'end';
  }

  function labelOffset(i) {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const deg = (angle * 180) / Math.PI;
    let dx = 0, dy = 0;
    if (deg > -100 && deg < -80) dy = -12;
    else if (deg >= 80 && deg <= 100) dy = 16;
    else if (deg > 0 && deg < 80) { dx = 8; dy = 4; }
    else if (deg > 100 && deg < 180) { dx = -8; dy = 4; }
    else if (deg < 0 && deg > -80) { dx = 8; dy = -2; }
    else { dx = -8; dy = -2; }
    return { dx, dy };
  }

  const dataPoints = scores.map((v, i) => polarToXY(i, v));
  const axisEnds = Array.from({ length: n }, (_, i) => polarToXY(i, 100));
  const labelPts = Array.from({ length: n }, (_, i) => polarToXY(i, 114));
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / n);

  return (
    <div className="relative">
      <svg viewBox="0 0 520 450" className="w-full max-w-[420px] mx-auto" role="img" aria-label="Gráfica de alineación curricular">
        {levels.map(l => (
          <polygon
            key={l}
            points={polygon(l)}
            fill="none"
            stroke={l === 100 ? COLORS.gridStrong : COLORS.grid}
            strokeWidth={l === 100 ? 1 : 0.7}
            strokeDasharray={l < 100 ? '4,4' : '0'}
          />
        ))}

        {[20, 40, 60, 80].map(l => {
          const p = polarToXY(0, l);
          return (
            <text
              key={`s${l}`}
              x={p.x + 5}
              y={p.y - 3}
              style={{ fontSize: '8px', fill: COLORS.scale, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {l}
            </text>
          );
        })}

        {axisEnds.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={COLORS.axis} strokeWidth={0.5} />
        ))}

        <polygon points={polygon(scores)} fill={COLORS.fill} stroke={COLORS.stroke} strokeWidth={2.5} strokeLinejoin="round" />

        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill={COLORS.point} stroke="white" strokeWidth={2} />
        ))}

        {labelPts.map((p, i) => {
          const off = labelOffset(i);
          const lines = wrapLabel(labels[i]);
          return (
            <text
              key={i}
              x={p.x + off.dx}
              y={p.y + off.dy}
              textAnchor={labelAnchor(i)}
              dominantBaseline="middle"
              style={{ fontSize: '10px', fill: COLORS.label, fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {lines.map((line, li) => (
                <tspan key={li} x={p.x + off.dx} dy={li === 0 ? 0 : 13}>{line}</tspan>
              ))}
            </text>
          );
        })}

        {dataPoints.map((p, i) => {
          const off = labelOffset(i);
          const dy2 = i === 0 ? -16 : off.dy > 0 ? 16 : -12;
          return (
            <text
              key={`v${i}`}
              x={p.x}
              y={p.y + dy2}
              textAnchor="middle"
              style={{ fontSize: '10.5px', fill: COLORS.value, fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              {scores[i]}%
            </text>
          );
        })}

        <circle cx={cx} cy={cy} r={22} fill="white" fillOpacity={0.85} />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: '18px', fill: COLORS.stroke, fontWeight: 800, fontFamily: 'Poppins, system-ui, sans-serif' }}>
          {avg}
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle"
          style={{ fontSize: '7.5px', fill: COLORS.scale, fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          promedio
        </text>
      </svg>
    </div>
  );
}
