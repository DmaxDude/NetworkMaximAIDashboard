import { useEffect, useRef, useState } from 'react'
import '../styles/operator.css'
import { GM_GEO } from '../data/gmGeo.js'
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
const GREYSKIES_URL = 'https://greyskies-presentations.netlify.app/catalyst_demo/'

const GM_MAP_WIDTH = 1000
const GM_MAP_HEIGHT = 747
const GM_TOOLTIP_WIDTH = 248
const GM_TOOLTIP_HEIGHT = 250
const GM_STATUS_COLOR = {
  good: '#32cfaa',
  warn: '#f8b333',
  bad: '#ff5b6f',
}

const GM_ZONE_STATUS = {
  Trafford: {
    status: 'bad',
    label: 'Active issue',
    note: 'Service Degradation',
    inc: 'INC-20234',
    users: '12,000',
    severity: 'High',
    detail: 'Trafford Metro 5G RAN \u00b7 28 sites',
  },
  Oldham: {
    status: 'bad',
    label: 'Escalated',
    note: 'Node failure',
    inc: 'INC-2035',
    users: '9,800',
    severity: 'High',
    detail: 'Human-in-loop',
  },
  Stockport: {
    status: 'warn',
    label: 'Degraded',
    note: 'Packet loss',
    inc: 'INC-2039',
    users: '6,400',
    severity: 'Med',
    detail: 'Auto-mitigating',
  },
  Manchester: { status: 'good', label: 'Healthy', note: 'All systems nominal', detail: '99.4% uptime' },
  Salford: { status: 'good', label: 'Healthy', note: 'All systems nominal', detail: '99.6% uptime' },
  Bury: { status: 'good', label: 'Healthy', note: 'Recently resolved', inc: 'INC-2030', detail: 'Resolved 24m' },
  Bolton: { status: 'good', label: 'Healthy', note: 'Recently resolved', inc: 'INC-2028', detail: 'Resolved 31m' },
  Rochdale: { status: 'good', label: 'Healthy', note: 'All systems nominal', detail: '99.1% uptime' },
  Tameside: { status: 'good', label: 'Healthy', note: 'All systems nominal', detail: '99.3% uptime' },
  Wigan: { status: 'good', label: 'Healthy', note: 'All systems nominal', detail: '99.5% uptime' },
}

const getGmTooltipPosition = ([x, y]) => ({
  x: Math.min(Math.max(x + 18, 14), GM_MAP_WIDTH - GM_TOOLTIP_WIDTH - 14),
  y: Math.min(Math.max(y - 98, 14), GM_MAP_HEIGHT - GM_TOOLTIP_HEIGHT - 14),
})

