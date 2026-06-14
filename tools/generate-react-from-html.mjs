import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const pages = [
  {
    source: 'maxim-operator 1.html',
    component: 'OperatorDashboard',
    css: 'operator.css',
    wrapper: 'operator-page',
    title: 'Maxim Operator Dashboard',
  },
  {
    source: 'audit-trail-screen 1.html',
    component: 'AuditTrailPage',
    css: 'audit-trail.css',
    wrapper: 'audit-page',
    title: 'Maxim Regulatory Audit Trail',
  },
  {
    source: 'maxim-mobile_view.html',
    component: 'MobileViewPage',
    css: 'mobile.css',
    wrapper: 'mobile-page',
    title: 'Maxim Mobile View',
  },
]

function ensureDir(dir) {
  fs.mkdirSync(path.join(root, dir), { recursive: true })
}

function extract(html, tag) {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return match ? match[1].trim() : ''
}

function bodyWithoutScripts(html) {
  return extract(html, 'body').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').trim()
}

function camelStyleName(name) {
  return name.trim().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function styleStringToObject(value) {
  const entries = value
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const splitAt = entry.indexOf(':')
      if (splitAt === -1) return null
      const key = camelStyleName(entry.slice(0, splitAt))
      const rawValue = entry.slice(splitAt + 1).trim().replace(/'/g, "\\'")
      return `${key}: '${rawValue}'`
    })
    .filter(Boolean)

  return `style={{${entries.join(', ')}}}`
}

function htmlToJsx(html) {
  let jsx = html
    .replace(/<!--([\s\S]*?)-->/g, (_, comment) => `{/*${comment}*/}`)
    .replace(/\bclass=/g, 'className=')
    .replace(/\bfill-rule=/g, 'fillRule=')
    .replace(/\bclip-rule=/g, 'clipRule=')
    .replace(/\bstroke-width=/g, 'strokeWidth=')
    .replace(/\bstroke-linecap=/g, 'strokeLinecap=')
    .replace(/\bstroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/\bstroke-dasharray=/g, 'strokeDasharray=')
    .replace(/\bstroke-dashoffset=/g, 'strokeDashoffset=')
    .replace(/\bfont-family=/g, 'fontFamily=')
    .replace(/\bfont-size=/g, 'fontSize=')
    .replace(/\bdominant-baseline=/g, 'dominantBaseline=')
    .replace(/\btext-anchor=/g, 'textAnchor=')
    .replace(/\bxmlns:xlink=/g, 'xmlnsXlink=')
    .replace(/\bxlink:href=/g, 'xlinkHref=')
    .replace(/\btabindex=/g, 'tabIndex=')
    .replace(/\breadonly=/g, 'readOnly=')
    .replace(/\bmaxlength=/g, 'maxLength=')
    .replace(/\bfor=/g, 'htmlFor=')
    .replace(/\bonclick="goto\('([^']+)',this\)"/g, (_, page) => `onClick={() => goTo('${page}')}`)
    .replace(/\bonclick="openSim\(\)"/g, 'onClick={openSim}')
    .replace(/\bonclick="closeSim\(\)"/g, 'onClick={closeSim}')
    .replace(/\bonclick="resetSim\(\)"/g, 'onClick={resetSim}')
    .replace(/\bonclick="runSim\(false\)"/g, 'onClick={() => runSim(false)}')
    .replace(/\bonclick="runSim\(true\)"/g, 'onClick={() => runSim(true)}')
    .replace(/\bonclick="toggleXai\('([^']+)'\)"/g, (_, id) => `onClick={() => toggleXai('${id}')}`)
    .replace(/style="([^"]*)"/g, (_, value) => styleStringToObject(value))

  return jsx
}

function findMatchingBrace(text, openIndex) {
  let depth = 0
  for (let i = openIndex; i < text.length; i += 1) {
    if (text[i] === '{') depth += 1
    if (text[i] === '}') {
      depth -= 1
      if (depth === 0) return i
    }
  }
  return -1
}

