import { useEffect, useRef, useState } from 'react'

/* ── Agent icons ── */
const SOC_ICON = (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
)
const SEG_ICON = (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0 3 3 0 016 0zm-4.07 11c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
)
const ANA_ICON = (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
)
const NOTIF_ICON = (
  <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
  </svg>
)

const AGENTS = [
  { name: 'SOC Agent', label: 'pulling live KPIs from 312 affected cells...', icon: SOC_ICON },
  { name: 'Segment Agent', label: 'clustering 12000 affected subs by plan, value, geo...', icon: SEG_ICON },
  { name: 'Analytics Agent', label: 'modelling 6h revenue-at-risk + SLA + churn exposure...', icon: ANA_ICON },
]

const RESTORE_AGENTS = [
  { name: 'SOC Agent', label: 'running RCA — Metro-Ring-7 transport, splice + KPI soak...', icon: SOC_ICON },
  { name: 'Analytics Agent', label: 'benchmarking against 14 similar incidents · 82% confidence...', icon: ANA_ICON },
]

const COMMS_AGENTS = [
  { name: 'SOC Agent',          label: 'confirming degraded footprint — 312 cells, VoLTE/IMS impaired...', icon: SOC_ICON },
  { name: 'Segment Agent',      label: 'scanning 12000 affected subs · finding lifestyle clusters...', icon: SEG_ICON },
  { name: 'Segment Agent',      label: 'identified 3 segments: Creators · Travellers · Families...', icon: SEG_ICON },
  { name: 'Notification Agent', label: 'drafting per-segment SMS — tone + CTA tuned to each cluster...', icon: NOTIF_ICON },
  { name: 'Notification Agent', label: 'picking channel mix per persona (SMS-C / push / in-app)...', icon: NOTIF_ICON },
  { name: 'Notification Agent', label: 'TCPA service-message exemption + STOP list compliance check...', icon: NOTIF_ICON },
]

const COMMS_RESPONSE = {
  intro: "On it, Adam\u2014 Segment Agent split the affected base into 3 lifestyle clusters; Notification Agent then tuned a per-segment SMS for each (card below \uD83D\uDC47).",
  details: [
    { bold: 'Outage comms bundle \u2014 per-segment, please review before dispatch' },
    { html: '<strong>Recipients:</strong> 12000 subscribers across 3 segments (full breakdown below)' },
    { html: '<strong>Channel mix</strong> (designed around the VoLTE/IMS degradation):' },
    { html: '\uD83D\uDCE8 <strong>SMS via legacy SMS-C / CS fallback</strong> \u2014 bypasses degraded VoLTE bearer, <em>~99% expected delivery</em>' },
    { html: '\uD83D\uDD14 <strong>Push notification</strong> \u2014 for subs on Wi-Fi or roamed onto healthy cells, <em>~62% reachable</em>' },
    { html: '\uD83D\uDCF1 <strong>In-app banner</strong> in the CareX app \u2014 persistent, <em>100% eventual on next app open</em>' },
    { html: '<strong>Throughput:</strong> 12,000 SMS/min \u2192 full send in <strong>~15 min</strong> \u00b7 est. cost <strong>$1,289</strong>' },
    { html: '<strong>Compliance:</strong> TCPA service-message exemption \u2705 \u00b7 STOP honored \u2705 \u00b7 multilingual EN/ES' },
  ],
  totalSubs: 12000,
  clusters: [
    {
      name: 'Content creators',
      persona: 'e.g. Maya',
      pct: 30, count: 40524,
      channels: ['CREATOR-TUNED SMS', 'PUSH', 'IN-APP', 'SMS'],
      msg: "[NOVA] Heads up — your creator uploads may be slower than usual right now. We\u2019re on it. Status: nova.co/status",
      icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M18 3H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9l-4-6zm-5 13H9v-2h4v2zm3-4H6v-2h10v2zm0-4H6V6h10v2z"/><path d="M18 9l4-3v12l-4-3V9z"/></svg>,
    },
    {
      name: 'Business travellers',
      persona: 'e.g. Raj',
      pct: 19, count: 25788,
      channels: ['TRAVELLER-TUNED SMS', 'SMS-C FALLBACK', 'IN-APP'],
      msg: '[NOVA] Signal in your area is degraded. If you\u2019re on the move, switch to Wi-Fi calling where possible. Restoration is underway.',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>,
    },
    {
      name: 'Family planners',
      persona: 'e.g. Elena',
      pct: 51, count: 69996,
      channels: ['FAMILY-TUNED SMS', 'SMS-C FALLBACK (NO APP)'],
      msg: '[NOVA] Service in your area is temporarily slow — all your lines are affected. We\u2019re restoring fast, expected ~25 min. Thank you for your patience.',
      icon: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
    },
  ],
  footerAgents: [
    { name: 'SOC Agent', icon: SOC_ICON },
    { name: 'Segment Agent', icon: SEG_ICON },
    { name: 'Notification Agent', icon: NOTIF_ICON },
  ],
}

const BUSINESS_RESPONSE = {
  intro: "Here's the damage so far, Adam— not pretty, but contained 🏷️",
  lines: [
    { bold: 'Business impact —  Trafford Metro RAN degradation (Incident #INC-20234)' },
    { html: '<strong>Customers affected:</strong> ~12000 subscribers across <strong>28 cell sites</strong> under the Trafford aggregation' },
    { html: '<strong>Service impact:</strong> 5G NR throughput down <strong>15%</strong>, VoLTE call setup failure rate at <strong>7.2%</strong> (baseline 1.8x).' },
    { html: '<strong>Enterprise SLA exposure: 47 enterprise accounts</strong> breaching SLA — top 3: <em>FreightOne Logistics</em>, <em>Mercy Health Network</em>, <em>Atlas Rideshare</em>.' },
    { bold: 'Revenue at risk:' },
    { plain: 'Consumer ARPU credits: ~$148K' },
    { plain: 'Enterprise SLA penalties: ~$312K' },
    { plain: 'Roaming/MVNO settlement loss: ~$41K' },
    { bold: 'Total: ~$501K' },
    { html: '<strong>Brand / churn signal:</strong> social mentions up <strong>9.4×</strong>, NPS detractors trending <strong>+18 pts</strong> in affected ZIPs. Predicted churn lift: <strong>+0.7%</strong> (~1,290 subs).' },
    { html: "<strong>Regulatory:</strong> approaching FCC NORS reporting threshold (≥900K user-minutes lost). Currently at <strong>612K</strong> — we'll want to escalate at <strong>75%</strong>." },
    { plain: "Want me to line up restoration support or get comms moving?" },
  ],
}