const reportIssues = [
  {
    id: 'INC-20234',
    zone: 'Trafford',
    type: 'Service Degradation',
    severity: 'High',
    status: 'Resolved',
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
    rootCause: 'Microbursts on SKP-MW03 uplink saturating egress queues',
    usersImpacted: 6400,
    sites: 14,
    resolution: '42 min',
    resolutionScore: 54,
    compensationClaimed: 33000,
    usersCompClaimed: 1740,
    claimRate: 27,
    ossHealth: 64,
    bssHealth: 74,
    packetLoss: 4.1,
    throughputDrop: 9,
    rtt: 240,
    revenueAtRisk: 71000,
    agent: 'Network Agent',
    recommendation: 'Re-balance QoS weights on SKP-MW03 and watch buffer occupancy for 30 min.',
    segments: [
      ['Creator Boost', 1420, 29000],
      ['Roam & Recover', 980, 18000],
      ['Family Care', 1980, 36000],
    ],
    trend: [0, 7, 42, 63, 70, 66, 58, 47, 36, 27, 19, 13, 8, 5, 3],
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
  const [selectedReportIssueId, setSelectedReportIssueId] = useState(reportIssues[1].id)
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
  const liveZoneStatus = {
    ...GM_ZONE_STATUS,
    Trafford: inc20234Resolved
      ? {
          status: 'good',
          label: 'Healthy',
          note: 'All systems nominal',
          detail: 'All 28 sites restored',
        }
      : GM_ZONE_STATUS.Trafford,
  }

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
  const selectedReportIssue = reportIssues.find((issue) => issue.id === selectedReportIssueId) || reportIssues[1]
  const reportTotals = { usersImpacted: 35100, sites: 81, compensationClaimed: 267000, usersCompClaimed: 13850, revenueAtRisk: 458000 }
  const avgClaimRate = 34
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
      <svg className="nav-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"></path></svg>
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
            <div className="mapb gm-map" aria-label="Greater Manchester network zone map">
              <svg className="gm-live-map" viewBox={GM_GEO.viewBox} preserveAspectRatio="xMidYMid meet" role="img">
                <defs>
                  <linearGradient id="gmLiveGood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="rgba(45,212,167,0.32)" />
                    <stop offset="1" stopColor="rgba(45,212,167,0.10)" />
                  </linearGradient>
                  <linearGradient id="gmLiveWarn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="rgba(246,181,60,0.40)" />
                    <stop offset="1" stopColor="rgba(246,181,60,0.12)" />
                  </linearGradient>
                  <linearGradient id="gmLiveBad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="rgba(255,93,108,0.52)" />
                    <stop offset="1" stopColor="rgba(255,93,108,0.16)" />
                  </linearGradient>
                  <radialGradient id="gmLiveStageGlow" cx="50%" cy="42%" r="62%">
                    <stop offset="0" stopColor="rgba(33,182,218,0.10)" />
                    <stop offset="1" stopColor="rgba(33,182,218,0)" />
                  </radialGradient>
                  <filter id="gmLiveGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <pattern id="gmLiveGrid" width="34" height="34" patternUnits="userSpaceOnUse">
                    <path className="gm-live-grid-line" d="M34 0H0V34" fill="none" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width={GM_MAP_WIDTH} height={GM_MAP_HEIGHT} fill="url(#gmLiveGrid)" />
                <rect x="0" y="0" width={GM_MAP_WIDTH} height={GM_MAP_HEIGHT} fill="url(#gmLiveStageGlow)" />
                {GM_GEO.boroughs.map((borough) => {
                  const meta = liveZoneStatus[borough.name] || { status: 'good', label: 'Healthy', note: 'All systems nominal' }
                  const color = GM_STATUS_COLOR[meta.status]
                  const dotX = borough.c[0] - 46
                  const labelX = borough.c[0] - 34
                  const tip = getGmTooltipPosition(borough.c)

                  return (
                    <g
                      key={borough.code}
                      className={`gm-live-zone ${meta.status}`}
                      tabIndex={0}
                      role="button"
                      aria-label={`${borough.name}: ${meta.label}`}
                    >
                      <path className="gm-live-shape" d={borough.d} />
                      {meta.status === 'bad' && (
                        <>
                          <circle className="gm-live-ping" cx={borough.c[0]} cy={borough.c[1]} r="11" />
                          <circle className="gm-live-ping gm-live-ping-delay" cx={borough.c[0]} cy={borough.c[1]} r="11" />
                        </>
                      )}
                      <circle className="gm-live-dot" cx={dotX} cy={borough.c[1] - 5} r="4.5" style={{ fill: color }} />
                      <text className="gm-live-label" x={labelX} y={borough.c[1]}>{borough.name}</text>
                      <foreignObject className="gm-live-tip-wrap" x={tip.x} y={tip.y} width={GM_TOOLTIP_WIDTH} height={GM_TOOLTIP_HEIGHT}>
                        <div xmlns="http://www.w3.org/1999/xhtml" className="gm-live-tip">
                          <div className="gm-live-tip-name"><span style={{ background: color }}></span>{borough.name}</div>
                          <div className={`gm-live-tip-status ${meta.status}`}>{meta.label}</div>
                          <div className="gm-live-tip-row"><span>Status</span><strong>{meta.note}</strong></div>
                          {meta.severity && <div className="gm-live-tip-row"><span>Severity</span><strong>{meta.severity}</strong></div>}
                          {meta.inc && <div className="gm-live-tip-row"><span>Incident</span><strong>{meta.inc}</strong></div>}
                          {meta.users && <div className="gm-live-tip-row"><span>Users impacted</span><strong>{meta.users}</strong></div>}
                          {meta.detail && <div className="gm-live-tip-row"><span>Detail</span><strong>{meta.detail}</strong></div>}
                        </div>
                      </foreignObject>
                    </g>
                  )
                })}
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
          <div className="mapb"></div>
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
      <div className="reports-page">
        <div className="report-kpi-grid">
          <div className="card report-kpi report-kpi-red"><span>Users Impacted</span><strong>{reportTotals.usersImpacted.toLocaleString()}</strong><em>Across {reportTotals.sites} OSS sites</em></div>
          <div className="card report-kpi report-kpi-amber"><span>Compensation Claimed</span><strong>${Math.round(reportTotals.compensationClaimed / 1000)}<small>K</small></strong><em>{reportTotals.usersCompClaimed.toLocaleString()} users claimed</em></div>
          <div className="card report-kpi report-kpi-green"><span>Claim Rate</span><strong>{avgClaimRate}<small>%</small></strong><em>BSS uptake average</em></div>
          <div className="card report-kpi report-kpi-red"><span>Revenue At Risk</span><strong>${Math.round(reportTotals.revenueAtRisk / 1000)}<small>K</small></strong><em>OSS + BSS exposure</em></div>
        </div>

        <section className="card report-issue-table">
          <div className="report-table-title">
            <div><strong>Issues</strong><span>click an issue to update the report dashboard</span></div>
            <b>{reportIssues.length} incidents</b>
          </div>
          <table>
            <thead>
              <tr><th>Incident</th><th>Zone</th><th>Type</th><th>Severity</th><th>Status</th><th>Users</th><th>Resolution</th><th>Comp Claims</th></tr>
            </thead>
            <tbody>
              {reportIssues.map((issue) => {
                return (
                  <tr key={issue.id} className={selectedReportIssue.id === issue.id ? 'selected' : ''} onClick={() => setSelectedReportIssueId(issue.id)}>
                    <td><strong>{issue.id}</strong></td>
                    <td>{issue.zone}</td>
                    <td>{issue.type}</td>
                    <td><span className={`report-sev ${issue.severity.toLowerCase()}`}>{issue.severity}</span></td>
                    <td><span className={`report-status ${issue.status.toLowerCase()}`}>{issue.status}</span></td>
                    <td>{issue.usersImpacted.toLocaleString()}</td>
                    <td>{issue.resolution}</td>
                    <td>{issue.usersCompClaimed.toLocaleString()}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>

        <div className="report-primary-grid">
          <section className="card report-panel report-focus-card">
            <div className="report-card-head">
              <strong>{selectedReportIssue.id} · {selectedReportIssue.zone}</strong>
              <span className={`report-status ${selectedReportIssue.status.toLowerCase()}`}>{selectedReportIssue.status}</span>
            </div>
            <div className="report-focus-sub">{selectedReportIssue.type} · {selectedReportIssue.agent}</div>
            <div className="report-focus-body">
              <div className="report-focus-metric"><span>Users Impacted</span><strong>{selectedReportIssue.usersImpacted.toLocaleString()}</strong></div>
              <div className="report-focus-metric"><span>Resolution Time</span><strong>{selectedReportIssue.resolution}</strong></div>
              <div className="report-focus-metric"><span>Compensation Claimed</span><strong>${Math.round(selectedReportIssue.compensationClaimed / 1000)}K</strong></div>
              <div className="report-focus-metric"><span>Users Claimed Comp</span><strong>{selectedReportIssue.usersCompClaimed.toLocaleString()}</strong></div>
            </div>
            {selectedReportIssue.id !== 'INC-2039' && (
              <>
                <div className="report-root"><span>Root Cause</span><p>{selectedReportIssue.rootCause}</p></div>
                <div className="report-root"><span>Recommended Action</span><p>{selectedReportIssue.recommendation}</p></div>
              </>
            )}
          </section>

          <section className="card report-panel">
            <div className="report-card-head"><strong>OSS Health</strong><b>{selectedReportIssue.ossHealth}%</b></div>
            <div className="report-panel-sub">Network symptoms and recovery pressure</div>
            <div className="report-bars">
              <div><span>Throughput drop</span><b>{selectedReportIssue.throughputDrop}%</b><i><em style={{width: '22%'}}></em></i></div>
              <div><span>Packet loss</span><b>{selectedReportIssue.packetLoss.toFixed(2)}%</b><i><em style={{width: '48%'}}></em></i></div>
              <div><span>RAN RTT</span><b>{selectedReportIssue.rtt} ms</b><i><em style={{width: '52%'}}></em></i></div>
              <div><span>Sites affected</span><b>{selectedReportIssue.sites}</b><i><em style={{width: '46%'}}></em></i></div>
            </div>
          </section>

          <section className="card report-panel">
            <div className="report-card-head"><strong>BSS Impact</strong><b>{selectedReportIssue.bssHealth}%</b></div>
            <div className="report-panel-sub">Customer care, claims, and revenue exposure</div>
            <div className="report-donut-row">
              <div className="report-donut" style={{'--p': `${selectedReportIssue.claimRate}%`}}><strong>{selectedReportIssue.claimRate}%</strong><span>claim rate</span></div>
              <dl><div><dt>Claims</dt><dd>{selectedReportIssue.usersCompClaimed.toLocaleString()}</dd></div><div><dt>Comp value</dt><dd>${selectedReportIssue.compensationClaimed.toLocaleString()}</dd></div><div><dt>Revenue risk</dt><dd>${selectedReportIssue.revenueAtRisk.toLocaleString()}</dd></div></dl>
            </div>
          </section>
        </div>

        <div className="report-aggregate-grid">
          <section className="card report-panel">
            <div className="report-card-head"><strong>Aggregated Impact By Issue</strong></div>
            <div className="report-panel-sub">Users impacted compared with compensation claimers</div>
            <div className="report-impact-chart">
              {reportIssues.map((issue) => (
                <button type="button" key={issue.id} className={selectedReportIssue.id === issue.id ? 'selected' : ''} onClick={() => setSelectedReportIssueId(issue.id)}>
                  <span>{issue.zone}</span>
                  <i><b style={{width: `${(issue.usersImpacted / maxUsersImpacted) * 100}%`}}></b><em style={{width: `${(issue.usersCompClaimed / issue.usersImpacted) * 100}%`}}></em></i>
                  <strong>{issue.usersImpacted.toLocaleString()}</strong>
                </button>
              ))}
            </div>
            <div className="report-legend"><span><i></i> impacted users</span><span><i></i> compensation claimers</span></div>
          </section>

          <section className="card report-panel report-score-card">
            <div className="report-card-head"><strong>OSS/BSS Aggregate Score</strong></div>
            <div className="report-panel-sub">Combined operational readiness across all report issues</div>
            <div className="report-score-list">
              <div><span>OSS average health</span><strong>77%</strong><i><em className="cyan" style={{width: '77%'}}></em></i></div>
              <div><span>BSS average readiness</span><strong>85%</strong><i><em className="green" style={{width: '85%'}}></em></i></div>
              <div><span>Compensation uptake</span><strong>34%</strong><i><em className="amber" style={{width: '34%'}}></em></i></div>
            </div>
          </section>
        </div>

        <div className="report-bottom-grid">
          <section className="card report-panel report-pressure-card">
            <div className="report-card-head">
              <strong>Incident Pressure Curve</strong>
              <span className="report-info">i</span>
            </div>
            <div className="report-panel-sub">Pressure index over the incident lifecycle — detection to recovery</div>
            <svg className="report-pressure-chart" viewBox="0 0 640 260" preserveAspectRatio="none">
              <defs>
                <linearGradient id="reportPressureFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#20b6d7" stopOpacity=".22" />
                  <stop offset="1" stopColor="#20b6d7" stopOpacity=".02" />
                </linearGradient>
              </defs>
              <line className="grid" x1="64" y1="66" x2="604" y2="66" />
              <line className="grid" x1="64" y1="122" x2="604" y2="122" />
              <line className="grid" x1="64" y1="178" x2="604" y2="178" />
              <text className="axis-label" x="18" y="128" transform="rotate(-90 18 128)">PRESSURE INDEX</text>
              <text className="tick" x="42" y="69">100</text>
              <text className="tick" x="49" y="125">50</text>
              <text className="tick" x="56" y="212">0</text>
              <path className="area" d="M64 212 C82 204 92 190 104 170 C130 124 160 86 208 76 C256 66 300 82 346 104 C398 129 438 153 492 170 C535 184 574 191 604 195 L604 212 L64 212 Z" />
              <path className="line" d="M64 212 C82 204 92 190 104 170 C130 124 160 86 208 76 C256 66 300 82 346 104 C398 129 438 153 492 170 C535 184 574 191 604 195" />
              <circle className="peak" cx="208" cy="76" r="5" />
              <text className="peak-label" x="184" y="60">Peak 70</text>
              <text className="x-label" x="64" y="238">Detected</text>
              <text className="x-label end" x="604" y="238">Recovered · 42 min</text>
            </svg>
          </section>

          <section className="card report-panel">
            <div className="report-card-head"><strong>Compensation Mix</strong></div>
            <div className="report-panel-sub">Claims and spend by BSS segment</div>
            <div className="report-segments">
              {selectedReportIssue.segments.map(([name, users, spend]) => <div key={name}><span>{name}</span><strong>{users.toLocaleString()} users</strong><b>${Math.round(spend / 1000)}K</b></div>)}
            </div>
          </section>
        </div>
      </div>
    </div>

    {/* AI GOVERNANCE */}
    <div className={pageClass('governance')} id="page-governance">
      <div className="gov-kpi-row">
        <div className="card gov-kpi gov-kpi-good">
          <div className="gov-kpi-lbl">Governance Score</div>
          <div className="gov-kpi-val">96<span>/100</span></div>
          <div className="gov-kpi-sub">INC-20234 cleared active checks</div>
        </div>
        <div className="card gov-kpi gov-kpi-good">
          <div className="gov-kpi-lbl">Policies Active</div>
          <div className="gov-kpi-val">6</div>
          <div className="gov-kpi-sub">Incident Comp Policy v3.2 enforced</div>
        </div>
        <div className="card gov-kpi gov-kpi-good">
          <div className="gov-kpi-lbl">Decisions Today</div>
          <div className="gov-kpi-val">9<span>/9</span></div>
          <div className="gov-kpi-sub">Demo workflow gates completed</div>
        </div>
        <div className="card gov-kpi gov-kpi-watch">
          <div className="gov-kpi-lbl">Flags Raised</div>
          <div className="gov-kpi-val">1</div>
          <div className="gov-kpi-sub">NORS watch at 612K user-min</div>
        </div>
      </div>

      <div className="gov-panel-grid">
        <section className="card gov-card gov-matrix-card">
          <div className="gov-card-title">Action Authorization Matrix</div>
          <table className="auth-table">
            <thead>
              <tr><th>Action</th><th>Agent</th><th>Threshold</th><th>Authorization</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Service-Alert<br />(Degradation)</strong></td>
                <td>Notification<br />Agent</td>
                <td>12,000 subs ·<br />TCPA service<br />message</td>
                <td><span className="auth-badge auth-auto"><i></i>Autonomous</span></td>
              </tr>
              <tr>
                <td><strong>RAN RCA + LAG<br />remediation</strong></td>
                <td>SOC Agent</td>
                <td>28 5G RAN sites ·<br />KPI validation</td>
                <td><span className="auth-badge auth-auto"><i></i>Autonomous</span></td>
              </tr>
              <tr>
                <td><strong>Multi-channel all-<br />clear</strong></td>
                <td>Notification<br />Agent</td>
                <td>12,000 consumers<br />+ 47 enterprise</td>
                <td><span className="auth-badge auth-human"><i></i>Operator Approved</span></td>
              </tr>
              <tr>
                <td><strong>Per-segment<br />compensation</strong></td>
                <td>Promotion<br />Agent</td>
                <td>$3.56M envelope ·<br />under $4M cap</td>
                <td><span className="auth-badge auth-auto"><i></i>Policy Auto-approved</span></td>
              </tr>
              <tr>
                <td><strong>FCC NORS<br />escalation</strong></td>
                <td>Analytics<br />Agent</td>
                <td>75% of 900K<br />user-min<br />threshold</td>
                <td><span className="auth-badge auth-human"><i></i>Watch</span></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="card gov-card gov-guardrail-card">
          <div className="gov-card-title">Compensation Guardrails</div>
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
            <div className="comp-flag ok"><span className="comp-flag-ico">✓</span><span><strong>INC-20234</strong> — Creator Boost, Roam & Recover, and Family Care approved · within Incident Comp Policy v3.2</span></div>
            <div className="comp-flag ok"><span className="comp-flag-ico">✓</span><span>Projected spend <strong>$3.56M</strong> · 98,436 expected redemptions · redemption tracking live after CareX/SMS publish</span></div>
          </div>
        </section>

        <section className="card gov-card gov-policy-card">
          <div className="gov-card-title">Policy Compliance Status</div>
          <div className="policy-list">
            <div className="policy-row">
              <div className="policy-dot g"></div><div className="policy-name"><strong>NET-AUTO-01</strong> · Self-healing LAG config push validated across 28 RAN sites</div><div className="policy-status g">Compliant</div>
            </div>
            <div className="policy-row">
              <div className="policy-dot g"></div><div className="policy-name"><strong>RCA-LAG-01</strong> · BDN-PE01 xe-0/0/1 added to ae1 and LACP confirmed</div><div className="policy-status g">Compliant</div>
            </div>
            <div className="policy-row">
              <div className="policy-dot g"></div><div className="policy-name"><strong>CX-NOTIF-01</strong> · Outage and all-clear sent by SMS, push, and in-app</div><div className="policy-status g">Compliant</div>
            </div>
            <div className="policy-row">
              <div className="policy-dot g"></div><div className="policy-name"><strong>TCPA-STOP-01</strong> · Service-message exemption applied and 38 STOP opt-outs suppressed</div><div className="policy-status g">Compliant</div>
            </div>
            <div className="policy-row">
              <div className="policy-dot g"></div><div className="policy-name"><strong>COMP-POLICY-3.2</strong> · $3.56M compensation package within $4M cap</div><div className="policy-status g">Compliant</div>
            </div>
            <div className="policy-row">
              <div className="policy-dot a"></div><div className="policy-name"><strong>REG-NORS-01</strong> · FCC NORS exposure monitored at 612K user-minutes</div><div className="policy-status a">Watch</div>
            </div>
          </div>
        </section>

        <section className="card gov-card gov-audit-card">
          <div className="gov-card-title gov-card-title-row">
            <span>Regulatory Audit Trail</span>
            <a className="gov-download-btn" href="/maxim-audit-INC-20234.txt" download="maxim-audit-INC-20234.txt" aria-label="Download audit report">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path></svg>
            </a>
          </div>
          <div className="audit-list">
            <div className="audit-row">
              <span className="audit-time">09:41:22</span>
              <span className="audit-agent">SOC Agent</span>
              <span className="audit-action">INC-20234 detected — Trafford Metro 5G RAN · 28 sites · ~12,000 subs</span>
              <span className="audit-type">AUTO</span>
            </div>
            <div className="audit-row">
              <span className="audit-time">09:41:35</span>
              <span className="audit-agent">Analytics Agent</span>
              <span className="audit-action">Business impact sized · $501K revenue at risk · 47 enterprise SLA accounts · NORS 612K</span>
              <span className="audit-type">AUTO</span>
            </div>
            <div className="audit-row">
              <span className="audit-time">09:41:48</span>
              <span className="audit-agent">Notification Agent</span>
              <span className="audit-action">Outage comms sent · 12,000 SMS · 99.2% delivery · 38 STOP opt-outs</span>
              <span className="audit-type">AUTO</span>
            </div>
            <div className="audit-row">
              <span className="audit-time">09:43:10</span>
              <span className="audit-agent">SOC Agent</span>
              <span className="audit-action">LAG fix pushed · BDN-PE01 xe-0/0/1 → ae1 · traffic balancing ~50/50</span>
              <span className="audit-type">AUTO</span>
            </div>
            <div className="audit-row">
              <span className="audit-time">09:46:02</span>
              <span className="audit-agent">Notification Agent</span>
              <span className="audit-action">All-clear sent · 12,000 consumers + 47 enterprise contacts · 99.1% SMS delivery</span>
              <span className="audit-type">AUTO</span>
            </div>
            <div className="audit-row">
              <span className="audit-time">09:48:20</span>
              <span className="audit-agent">Promotion Agent</span>
              <span className="audit-action">Bundles published · $3.56M envelope · 98,436 expected redemptions · Policy v3.2</span>
              <span className="audit-type">AUTO</span>
            </div>
          </div>
        </section>
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
