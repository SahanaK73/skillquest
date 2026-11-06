import { useEffect, useState } from 'react'
import RadarChart from '../components/RadarChart'
import { SKILLS } from '../data'
import { useProgress } from '../hooks'

const STAGES = [
  'Reading your decision sequence…',
  'Mapping actions to skill signals…',
  'Benchmarking against role profiles…',
  'Building your Skill Fingerprint…',
]

function Analyzing({ onDone }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI((v) => v + 1), 1100)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (i >= STAGES.length) onDone()
  }, [i, onDone])

  const pct = Math.min(100, Math.round((i / STAGES.length) * 100))

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="relative grid h-44 w-44 place-items-center overflow-hidden rounded-full border border-neon/30 bg-neon/5 shadow-[0_0_60px_rgba(168,85,247,0.35)]">
        <div className="absolute inset-3 animate-spin rounded-full border-2 border-dashed border-neon/60" style={{ animationDuration: '6s' }} />
        <div className="absolute inset-8 animate-spin rounded-full border-2 border-dotted border-violet/70" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
        <div className="absolute inset-x-0 top-0 h-1/3 animate-scan bg-gradient-to-b from-transparent via-neon/40 to-transparent" />
        <span className="relative text-3xl font-black text-white">AI</span>
      </div>
      <h1 className="mt-8 text-3xl font-black text-white">AI Analysis in progress</h1>
      <ul className="mt-5 w-full space-y-2 text-left">
        {STAGES.map((s, idx) => (
          <li
            key={s}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              idx < i ? 'text-slate-300' : idx === i ? 'bg-white/5 text-white' : 'text-slate-600'
            }`}
          >
            <span className={`grid h-5 w-5 place-items-center rounded-full text-xs ${idx < i ? 'bg-neon text-ink' : 'border border-white/20'}`}>
              {idx < i ? '✓' : ''}
            </span>
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-neon to-violet transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>
      <button onClick={onDone} className="mt-5 text-sm text-slate-500 underline-offset-4 hover:text-slate-300 hover:underline">
        Skip
      </button>
    </div>
  )
}

function SkillBar({ label, value, index }) {
  const p = useProgress(900, 200 + index * 90)
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-slate-200">{label}</span>
        <span className="font-bold text-white">{Math.round(value * p)}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-neon to-violet" style={{ width: `${value * p}%` }} />
      </div>
    </div>
  )
}

export default function Result({ result, analyzed, onAnalyzed, onCareer, onEmployer }) {
  const [phase, setPhase] = useState(analyzed ? 'done' : 'analyzing')

  const finish = () => {
    onAnalyzed()
    setPhase('done')
  }

  if (phase === 'analyzing') return <Analyzing onDone={finish} />

  const series = [{ name: 'You', color: '#38bdf8', values: result.scores }]

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="animate-fadeUp">
        <p className="text-xs font-bold uppercase tracking-widest text-neon">AI Analysis complete</p>
        <div className="mt-1 flex flex-wrap items-center gap-4">
          <h1 className="text-3xl font-black text-white sm:text-4xl">Your Skill Fingerprint</h1>
          <span className="rounded-full border border-neon/40 bg-neon/10 px-4 py-1 text-sm font-bold text-neon">
            Overall demonstrated skill · {result.overall}
          </span>
        </div>
        <p className="mt-2 text-slate-400">Scored from your actions only. No resume, college or past experience was used.</p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="glass animate-fadeUp p-4 sm:p-6">
          <RadarChart series={series} />
        </div>
        <div className="glass animate-fadeUp space-y-4 p-5 sm:p-7" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-lg font-bold text-white">Skill breakdown</h2>
          {SKILLS.map((s, i) => (
            <SkillBar key={s.key} label={s.label} value={result.scores[s.key]} index={i} />
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="glass card-hover border-emerald-400/20 p-5">
          <h2 className="text-lg font-bold text-emerald-300">Your strengths</h2>
          <ul className="mt-3 space-y-3">
            {result.strengths.map((s) => (
              <li key={s.key} className="flex gap-3">
                <span className="mt-1 text-emerald-300">▲</span>
                <div>
                  <p className="font-semibold text-white">{s.label}</p>
                  <p className="text-sm text-slate-400">{s.strength}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass card-hover border-amber-400/20 p-5">
          <h2 className="text-lg font-bold text-amber-300">Areas to improve</h2>
          <ul className="mt-3 space-y-3">
            {result.improve.map((s) => (
              <li key={s.key} className="flex gap-3">
                <span className="mt-1 text-amber-300">●</span>
                <div>
                  <p className="font-semibold text-white">{s.label}</p>
                  <p className="text-sm text-slate-400">{s.improve}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass mt-5 p-5 sm:p-7">
        <h2 className="text-lg font-bold text-white">Evidence</h2>
        <p className="text-sm text-slate-400">Why the system scored you this way, based on your choices.</p>
        <ol className="mt-4 space-y-3">
          {result.evidence.map((e) => (
            <li key={e.step} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-neon/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-neon">
                  Decision {e.step} · {e.title}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {e.tags.map((t) => (
                    <span key={t} className="chip border-violet/30 text-violet">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                You chose: <span className="font-semibold text-slate-100">{e.choice}</span>
              </p>
              <p className="mt-1 text-slate-300">{e.text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3 pb-10">
        <button onClick={onCareer} className="btn-primary">
          View Career Potential <span aria-hidden>→</span>
        </button>
        <button onClick={onEmployer} className="btn-ghost">
          See how employers view this
        </button>
      </div>
    </div>
  )
}
