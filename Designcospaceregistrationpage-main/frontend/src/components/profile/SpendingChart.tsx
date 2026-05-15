interface SpendingSegment {
  key: string;
  label: string;
  color: string;
  pct: number;
  a1: number;
  a2: number;
}

interface SpendingChartProps {
  segments: SpendingSegment[];
}

const card: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutArc(cx: number, cy: number, ro: number, ri: number, a1: number, a2: number) {
  const A = polar(cx, cy, ro, a1);
  const B = polar(cx, cy, ro, a2);
  const C = polar(cx, cy, ri, a2);
  const D = polar(cx, cy, ri, a1);
  const largeArc = a2 - a1 > 180 ? 1 : 0;

  return [
    `M${A.x.toFixed(2)},${A.y.toFixed(2)}`,
    `A${ro},${ro} 0 ${largeArc} 1 ${B.x.toFixed(2)},${B.y.toFixed(2)}`,
    `L${C.x.toFixed(2)},${C.y.toFixed(2)}`,
    `A${ri},${ri} 0 ${largeArc} 0 ${D.x.toFixed(2)},${D.y.toFixed(2)}Z`,
  ].join(' ');
}

export function SpendingChart({ segments }: SpendingChartProps) {
  return (
    <div style={{ ...card, padding: '20px' }}>
      <p style={{ fontSize: '15px', fontWeight: '700', color: '#111111', marginBottom: '16px' }}>
        Chi phí theo loại phòng
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg viewBox="0 0 160 160" width="156" height="156">
          {segments.map((segment) => (
            <path key={segment.key} d={donutArc(80, 80, 70, 44, segment.a1, segment.a2)} fill={segment.color} />
          ))}
          <text x="80" y="76" textAnchor="middle" style={{ fontSize: '12px', fontWeight: '700', fill: '#111111', fontFamily: 'DM Sans, sans-serif' }}>
            ₫ 1.625.000
          </text>
          <text x="80" y="92" textAnchor="middle" style={{ fontSize: '11px', fill: '#9CA3AF', fontFamily: 'DM Sans, sans-serif' }}>
            Tổng
          </text>
        </svg>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '9px', marginTop: '8px' }}>
          {segments.map((segment) => (
            <div key={segment.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '3px',
                    backgroundColor: segment.color,
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: '13px', color: '#374151' }}>{segment.label}</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#111111' }}>{segment.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
