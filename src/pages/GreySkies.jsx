import { useEffect, useRef, useState } from 'react'
import '../styles/operator.css'

/* â”€â”€ Agent icons â”€â”€ */
const SOC_ICON = (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
  </svg>
)
const SEG_ICON = (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0 3 3 0 016 0zm-4.07 11c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
  </svg>
)
const ANA_ICON = (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
  </svg>
)

const AGENTS = [
  { name: 'SOC Agent',      label: 'pulling live KPIs from 312 affected cells...',               icon: SOC_ICON },
  { name: 'Segment Agent',  label: 'clustering 12000 affected subs by plan, value, geo...',    icon: SEG_ICON },
  { name: 'Analytics Agent',label: 'modelling 6h revenue-at-risk + SLA + churn exposure...',     icon: ANA_ICON },
]

const BUSINESS_RESPONSE = {
  intro: "Here's the damage so far, Adamâ€” not pretty, but contained ðŸ·ï¸",
  lines: [
    { bold: 'Business impact â€”  Trafford Metro RAN degradation (Incident #INC-20234)' },
    { html: '<strong>Customers affected:</strong> ~12000 subscribers across <strong>312 cell sites</strong> (Brooklyn, Queens, Jersey City).' },
    { html: '<strong>Service impact:</strong> 5G NR throughput down <strong>62%</strong>, VoLTE call setup failure rate at <strong>8.3%</strong> (baseline 0.4%).' },
    { html: '<strong>Enterprise SLA exposure: 47 enterprise accounts</strong> breaching SLA â€” top 3: <em>FreightOne Logistics</em>, <em>Mercy Health Network</em>, <em>Atlas Rideshare</em>.' },
    { bold: 'Revenue at risk (next 6h):' },
    { plain: 'Consumer ARPU credits: ~$148K' },
    { plain: 'Enterprise SLA penalties: ~$312K' },
    { plain: 'Roaming/MVNO settlement loss: ~$41K' },
    { bold: 'Total: ~$501K' },
    { html: '<strong>Brand / churn signal:</strong> social mentions up <strong>9.4Ã—</strong>, NPS detractors trending <strong>+18 pts</strong> in affected ZIPs. Predicted 30-day churn lift: <strong>+0.7%</strong> (~1,290 subs).' },
    { html: '<strong>Regulatory:</strong> approaching FCC NORS reporting threshold (â‰¥900K user-minutes lost). Currently at <strong>612K</strong> â€” we\'ll want to escalate at <strong>75%</strong>.' },
    { plain: "The clock's the real enemy here â€” want me to line up restoration ETA or get comms moving?" },
  ],
}

const CANNED = {
  restore: 'Field teams are on-site at Newark-PoP-2 and restoration is estimated at ~25 minutes. The primary fix is rerouting traffic around Metro-Ring-7 and validating fiber integrity before full service recovery.',
  comms:   'Recommend sending an SMS advisory to impacted subscribers, plus an internal ops alert for service desk and field crew status updates. Keep messages concise and include expected restoration window.',
}

const SUGGESTIONS = [
  { label: "What's the business impact of this degradation?", key: 'business' },
  { label: 'How long will it take to restore?',                key: 'restore' },
  { label: 'Send comms to all the customers right away informing them about the outage', key: 'comms' },
]

const PERSONAS = [
  {
    id: 'maya', name: 'Maya', role: 'CONTENT CREATOR',
    desc: 'Brooklyn Â· streams + uploads daily Â· on home Wi-Fi',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M18 3H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9l-4-6zm-5 13H9v-2h4v2zm3-4H6v-2h10v2zm0-4H6V6h10v2z"/><path d="M18 9l4-3v12l-4-3V9z"/></svg>,
  },
  {
    id: 'raj', name: 'Raj', role: 'BUSINESS TRAVELLER',
    desc: 'Queens Â· 80+ flights/yr Â· cell-only on a degraded site',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>,
  },
  {
    id: 'elena', name: 'Elena', role: 'FAMILY PLANNER',
    desc: 'Jersey City Â· 4-line family plan Â· no CareX app installed',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  },
]

/* status: 'pending' | 'active' | 'done' */
function agentStatus(agentIdx, phase) {
  if (phase === null) return 'pending'
  if (phase > agentIdx) return 'done'
  if (phase === agentIdx) return 'active'
  return 'pending'
}