const RESTORE_RESPONSE = {
  intro: "Good news, Adam\u2014 there's a clear path home \uD83D\uDD27",
  lines: [
    { html: '<strong>Restoration is on track</strong> and NetOps has a clear recovery path.' },
    { html: '<strong>Root cause:</strong> <strong>Backhaul capacity congestion</strong> on <strong>Metro-Ring-7</strong> following scheduled fiber maintenance at <em>Newark-PoP-2</em>. Backup path congested; 4 eNodeBs in fallback failed to re-home.' },
    { bold: 'Recovery plan:' },
    { html: '\u2705 Traffic steered to <strong>Ring-9</strong> \u2014 <em>complete</em>' },
    { html: '\u2705 Field team on-site at <em>Newark-PoP-2</em>' },
    { html: '\u25A1 Splice + OTDR validation' },
    { html: '\u23F3 Re-home 4 eNodeBs + KPI soak' },
    { html: '<strong>Confidence:</strong> 82% based on similar in-PoP splice incidents.' },
    { html: '<em>Heads-up:</em> if splice validation fails, fallback is a cold-spare transponder swap. I\u2019ll flag it the second we see a wobble.' },
  ],
}

const APPROVE_AGENTS = [
  { name: 'Notification Agent', label: 'dispatching segment-A SMS via SMS-C fallback...', icon: NOTIF_ICON },
  { name: 'Notification Agent', label: 'dispatching segment-B and C SMS + push to reachable handsets...', icon: NOTIF_ICON },
  { name: 'Notification Agent', label: 'pushing in-app banner to CareX for app-installed subs...', icon: NOTIF_ICON },
  { name: 'Analytics Agent',    label: 'logging delivery telemetry + opening inbound-reply intent listener...', icon: ANA_ICON },
]

const APPROVE_RESPONSE = {
  intro: 'Done and dusted, Adam\u2014 all 3 segment variants are out across SMS / push / in-app \uD83D\uDDBB (watch the customer view \u2014 Maya, Raj, and Elena are receiving the variant tuned for them)',
  lines: [
    { bold: 'Outage comms dispatched \u2014 multi-channel, per-segment' },
    { html: '\uD83D\uDDBB <strong>SMS (CS fallback via SMS-C):</strong> 12000\u00a0/\u00a012000 sent \u00b7 delivery <strong>99.2%</strong> (held up despite the VoLTE issue)' },
    { html: '\uD83D\uDD14 <strong>Push:</strong> 114,160\u00a0/\u00a012000 reachable (62%) \u00b7 delivered 113,488' },
    { html: '\uD83D\uDCF1 <strong>In-app banner:</strong> queued for 162K subs with CareX installed \u00b7 ~41% already seen' },
    { html: '<strong>Dispatch:</strong> completed across target channels \u00b7 cost <strong>$1,289.40</strong>' },
    { html: '<strong>STOP opt-outs received:</strong> 38 (suppressed for downstream comms)' },
    { html: '<strong>Inbound reply volume:</strong> 1,142 \u2014 top intents: <em>restoration query (61%), thanks (18%), complaint (12%)</em>' },
    { plain: 'Field team is closing in on the splice \u2014 restoration should land any minute. I\u2019ll surface the all-clear the second KPIs go green.' },
  ],
  footerAgents: [
    { name: 'Notification Agent', icon: NOTIF_ICON },
    { name: 'Analytics Agent', icon: ANA_ICON },
  ],
}

const RESTORED_ALERT = {
  intro: 'Good news incoming, Adam ',
  lines: [
    { html: '\u2705 <strong>Service restored \u2014 Incident #INC-20234</strong>' },
    { html: 'Just in from NetOps \u2014 splice validated at <em>Newark-PoP-2</em>, all 4 eNodeBs re-homed, KPI soak passed.' },
    { html: '<strong>5G NR throughput:</strong> 98.2% of baseline \u2705' },
    { html: '<strong>VoLTE setup failure:</strong> 0.3% (back inside SLA) \u2705' },
    { html: '<strong>Sites in-service:</strong> 312\u00a0/\u00a0312 \u2705' },
    { html: '<strong>Restoration status:</strong> validated' },
    { plain: "Now\u2019s the moment to (a) send a warm all-clear, and then (b) make it up to people with a goodwill package. Sentiment is still recoverable." },
    { plain: 'Want me to draft the restoration comms?' },
  ],
}

const RESTORATION_COMMS_AGENTS = [
  { name: 'SOC Agent', label: 'confirming all 312 sites green + KPIs in-SLA...', icon: SOC_ICON },
  { name: 'Segment Agent', label: 're-scoping audience (excluding 38 STOP opt-outs)...', icon: SEG_ICON },
  { name: 'Notification Agent', label: 'writing warm all-clear, segment-aware (no promo yet)...', icon: NOTIF_ICON },
  { name: 'Notification Agent', label: 're-enabling push + in-app now that cells are healed...', icon: NOTIF_ICON },
]

const RESTORATION_COMMS_RESPONSE = {
  intro: "Let's close this loop on a high note, Adam",
  lines: [
    { html: '<strong>Service restoration confirmed &mdash; all KPIs green &#9989;</strong>' },
    { html: '5G throughput back to <strong>98.2%</strong> of baseline &middot; VoLTE setup failure <strong>0.3%</strong> &middot; all 312 sites in-service' },
    { html: 'Restoration completed successfully.' },
    { html: '<strong>&#128221; Restoration SMS &mdash; please review before dispatch</strong> <em>(12000 subs + 47 enterprise contacts)</em>:' },
    { html: '<em>[NOVA] Good news &mdash; service in your area is fully restored. Thanks for sticking with us. We&rsquo;ll be in touch shortly with a small thank-you. &mdash; Team NOVA</em>' },
    { html: '<strong>Tone check:</strong> warm close &#9989; &middot; doesn&rsquo;t promise specifics yet &#9989; &middot; 198 chars / 2 SMS segments.' },
    { html: '&#128073; Say <strong>"approve"</strong> to dispatch the all-clear. I&rsquo;ll line up the goodwill package right after.' },
  ],
  footerAgents: [
    { name: 'SOC Agent', icon: SOC_ICON },
    { name: 'Segment Agent', icon: SEG_ICON },
    { name: 'Notification Agent', icon: NOTIF_ICON },
  ],
}

const RESTORATION_DISPATCH_AGENTS = [
  { name: 'Notification Agent', label: 'dispatching restoration SMS + push + in-app refresh...', icon: NOTIF_ICON },
  { name: 'Analytics Agent', label: 'rolling up delivery + inbound sentiment...', icon: ANA_ICON },
]

const RESTORATION_DISPATCH_RESPONSE = {
  intro: 'And there&rsquo;s the warm landing, Adam&#127919; <em>(customer view is lighting up with the all-clear)</em>',
  lines: [
    { html: '<strong>&#9989; Restoration comms dispatched &mdash; all 3 channels</strong>' },
    { html: '&#128140; <strong>SMS:</strong> 12000 consumer + 47 enterprise &middot; <strong>delivery 99.1%</strong>' },
    { html: '&#128276; <strong>Push:</strong> 118,94 reachable now (cells healed) &middot; <strong>delivery 97.8%</strong>' },
    { html: '&#128241; <strong>In-app banner:</strong> swapped from amber to green' },
    { html: '<strong>Dispatch:</strong> completed across all channels &middot; cost <strong>$1,304</strong>' },
    { html: '<strong>Inbound sentiment:</strong> 82% positive &middot; 11% neutral &middot; 7% still frustrated (routed to retention specialists)' },
    { html: 'Sentiment is recoverable &mdash; strong moment to offer the goodwill package.' },
  ],
  footerAgents: [
    { name: 'Notification Agent', icon: NOTIF_ICON },
    { name: 'Analytics Agent', icon: ANA_ICON },
  ],
}

