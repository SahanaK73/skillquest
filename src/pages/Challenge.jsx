import { useEffect, useRef, useState } from 'react'
import { SUPPLIERS, BUDGET, DECISION_COUNT, TOTAL_HOURS, getDecision } from '../data'

function Meter({ label, value, color }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  )
}

export default function Challenge({ onComplete }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [picked, setPicked] = useState(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const decision = getDecision(step, answers)
  const filled = step + (picked ? 1 : 0)
  const pct = Math.round((filled / DECISION_COUNT) * 100)
  const hoursLeft = TOTAL_HOURS - step * 12

  const choose = (opt) => {
    if (picked) return
    setPicked(opt.id)
    timer.current = setTimeout(() => {
      const next = [...answers, { optionId: opt.id }]
      if (step + 1 >= DECISION_COUNT) {
        onComplete(next)
      } else {
        setAnswers(next)
        setStep(step + 1)
        setPicked(null)
      }
    }, 650)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neon">Workplace Simulation</p>
          <h1 className="text-3xl font-black text-white sm:text-4xl">Supply Chain Crisis</h1>
        </div>
        <div className="glass flex animate-pulseGlow items-center gap-2 px-4 py-2">
          <span aria-hidden>⏱</span>
          <span className="text-xl font-extrabold text-white">{hoursLeft}h</span>
          <span className="text-sm text-slate-400">left</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-semibold text-slate-200">
            Decision {step + 1} of {DECISION_COUNT}
          </span>
          <span className="text-slate-400">{pct}% complete</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon to-violet transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="glass mt-6 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-pink-400">Scenario</p>
        <p className="mt-1 text-lg text-slate-100">
          A major supplier has suddenly stopped deliveries. You have limited budget and only 48 hours to respond.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SUPPLIERS.map((s) => (
          <div key={s.id} className="glass card-hover space-y-3 p-4">
            <div>
              <p className="font-bold text-white">{s.name}</p>
              <p className="text-xs text-slate-400">{s.note}</p>
            </div>
            <Meter label="Cost" value={s.cost} color={s.accent} />
            <Meter label="Reliability" value={s.reliability} color={s.accent} />
          </div>
        ))}
        <div className="glass card-hover flex flex-col justify-between border-violet/30 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-violet">Budget</p>
          <p className="mt-2 text-2xl font-black text-white">{BUDGET.amount}</p>
          <p className="text-xs text-slate-400">{BUDGET.note}</p>
        </div>
      </div>

      <div key={step} className="glass mt-6 animate-fadeUp p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-widest text-neon">{decision.title}</p>
        {decision.context && <p className="mt-2 text-slate-300">{decision.context}</p>}
        <h2 className="mt-2 text-2xl font-bold text-white">{decision.prompt}</h2>

        <div className="mt-5 grid gap-3">
          {decision.options.map((opt) => {
            const isPicked = picked === opt.id
            const dimmed = picked && !isPicked
            return (
              <button
                key={opt.id}
                onClick={() => choose(opt)}
                disabled={!!picked}
                className={`group flex items-center gap-4 rounded-xl border p-4 text-left transition duration-200 ${
                  isPicked
                    ? 'border-neon bg-neon/10 shadow-[0_0_24px_rgba(56,189,248,0.35)]'
                    : dimmed
                    ? 'border-white/10 bg-white/[0.02] opacity-40'
                    : 'border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-neon/60 hover:bg-neon/5'
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-extrabold transition ${
                    isPicked ? 'bg-gradient-to-br from-neon to-violet text-white' : 'bg-white/10 text-slate-300 group-hover:bg-neon/20'
                  }`}
                >
                  {opt.id}
                </span>
                <span className="font-medium text-slate-100">{opt.text}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