function prefixSelector(selector, wrapper) {
  return selector
    .split(',')
    .map((part) => {
      const trimmed = part.trim()
      if (!trimmed) return trimmed
      if (trimmed === 'body' || trimmed === ':root') return `.${wrapper}`
      if (trimmed === '*') return `.${wrapper} *`
      if (trimmed.startsWith(`.${wrapper}`)) return trimmed
      return `.${wrapper} ${trimmed}`
    })
    .join(',')
}

function scopeCss(css, wrapper) {
  const imports = []
  let body = css.replace(/@import\s+url\([^)]+\);/g, (line) => {
    imports.push(line)
    return ''
  })

  let output = ''
  let cursor = 0
  while (cursor < body.length) {
    const open = body.indexOf('{', cursor)
    if (open === -1) {
      output += body.slice(cursor)
      break
    }

    const selector = body.slice(cursor, open)
    if (!selector.trim()) {
      output += selector
      cursor = open + 1
      continue
    }

    const close = findMatchingBrace(body, open)
    if (close === -1) {
      output += body.slice(cursor)
      break
    }

    const block = body.slice(open, close + 1)
    const trimmedSelector = selector.trim()

    if (trimmedSelector.startsWith('@keyframes')) {
      output += `${selector}${block}`
    } else if (trimmedSelector.startsWith('@media')) {
      output += `${selector}${block}`
    } else {
      const leading = selector.match(/^\s*/)?.[0] ?? ''
      output += `${leading}${prefixSelector(trimmedSelector, wrapper)}${block}`
    }

    cursor = close + 1
  }

  return `${imports.join('\n')}\n${output.trim()}\n`
}

function writePage({ source, component, css, wrapper, title }) {
  const html = fs.readFileSync(path.join(root, source), 'utf8')
  const sourceCss = extract(html, 'style').replace(
    /background:var\(--bg;\)font-size/g,
    'background:var(--bg);font-size',
  )
  const scopedCss = scopeCss(sourceCss, wrapper)
  const jsxBody = htmlToJsx(bodyWithoutScripts(html))

  fs.writeFileSync(path.join(root, 'src/styles', css), scopedCss)

  const imports =
    component === 'OperatorDashboard'
      ? "import { useEffect, useRef, useState } from 'react'\n"
      : "import { useEffect, useState } from 'react'\n"

  const statefulBody =
    component === 'OperatorDashboard'
      ? buildOperatorComponent(component, css, wrapper, title, jsxBody)
      : buildSimpleClockComponent(component, css, wrapper, title, jsxBody)

  fs.writeFileSync(
    path.join(root, 'src/pages', `${component}.jsx`),
    `${imports}import '../styles/${css}'\n\n${statefulBody}`,
  )
}

function buildSimpleClockComponent(component, css, wrapper, title, jsxBody) {
  const clockId = component === 'MobileViewPage' ? 'mob-clk' : 'clk'
  const secondsLine = component === 'MobileViewPage' ? '' : '  const seconds = now.getSeconds()\n'
  const formatter =
    component === 'MobileViewPage'
      ? `const h12 = hours % 12 || 12
      return \`\${h12}:\${String(minutes).padStart(2, '0')} \${ampm}\``
      : `const h12 = hours % 12 || 12
      return \`\${h12}:\${String(minutes).padStart(2, '0')}:\${String(seconds).padStart(2, '0')} \${ampm}\``

  return `const formatClock = () => {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
${secondsLine}  const ampm = hours >= 12 ? 'PM' : 'AM'
  ${formatter}
}

export default function ${component}() {
  const [clock, setClock] = useState(formatClock)

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="${wrapper}">
${jsxBody.replace(new RegExp(`<span className="[^"]*" id="${clockId}">[^<]*<\\/span>`), `<span className="${
    component === 'MobileViewPage' ? 'sb-time' : 'clk'
  }" id="${clockId}">{clock}</span>`)}
    </div>
  )
}
`
}

function buildOperatorComponent(component, css, wrapper, title, jsxBody) {
  return `const pageMeta = {
  dashboard: ['Live Dashboard', 'Manchester · Real-time Multi-AI Monitoring'],
  issues: ['Active Issues', '3 open incidents across Manchester zones'],
  agents: ['AI Agents', 'Multi-agent pipeline status'],
  escalations: ['Escalations', 'Human-in-the-loop incidents'],
  tower: ['AI Control Tower', 'System-wide intelligence overview'],
  reports: ['Reports', 'Operational & performance summaries'],
  governance: ['AI Control Tower', 'Trust · Explainability · Compliance · Audit'],
}

