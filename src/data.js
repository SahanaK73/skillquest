// All challenge content, scoring logic and mock data live here.
// "AI analysis" is a deterministic scoring engine over the user's choices (no backend needed).

export const SKILLS = [
  { key: 'ps', label: 'Problem Solving', strength: 'Finds workable routes when the obvious option fails.', improve: 'Generate more alternatives before committing to a path.' },
  { key: 'dm', label: 'Decision Making', strength: 'Commits to a clear call under time pressure.', improve: 'Decide faster and with clearer criteria.' },
  { key: 'ad', label: 'Adaptability', strength: 'Adjusts the plan as new information arrives.', improve: 'Be quicker to change course when conditions shift.' },
  { key: 'le', label: 'Leadership', strength: 'Gives people clear ownership and direction.', improve: 'Delegate with explicit owners and checkpoints.' },
  { key: 'pr', label: 'Prioritization', strength: 'Protects what matters most when resources are tight.', improve: 'Rank tasks by impact and urgency before acting.' },
  { key: 'co', label: 'Communication', strength: 'Keeps stakeholders informed with clear, concise updates.', improve: 'Share status proactively with a clear structure.' },
]

export const SUPPLIERS = [
  { id: 'A', name: 'Supplier A', note: 'Cheap but unreliable', cost: 20, reliability: 30, accent: '#f472b6' },
  { id: 'B', name: 'Supplier B', note: 'Expensive but reliable', cost: 90, reliability: 93, accent: '#38bdf8' },
  { id: 'C', name: 'Supplier C', note: 'Moderate cost, moderate reliability', cost: 55, reliability: 60, accent: '#a855f7' },
]

export const BUDGET = { amount: '₹5,00,000', note: 'Limited emergency budget for the whole response' }

// pts order: Problem solving, Decision making, Adaptability, Leadership, Prioritization, Communication
const P = (ps, dm, ad, le, pr, co) => ({ ps, dm, ad, le, pr, co })