const COMPENSATION_AGENTS = [
  { name: 'Segment Agent', label: 're-confirming 3 segments: Creators · Travellers · Families...', icon: SEG_ICON },
  { name: 'Promotion Agent', label: 'designing 2 candidate bundles per segment (primary + alt)...', icon: '🎁' },
  { name: 'Promotion Agent', label: 'pricing Adobe · LoungeKey · Disney+ partner rates...', icon: '🤝' },
  { name: 'Analytics Agent', label: 'projecting cost × expected uptake · checking $4M envelope...', icon: ANA_ICON },
  { name: 'Analytics Agent', label: 'scoring each bundle on uptake, churn-save and LTV...', icon: ANA_ICON },
]

const COMPENSATION_RESPONSE = {
  intro: 'Promotion Agent has 3 segment-specific bundles ready with a vetted alternative for each, Adam— review and approve below 🎁',
  lines: [
    { html: '<strong>Per-segment compensation — pick the recommended bundle or swap for the alternative.</strong>' },
    { html: 'Costs project at the expected uptake for each option, so you can see the envelope before rollout.' },
    { html: 'Use the card below to flip between <em>Reco</em> and <em>Alt</em> per segment, then hit <strong>Approve &amp; roll out</strong> (or just type <em>"approve"</em>).' },
  ],
  footerAgents: [
    { name: 'Segment Agent', icon: SEG_ICON },
    { name: 'Promotion Agent', icon: 'P' },
    { name: 'Analytics Agent', icon: ANA_ICON },
  ],
}

const COMPENSATION_BUNDLES = [
  {
    id: 'creators',
    title: 'Content creators',
    icon: '🎬',
    meta: '40,524 subs · e.g. Maya',
    reco: {
      title: 'Creator Boost 🎬',
      desc: '50 GB creator data + 3 months Adobe Creative Cloud + priority upload lane.',
      uptake: '63%',
      redeemers: '25,53',
      cost: '$460K',
      note: 'Recommended · Adobe co-marketing offsets ~$0.10M.',
    },
    alt: {
      title: 'Studio Storage Boost 🗄️',
      desc: '1 TB cloud storage + 6 months Premiere Rush + 25 GB creator data.',
      uptake: '48%',
      redeemers: '19,45',
      cost: '$214K',
      note: 'Cheaper alternative — lower uptake, no partner co-fund.',
    },
  },
  {
    id: 'travellers',
    title: 'Business travellers',
    icon: '✈️',
    meta: '25,788 subs · e.g. Raj',
    reco: {
      title: 'Roam & Recover ✈️',
      desc: "10 GB int'l roaming (30+ countries) + 12 months LoungeKey (2 visits/yr).",
      uptake: '71%',
      redeemers: '18,30',
      cost: '$1.25M',
      note: 'Recommended · LoungeKey partner-subsidised at $42/sub.',
    },
    alt: {
      title: 'Global Calling Pass 📞',
      desc: 'Unlimited international calling for 3 months + 5 GB roaming data.',
      uptake: '54%',
      redeemers: '13,92',
      cost: '$446K',
      note: 'Lower-cost alternative — no lounge perk, lower uptake.',
    },
  },
  {
    id: 'families',
    title: 'Family planners',
    icon: '👨‍👩‍👧',
    meta: '69,996 subs · e.g. Elena',
    reco: {
      title: 'Family Care 👨‍👩‍👧',
      desc: '$25 bill credit across all lines + 6 months Disney+ Bundle for the household.',
      uptake: '78%',
      redeemers: '54,59',
      cost: '$1.86M',
      note: 'Recommended · per-line credit drives highest absolute redemption.',
    },
    alt: {
      title: 'Streaming Family Pack 📺',
      desc: '12 months Netflix + Hulu Bundle (no bill credit).',
      uptake: '61%',
      redeemers: '42,69',
      cost: '$1.20M',
      note: 'Streaming-only alternative — no direct bill relief.',
    },
  },
]

const COMPENSATION_ROLLOUT_AGENTS = [
  { name: 'Promotion Agent', label: 'binding each segment to its approved bundle...', icon: 'P' },
  { name: 'Notification Agent', label: 'publishing persona-specific promo cards to CareX...', icon: NOTIF_ICON },
  { name: 'Notification Agent', label: 'sending SMS-only segments their bundle via SMS link...', icon: NOTIF_ICON },
  { name: 'Analytics Agent', label: 'starting redemption tracking + churn-save attribution...', icon: ANA_ICON },
]

const COMPENSATION_ROLLOUT_RESPONSE = {
  activation: [
    { html: 'Locked in, Adam&mdash; your approved bundles are going live to their segments now &#127873; <em>(watch the CareX app &mdash; each persona only sees the bundle you approved for them)</em>' },
    { html: '<strong>&#9989; Compensation activated &mdash; per-segment publish</strong>' },
    { html: '<strong>&#127916; Creators</strong> &middot; Adobe / storage codes via partner API &middot; PCRF data live in 30 min' },
    { html: '<strong>&#9992; Travellers</strong> &middot; LoungeKey / calling entitlement provisioning &middot; enterprise SLA credits queued' },
    { html: '<strong>&#128106; Families</strong> &middot; per-line bill credit applied next invoice cycle &middot; Disney+ / streaming codes via partner API' },
    { html: '<strong>Approvals:</strong> auto-approved under <em>Incident Comp Policy v3.2</em> &mdash; VP Customer Ops &amp; Partnerships notified' },
    { html: '<strong>Activation:</strong> CareX promo cards now visible to Maya and Raj; Elena (no CareX app) gets her bundle details via SMS' },
    { html: 'Redemption tracking now live &mdash; uptake panel will show on incident close.' },
  ],
  closeout: [
    { html: 'That&rsquo;s a wrap, Adam&#127881; Nice work staying calm through that one.' },
    { html: '<strong>&#128274; Incident #INC-20234&mdash; auto-closed</strong>' },
    { html: 'All comms, restoration and per-segment compensation are out the door. Closing the ticket and wrapping this session.' },
    { html: '<strong>Customer outcome</strong>' },
    { html: '12000 subs notified &middot; <strong>99.1%</strong> SMS delivery' },
    { html: 'Per-segment promo packages live in CareX &middot; tracking ahead of last-incident benchmark' },
    { html: 'Inbound sentiment: <strong>82% positive</strong> post-restoration' },
    { html: '<strong>Auto-handoffs queued</strong>' },
    { html: '&#128196; RCA draft &rarr; <em>NetOps - R. Patel</em>' },
    { html: '&#128202; Sentiment + churn watch extended' },
    { html: '&#9993; Exec brief auto-drafted &rarr; <em>VP Customer Ops, VP NetOps, CCO</em>' },
    { html: 'Session ending. Go grab a coffee, Adam&mdash; you earned it &#9749;. Ping me anytime. &#128075;' },
  ],
  footerAgents: [
    { name: 'Promotion Agent', icon: 'P' },
    { name: 'Notification Agent', icon: NOTIF_ICON },
    { name: 'Analytics Agent', icon: ANA_ICON },
  ],
}

