export default function Nav({ page, onHome, onStart, onGo, hasResult }) {
  const items = [
    { id: 'landing', label: 'Home', action: onHome },
    { id: 'challenge', label: 'Challenge', action: onStart },
    ...(hasResult
      ? [
          { id: 'result', label: 'Results', action: () => onGo('result') },
          { id: 'career', label: 'Careers', action: () => onGo('career') },
        ]
      : []),
    { id: 'employer', label: 'Employer View', action: () => onGo('employer') },
  ]

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-ink/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <button onClick={onHome} className="group flex items-center gap-2" aria-label="SkillQuest home">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-neon to-violet text-sm font-black text-white shadow-[0_0_18px_rgba(168,85,247,0.55)] transition group-hover:rotate-6">
            SQ
          </span>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Skill<span className="gradient-text">Quest</span>
          </span>
        </button>
        <nav className="flex flex-wrap items-center gap-1">
          {items.map((it) => (
            <button
              key={it.id}
              onClick={it.action}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                page === it.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {it.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
