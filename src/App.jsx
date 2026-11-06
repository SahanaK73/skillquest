import { useCallback, useMemo, useState } from 'react'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Challenge from './pages/Challenge'
import Result from './pages/Result'
import Career from './pages/Career'
import Employer from './pages/Employer'
import { computeResult } from './data'

export default function App() {
  const [page, setPage] = useState('landing')
  const [answers, setAnswers] = useState(null)
  const [analyzed, setAnalyzed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const result = useMemo(() => (answers ? computeResult(answers) : null), [answers])

  const go = (p) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setPage(p)
  }
  const start = () => {
    setAnswers(null)
    setAnalyzed(false)
    setAttempt((a) => a + 1)
    go('challenge')
  }
  const finish = (a) => {
    setAnswers(a)
    setAnalyzed(false)
    go('result')
  }
  const markAnalyzed = useCallback(() => setAnalyzed(true), [])

  return (
    <div className="flex min-h-screen flex-col">
      <Nav page={page} onHome={() => go('landing')} onStart={start} onGo={go} hasResult={!!result} />
      <main className="flex-1">
        {page === 'landing' && <Landing onStart={start} onEmployer={() => go('employer')} />}
        {page === 'challenge' && <Challenge key={attempt} onComplete={finish} />}
        {page === 'result' && result && (
          <Result
            result={result}
            analyzed={analyzed}
            onAnalyzed={markAnalyzed}
            onCareer={() => go('career')}
            onEmployer={() => go('employer')}
          />
        )}
        {page === 'career' && result && <Career result={result} onRetry={start} onEmployer={() => go('employer')} />}
        {page === 'employer' && <Employer key={result ? 'with-result' : 'no-result'} userResult={result} onStart={start} />}
      </main>
      <footer className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        SkillQuest · Hackathon prototype · Theme: Inclusive Workforce
      </footer>
    </div>
  )
}