const INCIDENT_TIMELINE = [
  ['warn', 'Degradation detected', 'P1 - Metro-Ring-7 transport failure - 312 sites, ~184.2K subs'],
  ['msg', 'Outage comms sent (per segment)', '3 segment-tuned SMS variants - 99.2% delivery - 3-channel mix'],
  ['ok', 'Service restored', 'Splice validated at Newark-PoP-2 - KPI soak passed'],
  ['msg', 'Restoration comms sent', 'All-clear pushed across SMS / push / in-app - sentiment 82% positive'],
  ['msg', 'Per-segment compensation live', 'Approved bundles published to CareX - redemption tracking on'],
  ['lock', 'Incident auto-closed', 'RCA and watch handed off'],
]

const UPTAKE_ROWS = [
  ['Creator Boost', 'Maya', 'Recommended - Adobe co-marketing offsets ~$0.10M.', '63%', '25,53 / 40,52', '$3K', '412 tickets', '612', '$1.64M'],
  ['Roam & Recover', 'Raj', 'Recommended - LoungeKey partner-subsidised at $42/sub.', '71%', '18,30 / 25,78', '$2K', '286 tickets', '348', '$1.09M'],
  ['Family Care', 'Elena', 'Recommended - per-line credit drives highest absolute redemption.', '78%', '54,59 / 69,99', '$5K', '686 tickets', '1,120', '$3.30M'],
]

const CANNED = {
  comms: 'Recommend sending an SMS advisory to impacted subscribers, plus an internal ops alert for service desk and field crew status updates. Keep messages concise and include expected restoration window.',
}

const SUGGESTIONS = [
  { label: "What's the business impact of this degradation?", key: 'business' },
  { label: 'How long will it take to restore?', key: 'restore' },
  { label: 'Send comms to all the customers right away informing them about the outage', key: 'comms' },
]

const PERSONAS = [
  {
    id: 'maya', name: 'Maya', role: 'CONTENT CREATOR',
    desc: ' Streams + Uploads Daily + 5G Data',
    hasCareX: true,
    signal: 'Wi-Fi',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M18 3H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V9l-4-6zm-5 13H9v-2h4v2zm3-4H6v-2h10v2zm0-4H6V6h10v2z" /><path d="M18 9l4-3v12l-4-3V9z" /></svg>,
  },
  {
    id: 'raj', name: 'Raj', role: 'BUSINESS TRAVELLER',
    desc: '4-International Sites < 190 days | 5G Data Roaming Plans',
    hasCareX: true,
    signal: 'Cell · degraded',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>,
  },
  {
    id: 'elena', name: 'Elena', role: 'FAMILY PLANNER',
    desc: ' 4-line family plan - No CareX App Installed',
    hasCareX: false,
    signal: 'Cell · degraded',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>,
  },
]

function agentStatus(agentIdx, phase) {
  if (phase === null) return 'pending'
  if (phase > agentIdx) return 'done'
  if (phase === agentIdx) return 'active'
  return 'pending'
}