export const DECISIONS = [
  {
    id: 'first',
    title: 'First Response',
    prompt: 'What should you do first?',
    options: [
      { id: 'A', text: 'Wait for Supplier A to resume deliveries', pts: P(0, 0, 0, 0, 0, 0), evidence: 'Waited on the least reliable supplier while the clock ran down, which delays action when speed matters most.' },
      { id: 'B', text: 'Switch to Supplier B immediately', pts: P(2, 3, 1, 1, 3, 0), evidence: 'Acted fast and moved to the reliable supplier, protecting continuity over cost.' },
      { id: 'C', text: 'Split the order between suppliers', pts: P(3, 2, 3, 1, 2, 1), evidence: 'Split the order to spread risk, balancing cost and reliability instead of betting on one supplier.' },
      { id: 'D', text: 'Search for a completely new supplier', pts: P(2, 1, 2, 2, 0, 0), evidence: 'Looked for a new supplier, which shows initiative, but with only 48 hours that path carries high risk.' },
    ],
  },
  {
    id: 'followup',
    // The second decision depends on the first choice.
    branches: {
      A: {
        title: 'Follow-up',
        context: 'You waited. Supplier A now confirms a 3-day delay. About 36 hours remain.',
        prompt: 'How do you recover?',
        options: [
          { id: 'A', text: 'Place an emergency order with Supplier B at premium cost', pts: P(2, 3, 2, 1, 3, 0), evidence: 'Recovered quickly by paying for reliability once the delay was confirmed.' },
          { id: 'B', text: 'Keep waiting and hope Supplier A catches up', pts: P(0, 0, 0, 0, 0, 0), evidence: 'Kept waiting after the delay was confirmed, which is a missed chance to adapt.' },
          { id: 'C', text: 'Negotiate a partial early shipment from Supplier A', pts: P(2, 1, 1, 1, 1, 3), evidence: 'Negotiated with the supplier to salvage value, showing strong communication.' },
          { id: 'D', text: 'Cut the production plan to match what is available', pts: P(2, 2, 3, 1, 2, 1), evidence: 'Reduced scope to fit reality, a sign of adaptability and realistic planning.' },
        ],
      },
      B: {
        title: 'Follow-up',
        context: 'Supplier B can cover only 60% of the volume you need, at premium prices.',
        prompt: 'How do you cover the remaining 40%?',
        options: [
          { id: 'A', text: 'Order the gap from Supplier C', pts: P(3, 3, 2, 1, 2, 0), evidence: 'Covered the gap with a mid-tier supplier, balancing cost and reliability.' },
          { id: 'B', text: 'Ask Supplier B to expedite and stretch capacity', pts: P(2, 1, 1, 1, 1, 3), evidence: 'Used negotiation to unlock extra capacity from the supplier already trusted.' },
          { id: 'C', text: 'Delay the least urgent customer orders', pts: P(2, 2, 2, 2, 3, 2), evidence: 'Ranked orders by urgency and delayed the least critical ones, a strong prioritization move.' },
          { id: 'D', text: 'Accept the shortfall and carry on', pts: P(0, 0, 0, 0, 0, 0), evidence: 'Accepted a 40% gap without exploring options, which leaves risk unmanaged.' },
        ],
      },
      C: {
        title: 'Follow-up',
        context: "Supplier C's half arrives on time, but Supplier A's half is running late.",
        prompt: 'What is your next move?',
        options: [
          { id: 'A', text: 'Shift the remaining budget to Suppliers B and C', pts: P(3, 2, 3, 1, 3, 0), evidence: 'Rebalanced budget toward the suppliers that were delivering, adapting to real performance.' },
          { id: 'B', text: 'Proactively update customers with a revised timeline', pts: P(1, 1, 1, 2, 1, 3), evidence: 'Informed customers early, which protects trust when delays are likely.' },
          { id: 'C', text: 'Hold the remaining budget in reserve and monitor', pts: P(1, 2, 1, 0, 1, 0), evidence: 'Preserved budget flexibility, though a passive stance can cost time.' },
          { id: 'D', text: 'Do nothing until Supplier A delivers', pts: P(0, 0, 0, 0, 0, 0), evidence: 'Took no action while the delay grew, which weakens the earlier risk-spreading decision.' },
        ],
      },
      D: {
        title: 'Follow-up',
        context: 'A new supplier quotes fast delivery, but their quality is unverified.',
        prompt: 'How do you proceed?',
        options: [
          { id: 'A', text: 'Order a small trial batch and keep Supplier B as backup', pts: P(3, 3, 2, 1, 2, 0), evidence: 'Limited exposure with a trial batch and a fallback, a smart way to manage uncertainty.' },
          { id: 'B', text: 'Commit the full order to the new supplier', pts: P(0, 0, 1, 0, 0, 0), evidence: 'Committed the full order to an unverified supplier, a high-risk bet.' },
          { id: 'C', text: 'Check references quickly before deciding', pts: P(2, 2, 1, 1, 2, 1), evidence: 'Verified before committing, a careful approach that still respects the deadline.' },
          { id: 'D', text: 'Drop the idea and go back to Supplier A', pts: P(0, 0, 0, 0, 0, 0), evidence: 'Retreated to the unreliable supplier after exploring, losing the momentum already built.' },
        ],
      },
    },
  },
  {
    id: 'comms',
    title: 'Stakeholder Pressure',
    context: 'Your VP and two key customers are asking for a status update.',
    prompt: 'How do you communicate?',
    options: [
      { id: 'A', text: 'Send a concise update: situation, actions taken, risks, next checkpoint', pts: P(1, 1, 1, 3, 2, 4), evidence: 'Sent a structured update covering situation, actions, risks and next steps, which is clear leadership communication.' },
      { id: 'B', text: 'Wait until the problem is fully solved, then report', pts: P(0, 0, 0, 0, 0, 0), evidence: 'Held back updates until resolution, leaving stakeholders in the dark.' },
      { id: 'C', text: 'Have a quick call with the VP only', pts: P(1, 1, 1, 1, 2, 2), evidence: 'Briefed the VP quickly, but left customers without information.' },
      { id: 'D', text: 'Forward all raw supplier emails to everyone', pts: P(0, 0, 1, 0, 0, 1), evidence: 'Shared information without synthesizing it, which creates noise rather than clarity.' },
    ],
  },
  {
    id: 'lead',
    title: 'Final Push',
    context: 'Your team is stretched thin with 12 hours left.',
    prompt: 'How do you lead the final push?',
    options: [
      { id: 'A', text: 'Assign clear owners and set checkpoints every few hours', pts: P(1, 2, 1, 4, 3, 2), evidence: 'Assigned clear owners and checkpoints, which turns pressure into coordinated execution.' },
      { id: 'B', text: 'Take on everything yourself to stay in control', pts: P(1, 1, 0, 0, 0, 0), evidence: 'Took on everything personally, which creates a bottleneck and burns out the person leading.' },
      { id: 'C', text: 'Let the team self-organize without direction', pts: P(1, 0, 2, 1, 0, 1), evidence: 'Left the team to self-organize, which can work but adds risk under tight deadlines.' },
      { id: 'D', text: 'Escalate to the VP and wait for instructions', pts: P(0, 0, 0, 0, 0, 1), evidence: 'Escalated without a recommendation, handing the decision away at the moment it was needed.' },
    ],
  },
]