function AgentStatusIcon({ status }) {
  if (status === 'done') return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
      <circle cx="10" cy="10" r="9" stroke="#22c55e" strokeWidth="1.5" fill="#f0fdf4"/>
      <path d="M6 10l3 3 5-5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  if (status === 'active') return <span className="gs-agent-spinner" />
  return <span className="gs-agent-pending-dot" />
}

export default function GreySkiesPage() {
  const [inputValue, setInputValue]       = useState('')
  const [messages, setMessages]           = useState([])
  const [selectedPersona, setSelectedPersona] = useState('maya')
  /* agentPhase: null | 0 | 1 | 2 | 3 (3 = all done, response shown) */
  const [agentPhase, setAgentPhase]       = useState(null)
  const chatEndRef = useRef(null)
  const timers     = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const scrollDown = () => setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

  const addMsg = (msg) => {
    setMessages((m) => [...m, msg])
    scrollDown()
  }

  const runAgentSequence = (userLabel) => {
    // add user bubble
    addMsg({ type: 'user', text: userLabel })
    // add the agents-at-work placeholder
    addMsg({ type: 'agents' })
    setAgentPhase(0)

    const t1 = setTimeout(() => { setAgentPhase(1); scrollDown() }, 1500)
    const t2 = setTimeout(() => { setAgentPhase(2); scrollDown() }, 3000)
    const t3 = setTimeout(() => {
      setAgentPhase(3)
      // replace agents block with assistant response
      setMessages((m) => {
        const next = [...m]
        // find last 'agents' entry and replace with 'business-response'
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i].type === 'agents') { next[i] = { type: 'business-response' }; break }
        }
        return next
      })
      scrollDown()
    }, 4600)

    timers.current.push(t1, t2, t3)
  }

  const handleSuggestion = (key, label) => {
    if (key === 'business') {
      runAgentSequence(label)
    } else {
      addMsg({ type: 'user', text: label })
      addMsg({ type: 'assistant', text: CANNED[key] })
    }
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    addMsg({ type: 'user', text: inputValue.trim() })
    addMsg({ type: 'assistant', text: 'Thanks â€” checking the latest network impact and will update you shortly.' })
    setInputValue('')
  }

  const persona = PERSONAS.find((p) => p.id === selectedPersona)

  return (
    <div className="gs-page">
      {/* â”€â”€ LEFT: CHAT PANEL â”€â”€ */}
      <div className="gs-left">
        <div className="gs-hdr">
          <div className="gs-hdr-brand">
            <div className="gs-hdr-icon">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
            <div>
              <div className="gs-hdr-title">Nova â€” Operator Co-pilot</div>
              <div className="gs-hdr-sub">Insights Â· Actions Â· Network ops</div>
            </div>
          </div>
          <div className="gs-inc-badge">
            <span className="gs-inc-dot"></span>
            1 active incident Â· P1
          </div>
        </div>

        <div className="gs-chat">
          {/* Initial copilot message */}
          <div className="gs-msg-wrap">
            <div className="gs-msg-avatar">
              <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div className="gs-msg-label">Co-pilot</div>
              <div className="gs-msg-bubble">
                <p>Heads up, Adamâ€” something&apos;s off in the  Trafford ðŸš¨</p>
                <p>ðŸš¨ <strong>Active alert â€” Network degradation detected</strong></p>
                <p><strong>Incident #INC-20234</strong> Â·  Trafford Metro RAN Â· severity <strong>P1</strong></p>
                <p><strong>Scope:</strong> 28 RAN 5G sites under the Trafford aggregation</p>
                <p><strong>Symptom:</strong> 5G NR throughput down <strong>62%</strong> Â· VoLTE call setup failure <strong>8.3%</strong> (baseline 0.4%)</p>
                <p><strong>Likely cause:</strong> transport ring failure on <em>Metro-Ring-7</em> after fiber maintenance at <em>Newark-PoP-2</em></p>
                <p><strong>Subscribers affected (live estimate): ~12000</strong></p>
                <p><strong>Restoration ETA: ~25 min</strong> Â· field team already at <em>Newark-PoP-2</em></p>
                <p>I&apos;m here to help you size it up and handle customer comms while NetOps restores. A few good opening shots:</p>
                <p className="gs-italic">What&apos;s the business impact of this degradation?</p>
                <p className="gs-italic">How long will it take to restore?</p>
                <p className="gs-italic">Send an SMS to affected customers about the outage</p>
              </div>
            </div>
          </div>

          {/* Dynamic messages */}
          {messages.map((m, i) => {
            if (m.type === 'user') return (
              <div key={i} className="gs-user-msg-wrap">
                <div className="gs-user-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <div className="gs-msg-label">You</div>
                  <div className="gs-user-text">{m.text}</div>
                </div>
              </div>
            )

            if (m.type === 'agents') return (
              <div key={i} className="gs-agents-card">
                <div className="gs-agents-header">
                  <span className="gs-agents-dot"></span>
                  AGENTS AT WORK
                </div>
                {AGENTS.map((agent, ai) => {
                  const status = agentStatus(ai, agentPhase)
                  return (
                    <div key={ai} className={`gs-agent-row gs-agent-${status}`}>
                      <AgentStatusIcon status={status} />
                      <span className="gs-agent-icon-wrap">{agent.icon}</span>
                      <span className="gs-agent-name">{agent.name}</span>
                      <span className="gs-agent-sep">Â·</span>
                      <span className="gs-agent-label">{agent.label}</span>
                    </div>
                  )
                })}
              </div>
            )

            if (m.type === 'business-response') return (
              <div key={i} className="gs-msg-wrap">
                <div className="gs-msg-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Co-pilot</div>
                  <div className="gs-msg-bubble gs-biz-bubble">
                    <p>{BUSINESS_RESPONSE.intro}</p>
                    {BUSINESS_RESPONSE.lines.map((l, li) =>
                      l.html  ? <p key={li} dangerouslySetInnerHTML={{ __html: l.html }} /> :
                      l.bold  ? <p key={li}><strong>{l.bold}</strong></p> :
                                <p key={li}>{l.plain}</p>
                    )}
                    <div className="gs-agents-footer">
                      <span className="gs-agents-footer-lbl">AGENTS THAT WORKED ON THIS</span>
                      {AGENTS.map((a, ai) => (
                        <span key={ai} className="gs-agents-footer-tag">
                          <span className="gs-agents-footer-ico">{a.icon}</span>
                          {a.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )

            if (m.type === 'assistant') return (
              <div key={i} className="gs-msg-wrap">
                <div className="gs-msg-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Co-pilot</div>
                  <div className="gs-msg-bubble"><p>{m.text}</p></div>
                </div>
              </div>
            )

            return null
          })}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion cards */}
        <div className="gs-sugg-row">
          {SUGGESTIONS.map((s) => (
            <button key={s.key} className="gs-sugg-card" onClick={() => handleSuggestion(s.key, s.label)}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="gs-input-wrap">
          <div className="gs-input-row">
            <input
              className="gs-input-field"
              placeholder="Ask about network health, subscribers, revenue, incidents..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="gs-send-btn" onClick={handleSend}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
          <div className="gs-footer-note">
            Nova answers <span className="gs-footer-link">from a curated knowledge base</span>. Press Enter to send.
          </div>
        </div>
      </div>

      {/* â”€â”€ RIGHT: CUSTOMER VIEW â”€â”€ */}
      <div className="gs-right">
        <div className="gs-cv-hdr">
          <div className="gs-cv-icon">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" clipRule="evenodd"/>
            </svg>
          </div>
          <div>
            <div className="gs-cv-title">Customer view</div>
            <div className="gs-cv-sub">Live downstream impact of operator actions</div>
          </div>
        </div>

        <div className="gs-cv-body">
          <div className="gs-persona-lbl">CUSTOMER PERSONA</div>
          <div className="gs-persona-row">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                className={`gs-persona-card${selectedPersona === p.id ? ' active' : ''}`}
                onClick={() => setSelectedPersona(p.id)}
              >
                <div className="gs-persona-ico">{p.icon}</div>
                <div className="gs-persona-name">{p.name}</div>
                <div className="gs-persona-role">{p.role}</div>
                <div className="gs-persona-desc">{p.desc}</div>
              </button>
            ))}
          </div>

          {/* iPhone Mockup */}
          <div className="gs-phone-outer">
            <div className="gs-phone">
              <div className="gs-phone-status">
                <span className="gs-phone-time-sm">04:47 PM</span>
                <div className="gs-phone-sig">
                  <span className="gs-wifi-dot"></span>
                  Wi-Fi
                </div>
              </div>
              <div className="gs-phone-notch"></div>
              <div className="gs-phone-owner">{persona?.name}&apos;s iPhone</div>
              <div className="gs-phone-clock">04:47 PM</div>
              <div className="gs-phone-date">Monday, Jun 7</div>
              <div className="gs-phone-empty">No notifications yet</div>
              <div className="gs-phone-bar"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