function AgentStatusIcon({ status }) {
  if (status === 'done') return (
    <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
      <circle cx="10" cy="10" r="9" stroke="#22c55e" strokeWidth="1.5" fill="#f0fdf4" />
      <path d="M6 10l3 3 5-5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  if (status === 'active') return <span className="gs-agent-spinner" />
  return <span className="gs-agent-pending-dot" />
}

export default function CirclesInline({ onResolveIncident }) {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])
  const [selectedPersona, setSelectedPersona] = useState('maya')
  const [agentPhase, setAgentPhase] = useState(null)
  const [suggestionsDismissed, setSuggestionsDismissed] = useState(false)
  const [showRestoredAction, setShowRestoredAction] = useState(false)
  const [restoredActionDone, setRestoredActionDone] = useState(false)
  const [phoneState, setPhoneState] = useState(null)
  const [phoneTab, setPhoneTab] = useState('carex')
  const [allClearDispatched, setAllClearDispatched] = useState(false)
  const [compensationRolledOut, setCompensationRolledOut] = useState(false)
  const [activatedBundles, setActivatedBundles] = useState({})
  const [showCompensationAction, setShowCompensationAction] = useState(false)
  const [compSelections, setCompSelections] = useState({ creators: 'reco', travellers: 'reco', families: 'reco' })
  const chatEndRef = useRef(null)
  const timers = useRef([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const scrollDown = () => setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

  const addMsg = (msg) => {
    setMessages((m) => [...m, msg])
    scrollDown()
  }

  const runAgentSequence = (userLabel, agentSet = AGENTS, responseType = 'business-response') => {
    addMsg({ type: 'user', text: userLabel })
    addMsg({ type: 'agents', agentSet, responseType })
    setAgentPhase(0)
    const stepMs = Math.round(4200 / agentSet.length)
    const newTimers = []
    for (let i = 1; i < agentSet.length; i++) {
      const t = setTimeout(() => { setAgentPhase(i); scrollDown() }, i * stepMs)
      newTimers.push(t)
    }
    const done = setTimeout(() => {
      setAgentPhase(agentSet.length + 1)
      setMessages((m) => {
        const next = [...m]
        for (let i = next.length - 1; i >= 0; i--) {
          if (next[i].type === 'agents') {
            next[i] = { type: next[i].responseType, agentSet: next[i].agentSet }
            break
          }
        }
        return next
      })
      scrollDown()
    }, agentSet.length * stepMs + 600)
    timers.current.push(...newTimers, done)
  }

  const handleSuggestion = (key, label) => {
    setSuggestionsDismissed(true)
    if (key === 'business') {
      runAgentSequence(label, AGENTS, 'business-response')
    } else if (key === 'restore') {
      runAgentSequence(label, RESTORE_AGENTS, 'restore-response')
    } else if (key === 'comms') {
      runAgentSequence(label, COMMS_AGENTS, 'comms-response')
    } else {
      addMsg({ type: 'user', text: label })
    }
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    setSuggestionsDismissed(true)
    const text = inputValue.trim()
    const lower = text.toLowerCase()
    setInputValue('')
    if (lower.includes('eta') || lower.includes('restor') || lower.includes('how long')) {
      runAgentSequence(text, RESTORE_AGENTS, 'restore-response')
    } else if (lower.includes('business impact') || lower.includes('revenue') || lower.includes('damage')) {
      runAgentSequence(text, AGENTS, 'business-response')
    } else if (lower.includes('comm') || lower.includes('sms') || lower.includes('notif') || lower.includes('customer')) {
      runAgentSequence(text, COMMS_AGENTS, 'comms-response')
    } else if (lower.trim() === 'approve' || lower.includes('approve')) {
      if (restoredActionDone) {
        runAgentSequence(text, RESTORATION_DISPATCH_AGENTS, 'restoration-dispatch-response')
        const stepMs = Math.round(4200 / RESTORATION_DISPATCH_AGENTS.length)
        const doneMs = RESTORATION_DISPATCH_AGENTS.length * stepMs + 700
        const phoneTimer = setTimeout(() => {
          setAllClearDispatched(true)
          setPhoneState('restored')
        }, doneMs)
        const followUpTimer = setTimeout(() => {
          setMessages((m) => [...m, { type: 'compensation-prompt' }])
          setShowCompensationAction(true)
          setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
        }, doneMs + 700)
        timers.current.push(phoneTimer, followUpTimer)
      } else {
        runAgentSequence(text, APPROVE_AGENTS, 'approve-response')
        const stepMs = Math.round(4200 / APPROVE_AGENTS.length)
        const outageMs = APPROVE_AGENTS.length * stepMs + 650
        const followUpMs = outageMs + 3200
        const ot = setTimeout(() => setPhoneState('outage'), outageMs)
        const ft = setTimeout(() => {
          setMessages((m) => [...m, { type: 'restored-alert' }])
          setShowRestoredAction(true)
          setPhoneState('restored')
          setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
        }, followUpMs)
        timers.current.push(ot, ft)
      }
    } else if ((lower.includes('thankyou') || lower.includes('thank you')) && lower.includes('close') && lower.includes('issue')) {
      addMsg({ type: 'user', text })
      addMsg({ type: 'assistant', text: 'Sure. The issue has been closed and the ticket #20234 has been marked resolved.' })
      onResolveIncident?.('INC-20234')
    } else {
      addMsg({ type: 'user', text })
      addMsg({ type: 'assistant', text: 'Thanks — checking the latest network impact and will update you shortly.' })
    }
  }

  const handleCompensationRollout = () => {
    runAgentSequence('approve', COMPENSATION_ROLLOUT_AGENTS, 'compensation-rollout-response')
    const stepMs = Math.round(4200 / COMPENSATION_ROLLOUT_AGENTS.length)
    const doneMs = COMPENSATION_ROLLOUT_AGENTS.length * stepMs + 800
    const phoneTimer = setTimeout(() => {
      setCompensationRolledOut(true)
      setPhoneState('outage')
      setPhoneTab('carex')
    }, doneMs)
    timers.current.push(phoneTimer)
  }

  const persona = PERSONAS.find((p) => p.id === selectedPersona)
  const hasCareX = persona?.hasCareX !== false
  const phoneTime = ''
  const phoneBadgeCount = allClearDispatched ? 2 : 1
  const messageText = phoneState === 'restored'
    ? '[NOVA] Your service is restored. Everything should be back to full speed now. Thanks for your patience.'
    : '[NOVA] Your service may be slower than usual right now. We are already on it. Updates: nova.co/status'
  const carexTitle = phoneState === 'restored' ? 'Service restored in your area' : 'Service issue in your area'
  const carexText = phoneState === 'restored'
    ? 'All systems back to full speed. Thanks for your patience.'
    : 'Engineers are restoring service.'
  const promoCard = {
    maya: {
      eyebrow: 'CAREX - TAILORED FOR CONTENT CREATORS',
      title: 'Creator Boost',
      icon: '',
      desc: '50 GB creator data + 3 months Adobe Creative Cloud + priority upload lane.',
    },
    raj: {
      eyebrow: 'CAREX - TAILORED FOR BUSINESS TRAVELLERS',
      title: 'Roam & Recover',
      icon: '',
      desc: "10 GB int'l roaming (30+ countries) + 12 months LoungeKey (2 visits/yr).",
    },
  }[selectedPersona]
  const redeemedNames = ['maya', 'raj'].filter((id) => activatedBundles[id]).map((id) => PERSONAS.find((p) => p.id === id)?.name)
  const liveRedemptionCount = redeemedNames.length
  const uptakeRows = UPTAKE_ROWS.map((row) => {
    if (activatedBundles.maya && row[1] === 'Maya') return ['Creator Boost', 'Maya', row[2], '66%', '26,746 / 40,524', row[5], row[6], row[7], row[8], true]
    if (activatedBundles.raj && row[1] === 'Raj') return ['Roam & Recover', 'Raj', row[2], '74%', '19,083 / 25,788', row[5], row[6], row[7], row[8], true]
    return [...row, false]
  })

  const activateBundle = () => {
    if (!promoCard) return
    setActivatedBundles((current) => ({ ...current, [selectedPersona]: true }))
  }
  return (
    <div className="gsi-wrap">
      {/* LEFT: CHAT */}
      <div className="gsi-left">
        <div className="gs-hdr">
          <div className="gs-hdr-brand">
            <div className="gs-hdr-icon">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div>
              <div className="gs-hdr-title">NOVA — Operator  Co-pilot</div>
              <div className="gs-hdr-sub">Network Ops Insights · Actions · Offers</div>
            </div>
          </div>
          <div className="gs-inc-badge">
            <span className="gs-inc-dot"></span>
            1 active incident · P1
          </div>
        </div>

        <div className="gs-chat">
          <div className="gs-msg-wrap">
            <div className="gs-msg-avatar">
              <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div className="gs-msg-label">Analytics Co-pilot</div>
              <div className="gs-msg-bubble">
                <p>Heads up, Adam— something&apos;s off in Trafford 🚨</p>
                <p>🚨 <strong>Active alert — Service degradation detected</strong></p>
                <p><strong>Incident #INC-20234</strong> · Trafford Metro RAN · severity <strong>P1</strong></p>
                <p><strong>Scope:</strong> 28 RAN 5G sites under the Trafford aggregation</p>
                <p><strong>Symptom:</strong> 5G NR throughput down <strong>15%</strong> · Packet Loss <strong>7.22%</strong> (1.8 x baseline) Average RAN RTT 386 ms (1.6 x Baseline)</p>
                <p><strong>Likely cause:</strong> Backhaul capacity congestion. Confidence will firm as the signal develops.</p>
                <p><strong>Subscribers affected (live estimate): ~12000</strong></p>

                <p>I&apos;m here to help you size it up and handle customer comms while NetOps restores. A few good opening shots:</p>
                <p className="gs-italic">What&apos;s the business impact of this degradation?</p>
                <p className="gs-italic">How long will it take to restore?</p>
                <p className="gs-italic">Send an SMS to affected customers about the outage</p>
              </div>
            </div>
          </div>

          {messages.map((m, i) => {
            if (m.type === 'user') return (
              <div key={i} className="gs-user-msg-wrap">
                <div className="gs-user-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
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
                {(m.agentSet || AGENTS).map((agent, ai) => {
                  const status = agentStatus(ai, agentPhase)
                  return (
                    <div key={ai} className={`gs-agent-row gs-agent-${status}`}>
                      <AgentStatusIcon status={status} />
                      <span className="gs-agent-icon-wrap">{agent.icon}</span>
                      <span className="gs-agent-name">{agent.name}</span>
                      <span className="gs-agent-sep">·</span>
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
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Analytics Co-pilot</div>
                  <div className="gs-msg-bubble gs-biz-bubble">
                    <p>{BUSINESS_RESPONSE.intro}</p>
                    {BUSINESS_RESPONSE.lines.map((l, li) =>
                      l.html ? <p key={li} dangerouslySetInnerHTML={{ __html: l.html }} /> :
                        l.bold ? <p key={li}><strong>{l.bold}</strong></p> :
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
            if (m.type === 'restore-response') return (
              <div key={i} className="gs-msg-wrap">
                <div className="gs-msg-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Analytics Co-pilot</div>
                  <div className="gs-msg-bubble gs-biz-bubble">
                    <p>{RESTORE_RESPONSE.intro}</p>
                    {RESTORE_RESPONSE.lines.map((l, li) =>
                      l.html ? <p key={li} dangerouslySetInnerHTML={{ __html: l.html }} /> :
                        l.bold ? <p key={li}><strong>{l.bold}</strong></p> :
                          <p key={li}>{l.plain}</p>
                    )}
                    <div className="gs-agents-footer">
                      <span className="gs-agents-footer-lbl">AGENTS THAT WORKED ON THIS</span>
                      {(m.agentSet || RESTORE_AGENTS).map((a, ai) => (
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
            if (m.type === 'comms-response') return (
              <div key={i} className="gs-msg-wrap">
                <div className="gs-msg-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Analytics Co-pilot</div>
                  <div className="gs-msg-bubble gs-biz-bubble">
                    <p>{COMMS_RESPONSE.intro}</p>
                    {COMMS_RESPONSE.details.map((l, li) =>
                      l.html ? <p key={li} dangerouslySetInnerHTML={{ __html: l.html }} /> :
                        l.bold ? <p key={li}><strong>{l.bold}</strong></p> :
                          <p key={li}>{l.plain}</p>
                    )}
                    <p style={{marginTop:'10px',fontSize:'12px',color:'#6b7a90'}}>🎨 Nothing leaves Nova until you say so — just say <strong>"approve"</strong> to dispatch all three segment variants, or tell me what to tweak.</p>
                    <div className="gs-seg-card">
                      <div className="gs-seg-card-hdr">
                        <div className="gs-seg-card-title">
                          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0 3 3 0 016 0zm-4.07 11c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
                          Segment Agent · 3 lifestyle clusters identified
                        </div>
                        <div className="gs-seg-card-total">{COMMS_RESPONSE.totalSubs.toLocaleString()} affected subs</div>
                      </div>
                      {COMMS_RESPONSE.clusters.map((cl, ci) => (
                        <div key={ci} className="gs-cluster">
                          <div className="gs-cluster-hdr">
                            <div className="gs-cluster-title">
                              <span className="gs-cluster-ico">{cl.icon}</span>
                              <span className="gs-cluster-name">{cl.name}</span>
                              <span className="gs-cluster-persona">· {cl.persona}</span>
                            </div>
                            <div className="gs-cluster-count"><strong>{cl.pct}%</strong> · {cl.count.toLocaleString()}</div>
                          </div>
                          <div className="gs-cluster-channels">
                            {cl.channels.map((ch, chi) => <span key={chi} className="gs-cluster-ch">{ch}</span>)}
                          </div>
                          <div className="gs-cluster-msg">{cl.msg}</div>
                        </div>
                      ))}
                    </div>
                    <div className="gs-agents-footer">
                      <span className="gs-agents-footer-lbl">AGENTS THAT WORKED ON THIS</span>
                      {COMMS_RESPONSE.footerAgents.map((a, ai) => (
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
            if (m.type === 'approve-response') return (
              <div key={i} className="gs-msg-wrap">
                <div className="gs-msg-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Analytics Co-pilot</div>
                  <div className="gs-msg-bubble gs-biz-bubble">
                    <p style={{fontStyle:'italic',color:'#374151'}}>{APPROVE_RESPONSE.intro}</p>
                    {APPROVE_RESPONSE.lines.map((l, li) =>
                      l.html ? <p key={li} dangerouslySetInnerHTML={{ __html: l.html }} /> :
                        l.bold ? <p key={li}><strong>{l.bold}</strong></p> :
                          <p key={li}>{l.plain}</p>
                    )}
                    <div className="gs-agents-footer">
                      <span className="gs-agents-footer-lbl">AGENTS THAT WORKED ON THIS</span>
                      {APPROVE_RESPONSE.footerAgents.map((a, ai) => (
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
            if (m.type === 'restored-alert') return (
              <div key={i} className="gs-msg-wrap">
                <div className="gs-msg-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Analytics Co-pilot</div>
                  <div className="gs-msg-bubble gs-biz-bubble">
                    <p style={{fontStyle:'italic',color:'#374151'}}>{RESTORED_ALERT.intro}</p>
                    {RESTORED_ALERT.lines.map((l, li) =>
                      l.html ? <p key={li} dangerouslySetInnerHTML={{ __html: l.html }} /> :
                        <p key={li}>{l.plain}</p>
                    )}
                  </div>
                </div>
              </div>
            )
            if (m.type === 'restoration-comms-response') return (
              <div key={i} className="gs-msg-wrap">
                <div className="gs-msg-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Analytics Co-pilot</div>
                  <div className="gs-msg-bubble gs-biz-bubble">
                    <p>{RESTORATION_COMMS_RESPONSE.intro}</p>
                    {RESTORATION_COMMS_RESPONSE.lines.map((l, li) => (
                      <p key={li} dangerouslySetInnerHTML={{ __html: l.html }} />
                    ))}
                    <div className="gs-agents-footer">
                      <span className="gs-agents-footer-lbl">AGENTS THAT WORKED ON THIS</span>
                      {RESTORATION_COMMS_RESPONSE.footerAgents.map((a, ai) => (
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
            if (m.type === 'restoration-dispatch-response') return (
              <div key={i} className="gs-msg-wrap">
                <div className="gs-msg-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Analytics Co-pilot</div>
                  <div className="gs-msg-bubble gs-biz-bubble">
                    <p dangerouslySetInnerHTML={{ __html: RESTORATION_DISPATCH_RESPONSE.intro }} />
                    {RESTORATION_DISPATCH_RESPONSE.lines.map((l, li) => (
                      <p key={li} dangerouslySetInnerHTML={{ __html: l.html }} />
                    ))}
                    <div className="gs-agents-footer">
                      <span className="gs-agents-footer-lbl">AGENTS THAT WORKED ON THIS</span>
                      {RESTORATION_DISPATCH_RESPONSE.footerAgents.map((a, ai) => (
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
            if (m.type === 'compensation-prompt') return (
              <div key={i} className="gs-msg-wrap">
                <div className="gs-msg-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Analytics Co-pilot</div>
                  <div className="gs-msg-bubble gs-biz-bubble">
                    <p>Nice &mdash; restoration comms are out. Now let&apos;s soften the bump &#127873;</p>
                    <p>Now that service is healthy, this is the right window to offer goodwill &mdash; sentiment listening is showing <strong>82% positive</strong>, and a tailored bundle here pays back in retention.</p>
                    <p>Want me to put together compensation for the affected segments? Just say <em>&quot;offer compensation&quot;</em>.</p>
                  </div>
                </div>
              </div>
            )
            if (m.type === 'compensation-response') return (
              <div key={i} className="gs-msg-wrap">
                <div className="gs-msg-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Analytics Co-pilot</div>
                  <div className="gs-msg-bubble gs-biz-bubble">
                    <p>{COMPENSATION_RESPONSE.intro}</p>
                    {COMPENSATION_RESPONSE.lines.map((l, li) => (
                      <p key={li} dangerouslySetInnerHTML={{ __html: l.html }} />
                    ))}
                    <div className="gs-agents-footer">
                      <span className="gs-agents-footer-lbl">AGENTS THAT WORKED ON THIS</span>
                      {COMPENSATION_RESPONSE.footerAgents.map((a, ai) => (
                        <span key={ai} className="gs-agents-footer-tag">
                          <span className="gs-agents-footer-ico">{a.icon}</span>
                          {a.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="comp-card">
                    <div className="comp-card-title">🎁 Promotion Agent · review per-segment bundles</div>
                    <div className="comp-card-sub">Approve the recommendation or swap for an alternative. Costs project at expected uptake.</div>
                    {COMPENSATION_BUNDLES.map((segment) => (
                      <div className="comp-segment" key={segment.id}>
                        <div className="comp-segment-title">
                          <span>{segment.icon}</span>
                          <strong>{segment.title}</strong>
                          <span>{segment.meta}</span>
                        </div>
                        <div className="comp-options">
                          {['reco', 'alt'].map((kind) => {
                            const option = segment[kind]
                            const active = compSelections[segment.id] === kind
                            return (
                              <button
                                type="button"
                                key={kind}
                                className={`comp-option${active ? ' active' : ''}`}
                                onClick={() => setCompSelections((current) => ({ ...current, [segment.id]: kind }))}
                              >
                                <div className="comp-option-head">
                                  <strong>{option.title}</strong>
                                  <span>{kind.toUpperCase()}</span>
                                </div>
                                <p>{option.desc}</p>
                                <div className="comp-metrics">
                                  <div><span>Uptake</span><strong>{option.uptake}</strong></div>
                                  <div><span>Redeemers</span><strong>{option.redeemers}</strong></div>
                                  <div><span>Proj. cost</span><strong>{option.cost}</strong></div>
                                </div>
                                <em>{option.note}</em>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                    <div className="comp-summary">
                      <div>Projected envelope: <strong>$3.56M</strong> · 98,436 expected redemptions · <strong className="comp-ok">within $4M cap</strong></div>
                      <div className="comp-actions">
                        <button type="button" className="comp-reset" onClick={() => setCompSelections({ creators: 'reco', travellers: 'reco', families: 'reco' })}>Reset</button>
                        <button type="button" className="comp-approve" onClick={handleCompensationRollout}>Approve &amp; roll out</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
            if (m.type === 'compensation-rollout-response') return (
              <div key={i} className="gs-msg-wrap">
                <div className="gs-msg-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Analytics Co-pilot</div>
                  <div className="gs-msg-bubble gs-biz-bubble">
                    {COMPENSATION_ROLLOUT_RESPONSE.activation.map((l, li) => (
                      <p key={li} dangerouslySetInnerHTML={{ __html: l.html }} />
                    ))}
                    <div className="gs-agents-footer">
                      <span className="gs-agents-footer-lbl">AGENTS THAT WORKED ON THIS</span>
                      {COMPENSATION_ROLLOUT_RESPONSE.footerAgents.map((a, ai) => (
                        <span key={ai} className="gs-agents-footer-tag">
                          <span className="gs-agents-footer-ico">{a.icon}</span>
                          {a.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="gs-msg-bubble gs-biz-bubble comp-closeout">
                    {COMPENSATION_ROLLOUT_RESPONSE.closeout.map((l, li) => (
                      <p key={li} dangerouslySetInnerHTML={{ __html: l.html }} />
                    ))}
                  </div>

                  <div className="incident-timeline-card">
                    <div className="incident-timeline-head">
                      <strong>Incident timeline</strong>
                      <span>INC-20234 &middot; auto-generated</span>
                    </div>
                    <div className="incident-timeline-list">
                      {INCIDENT_TIMELINE.map(([tone, title, sub]) => (
                        <div className="incident-timeline-row" key={title}>
                          <span className={`incident-timeline-icon ${tone}`}></span>
                          <div>
                            <strong>{title}</strong>
                            <p>{sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="uptake-card">
                    <div className="uptake-head">
                      <div>
                        <strong>Promotion uptake</strong>
                        <p>Per-segment bundles approved by the operator &mdash; live redemption tracking.</p>
                      </div>
                      <span>Per-segment</span>
                    </div>
                    {liveRedemptionCount > 0 && (
                      <div className="uptake-live-banner">
                        <strong>+{liveRedemptionCount} live redemption{liveRedemptionCount > 1 ? 's' : ''}</strong>
                        <span>&mdash; {redeemedNames.join(', ')} just tapped Redeem on the CareX app.</span>
                      </div>
                    )}
                    {uptakeRows.map(([bundle, person, note, uptake, uptakeSub, deflection, tickets, churn, value, isLive]) => (
                      <div className="uptake-row" key={bundle}>
                        <div className="uptake-title">
                          <strong>{bundle}</strong> <span>&middot; for {person}</span>
                          {isLive && <b className="uptake-live-pill">+1 live</b>}
                        </div>
                        <p>{note}</p>
                        <div className="uptake-metrics">
                          <div><span>Uptake</span><strong>{uptake}</strong><small>{uptakeSub}</small></div>
                          <div><span>Deflection</span><strong>{deflection}</strong><small>{tickets}</small></div>
                          <div><span>Churn saved</span><strong>{churn}</strong><small>{value}</small></div>
                        </div>
                      </div>
                    ))}
                    <div className="uptake-summary">Net upside vs. comp spend: <strong>$6.04M</strong> across all three segments (98,43 expected redemptions).</div>
                  </div>
                </div>
              </div>
            )
            if (m.type === 'assistant') return (
              <div key={i} className="gs-msg-wrap">
                <div className="gs-msg-avatar">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="gs-msg-label">Analytics Co-pilot</div>
                  <div className="gs-msg-bubble"><p>{m.text}</p></div>
                </div>
              </div>
            )
            return null
          })}
          <div ref={chatEndRef} />
        </div>

        {!suggestionsDismissed && (
        <div className="gs-sugg-row">
          {SUGGESTIONS.map((s) => (
            <button key={s.key} className="gs-sugg-card" onClick={() => handleSuggestion(s.key, s.label)}>
              {s.label}
            </button>
          ))}
        </div>
        )}

        {showRestoredAction && !restoredActionDone && (
        <div className="gs-sugg-row">
          <button className="gs-sugg-card gs-sugg-action" onClick={() => {
            setRestoredActionDone(true)
            const msg = "Ok - customers' services are restored. Lets go ahead and communicate that with customers"
            runAgentSequence(msg, RESTORATION_COMMS_AGENTS, 'restoration-comms-response')
          }}>
            Ok - customers&apos; services are restored. Lets go ahead and communicate that with customers
          </button>
        </div>
        )}

        {showCompensationAction && (
        <div className="gs-sugg-row">
          <button className="gs-sugg-card gs-sugg-action" onClick={() => {
            setShowCompensationAction(false)
            runAgentSequence("Let's offer compensation to the affected customers", COMPENSATION_AGENTS, 'compensation-response')
          }}>
            Let&apos;s offer compensation to the affected customers
          </button>
        </div>
        )}

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
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
          <div className="gs-footer-note">
            Nova answers <span className="gs-footer-link">from a curated knowledge base</span>. Press Enter to send.
          </div>
        </div>
      </div>

      {/* RIGHT: CUSTOMER VIEW */}
      <div className="gsi-right">
        <div className="gs-cv-hdr">
          <div className="gs-cv-icon">
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" clipRule="evenodd" />
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
          <div className="gs-phone-outer">
            <div className="gs-phone">
              <div className="gs-phone-status">
                <span className="gs-phone-time-sm">{phoneTime}</span>
                <div className="gs-phone-sig"><span className={`gs-wifi-dot${persona?.signal?.startsWith('Cell') ? ' gs-cell-dot' : ''}`}></span>{persona?.signal || 'Wi-Fi'}</div>
              </div>
              <div className="gs-phone-notch"></div>
              {(!phoneState || phoneTab === 'lock') && (
                <>
                  <div className="gs-phone-owner">{persona?.name}&apos;s iPhone</div>
                  <div className="gs-phone-clock">{phoneTime}</div>
                  <div className="gs-phone-date"></div>
                  {!phoneState && <div className="gs-phone-empty">No notifications yet</div>}
                  {phoneState && (
                    <div className="gs-lock-notifications">
                      <div className="gs-lock-card">
                        <div className="gs-lock-card-meta">
                          <span>Messages</span>
                          <span>{phoneState === 'restored' ? 'now' : '6m ago'}</span>
                        </div>
                        <strong>NOVA</strong>
                        <p>{allClearDispatched ? '[NOVA] Good news - service in your area is fully restored. Thanks for your patience.' : messageText}</p>
                      </div>
                      {hasCareX && (
                        <div className="gs-lock-card">
                          <div className="gs-lock-card-meta">
                            <span>CareX</span>
                            <span>{phoneState === 'restored' ? 'now' : '6m ago'}</span>
                          </div>
                          <strong>CareX - Service alert</strong>
                          <p>{allClearDispatched ? 'Service restored in your area. All systems back to full speed. Thanks for your patience.' : `${carexTitle}. ${carexText}`}</p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              {phoneState && phoneTab === 'messages' && (
                <div className="gs-phone-messages">
                  <div className="gs-msg-app-top">
                    <button className="gs-msg-back" type="button">&lt;</button>
                    <div>
                      <div className="gs-msg-app-sub">Text Message</div>
                      <div className="gs-msg-app-title">611-NOVA</div>
                    </div>
                  </div>
                  <div className="gs-msg-thread">
                    <div className="gs-sms-bubble">
                      [NOVA] Your service may be slower than usual right now. We are already on it. Updates: nova.co/status
                    </div>
                    {allClearDispatched && (
                      <div className="gs-sms-bubble">
                        [NOVA] Good news - service in your area is fully restored. Thanks for your patience.
                      </div>
                    )}
                  </div>
                </div>
              )}
              {phoneState && phoneTab === 'carex' && hasCareX && (
                <div className="gs-phone-app">
                  <div className="gs-app-topbar">
                    <div className="gs-app-brand">CAREX</div>
                    <div className="gs-app-title">My Account</div>
                  </div>
                  <div className="gs-app-body">
                    {phoneState === 'outage' && (
                      <div className="gs-app-alert gs-app-alert-warn">
                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" style={{flexShrink:0,color:'#B45309'}}><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                        <div>
                          <div className="gs-app-alert-title">{carexTitle}</div>
                          <div className="gs-app-alert-msg">{carexText}</div>
                        </div>
                      </div>
                    )}
                    {phoneState === 'restored' && (
                      <div className="gs-app-alert gs-app-alert-ok">
                        <svg viewBox="0 0 20 20" fill="none" width="18" height="18" style={{flexShrink:0}}><circle cx="10" cy="10" r="9" stroke="#16A34A" strokeWidth="1.5" fill="#F0FDF4"/><path d="M6 10l3 3 5-5" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <div>
                          <div className="gs-app-alert-title gs-app-alert-title-ok">{carexTitle}</div>
                          <div className="gs-app-alert-msg">{carexText}</div>
                        </div>
                      </div>
                    )}
                    {compensationRolledOut && promoCard && (
                      <div className="gs-carex-promo">
                        <div className="gs-carex-promo-eyebrow">&#127873; {promoCard.eyebrow}</div>
                        <div className="gs-carex-promo-title">{promoCard.title} {promoCard.icon}</div>
                        <div className="gs-carex-promo-desc">{promoCard.desc}</div>
                        <button
                          type="button"
                          className={`gs-carex-promo-btn${activatedBundles[selectedPersona] ? ' redeemed' : ''}`}
                          onClick={activateBundle}
                        >
                          {activatedBundles[selectedPersona] ? 'Redeemed' : 'Activate bundle'}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="gs-app-plan">
                    <div className="gs-app-plan-lbl">PLAN</div>
                    <div className="gs-app-plan-name">NOVA Unlimited · {persona?.name}</div>
                  </div>
                </div>
              )}
              {phoneState && phoneTab === 'carex' && !hasCareX && (
                <div className="gs-phone-unavailable">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" width="44" height="44">
                    <path d="M12 3v5m0 8v5M3 12h5m8 0h5M6.3 6.3l3.5 3.5m4.4 4.4 3.5 3.5m0-11.4-3.5 3.5m-4.4 4.4-3.5 3.5" strokeLinecap="round"/>
                  </svg>
                  <strong>CareX app not installed</strong>
                  <span>{persona?.name} prefers SMS - check the Messages tab.</span>
                </div>
              )}
              {phoneState && (
                <div className="gs-app-nav">
                  <button type="button" className={`gs-app-nav-item${phoneTab === 'lock' ? ' gs-app-nav-active' : ''}`} onClick={() => setPhoneTab('lock')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><rect x="3" y="11" width="6" height="10" rx="1"/><rect x="9" y="7" width="6" height="14" rx="1"/><rect x="15" y="3" width="6" height="18" rx="1"/></svg>
                    <span>Lock</span>
                  </button>
                  <button type="button" className={`gs-app-nav-item${phoneTab === 'messages' ? ' gs-app-nav-active' : ''}`} onClick={() => setPhoneTab('messages')}>
                    <div style={{position:'relative',display:'inline-block'}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                      <span className="gs-app-badge">{phoneBadgeCount}</span>
                    </div>
                    <span>Messages</span>
                  </button>
                  <button type="button" className={`gs-app-nav-item${phoneTab === 'carex' ? ' gs-app-nav-active' : ''}${!hasCareX ? ' gs-app-nav-disabled' : ''}`} onClick={() => setPhoneTab('carex')} aria-disabled={!hasCareX}>
                    <div style={{position:'relative',display:'inline-block'}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="12" y2="15"/></svg>
                      {hasCareX && <span className="gs-app-badge">{phoneBadgeCount}</span>}
                    </div>
                    <span>CareX</span>
                  </button>
                </div>
              )}
              <div className="gs-phone-bar"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