export const DECISION_COUNT = DECISIONS.length
export const TOTAL_HOURS = 48

// Resolve a decision for a step; the follow-up depends on the first answer.
export function getDecision(step, answers) {
  const d = DECISIONS[step]
  if (d.branches) {
    const branch = d.branches[answers[0].optionId]
    return { id: d.id, ...branch }
  }
  return d
}

export const ROLES = [
  { id: 'ops', title: 'Operations Associate', blurb: 'Keeps day-to-day supply, vendors and deadlines running smoothly.', weights: { ps: 0.2, dm: 0.25, ad: 0.2, le: 0.05, pr: 0.25, co: 0.05 } },
  { id: 'pc', title: 'Project Coordinator', blurb: 'Aligns people, timelines and stakeholders around a shared plan.', weights: { ps: 0.15, dm: 0.15, ad: 0.1, le: 0.2, pr: 0.2, co: 0.2 } },
  { id: 'sca', title: 'Supply Chain Analyst', blurb: 'Turns supplier, cost and risk data into sharper sourcing decisions.', weights: { ps: 0.3, dm: 0.25, ad: 0.1, le: 0.05, pr: 0.2, co: 0.1 } },
]

export const roleMatch = (role, scores) =>
  Math.round(SKILLS.reduce((t, s) => t + role.weights[s.key] * scores[s.key], 0))

export const average = (scores) =>
  Math.round(SKILLS.reduce((t, s) => t + scores[s.key], 0) / SKILLS.length)

// Mock "AI analysis": turns the choices into skill scores, strengths, gaps, evidence and role matches.
export function computeResult(answers) {
  const picked = answers.map((a, i) => {
    const d = getDecision(i, answers)
    return { d, opt: d.options.find((o) => o.id === a.optionId) }
  })

  const scores = {}
  SKILLS.forEach((s) => {
    const sum = picked.reduce((t, p) => t + p.opt.pts[s.key], 0)
    const max = picked.reduce((t, p) => t + Math.max(...p.d.options.map((o) => o.pts[s.key])), 0)
    scores[s.key] = max === 0 ? 70 : Math.round(55 + (42 * sum) / max)
  })

  const ranked = [...SKILLS].sort((a, b) => scores[b.key] - scores[a.key])
  const strengths = ranked.slice(0, 3)
  const improve = ranked.slice(-2).reverse()

  const evidence = picked.map((p, i) => ({
    step: i + 1,
    title: p.d.title,
    question: p.d.prompt,
    choice: p.opt.text,
    text: p.opt.evidence,
    tags: SKILLS.filter((s) => p.opt.pts[s.key] >= 3).map((s) => s.label),
  }))

  const roles = ROLES.map((r) => ({ ...r, match: roleMatch(r, scores) })).sort((a, b) => b.match - a.match)

  return { scores, overall: average(scores), strengths, improve, evidence, roles }
}

// Fictional candidates for the employer dashboard.
export const CANDIDATES = [
  {
    id: 'c1',
    name: 'Aarav Menon',
    headline: 'Self-taught dispatch coordinator',
    education: 'No degree · Open learning courses',
    experience: '2 yrs freelance logistics',
    resumeScore: 38,
    resumeVerdict: 'Filtered out',
    scores: { ps: 90, dm: 86, ad: 92, le: 70, pr: 88, co: 74 },
  },
  {
    id: 'c2',
    name: 'Meera Krishnan',
    headline: 'Community college graduate',
    education: 'B.Com · Tier-3 college',
    experience: '1 yr retail operations',
    resumeScore: 61,
    resumeVerdict: 'Maybe',
    scores: { ps: 82, dm: 78, ad: 80, le: 88, pr: 84, co: 91 },
  },
  {
    id: 'c3',
    name: 'Rohan Sharma',
    headline: 'MBA from a top-ranked institute',
    education: 'MBA · Top-ranked institute',
    experience: '4 yrs at a large consultancy',
    resumeScore: 92,
    resumeVerdict: 'Shortlisted',
    scores: { ps: 74, dm: 80, ad: 68, le: 76, pr: 72, co: 82 },
  },
]
