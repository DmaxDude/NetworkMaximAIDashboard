import '../styles/audit-trail.css'

export default function AuditTrailPage() {
  const openDefaultControlTower = () => {
    window.history.pushState({}, '', '/operator/governance')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="audit-page">
<div className="app">
  <aside className="sidebar">
    <div className="brand">
      <div className="brand-row">
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
      <div className="brand-tag">Multi-AI Network Ops</div>
    </div>
    <nav className="nav">
      <div className="ni"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>Live Dashboard</div>
      <div className="ni"><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>Active Issues <span className="nb">3</span></div>
      <div className="ni"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z"/></svg>AI Agents</div>
      <div className="ni"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>Escalations <span className="nb">1</span></div>
      <div className="ni"><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd"/></svg>Reports</div>
      <div className="ni active" onClick={openDefaultControlTower}><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>AI Control Tower</div>
    </nav>
    <div className="user-row">
      <div className="av">KS</div>
      <div><div className="uname">Kevin Smith</div><div className="urole">Network Operator</div></div>
      <div className="odot"></div>
    </div>
  </aside>

  <div className="main">
    <div className="topbar">
      <div>
        <div className="tb-title">AI Control Tower</div>
        <div className="tb-sub">Trust · Explainability · Compliance · Audit</div>
      </div>
      <div className="tb-right">
        <button className="sim-btn"><span className="blink"></span>Simulate Issue</button>
      </div>
    </div>

    <div className="content">
      <div className="kpi-row">
        <div className="kpi">
          <div className="kpi-lbl">Governance Score</div>
          <div className="gscore">
            <div>
              <div className="kpi-val cg">94<span style={{fontSize: '13px'}}>/100</span></div>
              <div className="kpi-note">All systems within policy</div>
            </div>
            <div className="ring-wrap" style={{marginLeft: 'auto'}}>
              <svg width="44" height="44" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#E4E9F2" strokeWidth="3.5"/>
                <circle cx="22" cy="22" r="18" fill="none" stroke="#00A86B" strokeWidth="3.5" strokeDasharray="107 113" strokeLinecap="round"/>
              </svg>
              <div className="ring-num">94</div>
            </div>
          </div>
        </div>
        <div className="kpi"><div className="kpi-lbl">Policies Active</div><div className="kpi-val cb">18</div><div className="kpi-note">All guardrails enforced</div></div>
        <div className="kpi"><div className="kpi-lbl">Decisions Today</div><div className="kpi-val">47<span style={{fontSize: '12px', color: '#6B7A90'}}> / 50</span></div><div className="kpi-note">47 autonomous · 3 human-approved</div></div>
        <div className="kpi"><div className="kpi-lbl">Flags Raised</div><div className="kpi-val ca">2</div><div className="kpi-note">1 blocked · 1 human-reviewed</div></div>
      </div>

      <div className="sec-head">
        <div>
          <div className="sec-title">Regulatory Audit Trail</div>
          <div className="sec-sub">Complete immutable log · INC-2041 Critical Network Slowdown — Midtown &amp; INC-2035 Node Failure — Staten Island · 09:18 – 09:47 AM</div>
        </div>
        <div className="export-btns">
          <button className="ebtn">&#8595; Export CSV</button>
          <button className="ebtn">&#8595; Export PDF</button>
          <button className="ebtn primary">&#8595; Export Word</button>
        </div>
      </div>

      <div className="panel">
        <div className="filter-row">
          <span className="fi-lbl">Filter:</span>
          <button className="fbtn on">All (9)</button>
          <button className="fbtn">Autonomous</button>
          <button className="fbtn">Human-approved</button>
          <button className="fbtn">Flagged</button>
          <input className="search-box" placeholder="Search agent or incident…"/>
        </div>
        <table>
          <thead>
            <tr>
              <th style={{width: '68px'}}>Incident</th>
              <th style={{width: '76px'}}>Timestamp</th>
              <th style={{width: '140px'}}>Agent</th>
              <th>Action &amp; Detail</th>
              <th style={{width: '54px'}}>Confidence</th>
              <th style={{width: '68px'}}>Type</th>
              <th style={{width: '64px'}}>Outcome</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="inc-id">INC-2041</span></td>
              <td><span className="ts">09:41:22</span></td>
              <td><div className="agent-nm">Monitoring System</div><div className="agent-sub">Sensor · Auto-trigger</div></td>
              <td><div className="action-txt">QoE anomaly detected — Midtown cluster</div><div className="action-detail">Bandwidth: 18% of normal · Users affected: 1,240 · Latency spike: +320ms</div><span className="policy-ref">CX-NOTIF-01</span></td>
              <td><span className="conf-hi">—</span></td>
              <td><span className="tb t-auto">Auto</span></td>
              <td><span className="ok">Detected</span></td>
            </tr>
            <tr>
              <td><span className="inc-id">INC-2041</span></td>
              <td><span className="ts">09:41:35</span></td>
              <td><div className="agent-nm">Network Service Agent</div><div className="agent-sub">RCA Sub-Agent spawned</div></td>
              <td><div className="action-txt">Root cause analysis · fiber fault MH-7→MH-9 identified</div><div className="action-detail">packet_loss: 34% · confidence threshold check: passed (97% &gt; 90%)</div><span className="policy-ref">NET-AUTO-01</span></td>
              <td><span className="conf-hi">97%</span></td>
              <td><span className="tb t-auto">Auto</span></td>
              <td><span className="ok">Confirmed</span></td>
            </tr>
            <tr>
              <td><span className="inc-id">INC-2041</span></td>
              <td><span className="ts">09:41:48</span></td>
              <td><div className="agent-nm">CX Agent</div><div className="agent-sub">Notification Sub-Agent</div></td>
              <td><div className="action-txt">Outage Alert dispatched · 1,240 Midtown users notified</div><div className="action-detail">"Critical Network Slowdown in your area — ETA 15 min" · Cohort dual-source verified · delivery: 99.2%</div><span className="policy-ref">CX-NOTIF-01</span><span className="policy-ref">CX-COHORT-01</span></td>
              <td><span className="conf-hi">—</span></td>
              <td><span className="tb t-auto">Auto</span></td>
              <td><span className="ok">Sent</span></td>
            </tr>
            <tr>
              <td><span className="inc-id">INC-2041</span></td>
              <td><span className="ts">09:43:10</span></td>
              <td><div className="agent-nm">Remediation Sub-Agent</div><div className="agent-sub">Network Service Agent</div></td>
              <td><div className="action-txt">Alternate route activated · MH-7 → MH-12 → MH-9</div><div className="action-detail">BW restored: 98% · MTTR: 4.5 min · latency: 12ms · packet_loss: 0.1%</div><span className="policy-ref">NET-AUTO-01</span></td>
              <td><span className="conf-hi">97%</span></td>
              <td><span className="tb t-auto">Auto</span></td>
              <td><span className="ok">Restored</span></td>
            </tr>
            <tr>
              <td><span className="inc-id">INC-2041</span></td>
              <td><span className="ts">09:46:02</span></td>
              <td><div className="agent-nm">CX Agent</div><div className="agent-sub">Notification Sub-Agent</div></td>
              <td><div className="action-txt">Resolution alert sent · "Service Fully Restored"</div><div className="action-detail">1,240 users · "The network issue has been resolved. We apologise for any inconvenience." · delivery: 99.4%</div><span className="policy-ref">CX-NOTIF-01</span></td>
              <td><span className="conf-hi">—</span></td>
              <td><span className="tb t-auto">Auto</span></td>
              <td><span className="ok">Sent</span></td>
            </tr>
            <tr className="hl">
              <td><span className="inc-id">INC-2041</span></td>
              <td><span className="ts">09:46:18</span></td>
              <td><div className="agent-nm">Promotions Agent</div><div className="agent-sub">Offer Sub-Agent</div></td>
              <td><div className="action-txt">15GB Data Add-on credited · 1,240 Midtown users</div><div className="action-detail">Rule matched: PROMO-STD-01 · outage: 14.5 min · budget consumed: ₹42k of ₹100k daily cap</div><span className="policy-ref">PROMO-STD-01</span><span className="policy-ref">COMP-BUDGET-01</span></td>
              <td><span className="conf-hi">91%</span></td>
              <td><span className="tb t-auto">Auto</span></td>
              <td><span className="ok">Applied</span></td>
            </tr>
            <tr>
              <td><span className="inc-id">INC-2035</span></td>
              <td><span className="ts">09:18:04</span></td>
              <td><div className="agent-nm">Escalation Handler</div><div className="agent-sub">Routing Sub-Agent</div></td>
              <td><div className="action-txt">Escalated to human NOC · confidence below 90% threshold</div><div className="action-detail">RCA confidence: 62% · physical fault suspected · assigned: Raj Patel (NOC)</div><span className="policy-ref">ESC-01</span></td>
              <td><span className="conf-md">62%</span></td>
              <td><span className="tb t-human">Human</span></td>
              <td><span className="pend">Pending</span></td>
            </tr>
            <tr>
              <td><span className="inc-id">INC-2035</span></td>
              <td><span className="ts">09:18:31</span></td>
              <td><div className="agent-nm">Promotions Agent</div><div className="agent-sub">Offer Sub-Agent</div></td>
              <td><div className="action-txt">Compensation blocked — exceeds autonomous threshold</div><div className="action-detail">Proposed: 30GB · 2,100 users · exceeds 15GB autonomous limit · routed to human approval queue</div><span className="policy-ref">PROMO-HUM-01</span></td>
              <td><span className="conf-md">—</span></td>
              <td><span className="tb t-block">Blocked</span></td>
              <td><span className="pend">Awaiting</span></td>
            </tr>
            <tr>
              <td><span className="inc-id">INC-2035</span></td>
              <td><span className="ts">09:32:11</span></td>
              <td><div className="agent-nm">Kevin Smith</div><div className="agent-sub">Operator · Human Override</div></td>
              <td><div className="action-txt">Human override — 30GB compensation approved after review</div><div className="action-detail">Reason: prolonged outage &gt;30 min · approved for 2,100 users · override logged with timestamp</div><span className="policy-ref">HUMAN-OVER-01</span><span className="policy-ref">PROMO-HUM-01</span></td>
              <td><span className="conf-hi">—</span></td>
              <td><span className="tb t-human">Human</span></td>
              <td><span className="ok">Approved</span></td>
            </tr>
          </tbody>
        </table>
        <div className="summary-bar">
          <div className="sb-item">Total events: <strong>9</strong></div>
          <div className="sb-item">Autonomous: <strong>6</strong></div>
          <div className="sb-item">Human-approved: <strong>2</strong></div>
          <div className="sb-item">Blocked &amp; reviewed: <strong>1</strong></div>
          <div className="sb-item">Incidents: <strong>INC-2041 · INC-2035</strong></div>
          <div className="pagination">
            <button className="pg-btn">‹</button>
            <button className="pg-btn active">1</button>
            <button className="pg-btn">2</button>
            <button className="pg-btn">›</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  )
}