const formatClock = () =>
  new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

const stepCount = 6

export default function ${component}({ initialPage = 'dashboard' }) {
  const [activePage, setActivePage] = useState(initialPage)
  const [clock, setClock] = useState(formatClock)
  const [openXai, setOpenXai] = useState({})
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
  const [stepStates, setStepStates] = useState(Array(stepCount).fill(''))
  const [shownSimItems, setShownSimItems] = useState({})
  const [progressWidth, setProgressWidth] = useState('0%')
  const [showEscalationNote, setShowEscalationNote] = useState(false)
  const [isSimRunning, setIsSimRunning] = useState(false)
  const timers = useRef([])

  function clearSimTimers() {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }

  useEffect(() => {
    const timer = window.setInterval(() => setClock(formatClock()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    return () => clearSimTimers()
  }, [])

  const goTo = (page) => setActivePage(page)

  const toggleXai = (id) => {
    setOpenXai((current) => ({ ...current, [id]: !current[id] }))
  }

  const resetSim = () => {
    clearSimTimers()
    setStepStates(Array(stepCount).fill(''))
    setShownSimItems({})
    setProgressWidth('0%')
    setShowEscalationNote(false)
    setIsSimRunning(false)
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
        setProgressWidth(\`\${Math.round(((index + 1) / steps.length) * 100)}%\`)
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

  const pageClass = (page) => \`pv \${activePage === page ? 'active' : ''}\`
  const navClass = (page) => \`ni \${activePage === page ? 'active' : ''}\`
  const stepClass = (index) => \`sstep \${stepStates[index] || ''}\`
  const flowStyle = (id) => ({ display: shownSimItems[id] ? 'flex' : 'none' })
  const blockStyle = (id) => ({ display: shownSimItems[id] ? 'block' : 'none' })
  const pillStyle = (id, base = {}) => ({
    ...base,
    display: shownSimItems[id] ? 'inline-flex' : 'none',
  })

  const [pageTitle, pageSubtitle] = pageMeta[activePage]

  return (
    <div className="${wrapper}">
${operatorDynamicJsx(jsxBody)}
    </div>
  )
}
`
}

function operatorDynamicJsx(jsx) {
  let out = jsx

  for (const page of ['dashboard', 'issues', 'agents', 'escalations', 'reports', 'governance']) {
    const active = page === 'dashboard' ? ' active' : ''
    out = out.replace(
      new RegExp(`<div className="ni${active}" onClick=\\{\\(\\) => goTo\\('${page}'\\)\\}>`),
      `<div className={navClass('${page}')} onClick={() => goTo('${page}')}>`,
    )
  }

  for (const page of ['dashboard', 'issues', 'agents', 'escalations', 'tower', 'reports', 'governance']) {
    const active = page === 'dashboard' ? ' active' : ''
    out = out.replace(
      `<div className="pv${active}" id="page-${page}">`,
      `<div className={pageClass('${page}')} id="page-${page}">`,
    )
  }

  out = out
    .replace('<div className="tbtitle" id="pgt">Live Dashboard</div>', '<div className="tbtitle" id="pgt">{pageTitle}</div>')
    .replace(
      '<div className="tbsub" id="pgs">Manchester · Real-time Multi-AI Monitoring</div>',
      '<div className="tbsub" id="pgs">{pageSubtitle}</div>',
    )
    .replace('<span className="clk" id="clk">--:--:--</span>', '<span className="clk" id="clk">{clock}</span>')
    .replace('<div id="ov">', '<div id="ov" className={isSimulatorOpen ? \'open\' : \'\'} onClick={(event) => { if (event.target === event.currentTarget) closeSim() }}>')
    .replace('<div className="enote" id="en">', '<div className={`enote ${showEscalationNote ? \'show\' : \'\'}`} id="en">')
    .replace('<div className="spb"><div className="spf" id="prog"></div></div>', '<div className="spb"><div className="spf" id="prog" style={{ width: progressWidth }}></div></div>')
    .replace('<button className="brun" id="bh" onClick={() => runSim(false)}>▶ Simulate Autonomous Resolution</button>', '<button className="brun" id="bh" onClick={() => runSim(false)} disabled={isSimRunning}>▶ Simulate Autonomous Resolution</button>')
    .replace('<button className="brun r" id="be" onClick={() => runSim(true)}>⚡ Simulate Escalation to Human Agent</button>', '<button className="brun r" id="be" onClick={() => runSim(true)} disabled={isSimRunning}>⚡ Simulate Escalation to Human Agent</button>')

  for (let i = 0; i < 6; i += 1) {
    out = out.replace(`<div className="sstep" id="s${i}">`, `<div className={stepClass(${i})} id="s${i}">`)
  }

  out = out
    .replace('<div className="flow" id="f1" style={{display: \'none\'}}>', '<div className="flow" id="f1" style={flowStyle(\'f1\')}>')
    .replace('<div className="flow" id="f2" style={{display: \'none\'}}>', '<div className="flow" id="f2" style={flowStyle(\'f2\')}>')
    .replace('<div className="apill" id="a2" style={{display: \'none\'}}>📱 Internet Outage — ETA 15 min</div>', '<div className="apill" id="a2" style={pillStyle(\'a2\')}>📱 Internet Outage — ETA 15 min</div>')
    .replace('<div className="sdet" id="d3" style={{display: \'none\'}}>Bandwidth restored to 98% · MTTR: 4.5 min</div>', '<div className="sdet" id="d3" style={blockStyle(\'d3\')}>Bandwidth restored to 98% · MTTR: 4.5 min</div>')
    .replace('<div className="apill" id="a4" style={{display: \'none\'}}>📱 Service restored.</div>', '<div className="apill" id="a4" style={pillStyle(\'a4\')}>📱 Service restored.</div>')
    .replace(
      '<div className="apill" id="a5" style={{display: \'none\', background: \'#FFF3E6\', borderColor: \'rgba(224,123,0,.25)\', color: \'#B85E00\'}}>📱 15GB data add-on credited— no action needed 🎉</div>',
      '<div className="apill" id="a5" style={pillStyle(\'a5\', { background: \'#FFF3E6\', borderColor: \'rgba(224,123,0,.25)\', color: \'#B85E00\' })}>📱 15GB data add-on credited— no action needed 🎉</div>',
    )

  for (const id of ['x0', 'x1', 'x2']) {
    const index = id.slice(1)
    out = out
      .replace(`<span className="xai-toggle" id="xt${index}">▼</span>`, `<span className="xai-toggle" id="xt${index}">{openXai.${id} ? '▲' : '▼'}</span>`)
      .replace(`<div className="xai-body" id="${id}">`, `<div className={\`xai-body \${openXai.${id} ? 'open' : ''}\`} id="${id}">`)
  }

  return out
}

ensureDir('src/pages')
ensureDir('src/styles')
pages.forEach(writePage)
