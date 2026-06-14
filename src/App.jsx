import { useEffect, useMemo, useState } from 'react'
import AuditTrailPage from './pages/AuditTrailPage.jsx'
import MobileViewPage from './pages/MobileViewPage.jsx'
import OperatorDashboard from './pages/OperatorDashboard.jsx'
import GreySkiesPage from './pages/GreySkies.jsx'
import CirclesPage from './pages/Circles.jsx'

const routes = {
  '/': { page: 'operator' },
  '/operator': { page: 'operator' },
  '/operator/tower': { page: 'operator', initialPage: 'tower' },
  '/operator/governance': { page: 'operator', initialPage: 'governance' },
  '/audit-trail': { page: 'audit-trail' },
  '/mobile': { page: 'mobile' },
  '/greyskies': { page: 'operator', initialPage: 'greyskies' },
  '/circles': { page: 'operator', initialPage: 'circles' },
}

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function routeFor(pathname) {
  return routes[normalizePath(pathname)] ?? routes['/']
}

function App() {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => setPathname(normalizePath(window.location.pathname))
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const route = useMemo(() => routeFor(pathname), [pathname])

  if (route.page === 'audit-trail') return <AuditTrailPage />
  if (route.page === 'mobile') return <MobileViewPage />
  if (route.page === 'greyskies') return <GreySkiesPage />
  if (route.page === 'circles') return <CirclesPage />

  const initialPage = route.initialPage ?? 'dashboard'

  return <OperatorDashboard key={initialPage} initialPage={initialPage} />
}

export default App
