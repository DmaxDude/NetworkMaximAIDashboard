import { useEffect, useRef, useState } from 'react'

const kpis = [
  ['Sites monitored', '28', 'All operational', 'network', 'ok'],
  ['Active incidents', '0', 'No active incidents', 'alert', 'ok'],
  ['Avg downlink per site', '2.27', 'Mean across all sites (24h)', 'down', 'blue', 'Mbps'],
  ['Avg RAN RTT', '128', 'Threshold 250 ms', 'clock', 'ok', 'ms'],
  ['Avg packet loss', '0.98', 'Threshold 4%', 'pulse', 'ok', '%'],
]

const legend = ['Incident', 'BLT-S01', 'BLT-S02', 'BLT-S03', 'BLT-S04', 'BRY-S01', 'BRY-S02', 'BRY-S03']

const nodes = [
  ['BLT-MW04', 9, 52, '11%', 'access'],
  ['BLT-MW02', 16, 37, '4%', 'access'],
  ['BLT-S02', 14, 62, '6%', 'access'],
  ['TRF-S01', 28, 60, '6%', 'access'],
  ['TRF-MW01', 41, 48, '46%', 'access'],
  ['TRF-MW02', 38, 82, '37%', 'access'],
  ['BDN-PE01', 53, 51, '6%', 'core'],
  ['BDN-PE02', 48, 64, '', 'core'],
  ['PE01', 65, 62, '', 'core'],
  ['PE02', 60, 78, '', 'core'],
  ['SKP-MW03', 92, 31, '5%', 'access'],
  ['SKP-S03', 97, 58, '6%', 'access'],
  ['SKP-S02', 99, 16, '6%', 'access'],
]

const GREY_TYPING_DELAY = 2200

function useDelayedStep(initial = 'idle') {
  const [step, setStep] = useState(initial)

  useEffect(() => {
    if (step !== 'typing') return undefined
    const timer = window.setTimeout(() => setStep('done'), GREY_TYPING_DELAY)
    return () => window.clearTimeout(timer)
  }, [step])

  return [step, setStep, step === 'done', step === 'typing']
}

function KpiIcon({ type }) {
  if (type === 'network') return (
    <svg viewBox="0 0 24 24"><path d="M12 4v5m0 6v5M5 9l7 3 7-3M5 15l7-3 7 3" /></svg>
  )
  if (type === 'alert') return (
    <svg viewBox="0 0 24 24"><path d="M12 4l9 16H3L12 4z" /><path d="M12 9v4m0 4h.01" /></svg>
  )
  if (type === 'down') return (
    <svg viewBox="0 0 24 24"><path d="M12 4v14m0 0l-5-5m5 5l5-5" /></svg>
  )
  if (type === 'clock') return (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 7v6l4 2" /></svg>
  )
  return (
    <svg viewBox="0 0 24 24"><path d="M4 12h4l2-5 4 10 2-5h4" /></svg>
  )
}

function ThroughputChart() {
  const grid = [20, 40, 60, 80]
  const lines = [
    'M0,70 C12,44 18,96 28,72 C42,24 50,18 58,64 C70,102 82,68 100,76',
    'M0,54 C18,82 24,42 38,47 C52,51 64,78 76,60 C88,38 92,58 100,71',
    'M0,66 C18,54 26,58 37,43 C49,67 58,47 70,61 C84,76 90,45 100,55',
    'M0,62 C18,71 30,48 43,61 C52,74 64,54 78,62 C88,66 96,50 100,63',
    'M0,68 C15,63 24,70 37,66 C48,58 60,69 72,64 C84,54 92,68 100,60',
  ]
  return (
    <div className="gsky-chart">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        {grid.map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} className="gsky-grid-line" />)}
        {lines.map((d, i) => <path key={d} d={d} className={`gsky-line l${i}`} />)}
      </svg>
      <div className="gsky-xaxis"><span>13:00<br />08/08/25</span><span>13:37</span><span>14:15</span><span>14:52</span><span>15:30</span></div>
    </div>
  )
}

function MiniRttChart() {
  return (
    <div className="gsky-mini-chart">
      <svg viewBox="0 0 100 46" preserveAspectRatio="none">
        <line x1="0" x2="100" y1="9" y2="9" className="gsky-threshold" />
        <path d="M0,39 C14,34 20,39 30,34 C42,28 48,15 56,24 C67,38 72,5 83,18 C91,28 95,12 100,9" className="gsky-rtt-line" />
      </svg>
    </div>
  )
}

function Topology() {
  const [selectedNode, setSelectedNode] = useState(null)
  const links = [
    [9, 52, 16, 37], [16, 37, 41, 48], [14, 62, 16, 37], [28, 60, 41, 48],
    [41, 48, 53, 51], [41, 48, 48, 64], [53, 51, 65, 62], [48, 64, 60, 78],
    [65, 62, 60, 78], [92, 31, 97, 58], [92, 31, 99, 16], [38, 82, 41, 48],
  ]
  const selectedName = selectedNode?.[0]
  const selectedKind = selectedNode?.[4]
  const selectedType = selectedName?.includes('MW') ? 'Aggregation (MW)' : selectedKind === 'core' ? 'Core' : 'Access site'
  const selectedTitle = selectedName ? `MCH-TRAFFORD-RCD-${selectedName.split('-').slice(-1)[0]}` : ''
  const selectedHasIssue = selectedTitle === 'MCH-TRAFFORD-RCD-MW02'

  return (
    <div className="gsky-topology">
      <div className="gsky-map-tools"><button>+</button><button>-</button><button>↻</button></div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        {links.map(([x1, y1, x2, y2], index) => <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} className="gsky-link" />)}
      </svg>
      {nodes.map(([name, x, y, pct, kind]) => (
        <div key={name} className={`gsky-node ${kind} ${name === 'TRF-MW02' ? 'issue' : ''}`} style={{ left: `${x}%`, top: `${y}%` }}>
          <span className="gsky-node-label">{name}</span>
          <button className="gsky-node-mark" type="button" onClick={() => setSelectedNode([name, x, y, pct, kind])} aria-label={`Show ${name} details`}>{kind === 'core' ? '◎' : '△'}</button>
          {pct && <b>{pct}</b>}
        </div>
      ))}
      {selectedNode && (
        <div className="gsky-node-popover">
          <header>
            <strong>{selectedHasIssue ? 'Issue Detected' : selectedTitle}</strong>
            <button type="button" onClick={() => setSelectedNode(null)} aria-label="Close node details">×</button>
          </header>
          {selectedHasIssue ? (
            <div className="gsky-node-issue">
              <strong>Service Degradation</strong>
              <p>Trafford 5G RAN <span>&middot;</span></p>
              <b>Severity : High</b>
            </div>
          ) : (
            <dl>
              <div><dt>Type</dt><dd>{selectedType}</dd></div>
              <div><dt>Max link utilization</dt><dd className="ok">7.64%</dd></div>
              <div><dt>Connections</dt><dd>2</dd></div>
            </dl>
          )}
        </div>
      )}
    </div>
  )
}

