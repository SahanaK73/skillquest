import { useMemo, useState } from 'react'
import RadarChart from '../components/RadarChart'
import { SKILLS, ROLES, CANDIDATES, roleMatch, average } from '../data'

const COLORS = ['#38bdf8', '#a855f7', '#f472b6', '#34d399']

const verdictStyle = {
  'Filtered out': 'border-red-400/40 text-red-300',
  Maybe: 'border-amber-400/40 text-amber-300',
  Shortlisted: 'border-emerald-400/40 text-emerald-300',
}

export default function Employer({ userResult, onStart }) {
  const all = useMemo(() => {
    const base = [...CANDIDATES]
    if (userResult) {
      base.push({
        id: 'you',
        name: 'You (demo run)',
        headline: 'Your SkillQuest result',
        education: 'Not provided',
        experience: 'Not provided',
        resumeScore: 50,
        resumeVerdict: 'Maybe',
        scores: userResult.scores,
      })
    }
    return base.map((c, i) => ({ ...c, color: COLORS[i], anon: `Candidate ${String.fromCharCode(65 + i)}` }))
  }, [userResult])

  const [blind, setBlind] = useState(true)
  const [sel, setSel] = useState(() => all.map((c) => c.id))
  const [roleId, setRoleId] = useState('ops')

  const role = ROLES.find((r) => r.id === roleId)
  const label = (c) => (blind ? c.anon : c.name)
  const toggle = (id) =>
    setSel((s) => (s.includes(id) ? (s.length > 1 ? s.filter((x) => x !== id) : s) : [...s, id]))

  const chosen = all.filter((c) => sel.includes(c.id))
  const ranked = all
    .map((c) => ({ ...c, fit: roleMatch(role, c.scores) }))
    .sort((a, b) => b.fit - a.fit)
  const resumeOrder = [...all].sort((a, b) => b.resumeScore - a.resumeScore).map((c) => c.id)
  const top = ranked[0]
  const topResumeRank = resumeOrder.indexOf(top.id) + 1

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="animate-fadeUp">
          <p className="text-xs font-bold uppercase tracking-widest text-neon">Employer dashboard</p>
          <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">Hire on demonstrated skills</h1>
          <p className="mt-2 max-w-xl text-slate-400">
            Compare candidates by what they did in the simulation. Flip the switch to see how a traditional resume screen
            would have judged them.
          </p>
        </div>
        <button
          role="switch"
          aria-checked={blind}
          onClick={() => setBlind(!blind)}
          className="glass flex items-center gap-3 px-4 py-2.5 transition hover:border-neon/40"
        >
          <span
            className={`relative h-6 w-11 rounded-full transition ${blind ? 'bg-gradient-to-r from-neon to-violet' : 'bg-white/15'}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${blind ? 'left-[22px]' : 'left-0.5'}`}
            />
          </span>
          <span className="text-left text-sm">
            <span className="block font-semibold text-white">Blind mode</span>
            <span className="block text-xs text-slate-400">{blind ? 'Name, college & resume hidden' : 'Showing resume details'}</span>
          </span>
        </button>
      </div>

      {!blind && top.id !== 'you' && topResumeRank > 1 && (
        <div className="mt-5 animate-fadeUp rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
          A resume screen would rank <b>{top.name}</b> #{topResumeRank}
          {top.resumeVerdict === 'Filtered out' ? ' and filter them out entirely' : ''}, yet they are the best demonstrated fit for{' '}
          <b>{role.title}</b>.
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((c) => {
          const on = sel.includes(c.id)
          const topSkills = [...SKILLS].sort((a, b) => c.scores[b.key] - c.scores[a.key]).slice(0, 2)
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              aria-pressed={on}
              className={`glass card-hover p-5 text-left ${on ? '' : 'opacity-50'}`}
              style={on ? { borderColor: c.color, boxShadow: `0 0 22px ${c.color}33` } : undefined}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-full text-sm font-black text-ink"
                    style={{ background: c.color }}
                  >
                    {blind ? c.anon.slice(-1) : c.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </span>
                  <div>
                    <p className="font-bold text-white">{label(c)}</p>
                    <p className="text-xs text-slate-400">{blind ? 'Resume & college hidden' : c.headline}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white">{average(c.scores)}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">skill avg</p>
                </div>
              </div>
              {!blind && (
                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <p>{c.education}</p>
                  <p>{c.experience}</p>
                  <span className={`chip mt-1 ${verdictStyle[c.resumeVerdict]}`}>Resume screen: {c.resumeVerdict}</span>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {topSkills.map((s) => (
                  <span key={s.key} className="chip border-neon/30 text-neon">
                    {s.label} {c.scores[s.key]}%
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="glass p-4 sm:p-6">
          <h2 className="text-lg font-bold text-white">Skill comparison</h2>
          <RadarChart series={chosen.map((c) => ({ name: label(c), color: c.color, values: c.scores }))} />
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
            {chosen.map((c) => (
              <span key={c.id} className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                {label(c)}
              </span>
            ))}
          </div>
        </div>

        <div className="glass p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">Best fit for role</h2>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="rounded-lg border border-white/15 bg-panel px-3 py-1.5 text-sm text-white outline-none focus:border-neon"
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </div>
          <ol className="mt-4 space-y-4">
            {ranked.map((c, i) => {
              const rr = resumeOrder.indexOf(c.id) + 1
              return (
                <li key={c.id}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                    <span className="font-semibold text-white">
                      #{i + 1} {label(c)}
                    </span>
                    <span className="flex items-center gap-2">
                      {!blind && (
                        <span className="chip text-[11px]">
                          Resume rank #{rr} → Skill rank #{i + 1}
                        </span>
                      )}
                      <span className="font-bold text-white">{c.fit}%</span>
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${c.fit}%`, background: c.color }}
                    />
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <div className="glass mt-5 overflow-x-auto p-5 sm:p-6">
        <h2 className="mb-3 text-lg font-bold text-white">Side-by-side skills</h2>
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-slate-500">
              <th className="pb-2 font-semibold">Skill</th>
              {chosen.map((c) => (
                <th key={c.id} className="pb-2 font-semibold" style={{ color: c.color }}>
                  {label(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SKILLS.map((s) => {
              const max = Math.max(...chosen.map((c) => c.scores[s.key]))
              return (
                <tr key={s.key} className="border-t border-white/10">
                  <td className="py-3 pr-3 font-medium text-slate-200">{s.label}</td>
                  {chosen.map((c) => {
                    const v = c.scores[s.key]
                    return (
                      <td key={c.id} className="py-3 pr-4">
                        <div className="mb-1 flex items-center gap-1 font-bold text-white">
                          {v}%{v === max && <span className="text-amber-300">★</span>}
                        </div>
                        <div className="h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full" style={{ width: `${v}%`, background: c.color }} />
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-slate-500">★ = highest demonstrated score for that skill among selected candidates.</p>
      </div>

      {!userResult && (
        <div className="mt-8 pb-10 text-center">
          <p className="text-slate-400">Want to see your own result appear here?</p>
          <button onClick={onStart} className="btn-primary mt-3">
            Start Challenge
          </button>
        </div>
      )}
    </div>
  )
}
