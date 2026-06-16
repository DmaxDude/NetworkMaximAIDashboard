import { useEffect, useRef, useState } from 'react'
import '../styles/operator.css'
import GreySkiesInline from './GreySkiesInline.jsx'
import CirclesInline from './CirclesInline.jsx'

const pageMeta = {
  dashboard: ['Live Dashboard', 'Greater Manchester · Real-time Multi-AI Monitoring'],
  issues: ['Active Issues', 'Incidents across Manchester zones'],
  greyskies: ['Grey Skies', 'OSS — Operations Support Systems'],
  circles: ['Circles', 'BSS — Business Support Systems'],
  agents: ['AI Agents', 'Multi-agent pipeline status'],
  escalations: ['Escalations', 'Human-in-the-loop incidents'],
  tower: ['AI Control Tower', 'System-wide intelligence overview'],
  reports: ['Reports', 'Operational & Performance summaries'],
  governance: ['AI Governance', 'Trust · Explainability · Compliance · Audit'],
}

const stepCount = 6
const GREYSKIES_URL = 'https://greyskies-presentations.netlify.app/'

const reportIssues = [
  {
    id: 'INC-20234',
    zone: 'Trafford',
    type: 'Service Degradation',
    severity: 'High',
    status: 'Active',
    rootCause: 'Incomplete LAG bundle on BDN-PE01 after transport failover',
    usersImpacted: 12000,
    sites: 28,
    resolution: '1 hour',
    resolutionScore: 68,
    compensationClaimed: 83000,
    usersCompClaimed: 4380,
    claimRate: 36,
    ossHealth: 72,
    bssHealth: 81,
    packetLoss: 7.22,
    throughputDrop: 15,
    rtt: 386,
    revenueAtRisk: 142000,
    agent: 'SOC + NOVA',
    recommendation: 'Add xe-0/0/1 to LAG bundle ae1 and keep goodwill outreach ready for affected subscribers.',
    segments: [
      ['Creator Boost', 1420, 28600],
      ['Roam & Recover', 980, 18400],
      ['Family Care', 1980, 36000],
    ],
    trend: [42, 58, 77, 91, 86, 74],
  },
  {
    id: 'INC-2039',
    zone: 'Stockport',
    type: 'Packet Loss',
    severity: 'Med',
    status: 'Active',
    rootCause: 'Edge congestion on aggregation uplink',
    usersImpacted: 6400,
    sites: 14,
    resolution: '42 min',
    resolutionScore: 54,
    compensationClaimed: 32000,
    usersCompClaimed: 1740,
    claimRate: 27,
    ossHealth: 79,
    bssHealth: 86,
    packetLoss: 4.8,
    throughputDrop: 9,
    rtt: 244,
    revenueAtRisk: 61000,
    agent: 'Network Agent',
    recommendation: 'Shift traffic to alternate aggregation path and watch subscriber complaint volume.',
    segments: [
      ['Creator Boost', 520, 9800],
      ['Roam & Recover', 410, 7600],
      ['Family Care', 810, 14600],
    ],
    trend: [28, 36, 54, 62, 58, 49],
  },
  {
    id: 'INC-2035',
    zone: 'Oldham',
    type: 'Node Failure',
    severity: 'High',
    status: 'Escalated',
    rootCause: 'Site controller hardware fault requiring NOC intervention',
    usersImpacted: 9800,
    sites: 21,
    resolution: '2 hours',
    resolutionScore: 88,
    compensationClaimed: 121000,
    usersCompClaimed: 6120,
    claimRate: 62,
    ossHealth: 58,
    bssHealth: 74,
    packetLoss: 6.1,
    throughputDrop: 22,
    rtt: 412,
    revenueAtRisk: 198000,
    agent: 'Human NOC + Nova',
    recommendation: 'Prioritize field confirmation, proactive enterprise comms, and higher-value compensation.',
    segments: [
      ['Creator Boost', 1760, 38400],
      ['Roam & Recover', 1320, 29600],
      ['Family Care', 3040, 53000],
    ],
    trend: [51, 69, 84, 97, 93, 88],
  },
  {
    id: 'INC-2030',
    zone: 'Bury',
    type: 'QoE Degradation',
    severity: 'Low',
    status: 'Resolved',
    rootCause: 'Radio scheduler imbalance after configuration drift',
    usersImpacted: 2800,
    sites: 7,
    resolution: '24 min',
    resolutionScore: 32,
    compensationClaimed: 9600,
    usersCompClaimed: 620,
    claimRate: 22,
    ossHealth: 91,
    bssHealth: 94,
    packetLoss: 1.8,
    throughputDrop: 5,
    rtt: 166,
    revenueAtRisk: 18000,
    agent: 'Network Agent',
    recommendation: 'Keep scheduler guardrail enabled and suppress broad compensation.',
    segments: [
      ['Creator Boost', 180, 2700],
      ['Roam & Recover', 140, 2100],
      ['Family Care', 300, 4800],
    ],
    trend: [26, 35, 31, 28, 18, 12],
  },
  {
    id: 'INC-2028',
    zone: 'Bolton',
    type: 'Latency Spike',
    severity: 'Med',
    status: 'Resolved',
    rootCause: 'Peering route flap impacting northeast traffic',
    usersImpacted: 4100,
    sites: 11,
    resolution: '31 min',
    resolutionScore: 41,
    compensationClaimed: 21400,
    usersCompClaimed: 990,
    claimRate: 24,
    ossHealth: 87,
    bssHealth: 90,
    packetLoss: 2.4,
    throughputDrop: 7,
    rtt: 292,
    revenueAtRisk: 39000,
    agent: 'Network Agent',
    recommendation: 'Keep alternate peering route warm and monitor high-value traveller segment.',
    segments: [
      ['Creator Boost', 260, 4200],
      ['Roam & Recover', 440, 9600],
      ['Family Care', 290, 7600],
    ],
    trend: [31, 45, 52, 44, 34, 22],
  },
]

