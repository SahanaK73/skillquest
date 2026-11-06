import { SKILLS } from '../data'
import { useProgress } from '../hooks'

// Lightweight SVG radar chart. Supports one or many series (for candidate comparison).
export default function RadarChart({ series }) {
  const p = useProgress(1100, 150, series.length)
  const cx = 220
  const cy = 200
  const R = 110
  const n = SKILLS.length
  const angle = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n
  const point = (i, r) => [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))]
  const ring = (f) => SKILLS.map((_, i) => point(i, R * f).join(',')).join(' ')
  const single = series.length === 1

  return (
    <svg viewBox="0 0 440 400" className="mx-auto w-full max-w-md" role="img" aria-label="Skill fingerprint radar chart">
      <defs>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={ring(f)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      ))}
      {SKILLS.map((_, i) => {
        const [x, y] = point(i, R)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.1)" />
      })}

      {series.map((s) => {
        const pts = SKILLS.map((k, i) => point(i, R * (s.values[k.key] / 100) * p))
        return (
          <g key={s.name} filter="url(#glow)">
            <polygon
              points={pts.map((q) => q.join(',')).join(' ')}
              fill={s.color}
              fillOpacity={single ? 0.25 : 0.12}
              stroke={s.color}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {pts.map((q, i) => (
              <circle key={i} cx={q[0]} cy={q[1]} r="3.5" fill={s.color} />
            ))}
          </g>
        )
      })}

      {SKILLS.map((k, i) => {
        const [x, y] = point(i, R + 26)
        const c = Math.cos(angle(i))
        const anchor = c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle'
        const yy = Math.sin(angle(i)) > 0.5 ? y + 6 : y
        return (
          <text key={k.key} x={x} y={yy} textAnchor={anchor} fontSize="12" fill="#cbd5e1" fontWeight="600">
            {k.label}
            {single && (
              <tspan x={x} dy="15" fill={series[0].color} fontWeight="800">
                {series[0].values[k.key]}%
              </tspan>
            )}
          </text>
        )
      })}
    </svg>
  )
}
