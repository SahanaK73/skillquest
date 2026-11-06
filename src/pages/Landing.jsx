import RadarChart from '../components/RadarChart'

const PREVIEW = [
  { name: 'Preview', color: '#38bdf8', values: { ps: 88, dm: 91, ad: 84, le: 76, pr: 89, co: 78 } },
]

function Flow({ steps, tone }) {
  const styles =
    tone === 'old'
      ? 'border-white/10 bg-white/5 text-slate-400'
      : 'border-neon/40 bg-neon/10 text-white shadow-[0_0_18px_rgba(56,189,248,0.2)]'
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <span className={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${styles}`}>{s}</span>
          {i < steps.length - 1 && <span className={tone === 'old' ? 'text-slate-600' : 'text-violet'}>→</span>}
        </div>
      ))}
    </div>
  )
}

export default function Landing({ onStart, onEmployer }) {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div className="animate-fadeUp">
          <span className="chip mb-5 border-neon/30 text-neon">Theme · Inclusive Workforce</span>
          <h1 className="text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Skill<span className="gradient-text">Quest</span>
          </h1>
          <p className="mt-3 text-2xl font-semibold text-slate-100">Don&apos;t tell us what you can do. Show us.</p>
          <p className="mt-5 max-w-xl text-slate-400">
            SkillQuest is an AI-powered workplace simulation. Instead of judging people by their resume, college or past
            employer, it evaluates what they actually <em className="text-slate-200 not-italic font-semibold">do</em>{' '}
            when faced with a real work problem.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={onStart} className="btn-primary animate-pulseGlow text-lg">
              Start Challenge <span aria-hidden>→</span>
            </button>
            <button onClick={onEmployer} className="btn-ghost">
              See Employer View
            </button>
          </div>
        </div>
        <div className="glass animate-fadeUp p-4 sm:p-6" style={{ animationDelay: '0.15s' }}>
          <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Sample Skill Fingerprint
          </p>
          <RadarChart series={PREVIEW} />
        </div>
      </section>

      <section className="grid gap-5 pb-12 md:grid-cols-2">
        <div className="glass card-hover p-6">
          <p className="text-sm font-bold uppercase tracking-widest text-pink-400">The problem</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Resumes reward pedigree, not potential.</h2>
          <p className="mt-3 text-slate-400">
            Talented people without a famous college, a polished CV or a referral are filtered out before anyone sees what
            they can do. Employers miss great hires, and capable people never get a chance.
          </p>
        </div>
        <div className="glass card-hover p-6">
          <p className="text-sm font-bold uppercase tracking-widest text-neon">The solution</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Judge the work, not the paperwork.</h2>
          <p className="mt-3 text-slate-400">
            Candidates step into a realistic workplace scenario. Every decision becomes evidence. AI turns those actions
            into a Skill Fingerprint that employers can compare fairly.
          </p>
        </div>
      </section>

      <section className="glass mb-12 space-y-6 p-6 sm:p-8">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Traditional hiring</p>
          <Flow tone="old" steps={['Resume', 'Interview', 'Decision']} />
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-neon">SkillQuest</p>
          <Flow tone="new" steps={['Challenge', 'Actions', 'AI Analysis', 'Demonstrated Skills', 'Opportunity']} />
        </div>
      </section>

      <section className="pb-16 text-center">
        <h2 className="text-3xl font-black text-white">Ready to prove it?</h2>
        <p className="mx-auto mt-2 max-w-md text-slate-400">One scenario. Four decisions. About two minutes.</p>
        <button onClick={onStart} className="btn-primary mt-6 text-lg">
          Start Challenge <span aria-hidden>→</span>
        </button>
      </section>
    </div>
  )
}