export default function OperatorDashboard({ initialPage = 'dashboard' }) {
  const [activePage, setActivePage] = useState(initialPage)
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
  const [stepStates, setStepStates] = useState(Array(stepCount).fill(''))
  const [shownSimItems, setShownSimItems] = useState({})
  const [progressWidth, setProgressWidth] = useState('0%')
  const [showEscalationNote, setShowEscalationNote] = useState(false)
  const [isSimRunning, setIsSimRunning] = useState(false)
  const [showIncNotif, setShowIncNotif] = useState(true)
  const [selectedReportIssueId, setSelectedReportIssueId] = useState(reportIssues[0].id)
  const [inc20234Resolved, setInc20234Resolved] = useState(false)
  const timers = useRef([])
  const simulatorBodyRef = useRef(null)
  const simulatorStepRefs = useRef([])

  function clearSimTimers() {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }

  useEffect(() => {
    const t = window.setTimeout(() => setShowIncNotif(false), 6000)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    return () => clearSimTimers()
  }, [])

  const goTo = (page) => setActivePage(page)
  const openGreySkies = () => {
    window.open(GREYSKIES_URL, '_blank', 'noopener,noreferrer')
  }
  const activeIssueCount = inc20234Resolved ? 2 : 3

  const scrollSimulatorToStep = (index) => {
    const body = simulatorBodyRef.current
    const step = simulatorStepRefs.current[index]
    if (!body || !step) return

    const bodyRect = body.getBoundingClientRect()
    const stepRect = step.getBoundingClientRect()
    const targetTop = Math.max(0, body.scrollTop + stepRect.top - bodyRect.top - 16)
    body.scrollTo({ top: targetTop, behavior: 'smooth' })
  }

  const resetSim = () => {
    clearSimTimers()
    setStepStates(Array(stepCount).fill(''))
    setShownSimItems({})
    setProgressWidth('0%')
    setShowEscalationNote(false)
    setIsSimRunning(false)
    simulatorBodyRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }

  const openSim = () => {
    resetSim()
    setIsSimulatorOpen(true)
  }

  const closeSim = () => {
    setIsSimulatorOpen(false)
  }

  const runSim = (esc) => {
    resetSim()
    setIsSimRunning(true)
    simulatorBodyRef.current?.scrollTo({ top: 0, behavior: 'auto' })
    const happy = [
      { d: 400 },
      { d: 1500, sh: ['f1'] },
      { d: 2800, sh: ['f2', 'a2'] },
      { d: 4200, sh: ['d3'] },
      { d: 5600, sh: ['a4'] },
      { d: 7000, sh: ['a5'] },
    ]
    const escPath = [{ d: 400 }, { d: 1500, sh: ['f1'] }, { d: 2800, sh: ['f2', 'a2'] }]
    const steps = esc ? escPath : happy

    steps.forEach((cfg, index) => {
      const timer = window.setTimeout(() => {
        setStepStates((current) => {
          const next = [...current]
          if (index > 0) next[index - 1] = 'done'
          next[index] = 'active'
          return next
        })
        setShownSimItems((current) => {
          const next = { ...current }
          ;(cfg.sh || []).forEach((id) => {
            next[id] = true
          })
          return next
        })
        setProgressWidth(`${Math.round(((index + 1) / steps.length) * 100)}%`)
        const scrollTimer = window.setTimeout(() => scrollSimulatorToStep(index), 50)
        timers.current.push(scrollTimer)
        if (index === steps.length - 1) {
          const doneTimer = window.setTimeout(() => {
            setStepStates((current) => {
              const next = [...current]
              next[index] = 'done'
              return next
            })
            if (esc) setShowEscalationNote(true)
            setIsSimRunning(false)
          }, 800)
          timers.current.push(doneTimer)
        }
      }, cfg.d)
      timers.current.push(timer)
    })
  }

  const pageClass = (page) => `pv ${activePage === page ? 'active' : ''}`
  const navClass = (page) => `ni ${activePage === page ? 'active' : ''}`
  const stepClass = (index) => `sstep ${stepStates[index] || ''}`
  const flowStyle = (id) => ({ display: shownSimItems[id] ? 'flex' : 'none' })
  const blockStyle = (id) => ({ display: shownSimItems[id] ? 'block' : 'none' })
  const pillStyle = (id, base = {}) => ({
    ...base,
    display: shownSimItems[id] ? 'inline-flex' : 'none',
  })

  const [pageTitle, pageSubtitle] = pageMeta[activePage]
  const selectedReportIssue = reportIssues.find((issue) => issue.id === selectedReportIssueId) || reportIssues[0]
  const reportTotals = reportIssues.reduce((total, issue) => ({
    usersImpacted: total.usersImpacted + issue.usersImpacted,
    sites: total.sites + issue.sites,
    compensationClaimed: total.compensationClaimed + issue.compensationClaimed,
    usersCompClaimed: total.usersCompClaimed + issue.usersCompClaimed,
    revenueAtRisk: total.revenueAtRisk + issue.revenueAtRisk,
  }), { usersImpacted: 0, sites: 0, compensationClaimed: 0, usersCompClaimed: 0, revenueAtRisk: 0 })
  const avgClaimRate = Math.round(reportIssues.reduce((sum, issue) => sum + issue.claimRate, 0) / reportIssues.length)
  const maxUsersImpacted = Math.max(...reportIssues.map((issue) => issue.usersImpacted))

  return (
    <div className="operator-page">
      {showIncNotif && (
        <div className="inc-notif" onClick={() => { setShowIncNotif(false); goTo('issues') }}>
          <div className="inc-notif-icon">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
          </div>
          <div className="inc-notif-body">
            <div className="inc-notif-title">New Incident Detected</div>
            <div className="inc-notif-msg"><strong>#INC-20234</strong> - Service degradation detected, Trafford 5G RAN, <span className="inc-notif-sev">Severity High</span></div>

          </div>
          <button className="inc-notif-close" onClick={(e) => { e.stopPropagation(); setShowIncNotif(false) }} aria-label="Dismiss">✕</button>
        </div>
      )}
<aside className="sidebar">
  <div className="brand">
    <div style={{display: 'flex', alignItems: 'center', marginBottom: '4px'}}>
      <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 150.7 36" width="151" height="36" role="img" aria-label="Maxim">
        <g>
          <rect fill="#fff" x="86.29" y="17.99" width=".15" height="0" transform="translate(-1.57 10.88) rotate(-7.14)"/>
          <path fill="#fff" d="M69.41,8.06s0,.02,0,.03c-1.06,4.08-2.43,9.49-2.89,12.6h-.1c-.4-2.89-1.57-9.01-2.47-12.6,0,0,0-.02,0-.03h-7.88v19.87h4.89v-6.28c0-3.42-.1-7.49-.25-9.81h.19c.69,4.38,2.05,11.16,3.05,16.08h4.4c1.29-5.16,2.69-11.79,3.44-16.09h.18c-.09,2.36-.15,6.57-.15,9.65v6.43h5.25V8.06h-7.65Z"/>
          <path fill="#fff" d="M140.88,8.06s0,.02,0,.03c-1.06,4.08-2.43,9.49-2.89,12.6h-.1c-.4-2.89-1.57-9.01-2.47-12.6,0,0,0-.02,0-.03h-7.88v19.87h4.89v-6.28c0-3.42-.1-7.49-.25-9.81h.19c.69,4.38,2.05,11.16,3.05,16.08h4.4c1.29-5.16,2.69-11.79,3.44-16.09h.18c-.09,2.36-.15,6.57-.15,9.65v6.43h5.25V8.06h-7.65Z"/>
          <path fill="#fff" d="M91.98,8.09v-.03h-7.38v.03s-5.56,19.84-5.56,19.84h5.37c1.23-5.4,2.45-10.8,3.68-16.19h.08c1.31,5.4,2.61,10.8,3.92,16.19h3.15c.56-.97,1.12-1.95,1.68-2.92l-4.95-16.92Z"/>
          <path fill="#fff" d="M115.49,27.93h-6.21c-.17-.6-2.88-5.93-3.06-6.66h-.07c-.98,2.23-1.96,4.45-2.94,6.68h-5.98s0,0,0-.01c.56-.97,1.12-1.95,1.68-2.92,1.34-2.32,2.67-4.64,4.01-6.96l-5.41-9.96v-.03s6.21,0,6.21,0c0,0,.01.02.02.03,3.91,6.61,7.83,13.23,11.74,19.84Z"/>
          <path fill="#276fdf" d="M110.67,15.85l-2.63-4.37c.55-1.13,1.1-2.26,1.65-3.39h5.54c-1.52,2.59-3.04,5.18-4.56,7.77Z"/>
          <rect fill="#fff" x="118.7" y="8.06" width="5.32" height="19.82"/>
        </g>
        <polygon fill="#fff" points="6.52 0 21.58 15 18.91 17.74 18.76 17.77 5.67 4.7 5.67 32.65 38.41 0 43.08 0 43.08 36 37 36 23.41 22.36 26.13 19.62 39.26 32.65 39.26 4.7 7.93 36 1.85 36 1.85 0 6.52 0"/>
      </svg>
    </div>
    <div className="app-tag">Multi-AI Network Ops</div>
  </div>
  <nav>
    <div className="nav-section">Operations</div>
    <div className={navClass('dashboard')} onClick={() => goTo('dashboard')}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="7" height="9" rx="1.5"></rect><rect x="14" y="3" width="7" height="5" rx="1.5"></rect><rect x="14" y="12" width="7" height="9" rx="1.5"></rect><rect x="3" y="16" width="7" height="5" rx="1.5"></rect></svg>
      Live Dashboard
    </div>
    <div className={navClass('issues')} onClick={() => goTo('issues')}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3 2 20h20z"></path><line x1="12" y1="10" x2="12" y2="14"></line><circle cx="12" cy="17" r=".6" fill="currentColor"></circle></svg>
      Active Issues <span className="nbadge">{activeIssueCount}</span>
    </div>
    <div className={navClass('greyskies')} onClick={openGreySkies}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="3.2"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"></path></svg>
      Grey Skies
    </div>
    <div className={navClass('circles')} onClick={() => goTo('circles')}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="3.4"></circle></svg>
      Circles
    </div>
    <div className="nav-section intelligence">Intelligence</div>
    <div className={navClass('reports')} onClick={() => goTo('reports')}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"></path><polyline points="14,3 14,8 19,8"></polyline></svg>
      Reports
    </div>
    <div className={navClass('governance')} onClick={() => goTo('governance')}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3l8 3v6c0 4.4-3.2 7.6-8 9-4.8-1.4-8-4.6-8-9V6z"></path></svg>
      AI Governance
    </div>
  </nav>
  <div className="sf">
    <div className="powered-by">Powered by :</div>
    <div className="powered-logos" aria-label="Powered by GreySkies and Circles">
      <img src="/powered-logo.png" alt="Powered by HCLTech, GreySkies and Circles" />
    </div>
    <div className="user">
      <div className="av">AS</div>
      <div><div className="uname">Adam Smith</div><div className="urole">Network Operator</div></div>
      <div className="odot"></div>
    </div>
  </div>
</aside>

<div className="main">
  <div className="topbar">
    <div className={activePage === 'circles' ? 'tbbrand tbbrand-logo' : 'tbbrand'}>
      <div className="tbtitle" id="pgt">
        {activePage === 'circles' ? <img src="/circles-powered-logo.png" alt="Circles" /> : pageTitle}
      </div>
      <div className="tbsub" id="pgs">{pageSubtitle}</div>
    </div>
    <div className="tbr">
      {activePage === 'dashboard' && <span className="live-chip"><span></span>LIVE</span>}
    </div>
  </div>
  <div className="content">

    {/* DASHBOARD */}
    <div className={pageClass('dashboard')} id="page-dashboard">
      <div className="dashboard-v2">
        <div className="dash-kpis">
          <div className="card stat stat-green"><div className="slbl">Districts Monitored</div><div className="sval">10</div><div className="snote"><span className="mini-dot g"></span>Greater Manchester metro</div></div>
          <div className="card stat stat-red"><div className="slbl">Active Issues</div><div className="sval">{activeIssueCount}</div><div className="snote alert">▲ 1 in the last hour</div></div>
          <div className="card stat stat-green"><div className="slbl">Avg MTTR</div><div className="sval">4.2<span>min</span></div><div className="snote good">▼ 60% <em>vs baseline</em></div></div>
          <div className="card stat stat-green"><div className="slbl">AI Resolution</div><div className="sval">94<span>%</span></div><div className="snote good">▲ <em>from 87% last week</em></div></div>
        </div>
        <div className="dash-grid">
          <div className="card zone-map-card">
            <div className="zone-head">
              <div className="zone-title"><strong>Greater Manchester</strong> <span>— Network Zone Map</span></div>
              <div className="zone-legend">
                <span><i className="z-healthy"></i>Healthy</span>
                <span><i className="z-degraded"></i>Degraded</span>
                <span><i className="z-active"></i>Active issue</span>
              </div>
            </div>
            <div className="mapb gm-map">
              <svg className="gm-stylized-map" viewBox="0 0 940 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Greater Manchester network zone map">
                <rect width="940" height="400" fill="#dbe8f5" />
                <rect x="190" y="0" width="560" height="400" fill="#cfe0f2" opacity=".86" />
                <rect x="190" y="0" width="38" height="400" fill="#bed2e8" opacity=".68" />
                <rect x="0" y="330" width="940" height="70" fill="#c4d8ee" opacity=".58" />
                <ellipse cx="680" cy="200" rx="56" ry="175" fill="#b7cbe5" opacity=".58" />
                <rect x="0" y="0" width="940" height="400" fill="none" stroke="#9db7d6" strokeWidth="1" />

                <g className="gm-map-legend-card">
                  <rect x="22" y="18" width="138" height="70" rx="8" fill="#fff" opacity=".92" />
                  <circle cx="37" cy="36" r="5" fill="#ef4444" /><text x="50" y="40">Active Issue</text>
                  <circle cx="37" cy="54" r="5" fill="#f59e0b" /><text x="50" y="58">Degraded</text>
                  <circle cx="37" cy="72" r="5" fill="#00a86b" /><text x="50" y="76">Healthy</text>
                </g>

                <g className="gm-zone healthy"><path className="gm-zone-shape" d="M42 210 70 160 112 170 148 150 178 178 192 226 162 270 106 280 70 250 Z" /></g>
                <g className="gm-zone healthy"><path className="gm-zone-shape" d="M170 150 222 116 273 150 260 210 211 235 174 205 Z" /></g>
                <g className="gm-zone healthy"><path className="gm-zone-shape" d="M300 62 346 82 351 176 323 243 290 254 274 210 286 118 Z" /></g>
                <g className="gm-zone healthy"><path className="gm-zone-shape" d="M348 60 430 45 500 58 505 118 450 128 390 120 Z" /></g>
                <g className="gm-zone healthy"><path className="gm-zone-shape" d="M236 235 288 220 340 238 320 305 250 306 220 270 Z" /></g>
                <g className="gm-zone healthy"><path className="gm-zone-shape" d="M344 235 400 220 455 244 478 292 420 330 350 314 320 276 Z" /></g>
                {!inc20234Resolved ? (
                  <g className="gm-zone active"><path className="gm-zone-shape" d="M210 286 258 318 320 315 350 360 314 388 248 376 206 346 168 360 135 332 168 306 Z" /></g>
                ) : (
                  <g className="gm-zone healthy"><path className="gm-zone-shape" d="M210 286 258 318 320 315 350 360 314 388 248 376 206 346 168 360 135 332 168 306 Z" /></g>
                )}
                <g className="gm-zone degraded"><path className="gm-zone-shape" d="M452 304 530 286 605 326 676 318 720 360 690 382 585 386 520 370 440 384 428 342 Z" /></g>
                <g className="gm-zone active"><path className="gm-zone-shape" d="M580 150 645 138 718 152 778 146 820 185 832 248 802 292 735 282 680 300 620 270 600 220 Z" /></g>
                <g className="gm-zone healthy"><path className="gm-zone-shape" d="M575 252 626 286 680 300 735 282 802 292 790 350 720 360 660 342 590 356 552 310 Z" /></g>

                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="112" cy="224" r="5" /><text x="124" y="228">Wigan</text>
                  <foreignObject x="126" y="155" width="230" height="126" className="map-tip"><div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Wigan</b><strong>Healthy</strong><dl><dt>Status</dt><dd>All systems nominal</dd><dt>Detail</dt><dd>99.7% uptime</dd></dl></div></foreignObject>
                </g>
                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="220" cy="170" r="5" /><text x="232" y="174">Bolton</text>
                  <foreignObject x="242" y="98" width="230" height="126" className="map-tip"><div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Bolton</b><strong>Healthy</strong><dl><dt>Status</dt><dd>All systems nominal</dd><dt>Detail</dt><dd>99.8% uptime</dd></dl></div></foreignObject>
                </g>
                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="320" cy="154" r="5" /><text x="332" y="158">Bury</text>
                  <foreignObject x="338" y="84" width="230" height="126" className="map-tip"><div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Bury</b><strong>Healthy</strong><dl><dt>Status</dt><dd>All systems nominal</dd><dt>Detail</dt><dd>99.5% uptime</dd></dl></div></foreignObject>
                </g>
                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="440" cy="68" r="5" /><text x="452" y="72">Rochdale</text>
                  <foreignObject x="466" y="28" width="230" height="126" className="map-tip"><div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Rochdale</b><strong>Healthy</strong><dl><dt>Status</dt><dd>All systems nominal</dd><dt>Detail</dt><dd>99.4% uptime</dd></dl></div></foreignObject>
                </g>
                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="282" cy="268" r="5" /><text x="294" y="272">Salford</text>
                  <foreignObject x="304" y="190" width="230" height="126" className="map-tip"><div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Salford</b><strong>Healthy</strong><dl><dt>Status</dt><dd>All systems nominal</dd><dt>Detail</dt><dd>99.6% uptime</dd></dl></div></foreignObject>
                </g>
                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="405" cy="264" r="5" /><text x="417" y="268">Manchester</text>
                  <foreignObject x="432" y="186" width="230" height="126" className="map-tip"><div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Manchester</b><strong>Healthy</strong><dl><dt>Status</dt><dd>Metro core stable</dd><dt>Detail</dt><dd>All systems nominal</dd></dl></div></foreignObject>
                </g>
                <g className={`gm-map-label has-tooltip ${inc20234Resolved ? 'healthy' : 'active'}`} tabIndex="0">
                  {!inc20234Resolved && <circle className="gm-pulse-ring" cx="244" cy="338" r="18" />}
                  <circle className="gm-location-dot" cx="244" cy="338" r="5" /><text x="256" y="342">Trafford</text>
                  <foreignObject x="262" y="250" width="244" height="158" className="map-tip"><div xmlns="http://www.w3.org/1999/xhtml" className={`map-pop ${inc20234Resolved ? 'healthy-pop' : 'active-pop'}`}><b><span></span>Trafford</b><strong>{inc20234Resolved ? 'Healthy' : 'Active issue'}</strong><dl><dt>Status</dt><dd>{inc20234Resolved ? 'All systems nominal' : 'Service degradation'}</dd><dt>Incident</dt><dd>INC-20234</dd><dt>Users impacted</dt><dd>{inc20234Resolved ? '0' : '12,000'}</dd><dt>Detail</dt><dd>{inc20234Resolved ? 'Restored' : <>28 sites &middot; 5G RAN</>}</dd></dl></div></foreignObject>
                </g>
                <g className="gm-map-label has-tooltip degraded" tabIndex="0">
                  <circle className="gm-location-dot" cx="562" cy="350" r="5" /><text x="574" y="354">Stockport</text>
                  <foreignObject x="590" y="248" width="244" height="158" className="map-tip"><div xmlns="http://www.w3.org/1999/xhtml" className="map-pop degraded-pop"><b><span></span>Stockport</b><strong>Degraded</strong><dl><dt>Status</dt><dd>Packet loss</dd><dt>Incident</dt><dd>INC-2039</dd><dt>Users impacted</dt><dd>6,400</dd><dt>Detail</dt><dd>Auto-mitigating</dd></dl></div></foreignObject>
                </g>
                <g className="gm-map-label has-tooltip active" tabIndex="0">
                  <circle className="gm-pulse-ring" cx="692" cy="214" r="18" />
                  <circle className="gm-location-dot" cx="692" cy="214" r="5" /><text x="704" y="218">Oldham</text>
                  <foreignObject x="710" y="126" width="244" height="158" className="map-tip"><div xmlns="http://www.w3.org/1999/xhtml" className="map-pop active-pop"><b><span></span>Oldham</b><strong>Active issue</strong><dl><dt>Status</dt><dd>Node failure</dd><dt>Incident</dt><dd>INC-2035</dd><dt>Users impacted</dt><dd>9,800</dd><dt>Detail</dt><dd>Human NOC engaged</dd></dl></div></foreignObject>
                </g>
                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="670" cy="298" r="5" /><text x="682" y="302">Tameside</text>
                  <foreignObject x="690" y="218" width="230" height="126" className="map-tip"><div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Tameside</b><strong>Healthy</strong><dl><dt>Status</dt><dd>All systems nominal</dd><dt>Detail</dt><dd>99.5% uptime</dd></dl></div></foreignObject>
                </g>
              </svg>
              <svg viewBox="0 0 1080 790" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Greater Manchester network zone map">
                <defs>
                  <linearGradient id="gmMapBg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#fbfdff" />
                    <stop offset="100%" stopColor="#f7fbff" />
                  </linearGradient>
                  <pattern id="gmGrid" width="36" height="36" patternUnits="userSpaceOnUse">
                    <path d="M36 0H0V36" fill="none" stroke="#e8eef6" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="1080" height="790" fill="url(#gmMapBg)" />
                <rect width="1080" height="790" fill="url(#gmGrid)" opacity=".74" />
                <g className="gm-zone healthy">
                  <path className="gm-zone-shape" d="M48 209 82 205 94 211 128 202 148 204 151 238 170 238 186 260 205 272 238 288 229 326 259 357 241 389 248 452 209 457 182 493 189 508 177 523 131 513 118 495 78 488 61 457 29 432 47 385 36 355 55 303 44 279 Z" />
                </g>
                <g className="gm-zone healthy">
                  <path className="gm-zone-shape" d="M170 238 186 206 212 190 234 204 256 226 288 211 321 180 377 154 433 180 487 188 514 226 501 283 531 322 494 373 437 360 405 391 337 369 306 336 258 315 238 288 205 272 186 260 Z" />
                </g>
                <g className="gm-zone healthy">
                  <path className="gm-zone-shape" d="M487 80 531 101 533 136 580 146 626 146 668 110 686 148 679 183 697 238 728 267 706 320 663 330 634 372 586 353 535 329 512 292 501 283 514 226 487 188 508 148 487 113 Z" />
                </g>
                <g className="gm-zone healthy">
                  <path className="gm-zone-shape" d="M668 110 709 74 751 98 785 108 793 71 824 23 849 55 883 79 916 82 954 80 977 68 996 34 1048 28 1062 67 1048 90 1069 122 1068 174 1078 214 1064 260 1038 296 1000 304 958 294 902 307 847 290 802 298 752 270 728 267 697 238 679 183 686 148 Z" />
                </g>
                <g className="gm-zone healthy">
                  <path className="gm-zone-shape" d="M258 315 306 336 337 369 405 391 437 360 494 373 526 416 513 461 539 508 500 558 433 557 375 543 318 557 279 518 287 456 263 414 268 374 Z" />
                </g>
                <g className="gm-zone healthy">
                  <path className="gm-zone-shape" d="M526 416 571 403 611 424 645 424 674 464 716 471 706 524 663 557 621 585 576 565 539 508 513 461 Z" />
                </g>
                {!inc20234Resolved && (
                  <g className="gm-zone active">
                    <path className="gm-zone-shape" d="M279 518 318 557 375 543 433 557 500 558 539 508 576 565 621 585 599 625 630 687 587 735 525 746 477 721 426 721 382 681 334 667 295 631 253 641 226 615 261 579 Z" />
                    <foreignObject x="360" y="284" width="230" height="150" className="map-tip">
                      <div xmlns="http://www.w3.org/1999/xhtml" className="map-pop active-pop">
                        <b><span></span>Trafford</b><strong>Active issue</strong>
                        <dl><dt>Status</dt><dd>Service degradation</dd><dt>Incident</dt><dd>INC-20234</dd><dt>Users impacted</dt><dd>12,000</dd><dt>Detail</dt><dd>28 sites · 5G RAN</dd></dl>
                      </div>
                    </foreignObject>
                  </g>
                )}
                {inc20234Resolved && (
                  <g className="gm-zone healthy">
                    <path className="gm-zone-shape" d="M279 518 318 557 375 543 433 557 500 558 539 508 576 565 621 585 599 625 630 687 587 735 525 746 477 721 426 721 382 681 334 667 295 631 253 641 226 615 261 579 Z" />
                  </g>
                )}
                <g className="gm-zone active"><path className="gm-zone-shape" d="M752 270 802 298 847 290 902 307 958 294 1000 304 1038 296 1060 337 1078 370 1082 426 1054 453 1041 498 998 501 969 532 908 505 848 513 797 543 751 512 726 463 751 421 737 379 757 356 750 315 Z" /></g>
                <g className="gm-zone healthy"><path className="gm-zone-shape" d="M751 512 797 543 848 513 908 505 969 532 998 501 1013 562 980 634 919 668 861 644 816 663 771 635 735 651 697 607 706 524 716 471 726 463 Z" /></g>
                <g className="gm-zone degraded">
                  <path className="gm-zone-shape" d="M599 625 621 585 663 557 697 607 735 651 771 635 816 663 861 644 919 668 980 634 966 718 916 757 852 746 806 770 772 748 724 782 671 739 619 746 611 695 Z" />
                  <foreignObject x="270" y="312" width="230" height="150" className="map-tip">
                    <div xmlns="http://www.w3.org/1999/xhtml" className="map-pop degraded-pop">
                      <b><span></span>Stockport</b><strong>Degraded</strong>
                      <dl><dt>Status</dt><dd>Packet loss</dd><dt>Incident</dt><dd>INC-2039</dd><dt>Users impacted</dt><dd>6,400</dd><dt>Detail</dt><dd>Auto-mitigating</dd></dl>
                    </div>
                  </foreignObject>
                </g>

                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="156" cy="352" r="5" /><text x="169" y="358">Wigan</text>
                  <foreignObject x="172" y="276" width="250" height="132" className="map-tip">
                    <div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Wigan</b><strong>Healthy</strong><dl><dt>Status</dt><dd>All systems nominal</dd><dt>Detail</dt><dd>99.7% uptime</dd></dl></div>
                  </foreignObject>
                </g>
                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="330" cy="245" r="5" /><text x="343" y="251">Bolton</text>
                  <foreignObject x="345" y="185" width="250" height="132" className="map-tip">
                    <div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Bolton</b><strong>Healthy</strong><dl><dt>Status</dt><dd>All systems nominal</dd><dt>Detail</dt><dd>99.8% uptime</dd></dl></div>
                  </foreignObject>
                </g>
                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="515" cy="234" r="5" /><text x="528" y="240">Bury</text>
                  <foreignObject x="520" y="174" width="250" height="132" className="map-tip">
                    <div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Bury</b><strong>Healthy</strong><dl><dt>Status</dt><dd>All systems nominal</dd><dt>Detail</dt><dd>99.5% uptime</dd></dl></div>
                  </foreignObject>
                </g>
                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="690" cy="168" r="5" /><text x="703" y="174">Rochdale</text>
                  <foreignObject x="690" y="112" width="250" height="132" className="map-tip">
                    <div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Rochdale</b><strong>Healthy</strong><dl><dt>Status</dt><dd>All systems nominal</dd><dt>Detail</dt><dd>99.4% uptime</dd></dl></div>
                  </foreignObject>
                </g>
                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="421" cy="414" r="5" /><text x="434" y="420">Salford</text>
                  <foreignObject x="430" y="335" width="250" height="132" className="map-tip">
                    <div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Salford</b><strong>Healthy</strong><dl><dt>Status</dt><dd>All systems nominal</dd><dt>Detail</dt><dd>99.6% uptime</dd></dl></div>
                  </foreignObject>
                </g>
                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="594" cy="522" r="5" /><text x="607" y="528">Manchester</text>
                  <foreignObject x="605" y="426" width="250" height="132" className="map-tip">
                    <div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Manchester</b><strong>Healthy</strong><dl><dt>Status</dt><dd>Metro core stable</dd><dt>Detail</dt><dd>All systems nominal</dd></dl></div>
                  </foreignObject>
                </g>
                <g className={`gm-map-label has-tooltip ${inc20234Resolved ? 'healthy' : 'active'}`} tabIndex="0">
                  {!inc20234Resolved && <circle className="gm-pulse-ring" cx="462" cy="595" r="20" />}
                  <circle className="gm-location-dot" cx="462" cy="595" r="5" /><text x="475" y="601">Trafford</text>
                  <foreignObject x="320" y="494" width="260" height="168" className="map-tip">
                    <div xmlns="http://www.w3.org/1999/xhtml" className={`map-pop ${inc20234Resolved ? 'healthy-pop' : 'active-pop'}`}>
                      <b><span></span>Trafford</b><strong>{inc20234Resolved ? 'Healthy' : 'Active issue'}</strong>
                      <dl><dt>Status</dt><dd>{inc20234Resolved ? 'All systems nominal' : 'Service degradation'}</dd><dt>Incident</dt><dd>INC-20234</dd><dt>Users impacted</dt><dd>{inc20234Resolved ? '0' : '12,000'}</dd><dt>Detail</dt><dd>{inc20234Resolved ? 'Restored' : <>28 sites &middot; 5G RAN</>}</dd></dl>
                    </div>
                  </foreignObject>
                </g>
                <g className="gm-map-label has-tooltip active" tabIndex="0">
                  <circle className="gm-pulse-ring" cx="832" cy="318" r="20" />
                  <circle className="gm-location-dot" cx="832" cy="318" r="5" /><text x="845" y="324">Oldham</text>
                  <foreignObject x="710" y="226" width="260" height="168" className="map-tip">
                    <div xmlns="http://www.w3.org/1999/xhtml" className="map-pop active-pop"><b><span></span>Oldham</b><strong>Active issue</strong><dl><dt>Status</dt><dd>Node failure</dd><dt>Incident</dt><dd>INC-2035</dd><dt>Users impacted</dt><dd>9,800</dd><dt>Detail</dt><dd>Human NOC engaged</dd></dl></div>
                  </foreignObject>
                </g>
                <g className="gm-map-label has-tooltip healthy" tabIndex="0">
                  <circle className="gm-location-dot" cx="795" cy="475" r="5" /><text x="808" y="481">Tameside</text>
                  <foreignObject x="790" y="380" width="250" height="132" className="map-tip">
                    <div xmlns="http://www.w3.org/1999/xhtml" className="map-pop healthy-pop"><b><span></span>Tameside</b><strong>Healthy</strong><dl><dt>Status</dt><dd>All systems nominal</dd><dt>Detail</dt><dd>99.5% uptime</dd></dl></div>
                  </foreignObject>
                </g>
                <g className="gm-map-label has-tooltip degraded" tabIndex="0">
                  <circle className="gm-location-dot" cx="724" cy="607" r="5" /><text x="737" y="613">Stockport</text>
                  <foreignObject x="552" y="490" width="260" height="168" className="map-tip">
                    <div xmlns="http://www.w3.org/1999/xhtml" className="map-pop degraded-pop"><b><span></span>Stockport</b><strong>Degraded</strong><dl><dt>Status</dt><dd>Packet loss</dd><dt>Incident</dt><dd>INC-2039</dd><dt>Users impacted</dt><dd>6,400</dd><dt>Detail</dt><dd>Auto-mitigating</dd></dl></div>
                  </foreignObject>
                </g>
              </svg>
            </div>
          </div>
          <div className="dash-side">
            <div className="card event-card">
              <div className="ch"><span className="ctitle">Event Feed</span></div>
              <div className="fi"><div className="fd r"></div><div><div className="ftxt">Service degradation — Trafford cluster</div><div className="ftm">16:00:00 · SOC Agent</div></div></div>
              <div className="fi"><div className="fd b"></div><div><div className="ftxt">Service-Alert dispatched · 1,240 users notified</div><div className="ftm">16:06:04 · CareX</div></div></div>
              <div className="fi"><div className="fd r"></div><div><div className="ftxt">INC-2035 escalated to NOC — Oldham node failure</div><div className="ftm">16:02:30 · Escalation Handler</div></div></div>
              <div className="fi"><div className="fd a"></div><div><div className="ftxt">Stockport packet loss — auto-mitigation in progress</div><div className="ftm">16:01:18 · Network Agent</div></div></div>
              <div className="fi"><div className="fd g"></div><div><div className="ftxt">Bolton sector check — all systems nominal</div><div className="ftm">15:57:40 · Monitoring</div></div></div>
              <div className="fi"><div className="fd g"></div><div><div className="ftxt">Promo credit applied — 890 users (Bury)</div><div className="ftm">15:46:02 · Promotions Agent</div></div></div>
            </div>
            <div className="card zone-status-card">
              <div className="ch"><span className="ctitle">Zone Status</span></div>
              {[
                ['r', 'Oldham', 'Escalated'],
                [inc20234Resolved ? 'g' : 'r', 'Trafford', inc20234Resolved ? 'Healthy' : 'Active issue'],
                ['a', 'Stockport', 'Degraded'],
                ['g', 'Bolton', 'Healthy'],
                ['g', 'Bury', 'Healthy'],
                ['g', 'Manchester', 'Healthy'],
                ['g', 'Rochdale', 'Healthy'],
                ['g', 'Salford', 'Healthy'],
                ['g', 'Tameside', 'Healthy'],
                ['g', 'Wigan', 'Healthy'],
              ].map(([tone, zone, status]) => (
                <div className="zone-status-row" key={zone}><span className={`fd ${tone}`}></span><strong>{zone}</strong><em>{status}</em></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="str">
        <div className="card stat"><div className="slbl">Zones Monitored</div><div className="sval cb">12</div><div className="snote">Manchester Metro</div></div>
        <div className="card stat"><div className="slbl">Active Issues</div><div className="sval cr">{activeIssueCount}</div><div className="snote">{inc20234Resolved ? 'INC-20234 resolved' : '↑ 1 in last hour'}</div></div>
        <div className="card stat"><div className="slbl">Avg MTTR</div><div className="sval cg">4.2m</div><div className="snote">↓ 60% vs baseline</div></div>
        <div className="card stat"><div className="slbl">AI Resolution</div><div className="sval cb">94%</div><div className="snote">↑ from 87% last week</div></div>
      </div>
      <div className="dgrid">
        <div className="card">
          <div className="ch">
            <span className="ctitle">Manchester — Zone Map</span>
            <span className="lp"><span className="ld"></span>LIVE</span>
          </div>
          <div className="mapb">
            <svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg">
              <rect width="560" height="320" fill="#D6E4F5"/>
              <ellipse cx="490" cy="160" rx="55" ry="140" fill="#BDD0E8" opacity=".7"/>
              <rect x="0" y="265" width="560" height="55" fill="#BDD0E8" opacity=".6"/>
              <rect x="0" y="0" width="38" height="320" fill="#BDD0E8" opacity=".5"/>
              <polygon points="238,32 272,28 286,72 292,118 282,175 268,228 248,270 222,278 208,242 204,192 210,140 216,90 225,58" fill="#C2D2EA" stroke="#8AAACF" strokeWidth="1.5"/>
              <line x1="214" y1="82" x2="288" y2="82" stroke="#A0B8D4" strokeWidth=".5" opacity=".7"/>
              <line x1="208" y1="132" x2="290" y2="132" stroke="#A0B8D4" strokeWidth=".5" opacity=".7"/>
              <line x1="206" y1="180" x2="283" y2="180" stroke="#A0B8D4" strokeWidth=".5" opacity=".7"/>
              <line x1="233" y1="32" x2="232" y2="276" stroke="#A0B8D4" strokeWidth=".5" opacity=".7"/>
              <line x1="258" y1="30" x2="256" y2="276" stroke="#A0B8D4" strokeWidth=".5" opacity=".7"/>
              <polygon points="252,32 308,22 358,32 362,82 326,90 292,86 268,70" fill="#C2D2EA" stroke="#8AAACF" strokeWidth="1.5"/>
              <polygon points="292,118 348,100 408,112 412,162 386,196 338,200 292,178" fill="#C2D2EA" stroke="#8AAACF" strokeWidth="1.5"/>
              <polygon points="262,270 318,258 368,274 378,300 338,316 268,316 248,300" fill="#C2D2EA" stroke="#8AAACF" strokeWidth="1.5"/>
              <ellipse cx="110" cy="282" rx="58" ry="28" fill="#C2D2EA" stroke="#8AAACF" strokeWidth="1.5"/>
              {!inc20234Resolved && <circle cx="250" cy="140" r="18" fill="#E03A3A" opacity=".15"><animate attributeName="r" values="14;24;14" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".15;.04;.15" dur="2s" repeatCount="indefinite"/></circle>}
              <circle cx="250" cy="140" r="6" fill={inc20234Resolved ? '#00A86B' : '#E03A3A'}/>
              <circle cx="306" cy="52" r="5" fill="#00A86B"/>
              <circle cx="352" cy="150" r="5" fill="#00A86B"/>
              <circle cx="296" cy="285" r="5" fill="#F59E0B"/>
              <circle cx="110" cy="282" r="5" fill="#00A86B"/>
              <circle cx="250" cy="200" r="5" fill="#00A86B"/>
              <circle cx="232" cy="82" r="5" fill="#00A86B"/>
              <text x="232" y="126" fontSize="10" fill="#1a2a3a" fontFamily="Inter,sans-serif" fontWeight="600">Trafford</text>
              {!inc20234Resolved && <text x="237" y="137" fontSize="8" fill="#E03A3A" fontFamily="Inter,sans-serif">Issue Active</text>}
              <text x="236" y="202" fontSize="9" fill="#1a2a3a" fontFamily="Inter,sans-serif" fontWeight="600">Salford</text>
              <text x="288" y="46" fontSize="9" fill="#1a2a3a" fontFamily="Inter,sans-serif" fontWeight="600">Stockport</text>
              <text x="336" y="154" fontSize="9" fill="#1a2a3a" fontFamily="Inter,sans-serif" fontWeight="600">Oldham</text>
              <text x="274" y="287" fontSize="9" fill="#1a2a3a" fontFamily="Inter,sans-serif" fontWeight="600">Rochdale</text>
              <text x="90" y="286" fontSize="9" fill="#1a2a3a" fontFamily="Inter,sans-serif" fontWeight="600">Bolton</text>
              <text x="220" y="76" fontSize="9" fill="#1a2a3a" fontFamily="Inter,sans-serif" fontWeight="600">Bury</text>
              <rect x="12" y="12" width="110" height="55" rx="6" fill="white" opacity=".88"/>
              <circle cx="24" cy="26" r="4" fill="#E03A3A"/><text x="32" y="30" fontSize="8.5" fill="#333" fontFamily="Inter,sans-serif">Active Issue</text>
              <circle cx="24" cy="41" r="4" fill="#F59E0B"/><text x="32" y="45" fontSize="8.5" fill="#333" fontFamily="Inter,sans-serif">Degraded</text>
              <circle cx="24" cy="56" r="4" fill="#00A86B"/><text x="32" y="60" fontSize="8.5" fill="#333" fontFamily="Inter,sans-serif">Healthy</text>
            </svg>
          </div>
        </div>
        <div className="card">
          <div className="ch"><span className="ctitle">Event Feed</span></div>
          <div className="fi"><div className="fd r"></div><div><div className="ftxt">Service degradation — Trafford cluster</div><div className="ftm">09:41:22 · SOC Agent</div></div></div>
          <div className="fi"><div className="fd a"></div><div><div className="ftxt">Service-Alert sent · 1,240 users notified</div><div className="ftm">09:41:48 · CareX</div></div></div>
          <div className="fi"><div className="fd g"></div><div><div className="ftxt">Salford cluster — all systems nominal</div><div className="ftm">09:38:10 · Monitoring</div></div></div>
          <div className="fi"><div className="fd g"></div><div><div className="ftxt">Promo credit applied — 890 users (Bury)</div><div className="ftm">09:22:04 · Promotions Agent</div></div></div>
        </div>
      </div>
    </div>

    {/* ISSUES */}
    <div className={pageClass('issues')} id="page-issues">
      <div className="fr issue-filters"><button className="fbtn on">All</button><button className="fbtn">High</button><button className="fbtn">Medium</button></div>
      <div className="card tw">
        <table>
          <thead><tr><th>Incident</th><th>Zone</th><th>Type</th><th>Sev</th><th>Status</th><th>GreySkies (OSS)</th><th>Circles (BSS)</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>INC-20234</strong></td>
              <td>Trafford</td>
              <td>Service Degradation</td>
              <td><span className="sev H">High</span></td>
              <td><span className={`pill ${inc20234Resolved ? 'rs' : 'ac'}`}>{inc20234Resolved ? '✓ Resolved' : '● Active'}</span></td>
              <td><button className="oss-row-btn" onClick={openGreySkies} aria-label="GreySkies"><svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg></button></td>
              <td><button className="bss-row-btn" onClick={() => goTo('circles')} aria-label="Circles"><svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg></button></td>
            </tr>
            <tr>
              <td><strong>INC-2039</strong></td>
              <td>Stockport</td>
              <td>Packet Loss</td>
              <td><span className="sev M">Med</span></td>
              <td><span className="pill ac">● Active</span></td>
              <td><button className="oss-row-btn" onClick={openGreySkies} aria-label="GreySkies"><svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg></button></td>
              <td><button className="bss-row-btn" onClick={() => goTo('circles')} aria-label="Circles"><svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg></button></td>
            </tr>
            <tr>
              <td><strong>INC-2035</strong></td>
              <td>Oldham</td>
              <td>Node Failure</td>
              <td><span className="sev L">Low</span></td>
              <td><span className="pill es">⚡ Escalated</span></td>
              <td><button className="oss-row-btn" onClick={openGreySkies} aria-label="GreySkies"><svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg></button></td>
              <td><button className="bss-row-btn" onClick={() => goTo('circles')} aria-label="Circles"><svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg></button></td>
            </tr>
            <tr>
              <td><strong>INC-2030</strong></td>
              <td>Bury</td>
              <td>QoE Degradation</td>
              <td><span className="sev L">Low</span></td>
              <td><span className="pill rs">✓ Resolved</span></td>
              <td><button className="oss-row-btn" onClick={openGreySkies} aria-label="GreySkies"><svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg></button></td>
              <td><button className="bss-row-btn" onClick={() => goTo('circles')} aria-label="Circles"><svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg></button></td>
            </tr>
            <tr>
              <td><strong>INC-2028</strong></td>
              <td>Bolton</td>
              <td>Latency Spike</td>
              <td><span className="sev M">Med</span></td>
              <td><span className="pill rs">✓ Resolved</span></td>
              <td><button className="oss-row-btn" onClick={openGreySkies} aria-label="GreySkies"><svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg></button></td>
              <td><button className="bss-row-btn" onClick={() => goTo('circles')} aria-label="Circles"><svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11"><path d="M3 2.5l10 5.5-10 5.5V2.5z"/></svg></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* GREY SKIES */}
    <div className={pageClass('greyskies')} id="page-greyskies">
      <GreySkiesInline onOpenCircles={() => goTo('circles')} />
    </div>

    {/* CIRCLES */}
    <div className={pageClass('circles')} id="page-circles">
      <CirclesInline onResolveIncident={() => setInc20234Resolved(true)} />
    </div>

    {/* AGENTS */}
    <div className={pageClass('agents')} id="page-agents">
      <div className="sh"><div><div className="stitle">AI Agents</div><div className="ssub">4 agents active in the multi-agent pipeline</div></div></div>
      <div className="agrid">
        <div className="card acard">
          <div className="ahead"><div className="aico in">🌐</div><div><div className="aname">Network Service Agent</div><div className="atype">Primary Orchestrator</div></div></div>
          <div className="asta"><div className="sd on"></div>Active — processing INC-2041</div>
          <div className="tags"><span className="tag">RCA Sub-Agent</span><span className="tag">Remediation Sub-Agent</span><span className="tag">Monitoring Sub-Agent</span><span className="tag">Bandwidth Sub-Agent</span></div>
          <div className="astat"><span>Resolved today</span><strong>18</strong></div>
        </div>
        <div className="card acard">
          <div className="ahead"><div className="aico ic">💬</div><div><div className="aname">Customer Experience Agent</div><div className="atype">CX & Notifications</div></div></div>
          <div className="asta"><div className="sd on"></div>Active — alerts dispatched</div>
          <div className="tags"><span className="tag">Notification Sub-Agent</span><span className="tag">Cohort Sub-Agent</span></div>
          <div className="astat"><span>Alerts sent today</span><strong>3,420</strong></div>
        </div>
        <div className="card acard">
          <div className="ahead"><div className="aico ip">🎁</div><div><div className="aname">Promotions Agent</div><div className="atype">Compensation & CLV</div></div></div>
          <div className="asta"><div className="sd off"></div>Idle — awaiting trigger</div>
          <div className="tags"><span className="tag">Segmentation Sub-Agent</span><span className="tag">Offer Sub-Agent</span></div>
          <div className="astat"><span>Promos applied today</span><strong>890</strong></div>
        </div>
        <div className="card acard">
          <div className="ahead"><div className="aico ie">📞</div><div><div className="aname">Escalation Handler</div><div className="atype">Human-in-the-Loop</div></div></div>
          <div className="asta" style={{color: 'var(--red)'}}><div className="sd wn"></div>Active — INC-2035 escalated</div>
          <div className="tags"><span className="tag">Ticket Sub-Agent</span><span className="tag">Routing Sub-Agent</span></div>
          <div className="astat"><span>Escalations today</span><strong>1</strong></div>
        </div>
      </div>
    </div>

    {/* ESCALATIONS */}
    <div className={pageClass('escalations')} id="page-escalations">
      <div className="sh"><div><div className="stitle">Escalations</div><div className="ssub">Human-in-the-loop incidents</div></div></div>
      <div className="eclist">
        <div className="card ecc">
          <div className="ecn cr">01</div>
          <div className="ecb">
            <div className="ect">INC-2035 — Node Failure, Staten Island</div>
            <div className="ecm">AI agents unable to resolve · Severity: High · ~2,100 users affected</div>
            <div className="eca">Assigned → Raj Patel (NOC Team)</div>
          </div>
          <div style={{textAlign: 'right', flexShrink: '0'}}>
            <div style={{fontSize: '11px', color: 'var(--muted)', fontFamily: '\'JetBrains Mono\',monospace'}}>09:18 AM</div>
            <div style={{marginTop: '6px'}}><span className="pill es">⚡ Open</span></div>
          </div>
        </div>
        <div className="card ecc" style={{opacity: '.5'}}>
          <div className="ecn cg">02</div>
          <div className="ecb">
            <div className="ect">INC-2021 — Fibre Cut, Lower Manhattan</div>
            <div className="ecm">Resolved by field team · Duration: 47 min</div>
            <div className="eca">Handled by → Maria Chen (Field Ops)</div>
          </div>
          <div style={{textAlign: 'right', flexShrink: '0'}}>
            <div style={{fontSize: '11px', color: 'var(--muted)', fontFamily: '\'JetBrains Mono\',monospace'}}>Yesterday</div>
            <div style={{marginTop: '6px'}}><span className="pill rs">✓ Closed</span></div>
          </div>
        </div>
      </div>
    </div>

    {/* TOWER */}
    <div className={pageClass('tower')} id="page-tower">
      <div className="sh"><div><div className="stitle">AI Control Tower</div><div className="ssub">System-wide intelligence overview</div></div></div>
      <div className="tgrid">
        <div className="card tcard">
          <div className="tlbl">Network Health</div>
          <div className="kpis">
            <div><div className="kv cb">94%</div><div className="kn">Uptime</div></div>
            <div><div className="kv cg">60%</div><div className="kn">MTTR Reduction</div></div>
            <div><div className="kv ca">3</div><div className="kn">Open Issues</div></div>
          </div>
        </div>
        <div className="card tcard">
          <div className="tlbl">Agent Efficiency</div>
          <div className="blist">
            <div className="brow"><span className="blbl">Network Agent</span><div className="btrk"><div className="bfill g" style={{width: '96%'}}></div></div><span className="bpct">96%</span></div>
            <div className="brow"><span className="blbl">CareX</span><div className="btrk"><div className="bfill g" style={{width: '92%'}}></div></div><span className="bpct">92%</span></div>
            <div className="brow"><span className="blbl">Promo Agent</span><div className="btrk"><div className="bfill" style={{width: '88%'}}></div></div><span className="bpct">88%</span></div>
          </div>
        </div>
        <div className="card tcard" style={{gridColumn: '1/-1'}}>
          <div className="tlbl">AI Insights</div>
          <div className="ins">
            <div className="in2"><span>🔍</span><span>Midtown cluster shows elevated packet loss for 3 consecutive days — flagged for preventive maintenance.</span></div>
            <div className="in2"><span>📈</span><span>Customer satisfaction up 18% this week, correlated with faster Service-Alert delivery times.</span></div>
            <div className="in2"><span>💡</span><span>Promotions Agent recommends proactive bonus data for Brooklyn cohort (1,200 users) — churn risk elevated.</span></div>
            <div className="in2"><span>⚡</span><span>AI autonomous resolution at 94% today — exceeding the 55% operations target by 39 points.</span></div>
          </div>
        </div>
        <div className="card tcard" style={{gridColumn: '1/-1'}}>
          <div className="tlbl">Recent Service Alerts Sent to Users</div>
          <div className="aprev">
            <div className="ap"><div className="apt">🔧 Planned Outage</div><div className="apb">Maintenance tonight 2–4 AM. Back by 4 AM.</div></div>
            <div className="ap"><div className="apt">✅ Issue Resolved</div><div className="apb">Service restored. 1GB roaming credit added — no action needed.</div></div>
            <div className="ap"><div className="apt">🎁 Promotion</div><div className="apb">Bonus 2GB added this month — no action needed.</div></div>
          </div>
        </div>
      </div>
    </div>

    {/* REPORTS */}
    <div className={pageClass('reports')} id="page-reports">
      
      <div className="card report-issue-table">
        <div className="report-section-head">
          <div><strong>Issues</strong><span>Click an issue to update the report dashboard</span></div>
          <b>{reportIssues.length} incidents</b>
        </div>
        <table>
          <thead>
            <tr><th>Incident</th><th>Zone</th><th>Type</th><th>Severity</th><th>Status</th><th>Users</th><th>Resolution</th><th>Comp Claims</th></tr>
          </thead>
          <tbody>
            {reportIssues.map((issue) => {
              const reportStatus = issue.id === 'INC-20234' && inc20234Resolved ? 'Resolved' : issue.status
              return (
                <tr key={issue.id} className={selectedReportIssue.id === issue.id ? 'selected' : ''} onClick={() => setSelectedReportIssueId(issue.id)}>
                  <td><strong>{issue.id}</strong></td>
                  <td>{issue.zone}</td>
                  <td>{issue.type}</td>
                  <td><span className={`sev ${issue.severity === 'High' ? 'H' : issue.severity === 'Med' ? 'M' : 'L'}`}>{issue.severity}</span></td>
                  <td><span className={`pill ${reportStatus === 'Resolved' ? 'rs' : reportStatus === 'Escalated' ? 'es' : 'ac'}`}>{reportStatus}</span></td>
                  <td>{issue.usersImpacted.toLocaleString()}</td>
                  <td>{issue.resolution}</td>
                  <td>{issue.usersCompClaimed.toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="report-kpi-grid">
        <div className="card report-kpi"><span>Users impacted</span><strong>{reportTotals.usersImpacted.toLocaleString()}</strong><em>Across {reportTotals.sites} OSS sites</em></div>
        <div className="card report-kpi"><span>Compensation claimed</span><strong>${Math.round(reportTotals.compensationClaimed / 1000)}K</strong><em>{reportTotals.usersCompClaimed.toLocaleString()} users claimed</em></div>
        <div className="card report-kpi"><span>Claim rate</span><strong>{avgClaimRate}%</strong><em>BSS uptake average</em></div>
        <div className="card report-kpi"><span>Revenue at risk</span><strong>${Math.round(reportTotals.revenueAtRisk / 1000)}K</strong><em>OSS + BSS exposure</em></div>
      </div>

      <div className="report-dashboard-grid">
        <div className="card report-panel report-focus">
          <div className="report-section-head"><div><strong>{selectedReportIssue.id} - {selectedReportIssue.zone}</strong><span>{selectedReportIssue.type} / {selectedReportIssue.agent}</span></div></div>
          <div className="report-focus-body">
            <div className="report-focus-metric"><span>Users impacted</span><strong>{selectedReportIssue.usersImpacted.toLocaleString()}</strong></div>
            <div className="report-focus-metric"><span>Resolution time</span><strong>{selectedReportIssue.resolution}</strong></div>
            <div className="report-focus-metric"><span>Compensation claimed</span><strong>${Math.round(selectedReportIssue.compensationClaimed / 1000)}K</strong></div>
            <div className="report-focus-metric"><span>Users claimed comp</span><strong>{selectedReportIssue.usersCompClaimed.toLocaleString()}</strong></div>
          </div>
          <div className="report-root"><span>Root cause</span><p>{selectedReportIssue.rootCause}</p></div>
          <div className="report-root"><span>Recommended action</span><p>{selectedReportIssue.recommendation}</p></div>
        </div>

        <div className="card report-panel">
          <div className="report-section-head"><div><strong>OSS Health</strong><span>Network symptoms and recovery pressure</span></div><b>{selectedReportIssue.ossHealth}%</b></div>
          <div className="report-bars">
            <div><span>Throughput drop</span><b>{selectedReportIssue.throughputDrop}%</b><i style={{width: `${Math.min(100, selectedReportIssue.throughputDrop * 3)}%`}}></i></div>
            <div><span>Packet loss</span><b>{selectedReportIssue.packetLoss}%</b><i style={{width: `${Math.min(100, selectedReportIssue.packetLoss * 10)}%`}}></i></div>
            <div><span>RAN RTT</span><b>{selectedReportIssue.rtt} ms</b><i style={{width: `${Math.min(100, selectedReportIssue.rtt / 5)}%`}}></i></div>
            <div><span>Sites affected</span><b>{selectedReportIssue.sites}</b><i style={{width: `${Math.min(100, selectedReportIssue.sites * 3)}%`}}></i></div>
          </div>
        </div>

        <div className="card report-panel">
          <div className="report-section-head"><div><strong>BSS Impact</strong><span>Customer care, claims, and revenue exposure</span></div><b>{selectedReportIssue.bssHealth}%</b></div>
          <div className="report-donut-row">
            <div className="report-donut" style={{'--p': `${selectedReportIssue.claimRate}%`}}><strong>{selectedReportIssue.claimRate}%</strong><span>claim rate</span></div>
            <dl><div><dt>Claims</dt><dd>{selectedReportIssue.usersCompClaimed.toLocaleString()}</dd></div><div><dt>Comp value</dt><dd>${selectedReportIssue.compensationClaimed.toLocaleString()}</dd></div><div><dt>Revenue risk</dt><dd>${selectedReportIssue.revenueAtRisk.toLocaleString()}</dd></div></dl>
          </div>
        </div>

        <div className="card report-panel report-wide">
          <div className="report-section-head"><div><strong>Aggregated Impact By Issue</strong><span>Users impacted compared with compensation claimers</span></div></div>
          <div className="report-impact-chart">
            {reportIssues.map((issue) => (
              <button type="button" key={issue.id} className={selectedReportIssue.id === issue.id ? 'selected' : ''} onClick={() => setSelectedReportIssueId(issue.id)}>
                <span>{issue.zone}</span><i><b style={{width: `${(issue.usersImpacted / maxUsersImpacted) * 100}%`}}></b><em style={{width: `${(issue.usersCompClaimed / maxUsersImpacted) * 100}%`}}></em></i><strong>{issue.usersImpacted.toLocaleString()}</strong>
              </button>
            ))}
          </div>
          <div className="report-legend"><span><i></i> impacted users</span><span><i></i> compensation claimers</span></div>
        </div>

        <div className="report-pair">
          <div className="card report-panel">
            <div className="report-section-head"><div><strong>Incident Pressure Curve</strong><span>Issue severity shape from detection to recovery</span></div></div>
            <svg className="report-line-chart" viewBox="0 0 320 150" preserveAspectRatio="none">
              <polyline points={selectedReportIssue.trend.map((value, index) => `${index * 64},${145 - value}`).join(' ')} />
              {selectedReportIssue.trend.map((value, index) => <circle key={`${value}-${index}`} cx={index * 64} cy={145 - value} r="4" />)}
            </svg>
          </div>

          <div className="card report-panel">
            <div className="report-section-head"><div><strong>Compensation Mix</strong><span>Claims and spend by BSS segment</span></div></div>
            <div className="report-segments">
              {selectedReportIssue.segments.map(([name, users, spend]) => <div key={name}><span>{name}</span><strong>{users.toLocaleString()} users</strong><b>${Math.round(spend / 1000)}K</b></div>)}
            </div>
          </div>
        </div>

      </div>
    </div>

    {/* AI GOVERNANCE */}
    <div className={pageClass('governance')} id="page-governance">
      

      {/* KPI ROW */}
      <div className="gov-kpi-row">
        <div className="card gov-kpi">
          <div className="gov-kpi-top">
            <div className="gov-kpi-ico">🛡️</div>
            <div className="gscore-wrap">
              <div className="gscore-ring">
                <svg width="52" height="52" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="22" fill="none" stroke="#E4E9F2" strokeWidth="4"/>
                  <circle cx="26" cy="26" r="22" fill="none" stroke="#00A86B" strokeWidth="4"
                    strokeDasharray="138 138" strokeDashoffset="6" strokeLinecap="round"/>
                </svg>
                <div className="gscore-ring-num">96</div>
              </div>
            </div>
          </div>
          <div className="gov-kpi-val cg">96<span style={{fontSize: '14px'}}>/100</span></div>
          <div className="gov-kpi-lbl">Governance Score</div>
          <div className="gov-kpi-sub">INC-20234 cleared active checks</div>
        </div>
        <div className="card gov-kpi">
          <div className="gov-kpi-top"><div className="gov-kpi-ico">📋</div></div>
          <div className="gov-kpi-val cb">6</div>
          <div className="gov-kpi-lbl">Policies Active</div>
          <div className="gov-kpi-sub">Incident Comp Policy v3.2 enforced</div>
        </div>
        <div className="card gov-kpi">
          <div className="gov-kpi-top"><div className="gov-kpi-ico">⚡</div></div>
          <div className="gov-kpi-val">9<span style={{fontSize: '13px', color: 'var(--muted)'}}> / 9</span></div>
          <div className="gov-kpi-lbl">Decisions Today</div>
          <div className="gov-kpi-sub">Demo workflow gates completed</div>
        </div>
        <div className="card gov-kpi">
          <div className="gov-kpi-top"><div className="gov-kpi-ico">🚩</div></div>
          <div className="gov-kpi-val ca">1</div>
          <div className="gov-kpi-lbl">Flags Raised</div>
          <div className="gov-kpi-sub">NORS watch at 612K user-min</div>
        </div>
      </div>

      {/* ROW 2: Authorization Matrix + Compensation Guardrails */}
      <div className="gov-grid2">

        {/* Authorization Matrix */}
        <div className="card gov-card">
          <div className="gov-card-title"><span>✅</span> Action Authorization Matrix</div>
          <table className="auth-table">
            <thead>
              <tr><th>Action</th><th>Agent</th><th>Threshold</th><th>Authorization</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Service-Alert (Degradation)</td><td>Notification Agent</td><td>12,000 subs · TCPA service message</td>
                <td><span className="auth-badge auth-auto">● Autonomous</span></td>
              </tr>
              <tr>
                <td>RAN RCA + LAG remediation</td><td>SOC Agent</td><td>28 5G RAN sites · KPI validation</td>
                <td><span className="auth-badge auth-auto">● Autonomous</span></td>
              </tr>
              <tr>
                <td>Multi-channel all-clear</td><td>Notification Agent</td><td>12,000 consumers + 47 enterprise</td>
                <td><span className="auth-badge auth-human">⚠ Operator Approved</span></td>
              </tr>
              <tr>
                <td>Per-segment compensation</td><td>Promotion Agent</td><td>$3.56M envelope · under $4M cap</td>
                <td><span className="auth-badge auth-auto">● Policy Auto-approved</span></td>
              </tr>
              <tr>
                <td>FCC NORS escalation</td><td>Analytics Agent</td><td>75% of 900K user-min threshold</td>
                <td><span className="auth-badge auth-human">⚠ Watch</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Compensation Guardrails */}
        <div className="card gov-card">
          <div className="gov-card-title"><span>💰</span> Compensation Guardrails</div>
          <div className="comp-meter">
            <div className="comp-meter-head"><span className="comp-meter-lbl">Projected Compensation Envelope</span><span className="comp-meter-val">$3.56M / $4M</span></div>
            <div className="comp-track"><div className="comp-fill warn" style={{width: '89%'}}></div></div>
          </div>
          <div className="comp-meter">
            <div className="comp-meter-head"><span className="comp-meter-lbl">Expected Redemptions</span><span className="comp-meter-val">98,436 / 136,308</span></div>
            <div className="comp-track"><div className="comp-fill safe" style={{width: '72%'}}></div></div>
          </div>
          <div className="comp-meter">
            <div className="comp-meter-head"><span className="comp-meter-lbl">Weighted Bundle Uptake</span><span className="comp-meter-val">72% · 3 segments</span></div>
            <div className="comp-track"><div className="comp-fill safe" style={{width: '72%'}}></div></div>
          </div>
          <div className="comp-flags">
            <div className="comp-flag ok"><span className="comp-flag-ico">✅</span><span>INC-20234 — Creator Boost, Roam & Recover, and Family Care approved · within Incident Comp Policy v3.2</span></div>
            <div className="comp-flag ok"><span className="comp-flag-ico">✅</span><span>Projected spend $3.56M · 98,436 expected redemptions · redemption tracking live after CareX/SMS publish</span></div>
          </div>
        </div>
      </div>

      {/* ROW 3: Policy Compliance + Audit Trail */}
      <div className="gov-grid2">

        {/* Policy Compliance */}
        <div className="card gov-card">
          <div className="gov-card-title"><span>📋</span> Policy Compliance Status</div>
          <div className="policy-list">
            <div className="policy-row" style={{background: 'var(--bg)', borderRadius: '7px', padding: '8px 10px'}}>
              <div className="policy-dot g"></div><div className="policy-name">NET-AUTO-01 · Self-healing LAG config push validated across 28 RAN sites</div><div className="policy-status g">Compliant</div>
            </div>
            <div className="policy-row" style={{background: 'var(--bg)', borderRadius: '7px', padding: '8px 10px'}}>
              <div className="policy-dot g"></div><div className="policy-name">RCA-LAG-01 · BDN-PE01 xe-0/0/1 added to ae1 and LACP confirmed</div><div className="policy-status g">Compliant</div>
            </div>
            <div className="policy-row" style={{background: 'var(--bg)', borderRadius: '7px', padding: '8px 10px'}}>
              <div className="policy-dot g"></div><div className="policy-name">CX-NOTIF-01 · Outage and all-clear sent by SMS, push, and in-app</div><div className="policy-status g">Compliant</div>
            </div>
            <div className="policy-row" style={{background: 'var(--bg)', borderRadius: '7px', padding: '8px 10px'}}>
              <div className="policy-dot g"></div><div className="policy-name">TCPA-STOP-01 · Service-message exemption applied and 38 STOP opt-outs suppressed</div><div className="policy-status g">Compliant</div>
            </div>
            <div className="policy-row" style={{background: 'var(--bg)', borderRadius: '7px', padding: '8px 10px'}}>
              <div className="policy-dot g"></div><div className="policy-name">COMP-POLICY-3.2 · $3.56M compensation package within $4M cap</div><div className="policy-status g">Compliant</div>
            </div>
            <div className="policy-row" style={{background: 'var(--bg)', borderRadius: '7px', padding: '8px 10px'}}>
              <div className="policy-dot a"></div><div className="policy-name">REG-NORS-01 · FCC NORS exposure monitored at 612K user-minutes</div><div className="policy-status a">Watch</div>
            </div>
          </div>
        </div>

        {/* Regulatory Audit Trail */}
        <div className="card gov-card">
          <div className="gov-card-title"><span>📁</span> Regulatory Audit Trail</div>
          <div>
            <div className="audit-row">
              <span className="audit-time">16:00:00</span>
              <span className="audit-agent">SOC Agent</span>
              <span className="audit-action">INC-20234 detected — Trafford Metro 5G RAN · 28 sites · ~12,000 subs</span>
              <span className="audit-type auto">Auto</span>
            </div>
            <div className="audit-row">
              <span className="audit-time">09:41:35</span>
              <span className="audit-agent">Analytics Agent</span>
              <span className="audit-action">Business impact sized · $501K revenue at risk · 47 enterprise SLA accounts · NORS 612K</span>
              <span className="audit-type auto">Auto</span>
            </div>
            <div className="audit-row">
              <span className="audit-time">09:41:48</span>
              <span className="audit-agent">Notification Agent</span>
              <span className="audit-action">Outage comms sent · 12,000 SMS · 99.2% delivery · 38 STOP opt-outs</span>
              <span className="audit-type auto">Auto</span>
            </div>
            <div className="audit-row">
              <span className="audit-time">09:43:10</span>
              <span className="audit-agent">SOC Agent</span>
              <span className="audit-action">LAG fix pushed · BDN-PE01 xe-0/0/1 → ae1 · traffic balancing ~50/50</span>
              <span className="audit-type auto">Auto</span>
            </div>
            <div className="audit-row">
              <span className="audit-time">09:46:02</span>
              <span className="audit-agent">Notification Agent</span>
              <span className="audit-action">All-clear sent · 12,000 consumers + 47 enterprise contacts · 99.1% SMS delivery</span>
              <span className="audit-type auto">Auto</span>
            </div>
            <div className="audit-row">
              <span className="audit-time">09:48:20</span>
              <span className="audit-agent">Promotion Agent</span>
              <span className="audit-action">Bundles published · $3.56M envelope · 98,436 expected redemptions · Policy v3.2</span>
              <span className="audit-type auto">Auto</span>
            </div>
          </div>
          <button className="export-btn" type="button">Download Audit Report</button>
        </div>

      </div>
    </div>

  </div>
</div>
<div id="ov" className={isSimulatorOpen ? 'open' : ''} onClick={(event) => { if (event.target === event.currentTarget) closeSim() }}>
  <div className="spanel">
    <div className="shead">
      <span className="shtitle">⚡ Issue Simulator — Live Execution</span>
      <button className="shclose" onClick={closeSim}>✕</button>
    </div>
    <div className="sbody" ref={simulatorBodyRef}>
      <div className="ssteps">
        <div className={stepClass(0)} id="s0" ref={(node) => { simulatorStepRefs.current[0] = node }}>
          <div className="stl"><div className="stico">📡</div><div className="stline"></div></div>
          <div className="stc"><div className="stag">System Monitoring</div><div className="sdesc">Critical Network Slowdown — Manchester/Midtown Cluster</div><div className="sdet">Bandwidth drop to 18% · 1,240 users affected</div></div>
        </div>
        <div className={stepClass(1)} id="s1" ref={(node) => { simulatorStepRefs.current[1] = node }}>
          <div className="stl"><div className="stico">🤖</div><div className="stline"></div></div>
          <div className="stc"><div className="stag">Network Service Agent</div><div className="sdesc">Issue identified — sub-agents spawned</div>
            <div className="flow" id="f1" style={flowStyle('f1')}><span className="fn">Network Agent</span><span className="arr">→</span><span className="fn s">RCA Sub-Agent</span><span className="arr">+</span><span className="fn s">Remediation Sub-Agent</span></div>
          </div>
        </div>
        <div className={stepClass(2)} id="s2" ref={(node) => { simulatorStepRefs.current[2] = node }}>
          <div className="stl"><div className="stico">🔔</div><div className="stline"></div></div>
          <div className="stc"><div className="stag">Customer Experience Agent</div><div className="sdesc">Service-Alert dispatched to affected cohort</div>
            <div className="flow" id="f2" style={flowStyle('f2')}><span className="fn">Network Agent</span><span className="arr">→</span><span className="fn g">CareX</span><span className="arr">→</span><span className="fn s">1,240 users</span></div>
            <div className="apill" id="a2" style={pillStyle('a2')}>📱 Internet Outage — ETA 15 min</div>
          </div>
        </div>
        <div className={stepClass(3)} id="s3" ref={(node) => { simulatorStepRefs.current[3] = node }}>
          <div className="stl"><div className="stico">🔧</div><div className="stline"></div></div>
          <div className="stc"><div className="stag">Network Service Agent — Remediation</div><div className="sdesc">Fix applied — alternate route activated, services restored</div>
            <div className="sdet" id="d3" style={blockStyle('d3')}>Bandwidth restored to 98% · MTTR: 4.5 min</div>
          </div>
        </div>
        <div className={stepClass(4)} id="s4" ref={(node) => { simulatorStepRefs.current[4] = node }}>
          <div className="stl"><div className="stico">✅</div><div className="stline"></div></div>
          <div className="stc"><div className="stag">Customer Experience Agent</div><div className="sdesc">Resolution alert sent to users</div>
            <div className="apill" id="a4" style={pillStyle('a4')}>📱 Service restored.</div>
          </div>
        </div>
        <div className={stepClass(5)} id="s5" ref={(node) => { simulatorStepRefs.current[5] = node }}>
          <div className="stl"><div className="stico">🎁</div><div className="stline"></div></div>
          <div className="stc"><div className="stag">Promotions Agent</div><div className="sdesc">Compensation applied to affected cohort</div>
            <div className="apill" id="a5" style={pillStyle('a5', { background: '#FFF3E6', borderColor: 'rgba(224,123,0,.25)', color: '#B85E00' })}>📱 15GB data add-on credited— no action needed 🎉</div>
          </div>
        </div>
      </div>
      <div className={`enote ${showEscalationNote ? 'show' : ''}`} id="en">
        <strong>⚡ Escalation Path Active</strong> — Network Agents could not resolve autonomously.
        Ticket raised and assigned to human NOC agent (Raj Patel). Human-in-the-loop engaged.
      </div>
      <div className="spb"><div className="spf" id="prog" style={{ width: progressWidth }}></div></div>
    </div>
    <div className="sfoot">
      <button className="brun" id="bh" onClick={() => runSim(false)} disabled={isSimRunning}>▶ Simulate Autonomous Resolution</button>
      <button className="brun r" id="be" onClick={() => runSim(true)} disabled={isSimRunning}>⚡ Simulate Escalation to Human Agent</button>
      <button className="breset" onClick={resetSim}>↺ Reset</button>
    </div>
  </div>
</div>
    </div>
  )
}