function GreyWorkspace({ onClose, onOpenCircles }) {
  const bodyRef = useRef(null)
  const shouldAutoScrollRef = useRef(true)
  const [greyStep, setGreyStep] = useState('start')
  const [replyText, setReplyText] = useState('')
  const [submittedPrompt, setSubmittedPrompt] = useState('')
  const [promptTypingLabel, setPromptTypingLabel] = useState('investigating')
  const [promptStep, setPromptStep, promptShown, promptTyping] = useDelayedStep()
  const [quickStep, setQuickStep, quickShown, quickTyping] = useDelayedStep()
  const [quickRiskStep, setQuickRiskStep, quickRiskShown, quickRiskTyping] = useDelayedStep()
  const [scopeStep, setScopeStep, scopeShown, scopeTyping] = useDelayedStep()
  const [trackingStep, setTrackingStep, trackingShown, trackingTyping] = useDelayedStep()
  const [trackingAlertStep, setTrackingAlertStep, trackingAlertShown, trackingAlertTyping] = useDelayedStep()
  const [deepStep, setDeepStep] = useState('idle')
  const [mitigationStep, setMitigationStep, mitigationShown, mitigationTyping] = useDelayedStep()
  const [approvalStep, setApprovalStep, approvalDone, approvalTyping] = useDelayedStep()
  const mitigationApproved = approvalStep !== 'idle'
  const [rootCauseStep, setRootCauseStep, rootCauseShown, rootCauseTyping] = useDelayedStep()
  const [opsStep, setOpsStep, opsSent, opsTyping] = useDelayedStep()
  const [strategyStep, setStrategyStep, strategyShown, strategyTyping] = useDelayedStep()
  const [etaStep, setEtaStep, etaShown, etaTyping] = useDelayedStep()
  const [finalStep, setFinalStep, finalShown, finalTyping] = useDelayedStep()
  const [finalPrompt, setFinalPrompt] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const greyTyping = ['investigating', 'earlyTyping'].includes(greyStep)
  const deepTyping = deepStep === 'typing'
  const copilotTyping = greyTyping || promptTyping || quickTyping || quickRiskTyping || scopeTyping || trackingTyping || trackingAlertTyping || deepTyping || mitigationTyping || approvalTyping || rootCauseTyping || opsTyping || strategyTyping || etaTyping || finalTyping
  const canSendReply = replyText.trim().length > 0

  const handleReplySend = () => {
    const nextPrompt = replyText.trim()
    if (!nextPrompt) return
    shouldAutoScrollRef.current = true
    if (submittedPrompt && nextPrompt.toLowerCase().includes('thank')) {
      setFinalPrompt(nextPrompt)
      setFinalStep('typing')
      setReplyText('')
      return
    }
    setSubmittedPrompt(nextPrompt)
    setPromptTypingLabel('investigating')
    setPromptStep('typing')
    setReplyText('')
  }

  useEffect(() => {
    if (!['investigating', 'earlyTyping'].includes(greyStep)) return undefined
    const nextStep = greyStep === 'earlyTyping' ? 'early' : 'confirmed'
    const timer = window.setTimeout(() => setGreyStep(nextStep), GREY_TYPING_DELAY)
    return () => window.clearTimeout(timer)
  }, [greyStep])

  useEffect(() => {
    if (deepStep !== 'typing') return undefined
    const timer = window.setTimeout(() => setDeepStep('done'), GREY_TYPING_DELAY)
    return () => window.clearTimeout(timer)
  }, [deepStep])

  useEffect(() => {
    if (promptStep !== 'typing') return undefined
    const timer = window.setTimeout(() => setPromptTypingLabel('typing'), 1100)
    return () => window.clearTimeout(timer)
  }, [promptStep])

  useEffect(() => {
    if (!quickShown || quickRiskStep !== 'idle') return
    setQuickRiskStep('typing')
  }, [quickShown, quickRiskStep, setQuickRiskStep])

  useEffect(() => {
    if (!trackingShown || trackingAlertStep !== 'idle') return
    setTrackingAlertStep('typing')
  }, [trackingShown, trackingAlertStep, setTrackingAlertStep])

  useEffect(() => {
    if (!bodyRef.current) return
    const body = bodyRef.current
    const scrollToBottom = () => {
      if (!shouldAutoScrollRef.current) return
      body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' })
    }
    let frame
    let settleTimer
    const responseDelay = copilotTyping ? GREY_TYPING_DELAY + 120 : 90
    if (!copilotTyping) {
      frame = window.requestAnimationFrame(scrollToBottom)
      settleTimer = window.setTimeout(scrollToBottom, 90)
    }
    const responseTimer = window.setTimeout(scrollToBottom, responseDelay)
    const cardRevealTimer = window.setTimeout(scrollToBottom, responseDelay + GREY_TYPING_DELAY + 160)
    const stagedTimers = [4800, 7200, 9600, 12400, 14800].map((delay) => window.setTimeout(scrollToBottom, responseDelay + delay))
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      if (settleTimer) window.clearTimeout(settleTimer)
      window.clearTimeout(responseTimer)
      window.clearTimeout(cardRevealTimer)
      stagedTimers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [greyStep, promptStep, quickStep, quickRiskStep, scopeStep, trackingStep, trackingAlertStep, deepStep, mitigationStep, approvalStep, rootCauseStep, opsStep, strategyStep, etaStep, finalStep, submittedPrompt, copilotTyping])

  useEffect(() => {
    if (!bodyRef.current) return undefined
    const hasNewResponse = promptShown || deepStep === 'done' || mitigationShown || approvalDone || rootCauseShown || opsSent || strategyShown || etaShown || finalShown
    if (!hasNewResponse) return undefined
    shouldAutoScrollRef.current = true
    const body = bodyRef.current
    const scrollToBottom = () => body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' })
    const frame = window.requestAnimationFrame(scrollToBottom)
    const settleTimer = window.setTimeout(scrollToBottom, 180)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(settleTimer)
    }
  }, [promptShown, deepStep, mitigationShown, approvalDone, rootCauseShown, opsSent, strategyShown, etaShown, finalShown])

  const handleBodyScroll = () => {
    const body = bodyRef.current
    if (!body) return
    const distanceFromBottom = body.scrollHeight - body.scrollTop - body.clientHeight
    shouldAutoScrollRef.current = distanceFromBottom < 96
  }

  const handleBodyAnimationEnd = (event) => {
    if (!String(event.animationName).startsWith('gskyInvest') || !bodyRef.current) return
    if (!shouldAutoScrollRef.current) return
    bodyRef.current.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }

  return (
    <section className={`gsky-copilot${isFullscreen ? ' fullscreen' : ''}`}>
      <header className="gsky-copilot-head">
        <div className="gsky-grey-mark">G<span></span></div>
        <div>
          <div className="gsky-copilot-title">
            <strong>Grey</strong>
            <b>PREDICTIVE</b>
          </div>
          <p><i></i> Predictive risk · Trafford 5G RAN</p>
        </div>
        <nav>
          <button aria-label="History">↺</button>
          <button aria-label="Settings">⚙</button>
          <button
            type="button"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            aria-pressed={isFullscreen}
            onClick={() => setIsFullscreen((current) => !current)}
          >
            {isFullscreen ? '↙' : '↗'}
          </button>
          <button aria-label="Close" onClick={onClose}>×</button>
        </nav>
      </header>

      <div className="gsky-copilot-body" ref={bodyRef} onScroll={handleBodyScroll} onAnimationEnd={handleBodyAnimationEnd}>
        <div className="gsky-chat-row">
          <div className="gsky-grey-mark small">G<span></span></div>
          <div>
            <p>Hi Adam, how can I help you today?</p>
          </div>
        </div>

        {submittedPrompt ? (
          <div className="gsky-status-thread">
            <div className="gsky-user-query">
              <span>{submittedPrompt}</span>
            </div>

            {promptTyping && (
              <div className="gsky-chat-row gsky-typing-row">
                <div className="gsky-grey-mark small">G<span></span></div>
                <div className="gsky-typing-pill"><b></b><b></b><b></b><em>{promptTypingLabel === 'investigating' ? 'Grey is investigating...' : 'Grey is typing...'}</em></div>
              </div>
            )}

            {promptShown && (
              <>
                <div className="gsky-chat-row gsky-response-row">
                  <div className="gsky-grey-mark small">G<span></span></div>
                  <div className="gsky-response-copy">
                    <div className="gsky-status-card warn">
                      <strong><i></i> Service degradation detected</strong>
                      <span>Incident #INC-20234 &middot; Trafford 5G RAN &middot; severity P1</span>
                    </div>
                    <p><strong>Scope:</strong> 28 RAN 5G sites under the Trafford aggregation</p>
                    <p><strong>Symptom:</strong> 5G NR throughput down 15% &middot; Packet Loss 7.22% (1.8 x baseline). Average RAN RTT 386 ms (1.6 x Baseline)</p>
                    <p><strong>Likely root cause:</strong> Backhaul capacity congestion. Confidence will firm as the signal develops.</p>
                    <p><strong>Subscribers affected (live estimate):</strong> ~12,000</p>
                    <p><strong>Status:</strong> SOC Agent is tracking the situation and will surface a new alert the moment the trajectory worsens or a new factor pops up.</p>
                  </div>
                </div>

                {deepStep === 'idle' && (
                  <div className="gsky-next gsky-choice-list">
                    <strong>WHAT'S NEXT?</strong>
                    <button onClick={() => setDeepStep('typing')}><span className="play">◎</span> <span>Start deep Invigation</span></button>
                  </div>
                )}

                {deepStep !== 'idle' && (
                  <>
                    <div className="gsky-user-query">
                      <span>Start deep Invigation</span>
                    </div>

                    {deepStep === 'typing' && (
                      <div className="gsky-chat-row gsky-typing-row">
                        <div className="gsky-grey-mark small">G<span></span></div>
                        <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                      </div>
                    )}

                    {deepStep === 'done' && (
                      <>
                        <div className="gsky-chat-row gsky-response-row">
                          <div className="gsky-grey-mark small">G<span></span></div>
                          <div className="gsky-response-copy gsky-staged-flow gsky-deep-flow">
                            <p>On it, tracing it back through the transport layer now.</p>
                            <div className="gsky-investigation-card">
                              <strong><i></i> INVESTIGATING</strong>
                              <p>Pulling transport telemetry for the cluster's two PE paths, BDN-PE01&harr;PE01 and BDN-PE02&harr;PE02</p>
                              <span>&#10003; BDN-PE02&harr;PE02 path is down; a connectivity fault dropped it and its traffic rerouted onto BDN-PE01&harr;PE01.</span>
                            </div>
                            <p>A failover on its own shouldn't hurt us, BDN-PE01&harr;PE01 is a two-link bundle, so it should have the headroom to absorb the rerouted traffic. The fact that it isn't tells me something's wrong on that path. Let me look at the links themselves.</p>
                            <div className="gsky-investigation-card">
                              <strong><i></i> INVESTIGATING</strong>
                              <p>Checking per-link utilisation on the BDN-PE01&harr;PE01 bundle</p>
                              <span>&#10003; one member at 100% (saturated, tail-dropping), the parallel member at 0% (idle, carrying no traffic).</span>
                            </div>
                            <p>That's the anomaly. There are two links, but only one is forwarding, the second is up but completely empty. The bundle isn't load-balancing, which means this isn't a capacity problem at all; it's a configuration problem. Let me check the audit feed.</p>
                            <div className="gsky-investigation-card">
                              <strong><i></i> INVESTIGATING</strong>
                              <p>Checking the router config-audit alarms on BDN-PE01</p>
                              <span>&#10003; Config Violation Found, interface xe-0/0/1 is not a member of bundle ae1; the second link was never added to the LAG.</span>
                            </div>
                            <p>That's the root cause. The BDN-PE01&harr;PE01 bundle was only ever half-built, one member in ae1, the second left out. Under normal load the single active link coped, so the gap stayed hidden. But when the BDN-PE02&harr;PE02 path failed and its traffic rerouted here, it all piled onto that one active link and saturated it, while the idle second link sat right next to it at 0%, carrying nothing.</p>
                            <div className="gsky-scope-card deep">
                              <strong><i></i> SCOPE PINNED TO THIS CHAT</strong>
                              <dl>
                                <div><dt>FAILED PATH</dt><dd>down <span>&middot; BDN-PE02&harr;PE02</span></dd></div>
                                <div><dt>ACTIVE LINK</dt><dd>100% <span>&middot; saturated, tail-dropping</span></dd></div>
                                <div><dt>STANDBY LINK</dt><dd>0% <span>&middot; idle, not in bundle</span></dd></div>
                                <div><dt>CONFIG AUDIT</dt><dd>ae1 incomplete <span>&middot; missing xe-0/0/1</span></dd></div>
                              </dl>
                            </div>
                          </div>
                        </div>

                        {mitigationStep === 'idle' && (
                          <div className="gsky-next gsky-choice-list">
                            <strong>WHAT'S NEXT?</strong>
                            <button onClick={() => setMitigationStep('typing')}><span className="play">▶</span> <span>What's the recommended mitigation?</span></button>
                          </div>
                        )}

                        {mitigationTyping && (
                          <>
                            <div className="gsky-user-query">
                              <span>What's the recommended mitigation?</span>
                            </div>
                            <div className="gsky-chat-row gsky-typing-row">
                              <div className="gsky-grey-mark small">G<span></span></div>
                              <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                            </div>
                          </>
                        )}

                        {mitigationShown && (
                          <>
                            <div className="gsky-user-query">
                              <span>What's the recommended mitigation?</span>
                            </div>

                            <div className="gsky-chat-row gsky-response-row">
                              <div className="gsky-grey-mark small">G<span></span></div>
                              <div className="gsky-response-copy gsky-staged-flow gsky-mitigation-flow">
                                <p>The second link is healthy and already up, let me check the bandwidth on both links against the current traffic load.</p>
                                <div className="gsky-investigation-card">
                                  <strong><i></i> INVESTIGATING</strong>
                                  <p>Checking link capacity and current traffic on the BDN-PE01&harr;PE01 bundle</p>
                                  <span>&#10003; Current traffic: 12 Gbps &middot; Active link: 10 Gbps (saturated) &middot; xe-0/0/1: 10 Gbps (idle) &middot; Combined: 20 Gbps.</span>
                                </div>
                                <p>The math is clear, the active link is pegged at its 10 Gbps ceiling while 12 Gbps is trying to cross it alone, so it's tail-dropping the excess. Adding xe-0/0/1 brings the bundle to 20 Gbps total, comfortably above the current load. One config push to BDN-PE01 is all it takes.</p>
                                <div className="gsky-scope-card mitigation-time">
                                  <strong><i></i> SCOPE PINNED TO THIS CHAT</strong>
                                  <dl>
                                    <div><dt>ESTIMATED RESTORATION TIME</dt><dd>within 4 polling cycles <span>&middot; ~1 hour</span></dd></div>
                                  </dl>
                                </div>
                                <p>This is a self-healing change, reversible, scoped to a single interface, and it addresses the actual cause rather than working around it. Approve and I'll push it.</p>
                              </div>
                            </div>
                          </>
                        )}

                        {rootCauseStep === 'idle' && mitigationShown && (
                          <div className="gsky-next gsky-choice-list">
                            <strong>WHAT'S NEXT?</strong>
                            <button onClick={() => setRootCauseStep('typing')}><span className="play">&#10022;</span> <span>Walk me through the root cause.</span></button>
                          </div>
                        )}

                        {rootCauseTyping && (
                          <>
                            <div className="gsky-user-query">
                              <span>Walk me through the root cause.</span>
                            </div>
                            <div className="gsky-chat-row gsky-typing-row">
                              <div className="gsky-grey-mark small">G<span></span></div>
                              <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                            </div>
                          </>
                        )}

                        {rootCauseShown && (
                          <>
                            <div className="gsky-user-query">
                              <span>Walk me through the root cause.</span>
                            </div>

                            <div className="gsky-chat-row gsky-response-row">
                              <div className="gsky-grey-mark small">G<span></span></div>
                              <div className="gsky-response-copy gsky-staged-flow gsky-root-flow">
                                <div className="gsky-status-card neutral">
                                  <strong><i></i> Incident complete &middot; post-mortem ready</strong>
                                  <span>Root cause traced to incomplete LAG bundle on BDN-PE01</span>
                                </div>
                                <p>I traced this live during the incident, but let me confirm the chain end-to-end and write it up for ops.</p>
                                <div className="gsky-investigation-card">
                                  <strong><i></i> INVESTIGATING</strong>
                                  <p>Confirming the trigger and sequence from the transport event log</p>
                                  <span>&#10003; connectivity fault on the BDN-PE02&harr;PE02 path, traffic auto-rerouted onto BDN-PE01&harr;PE01.</span>
                                </div>
                                <div className="gsky-investigation-card">
                                  <strong><i></i> INVESTIGATING</strong>
                                  <p>Confirming the latent fault, bundle membership and config-audit history on BDN-PE01</p>
                                  <span>&#10003; ae1 carried a single member; config-audit flagged xe-0/0/1 missing from the bundle, but the alarm stayed advisory.</span>
                                </div>
                                <p>That closes it. The failover was routine and survivable, what turned it into an incident was a latent misconfiguration that had been quietly sitting in the audit feed, flagged but never acted on.</p>
                                <div className="gsky-root-card">
                                  <h4>ROOT-CAUSE ANALYSIS</h4>
                                  <strong>Incomplete LAG bundle on BDN-PE01 forced a routine failover onto a single link</strong>
                                  <p>BDN-PE01 active-link utilisation &middot; incident window: <b>58% &rarr; 100%</b> <em>+42%</em></p>
                                  <ul>
                                    <li><b>Latent fault:</b> interface <code>xe-0/0/1</code> was never added to bundle ae1 on BDN-PE01; config-audit flagged it but left it advisory.</li>
                                    <li><b>Trigger:</b> connectivity fault on BDN-PE02&harr;PE02 rerouted that path's traffic onto BDN-PE01&harr;PE01.</li>
                                    <li><b>Manifestation:</b> with only one bundle member active, all rerouted traffic piled onto a single link, causing 100% saturation and tail-drop while the idle second link stayed at 0%.</li>
                                  </ul>
                                </div>
                                <p>Now that the chain is confirmed, let me put it on paper so it's ready for ops.</p>
                                <div className="gsky-investigation-card compiling">
                                  <strong><i></i> COMPILING REPORT</strong>
                                  <p>Assembling the post-incident report v1 from the timeline, root-cause chain and remediation record</p>
                                  <span>&#10003; Draft ready for your review.</span>
                                </div>
                                <div className="gsky-report-card">
                                  <header><strong>POST-INCIDENT REPORT &middot; V1 (DRAFT)</strong><b>DRAFT</b></header>
                                  <section>
                                    <h3>Trafford 5G RAN &middot; transport self-heal</h3>
                                    <dl>
                                      <div><dt>AUTHOR</dt><dd>Grey (AI Supervisor)</dd></div>
                                      <div><dt>REVIEWER</dt><dd>Adam &middot; pending</dd></div>
                                      <div><dt>SEVERITY</dt><dd>S2 &middot; averted</dd></div>
                                    </dl>
                                  </section>
                                  <section>
                                    <h4>SUMMARY</h4>
                                    <p>Predictive detection caught a transport-driven degradation ahead of SLA breach. A connectivity fault failed the BDN-PE02&harr;PE02 path over onto BDN-PE01&harr;PE01, where an incomplete LAG bundle forced all traffic onto a single link. A self-healing config push restored load-balancing across both links and held throughput within SLA across all 28 sites.</p>
                                    <h4>TIMELINE</h4>
                                    <p>Path failover, detection, cause isolation, config push, validation, and confirmation completed.</p>
                                    <h4>ROOT CAUSE</h4>
                                    <p>Interface xe-0/0/1 was never added to LAG bundle ae1 on BDN-PE01; config-audit alarm raised but left advisory. The BDN-PE02&harr;PE02 failover exposed it by routing full load onto the single active member.</p>
                                    <h4>RECOMMENDATION</h4>
                                    <p>Make the bundle fix permanent in the golden config; promote LAG-completeness config-audit from advisory to auto-remediate across the region's PE bundles.</p>
                                    <h4>CITED</h4>
                                    <p>BDN-PE01 &middot; ae1 &middot; xe-0/0/1 &middot; BDN-PE02&harr;PE02 path</p>
                                  </section>
                                </div>
                                <p>This is a first draft, want me to send it to ops as-is, or edit before sending?</p>
                              </div>
                            </div>

                            {strategyStep === 'idle' && (
                              <div className="gsky-next gsky-choice-list">
                                <strong>WHAT'S NEXT?</strong>
                                <button onClick={() => setStrategyStep('typing')}><span className="play">&#10022;</span> <span>Any strategic recommendation?</span></button>
                              </div>
                            )}

                            {strategyTyping && (
                              <>
                                <div className="gsky-user-query">
                                  <span>Any strategic recommendation?</span>
                                </div>
                                <div className="gsky-chat-row gsky-typing-row">
                                  <div className="gsky-grey-mark small">G<span></span></div>
                                  <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                                </div>
                              </>
                            )}

                            {strategyShown && (
                              <>
                                <div className="gsky-user-query">
                                  <span>Any strategic recommendation?</span>
                                </div>

                                <div className="gsky-chat-row gsky-response-row">
                                  <div className="gsky-grey-mark small">G<span></span></div>
                                  <div className="gsky-response-copy gsky-staged-flow gsky-strategy-flow">
                                    <p>Yes, and the lesson here isn't about today's failover, it's about why a routine event was allowed to hurt us at all.</p>
                                    <div className="gsky-investigation-card">
                                      <strong><i></i> INVESTIGATING</strong>
                                      <p>Assessing config-audit coverage across the region's PE bundles</p>
                                      <span>&#10003; The config-audit can already spot these incomplete bundles, it had BDN-PE01's gap on file, but spotting isn't fixing, so it sat exposed. And it's systemic: a region-wide sweep turns up 2 other PE bundles carrying the exact same gap.</span>
                                    </div>
                                    <p>The failover was survivable by design, a second path, a second link. It only became an incident because that latent gap had quietly halved our capacity right when we leaned on it. Today's fix is one router; the real win is removing this whole class of hidden single-link failures across the region.</p>
                                    <div className="gsky-strategy-card">
                                      <h4>STRATEGIC RECOMMENDATION</h4>
                                      <strong>Close the config-audit gap across the region's PE bundles</strong>
                                      <p>Strategic &middot; low-effort &middot; removes a whole class of latent single-link failures</p>
                                      <div className="gsky-strategy-action"><b>1</b><span><strong>CONFIG</strong>Commit today's bundle fix on BDN-PE01 into the golden config so it survives any reload</span></div>
                                      <div className="gsky-strategy-action"><b>2</b><span><strong>ASSURANCE</strong>Promote LAG-completeness config-audit from advisory to auto-remediate across all PE bundles in the region</span></div>
                                      <div className="gsky-strategy-action"><b>3</b><span><strong>DETECTION</strong>Promote this predictive model from advisory to auto-mitigate for this cluster</span></div>
                                    </div>
                                    <ul className="gsky-strategy-notes">
                                      <li><b>Action 1</b> makes today's live fix permanent.</li>
                                      <li><b>Action 2</b> is the high-leverage one, auto-remediating LAG-completeness audits would have caught BDN-PE01 and the two others I just found before any failover could expose them.</li>
                                      <li><b>Action 3</b> lets the model catch and clear this failure mode inside the lead-time window next time, since it just demonstrated it can.</li>
                                    </ul>
                                  </div>
                                </div>

                                {etaStep === 'idle' && (
                                  <div className="gsky-next gsky-choice-list">
                                    <strong>WHAT'S NEXT?</strong>
                                    <button onClick={() => setEtaStep('typing')}><span className="play">&#9654;</span> <span>What is the ETA for Restoration?</span></button>
                                  </div>
                                )}

                                {etaTyping && (
                                  <>
                                    <div className="gsky-user-query">
                                      <span>What is the ETA for Restoration?</span>
                                    </div>
                                    <div className="gsky-chat-row gsky-typing-row">
                                      <div className="gsky-grey-mark small">G<span></span></div>
                                      <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                                    </div>
                                  </>
                                )}

                                {etaShown && (
                                  <>
                                    <div className="gsky-user-query">
                                      <span>What is the ETA for Restoration?</span>
                                    </div>
                                    <div className="gsky-chat-row gsky-response-row">
                                      <div className="gsky-grey-mark small">G<span></span></div>
                                      <div className="gsky-response-copy">
                                        <div className="gsky-eta-card">
                                          <strong>ISSUE INVESTIGATED</strong>
                                          <b>ETA is 1 hour</b>
                                          <span>Information shared with <button type="button" onClick={onOpenCircles}>Nova Agent</button></span>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}

                              </>
                            )}
                          </>
                        )}

                        {finalPrompt && (
                          <>
                            <div className="gsky-user-query">
                              <span>{finalPrompt}</span>
                            </div>
                            {finalTyping && (
                              <div className="gsky-chat-row gsky-typing-row">
                                <div className="gsky-grey-mark small">G<span></span></div>
                                <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is typing...</em></div>
                              </div>
                            )}
                            {finalShown && (
                              <div className="gsky-chat-row gsky-response-row">
                                <div className="gsky-grey-mark small">G<span></span></div>
                                <div className="gsky-response-copy">
                                  <div className="gsky-final-card">
                                    <strong>Sure thing.</strong>
                                    <p>Have a nice day!</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        ) : quickStep !== 'idle' ? (
          <div className="gsky-status-thread">
            <div className="gsky-user-query">
              <span>Quick status on the Trafford cluster?</span>
            </div>

            {quickTyping ? (
              <div className="gsky-chat-row gsky-typing-row">
                <div className="gsky-grey-mark small">G<span></span></div>
                <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
              </div>
            ) : quickShown ? (
              <>
            <div className="gsky-chat-row gsky-response-row">
              <div className="gsky-grey-mark small">G<span></span></div>
              <div className="gsky-response-copy">
                <div className="gsky-status-card ok">
                  <strong><i></i> All systems nominal</strong>
                  <span>Trafford 5G RAN · 28 sites · within SLA</span>
                </div>
                <p>Everything looks normal in Trafford, no anomalies, no incidents detected.</p>
              </div>
            </div>

            {quickRiskTyping && (
              <div className="gsky-chat-row gsky-typing-row">
                <div className="gsky-grey-mark small">G<span></span></div>
                <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
              </div>
            )}

            {quickRiskShown && (
              <>
            <div className="gsky-chat-row gsky-response-row">
              <div className="gsky-grey-mark small">G<span></span></div>
              <div className="gsky-response-copy">
                <div className="gsky-status-card warn">
                  <strong><i></i> Pre-SLA risk window opening</strong>
                  <span>Trafford 5G RAN · 28 sites</span>
                </div>
                <p>Adam, my anomaly detector just tripped on the Trafford cluster. Want me to confirm whether it's real before we act on it?</p>
              </div>
            </div>

            {greyStep === 'start' && (
              <div className="gsky-next">
                <strong>WHAT'S NEXT?</strong>
                <button onClick={() => setGreyStep('investigating')}><span className="play">▶</span> <span>Confirm the anomaly</span></button>
              </div>
            )}

            {['investigating', 'confirmed', 'earlyTyping', 'early'].includes(greyStep) && (
              <>
                <div className="gsky-user-query">
                  <span>Confirm the anomaly</span>
                </div>

                {greyStep === 'investigating' && (
                  <div className="gsky-chat-row gsky-typing-row">
                    <div className="gsky-grey-mark small">G<span></span></div>
                    <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                  </div>
                )}

                {['confirmed', 'earlyTyping', 'early'].includes(greyStep) && (
                  <>
                <div className="gsky-chat-row gsky-response-row">
                  <div className="gsky-grey-mark small">G<span></span></div>
                  <div className="gsky-response-copy">
                    <p>On it, checking the anomaly detection module now.</p>
                    <div className="gsky-investigation-card">
                      <strong><i></i> INVESTIGATING</strong>
                      <p>Checking the anomaly detection module for packet loss, RAN RTT and DL throughput across these target sites</p>
                      <span>✓ Anomaly check complete.</span>
                    </div>
                  </div>
                </div>

                <div className="gsky-chat-row gsky-response-row">
                  <div className="gsky-grey-mark small">G<span></span></div>
                  <div className="gsky-response-copy">
                    <p>Confirmed, this isn't a transient. I waited two polling cycles to be sure, and loss, latency, and throughput are all moving together, which rules out a single-cell artifact. We're still inside SLA, so these anomalies register as MEDIUM severity right now, but the trajectory makes it highly likely to propagate into a real breach. Surfacing it now while there's lead time to act.</p>
                    <div className="gsky-scope-card">
                      <strong><i></i> SCOPE PINNED TO THIS CHAT</strong>
                      <dl>
                        <div><dt>SCENARIO</dt><dd>Predictive Risk Detection</dd></div>
                        <div><dt>CLUSTER</dt><dd>Trafford 5G RAN <span>· 28 sites</span></dd></div>
                        <div><dt>STATUS</dt><dd>Within SLA <span>· trending down</span></dd></div>
                      </dl>
                    </div>
                  </div>
                </div>

                {greyStep === 'confirmed' && scopeStep === 'idle' && trackingStep === 'idle' && (
                  <div className="gsky-next gsky-choice-list">
                    <strong>WHAT'S NEXT?</strong>
                    <button onClick={() => setGreyStep('earlyTyping')}><span className="play">◌</span> <span>How early are we?</span></button>
                    <button onClick={() => setScopeStep('typing')}><span className="play">✦</span> <span>What's the scope?</span></button>
                    <button onClick={() => setTrackingStep('typing')}><span className="play">◎</span> <span>Keep tracking, alert me if it deteriorates</span></button>
                  </div>
                )}

                {greyStep === 'earlyTyping' && (
                  <>
                    <div className="gsky-user-query">
                      <span>How early are we?</span>
                    </div>
                    <div className="gsky-chat-row gsky-typing-row">
                      <div className="gsky-grey-mark small">G<span></span></div>
                      <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                    </div>
                  </>
                )}

                {greyStep === 'early' && (
                  <>
                    <div className="gsky-user-query">
                      <span>How early are we?</span>
                    </div>

                    <div className="gsky-chat-row gsky-response-row">
                      <div className="gsky-grey-mark small">G<span></span></div>
                      <div className="gsky-response-copy">
                        <p>SLA is not breached yet, but the trend is concerning. I'll keep you updated if things get worse.</p>
                      </div>
                    </div>

                    {scopeStep === 'idle' && trackingStep === 'idle' && (
                    <div className="gsky-next gsky-choice-list">
                      <strong>WHAT'S NEXT?</strong>
                      <button onClick={() => setScopeStep('typing')}><span className="play">✦</span> <span>What's the scope?</span></button>
                      <button onClick={() => setTrackingStep('typing')}><span className="play">◎</span> <span>Keep tracking, alert me if it deteriorates</span></button>
                    </div>
                    )}
                  </>
                )}

                {scopeTyping && (
                  <>
                    <div className="gsky-user-query">
                      <span>What's the scope?</span>
                    </div>
                    <div className="gsky-chat-row gsky-typing-row">
                      <div className="gsky-grey-mark small">G<span></span></div>
                      <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                    </div>
                  </>
                )}

                {scopeShown && (
                  <>
                    <div className="gsky-user-query">
                      <span>What's the scope?</span>
                    </div>

                    <div className="gsky-chat-row gsky-response-row">
                      <div className="gsky-grey-mark small">G<span></span></div>
                      <div className="gsky-response-copy">
                        <p>Let me check the subscriber analytics module.</p>
                        <div className="gsky-investigation-card">
                          <strong><i></i> INVESTIGATING</strong>
                          <p>Querying real-time subscriber transaction metadata across all 28 sites</p>
                          <span>✓ ~12,000 active subscribers in scope; early degradation confirmed.</span>
                        </div>
                      </div>
                    </div>

                    <div className="gsky-chat-row gsky-response-row gsky-continuation-row gsky-row-delay-card">
                      <div className="gsky-response-copy">
                        <p>Roughly 12,000 subscribers are currently active across the cluster. Transaction data is already showing early impact, subscriber RTT is starting to rise.</p>
                        <div className="gsky-subscriber-card">
                          <div className="gsky-subscriber-total"><strong>~12,000</strong><span>active subscribers</span></div>
                          <p>early degradation confirmed · subscriber RTT rising</p>
                          <dl>
                            <div><dt>SITES IN SCOPE</dt><dd>28</dd></div>
                            <div><dt>ACTIVE SUBSCRIBERS</dt><dd>~12,000</dd></div>
                            <div><dt>EARLY DEGRADATION</dt><dd>Confirmed · RTT rising</dd></div>
                          </dl>
                        </div>
                      </div>
                    </div>

                    {trackingStep === 'idle' && (
                    <div className="gsky-next gsky-choice-list">
                      <strong>WHAT'S NEXT?</strong>
                      <button onClick={() => setTrackingStep('typing')}><span className="play">◎</span> <span>Keep tracking, alert me if it deteriorates</span></button>
                    </div>
                    )}
                  </>
                )}

                {trackingTyping && (
                  <>
                    <div className="gsky-user-query">
                      <span>Keep tracking, alert me if it deteriorates</span>
                    </div>
                    <div className="gsky-chat-row gsky-typing-row">
                      <div className="gsky-grey-mark small">G<span></span></div>
                      <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                    </div>
                  </>
                )}

                {trackingShown && (
                  <>
                    <div className="gsky-user-query">
                      <span>Keep tracking, alert me if it deteriorates</span>
                    </div>

                    <div className="gsky-chat-row gsky-response-row">
                      <div className="gsky-grey-mark small">G<span></span></div>
                      <div className="gsky-response-copy">
                        <p>Understood.</p>
                        <div className="gsky-investigation-card monitor">
                          <strong><i></i> ARMING MONITOR</strong>
                          <p>Arming the predictive monitor and escalation triggers on the Trafford cluster</p>
                          <span>✓ Monitor activated.</span>
                        </div>
                        <p>I'll alert you if anything changes.</p>
                        <div className="gsky-monitor-card">
                          <div className="gsky-monitor-line"><b></b><span></span><span></span></div>
                          <div className="gsky-monitor-labels"><strong>MONITORING</strong><strong>TRANSPORT</strong><strong>MITIGATION</strong><em>CORRELATION</em></div>
                        </div>
                      </div>
                    </div>

                    {trackingAlertTyping && (
                      <div className="gsky-chat-row gsky-typing-row">
                        <div className="gsky-grey-mark small">G<span></span></div>
                        <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                      </div>
                    )}

                    {trackingAlertShown && (
                      <>
                    <div className="gsky-chat-row gsky-response-row">
                      <div className="gsky-grey-mark small">G<span></span></div>
                      <div className="gsky-response-copy">
                        <div className="gsky-alert-card">
                          <strong><i></i> Trajectory worsening, projecting 55-60% throughput drop in 30 min</strong>
                          <span>Initial localization · link failure at an aggregation site</span>
                        </div>
                        <p>Adam, the trajectory just steepened past my confidence band. My initial root-cause localization points to a link failure at one of the aggregation sites, on the transport side rather than the radio, but a single link going down shouldn't be hitting the cluster this hard. Want me to start a deep investigation and trace exactly why it's dragging the wider network down with it?</p>
                      </div>
                    </div>

                    {deepStep === 'idle' && (
                    <div className="gsky-next gsky-choice-list">
                      <strong>WHAT'S NEXT?</strong>
                      <button onClick={() => setDeepStep('typing')}><span className="play">▶</span> <span>Start the deep investigation</span></button>
                    </div>
                    )}

                    {deepStep !== 'idle' && (
                      <>
                        <div className="gsky-user-query">
                          <span>Start the deep investigation</span>
                        </div>

                        {deepStep === 'typing' && (
                          <div className="gsky-chat-row gsky-typing-row">
                            <div className="gsky-grey-mark small">G<span></span></div>
                            <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                          </div>
                        )}

                        {deepStep === 'done' && (
                          <>
                            <div className="gsky-chat-row gsky-response-row">
                              <div className="gsky-grey-mark small">G<span></span></div>
                              <div className="gsky-response-copy gsky-staged-flow gsky-deep-flow">
                                <p>On it, tracing it back through the transport layer now.</p>
                                <div className="gsky-investigation-card">
                                  <strong><i></i> INVESTIGATING</strong>
                                  <p>Pulling transport telemetry for the cluster's two PE paths, BDN-PE01↔PE01 and BDN-PE02↔PE02</p>
                                  <span>✓ BDN-PE02↔PE02 path is down; a connectivity fault dropped it and its traffic rerouted onto BDN-PE01↔PE01.</span>
                                </div>
                                <p>A failover on its own shouldn't hurt us, BDN-PE01↔PE01 is a two-link bundle, so it should have the headroom to absorb the rerouted traffic. The fact that it isn't tells me something's wrong on that path. Let me look at the links themselves.</p>
                                <div className="gsky-investigation-card">
                                  <strong><i></i> INVESTIGATING</strong>
                                  <p>Checking per-link utilisation on the BDN-PE01↔PE01 bundle</p>
                                  <span>✓ one member at 100% (saturated, tail-dropping), the parallel member at 0% (idle, carrying no traffic).</span>
                                </div>
                                <p>That's the anomaly. There are two links, but only one is forwarding, the second is up but completely empty. The bundle isn't load-balancing, which means this isn't a capacity problem at all; it's a configuration problem. Let me check the audit feed.</p>
                                <div className="gsky-investigation-card">
                                  <strong><i></i> INVESTIGATING</strong>
                                  <p>Checking the router config-audit alarms on BDN-PE01</p>
                                  <span>✓ Config Violation Found, interface xe-0/0/1 is not a member of bundle ae1; the second link was never added to the LAG.</span>
                                </div>
                                <p>That's the root cause. The BDN-PE01↔PE01 bundle was only ever half-built, one member in ae1, the second left out. Under normal load the single active link coped, so the gap stayed hidden. But when the BDN-PE02↔PE02 path failed and its traffic rerouted here, it all piled onto that one active link and saturated it, while the idle second link sat right next to it at 0%, carrying nothing.</p>
                                <div className="gsky-scope-card deep">
                                  <strong><i></i> SCOPE PINNED TO THIS CHAT</strong>
                                  <dl>
                                    <div><dt>FAILED PATH</dt><dd>down <span>· BDN-PE02↔PE02</span></dd></div>
                                    <div><dt>ACTIVE LINK</dt><dd>100% <span>· saturated, tail-dropping</span></dd></div>
                                    <div><dt>STANDBY LINK</dt><dd>0% <span>· idle, not in bundle</span></dd></div>
                                    <div><dt>CONFIG AUDIT</dt><dd>ae1 incomplete <span>· missing xe-0/0/1</span></dd></div>
                                  </dl>
                                </div>
                              </div>
                            </div>

                            {mitigationStep === 'idle' && (
                            <div className="gsky-next gsky-choice-list">
                              <strong>WHAT'S NEXT?</strong>
                              <button onClick={() => setMitigationStep('typing')}><span className="play">▶</span> <span>What's the recommended mitigation?</span></button>
                            </div>
                            )}

                            {mitigationTyping && (
                              <>
                                <div className="gsky-user-query">
                                  <span>What's the recommended mitigation?</span>
                                </div>
                                <div className="gsky-chat-row gsky-typing-row">
                                  <div className="gsky-grey-mark small">G<span></span></div>
                                  <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                                </div>
                              </>
                            )}

                            {mitigationShown && (
                              <>
                                <div className="gsky-user-query">
                                  <span>What's the recommended mitigation?</span>
                                </div>

                                <div className="gsky-chat-row gsky-response-row">
                                  <div className="gsky-grey-mark small">G<span></span></div>
                                  <div className="gsky-response-copy gsky-staged-flow gsky-mitigation-flow">
                                    <p>The second link is healthy and already up, let me check the bandwidth on both links against the current traffic load.</p>
                                    <div className="gsky-investigation-card">
                                      <strong><i></i> INVESTIGATING</strong>
                                      <p>Checking link capacity and current traffic on the BDN-PE01↔PE01 bundle</p>
                                      <span>✓ Current traffic: 12 Gbps · Active link: 10 Gbps (saturated) · xe-0/0/1: 10 Gbps (idle) · Combined: 20 Gbps.</span>
                                    </div>
                                    <p>The math is clear, the active link is pegged at its 10 Gbps ceiling while 12 Gbps is trying to cross it alone, so it's tail-dropping the excess. Adding xe-0/0/1 brings the bundle to 20 Gbps total, comfortably above the current load. One config push to BDN-PE01 is all it takes.</p>
                                    <div className="gsky-scope-card mitigation-time">
                                      <strong><i></i> SCOPE PINNED TO THIS CHAT</strong>
                                      <dl>
                                        <div><dt>ESTIMATED RESTORATION TIME</dt><dd>within 4 polling cycles <span>· ~1 hour</span></dd></div>
                                      </dl>
                                    </div>
                                    <p>This is a self-healing change, reversible, scoped to a single interface, and it addresses the actual cause rather than working around it. Approve and I'll push it.</p>
                                    <div className="gsky-mitigation-card">
                                      <h4>RECOMMENDED MITIGATION</h4>
                                      <strong>Self-healing config correction, 1 action</strong>
                                      <p>Approval required · reversible · scoped to one interface on one router</p>
                                      <div className="gsky-action-card">
                                        <b>1</b>
                                        <span><strong>TRANSPORT · CONFIG</strong>Add interface xe-0/0/1 to LAG bundle ae1 on BDN-PE01, restoring load-balancing across both links to PE01</span>
                                      </div>
                                      {mitigationApproved ? (
                                        <div className="gsky-approved-state"><b>✓</b> Approved <span>·</span> executing</div>
                                      ) : (
                                        <div className="gsky-mitigation-actions">
                                          <button>Decline</button>
                                          <button onClick={() => setApprovalStep('typing')}>✓ Approve & execute</button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {approvalTyping && (
                                  <div className="gsky-chat-row gsky-typing-row">
                                    <div className="gsky-grey-mark small">G<span></span></div>
                                    <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                                  </div>
                                )}

                                {approvalDone && (
                                  <>
                                    <div className="gsky-chat-row gsky-response-row gsky-row-delay-execute">
                                      <div className="gsky-grey-mark small">G<span></span></div>
                                      <div className="gsky-response-copy gsky-staged-flow gsky-execute-flow">
                                        <p>Approved, pushing the config now, with validation at each step. If the member doesn't come up clean I roll it back rather than leave the bundle in a half-changed state.</p>
                                        <div className="gsky-execution-card executing">
                                          <header><strong><i></i> Executing optimisation</strong><span>stabilised in under 2 min</span></header>
                                          <ul>
                                            <li className="done"><b>✓</b><span><strong>Pushing LAG config to BDN-PE01</strong><em>add xe-0/0/1 → ae1</em></span><small>DONE</small></li>
                                            <li className="running"><b></b><span><strong>LACP negotiation</strong><em>second member up, in bundle</em></span><small>RUNNING...</small></li>
                                            <li className="queued"><b></b><span><strong>Validating load distribution</strong><em>traffic balancing ~50/50</em></span><small>QUEUED</small></li>
                                          </ul>
                                        </div>
                                        <p>Config committed and the second link is now carrying its share. The saturated link is already shedding load. I won't call this resolved until the metrics respond, so I'm holding the validation watch open.</p>
                                      </div>
                                    </div>

                                    <div className="gsky-chat-row gsky-response-row gsky-row-delay-recovery">
                                      <div className="gsky-grey-mark small">G<span></span></div>
                                      <div className="gsky-response-copy gsky-staged-flow gsky-recovery-flow">
                                        <div className="gsky-status-card ok">
                                          <strong><i></i> Bundle balanced, peak coming back within SLA</strong>
                                          <span>Early validation across 28 sites</span>
                                        </div>
                                        <p>The intervention is taking. Let me put numbers on the recovery.</p>
                                        <div className="gsky-investigation-card">
                                          <strong><i></i> INVESTIGATING</strong>
                                          <p>Sampling the recovery, per-link utilisation on the BDN-PE01↔PE01 bundle, plus cluster throughput.</p>
                                          <span>✓ both links balanced, throughput recovering.</span>
                                        </div>
                                        <div className="gsky-util-card down">
                                          <strong>ACTIVE LINK UTILISATION <span>100% → <b>52%</b> <em>-48%</em></span></strong>
                                          <i></i>
                                        </div>
                                        <div className="gsky-util-card up">
                                          <strong>SECOND LINK UTILISATION <span>0% → <b>48%</b> <em>+48%</em></span></strong>
                                          <i></i>
                                        </div>
                                        <p>The chain reads cleanly: the moment the second member joined the bundle, the load split across both links, the saturated link dropped from 100% to 52%, the idle link picked up the other half, and the path is no longer choked. Keeping the watch on the recovery tail to confirm it's stable.</p>
                                      </div>
                                    </div>

                                    <div className="gsky-chat-row gsky-response-row">
                                      <div className="gsky-grey-mark small">G<span></span></div>
                                      <div className="gsky-response-copy gsky-staged-flow gsky-close-flow">
                                        <div className="gsky-status-card ok">
                                          <strong><i></i> SLA restored, monitoring recovery tail</strong>
                                          <span>No active incident · bundle balanced across both links</span>
                                        </div>
                                        <p>Let me confirm the recovery tail is genuinely stable before I close this out.</p>
                                        <div className="gsky-investigation-card">
                                          <strong><i></i> INVESTIGATING</strong>
                                          <p>Checking current cluster averages against their SLA thresholds, and the bundle balance on BDN-PE01</p>
                                          <span>✓ RAN RTT and packet loss both below threshold, both links sharing load, no active breach.</span>
                                        </div>
                                        <p>The spike has fully cleared. Both members of ae1 are forwarding evenly, RTT and packet loss are comfortably below threshold, and the few degraded rows still showing are lagging samples from the recovery window, not a live breach. Closing the incident.</p>
                                        <div className="gsky-scope-card deep">
                                          <strong><i></i> SCOPE PINNED TO THIS CHAT</strong>
                                          <dl>
                                            <div><dt>INCIDENT</dt><dd>Closed <span>· no active breach</span></dd></div>
                                            <div><dt>AVG RAN RTT</dt><dd>within SLA</dd></div>
                                            <div><dt>PACKET LOSS</dt><dd>within SLA</dd></div>
                                            <div><dt>BDN-PE01 BUNDLE</dt><dd>balanced <span>· 2/2 members active</span></dd></div>
                                          </dl>
                                        </div>
                                      </div>
                                    </div>

                                    {rootCauseStep === 'idle' && (
                                    <div className="gsky-next gsky-choice-list">
                                      <strong>WHAT'S NEXT?</strong>
                                      <button onClick={() => setRootCauseStep('typing')}><span className="play">✦</span> <span>Walk me through the root cause</span></button>
                                    </div>
                                    )}

                                    {rootCauseTyping && (
                                      <>
                                        <div className="gsky-user-query">
                                          <span>Walk me through the root cause</span>
                                        </div>
                                        <div className="gsky-chat-row gsky-typing-row">
                                          <div className="gsky-grey-mark small">G<span></span></div>
                                          <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                                        </div>
                                      </>
                                    )}

                                    {rootCauseShown && (
                                      <>
                                        <div className="gsky-user-query">
                                          <span>Walk me through the root cause</span>
                                        </div>

                                        <div className="gsky-chat-row gsky-response-row">
                                          <div className="gsky-grey-mark small">G<span></span></div>
                                          <div className="gsky-response-copy gsky-staged-flow gsky-root-flow">
                                            <div className="gsky-status-card neutral">
                                              <strong><i></i> Incident complete · post-mortem ready</strong>
                                              <span>Root cause traced to incomplete LAG bundle on BDN-PE01</span>
                                            </div>
                                            <p>I traced this live during the incident, but let me confirm the chain end-to-end and write it up for ops.</p>
                                            <div className="gsky-investigation-card">
                                              <strong><i></i> INVESTIGATING</strong>
                                              <p>Confirming the trigger and sequence from the transport event log</p>
                                              <span>✓ connectivity fault on the BDN-PE02↔PE02 path, traffic auto-rerouted onto BDN-PE01↔PE01.</span>
                                            </div>
                                            <div className="gsky-investigation-card">
                                              <strong><i></i> INVESTIGATING</strong>
                                              <p>Confirming the latent fault, bundle membership and config-audit history on BDN-PE01</p>
                                              <span>✓ ae1 carried a single member; config-audit flagged xe-0/0/1 missing from the bundle, but the alarm stayed advisory.</span>
                                            </div>
                                            <p>That closes it. The failover was routine and survivable, what turned it into an incident was a latent misconfiguration that had been quietly sitting in the audit feed, flagged but never acted on.</p>
                                            <div className="gsky-root-card">
                                              <h4>ROOT-CAUSE ANALYSIS</h4>
                                              <strong>Incomplete LAG bundle on BDN-PE01 forced a routine failover onto a single link</strong>
                                              <p>The failover was routine and survivable. A latent misconfiguration, interface xe-0/0/1 never added to bundle ae1 on BDN-PE01, had quietly removed half the path's capacity. When the BDN-PE02↔PE02 path failed and rerouted onto BDN-PE01↔PE01, all traffic piled onto the single active member, saturating it while the idle second link stayed at 0%.</p>
                                              <div className="gsky-root-chart">
                                                <h5>BDN-PE01 ACTIVE-LINK UTILISATION · INCIDENT</h5>
                                                <div className="gsky-root-chart-plot">
                                                  <span>58% → <b>100%</b> <em>+42%</em></span>
                                                  <svg viewBox="0 0 360 70" preserveAspectRatio="none" aria-hidden="true">
                                                    <defs>
                                                      <linearGradient id="gsky-root-fill" x1="0" x2="0" y1="0" y2="1">
                                                        <stop offset="0%" stopColor="#dc4f48" stopOpacity=".20" />
                                                        <stop offset="100%" stopColor="#dc4f48" stopOpacity=".03" />
                                                      </linearGradient>
                                                    </defs>
                                                    <path className="gsky-root-area" d="M0 52 L34 51 L68 52 L102 50 L126 51 L150 28 L210 30 L254 36 L286 43 L326 55 L360 65 L360 70 L0 70 Z" />
                                                    <path className="gsky-root-line" d="M0 52 L34 51 L68 52 L102 50 L126 51 L150 28 L210 30 L254 36 L286 43 L326 55 L360 65" />
                                                    <circle cx="150" cy="28" r="4" />
                                                  </svg>
                                                </div>
                                              </div>
                                              <ul>
                                                <li><b>Latent fault:</b> interface <code>xe-0/0/1</code> was never added to bundle ae1 on BDN-PE01; config-audit flagged it but left it advisory.</li>
                                                <li><b>Trigger:</b> connectivity fault on BDN-PE02↔PE02 rerouted that path's traffic onto BDN-PE01↔PE01.</li>
                                                <li><b>Manifestation:</b> with only one bundle member active, all rerouted traffic piled onto a single link → 100% saturation and tail-drop, while the idle second link stayed at 0%.</li>
                                              </ul>
                                              <div className="gsky-citations"><strong>CITED</strong><span>↕ BDN-PE01 · ae1</span><span>↕ xe-0/0/1</span><span>↕ BDN-PE02↔PE02 path</span></div>
                                            </div>
                                            <p>Now that the chain is confirmed, let me put it on paper so it's ready for ops.</p>
                                            <div className="gsky-investigation-card compiling">
                                              <strong><i></i> COMPILING REPORT</strong>
                                              <p>Assembling the post-incident report v1 from the timeline, root-cause chain and remediation record</p>
                                              <span>✓ Draft ready for your review.</span>
                                            </div>
                                            <div className="gsky-report-card">
                                              <header><strong>POST-INCIDENT REPORT · V1 (DRAFT)</strong><b>DRAFT</b></header>
                                              <section>
                                                <h3>Trafford 5G RAN · transport self-heal</h3>
                                                <dl>
                                                  <div><dt>AUTHOR</dt><dd>Grey (AI Supervisor)</dd></div>
                                                  <div><dt>REVIEWER</dt><dd>Adam · pending</dd></div>
                                                  <div><dt>SEVERITY</dt><dd>S2 · averted</dd></div>
                                                </dl>
                                              </section>
                                              <section>
                                                <h4>SUMMARY</h4>
                                                <p>Predictive detection caught a transport-driven degradation ahead of SLA breach. A connectivity fault failed the BDN-PE02↔PE02 path over onto BDN-PE01↔PE01, where an incomplete LAG bundle forced all traffic onto a single link. A self-healing config push restored load-balancing across both links and held throughput within SLA across all 28 sites.</p>
                                                <h4>TIMELINE</h4>
                                                <p>Path failover, detection, cause isolation, config push, validation, and confirmation completed.</p>
                                                <h4>ROOT CAUSE</h4>
                                                <p>Interface xe-0/0/1 was never added to LAG bundle ae1 on BDN-PE01; config-audit alarm raised but left advisory. The BDN-PE02↔PE02 failover exposed it by routing full load onto the single active member.</p>
                                                <h4>RECOMMENDATION</h4>
                                                <p>Make the bundle fix permanent in the golden config; promote LAG-completeness config-audit from advisory to auto-remediate across the region's PE bundles.</p>
                                              </section>
                                              <footer><button onClick={() => setOpsStep('typing')} disabled={opsStep !== 'idle'}>↗ Send to ops</button><button disabled={opsStep !== 'idle'}>✎ Edit before sending</button></footer>
                                            </div>
                                            <p>This is a first draft, want me to send it to ops as-is, or edit before sending?</p>
                                          </div>
                                        </div>

                                        {opsTyping && (
                                          <div className="gsky-chat-row gsky-typing-row">
                                            <div className="gsky-grey-mark small">G<span></span></div>
                                            <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                                          </div>
                                        )}

                                        {opsSent && (
                                          <>
                                            <div className="gsky-chat-row gsky-response-row">
                                              <div className="gsky-grey-mark small">G<span></span></div>
                                              <div className="gsky-response-copy">
                                                <p>On it.</p>
                                                <div className="gsky-investigation-card sending">
                                                  <strong><i></i> SENDING</strong>
                                                  <p>Filing the post-incident report v1 with ops and attaching the evidence, transport event log, config-audit history, per-link utilisation and the remediation record</p>
                                                  <span>✓ Sent, logged to the ops incident record, distribution confirmed.</span>
                                                </div>
                                                <p>The report's filed with ops and the full evidence trail is attached to the incident record, so it's there for review. Incident's formally closed out on our side.</p>
                                              </div>
                                            </div>

                                            {strategyStep === 'idle' && (
                                            <div className="gsky-next gsky-choice-list">
                                              <strong>WHAT'S NEXT?</strong>
                                              <button onClick={() => setStrategyStep('typing')}><span className="play">✦</span> <span>Any strategic recommendation?</span></button>
                                            </div>
                                            )}

                                            {strategyTyping && (
                                              <>
                                                <div className="gsky-user-query">
                                                  <span>Any strategic recommendation?</span>
                                                </div>
                                                <div className="gsky-chat-row gsky-typing-row">
                                                  <div className="gsky-grey-mark small">G<span></span></div>
                                                  <div className="gsky-typing-pill"><b></b><b></b><b></b><em>Grey is investigating...</em></div>
                                                </div>
                                              </>
                                            )}

                                            {strategyShown && (
                                              <>
                                                <div className="gsky-user-query">
                                                  <span>Any strategic recommendation?</span>
                                                </div>

                                                <div className="gsky-chat-row gsky-response-row">
                                                  <div className="gsky-grey-mark small">G<span></span></div>
                                                  <div className="gsky-response-copy">
                                                    <p>Yes, and the lesson here isn't about today's failover, it's about why a routine event was allowed to hurt us at all.</p>
                                                    <div className="gsky-investigation-card">
                                                      <strong><i></i> INVESTIGATING</strong>
                                                      <p>Assessing config-audit coverage across the region's PE bundles</p>
                                                      <span>✓ The config-audit can already spot these incomplete bundles, it had BDN-PE01's gap on file, but spotting isn't fixing, so it sat exposed. And it's systemic: a region-wide sweep turns up 2 other PE bundles carrying the exact same gap.</span>
                                                    </div>
                                                    <p>The failover was survivable by design, a second path, a second link. It only became an incident because that latent gap had quietly halved our capacity right when we leaned on it. Today's fix is one router; the real win is removing this whole class of hidden single-link failures across the region.</p>
                                                    <div className="gsky-strategy-card">
                                                      <h4>STRATEGIC RECOMMENDATION</h4>
                                                      <strong>Close the config-audit gap across the region's PE bundles</strong>
                                                      <p>Strategic · low-effort · removes a whole class of latent single-link failures</p>
                                                      <div className="gsky-strategy-action"><b>1</b><span><strong>CONFIG</strong>Commit today's bundle fix on BDN-PE01 into the golden config so it survives any reload</span></div>
                                                      <div className="gsky-strategy-action"><b>2</b><span><strong>ASSURANCE</strong>Promote LAG-completeness config-audit from advisory to auto-remediate across all PE bundles in the region</span></div>
                                                      <div className="gsky-strategy-action"><b>3</b><span><strong>DETECTION</strong>Promote this predictive model from advisory to auto-mitigate for this cluster</span></div>
                                                    </div>
                                                    <ul className="gsky-strategy-notes">
                                                      <li><b>Action 1</b> makes today's live fix permanent.</li>
                                                      <li><b>Action 2</b> is the high-leverage one, auto-remediating LAG-completeness audits would have caught BDN-PE01 (and the two others I just found) before any failover could expose them.</li>
                                                      <li><b>Action 3</b> lets the model catch and clear this failure mode inside the lead-time window next time, since it just demonstrated it can.</li>
                                                    </ul>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                      </>
                    )}
                  </>
                )}
                  </>
                )}
              </>
            )}
              </>
            )}
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <footer className="gsky-copilot-foot">
        <div className="gsky-tags">
          <span><b>SCENARIO</b> Predictive Risk <i>×</i></span>
          <span><b>CLUSTER</b> Trafford 5G RAN <i>×</i></span>
        </div>
        <button className="gsky-context">+ context</button>
        <textarea
          className="gsky-reply"
          placeholder="Reply to Grey..."
          value={replyText}
          onChange={(event) => setReplyText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              handleReplySend()
            }
          }}
        />
        <div className="gsky-compose">
          <span>⌕ snapshot</span>
          <span><b>/</b> commands</span>
          <span><b>@</b> site</span>
          <span><b>↵</b> send</span>
          <button className="gsky-send-btn" type="button" aria-label="Send" disabled={!canSendReply} onClick={handleReplySend}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9"></polygon>
            </svg>
          </button>
        </div>
      </footer>
    </section>
  )
}

export default function GreySkiesInline({ onOpenCircles }) {
  const [greyOpen, setGreyOpen] = useState(false)
  const railIcons = [
    <svg viewBox="0 0 24 24"><path d="M4 14a8 8 0 1116 0" /><path d="M6 14h12" /><path d="M8 14a4 4 0 018 0" /><path d="M12 14l3-5" /><path d="M12 18h.01" /></svg>,
    <svg viewBox="0 0 24 24"><path d="M4 19V5" /><path d="M4 19h16" /><path d="M7 15l4-4 3 3 5-7" /><path d="M10 11h.01M14 14h.01M19 7h.01" /></svg>,
    <svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="9" ry="4" /><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" /><circle cx="12" cy="12" r="1.8" /></svg>,
    <svg viewBox="0 0 24 24"><path d="M4 8l8-4 8 4-8 4-8-4z" /><path d="M4 13l8 4 8-4" /><path d="M4 18l8 4 8-4" /></svg>,
    <svg viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z" /><path d="M15 3v4h4" /><path d="M9 17v-5" /><path d="M12 17V9" /><path d="M15 17v-3" /></svg>,
    <svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="2" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="12" r="2" /><path d="M7.7 6.2l8.6 4.6" /><path d="M7.7 17.8l8.6-4.6" /><path d="M6 7v10" /></svg>,
  ]

  return (
    <div className={`gsky-page ${greyOpen ? 'grey-open' : ''}`}>
      <aside className="gsky-rail">
        <div className="gsky-rail-active"></div>
        {railIcons.map((icon, index) => <button key={index}>{icon}</button>)}
      </aside>

      <main className="gsky-shell">
        <header className="gsky-top">
          <div className="gsky-brand">
            <div className="gsky-logo"><span></span><b></b><i></i></div>
            <strong>GreySkies</strong>
            <em>&middot;</em>
            <span>AI-Driven Service Assurance</span>
          </div>
          <div className="gsky-search">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="M16 16l4 4" /></svg>
            <span>Find a site, alarm or KPI...</span>
            <kbd>&#8984;K</kbd>
          </div>
          <div className="gsky-actions">
            <button aria-label="Download"><svg viewBox="0 0 24 24"><path d="M12 4v11" /><path d="M8 11l4 4 4-4" /><path d="M5 20h14" /></svg></button>
            <button aria-label="Settings"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.4 1a7 7 0 00-2-1.1L14 3h-4l-.5 2.8a7 7 0 00-2 1.1l-2.4-1-2 3.4 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.4-1a7 7 0 002 1.1L10 21h4l.5-2.8a7 7 0 002-1.1l2.4 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" /></svg></button>
            <button aria-label="Theme"><svg viewBox="0 0 24 24"><path d="M12 4a8 8 0 100 16z" /></svg></button>
            <button aria-label="Help"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M9.8 9a2.3 2.3 0 114 1.9c-1 .6-1.8 1.2-1.8 2.6" /><path d="M12 17h.01" /></svg></button>
            <b>A</b>
            <span>Adam</span>
          </div>
        </header>

        <section className="gsky-titlebar">
          <div className="gsky-title-left"><span className="gsky-window-icon"></span><strong>Access Domain QoE</strong><b>★</b><i>Auto-refresh: 30s</i></div>
          <div className="gsky-date">▣&nbsp; 08/08/25 13:00 - 08/08/25 15:30⌄</div>
          <div className="gsky-tools">↻ ♡ ⚙ ⤢</div>
        </section>

        <section className="gsky-filters">
          <span><b>INCIDENT</b> : Subscriber QoE Degradation</span>
          <span><b>AGGR. SITE</b> : MCH-TRAFFORD-BDN</span>
        </section>

        <section className="gsky-content">
          <div className="gsky-kpis">
            {kpis.map(([label, value, sub, icon, tone, unit]) => (
              <article className={`gsky-kpi ${tone}`} key={label}>
                <div className="gsky-kpi-icon"><KpiIcon type={icon} /></div>
                <div>
                  <h4>{label}</h4>
                  <strong>{value}<small>{unit ? ` ${unit}` : ''}</small></strong>
                  <p>{sub}</p>
                </div>
              </article>
            ))}
          </div>

          <section className="gsky-kpi-panel">
            <div className="gsky-panel-head">
              <strong>Service Level KPIs</strong>
              <span>☁ ⧉ ♡ ⋮ ⌃</span>
            </div>
            <div className="gsky-panels">
              <div className="gsky-left-panels">
                <article className="gsky-card">
                  <div className="gsky-card-title"><strong>Average Downlink Throughput</strong> <span>(Mbps)</span><i>expand menu</i></div>
                  <div className="gsky-card-body chart-body">
                    <ThroughputChart />
                    <div className="gsky-legend">
                      {legend.map((item, i) => <span key={item}><b className={`sw s${i}`}></b>{item}</span>)}
                    </div>
                  </div>
                </article>
                <article className="gsky-card rtt-card">
                  <div className="gsky-card-title"><strong>Average RAN RTT</strong> <span>(ms)</span><i>expand menu</i></div>
                  <div className="gsky-card-body chart-body small">
                    <MiniRttChart />
                    <div className="gsky-legend"><span><b className="sw s2"></b>Threshold (250ms)</span></div>
                  </div>
                </article>
              </div>
              <article className="gsky-card gsky-map-card">
                <div className="gsky-card-title"><strong>Aggregated Site Topology</strong><i>refresh menu</i></div>
                <div className="gsky-map-legend">Core &nbsp;&nbsp; Aggregation &nbsp;&nbsp; Access site &nbsp;&nbsp; LINK UTIL: <span className="ok">- &lt;40%</span> <span>- 40-60%</span> <span className="warn">- 60-80%</span> <span className="bad">- &gt;80%</span> <span className="down">--- Down</span></div>
                <Topology />
              </article>
            </div>
          </section>
        </section>
      </main>

      <aside className="gsky-right-rail">
        <button>62</button>
        <button className="gsky-grey-tab" onClick={() => setGreyOpen((open) => !open)} aria-label="Open Grey workspace">G<span></span></button>
        <strong>G R E Y</strong>
        <i></i>
      </aside>

      {greyOpen && <GreyWorkspace onClose={() => setGreyOpen(false)} onOpenCircles={onOpenCircles} />}

      <footer className="gsky-footer">
        <span>Connected · <b>data streaming</b></span>
        <span>Copyrights © 2026 GreySkies Inc. All rights reserved.</span>
        <span>Release <b>26.2.0</b> · Build <b>#8</b></span>
      </footer>
    </div>
  )
}
