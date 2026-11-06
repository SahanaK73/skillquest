import { SKILLS } from '../data'
import { useProgress } from '../hooks'

function RoleCard({ role, rank, scores }) {
  const p = useProgress(1000, 150 + rank * 150)
  const topSignals = [...SKILLS]
    .sort((a, b) => role.weights[b.key] * scores[b.key] - role.weights[a.key] * scores[a.key])
    .slice(0, 2)

  return (
    <div
      className="glass card-hover animate-fadeUp p-5 sm:p-6"
      style={{ animationDelay: `${rank * 0.12}s` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-lg font-black ${
              rank === 0 ? 'bg-gradient-to-br from-neon to-violet text-white' : 'bg-white/10 text-slate-300'
            }`}
          >
            {rank + 1}
          </span>
          <div>
            <h3 className="text-xl font-bold text-white">{role.title}</h3>
            <p className="text-sm text-slate-400">{role.blurb}</p>
          </div>
        </div>
        <p className="text-3xl font-black gradient-text">{Math.round(role.match * p)}%</p>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-neon to-violet" style={{ width: `${role.match * p}%` }} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>Matched on</span>
        {topSignals.map((s) => (
          <span key={s.key} className="chip border-neon/30 text-neon">
            {s.label} · {scores[s.key]}%
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Career({ result, onRetry, onEmployer }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="animate-fadeUp text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-neon">Career potential</p>
        <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">Roles you&apos;ve already shown you can do</h1>
        <p className="mt-2 text-slate-400">Matched from demonstrated skills, not from a CV.</p>
      </div>

      <div className="mt-8 space-y-4">
        {result.roles.map((r, i) => (
          <RoleCard key={r.id} role={r} rank={i} scores={result.scores} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3 pb-10">
        <button onClick={onRetry} className="btn-primary">
          Try Another Challenge
        </button>
        <button onClick={onEmployer} className="btn-ghost">
          Open Employer View
        </button>
      </div>
    </div>
  )
}
