import '../styles/mobile.css'

export default function MobileViewPage() {
  return (
    <div className="mobile-page">
<div className="phone">
  {/* notch */}
  <div className="notch"><div className="notch-cam"></div><div className="notch-mic"></div></div>

  {/* status bar */}
  <div className="statusbar">
    <div className="sb-icons">
      <div className="sig">
        <div className="sig-bar" style={{height: '3px'}}></div>
        <div className="sig-bar" style={{height: '5px'}}></div>
        <div className="sig-bar" style={{height: '7px'}}></div>
        <div className="sig-bar" style={{height: '9px'}}></div>
      </div>
      <div className="wifi">
        <div className="wifi-dot"></div>
        <div className="wifi-arc" style={{width: '7px', height: '7px', marginBottom: '-4px'}}></div>
        <div className="wifi-arc"></div>
      </div>
      <div className="batt"><div className="batt-fill"></div></div>
    </div>
  </div>

  {/* app bar */}
  <div className="appbar">
    <div className="app-brand">
      <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 150.7 36" width="117" height="28" role="img" aria-label="Maxim">
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
    <div className="bell">
      <svg viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
      <div className="bell-dot"></div>
    </div>
  </div>

  {/* body */}
  <div className="body">
    <div className="page-greeting">Service Alerts</div>
    <div className="page-sub">3 notifications for you</div>

    <div className="section-lbl">Active</div>

    {/* Alert 1: Outage Alert!*/}
    <div className="alert">
      <div className="alert-bar amber"></div>
      <div className="alert-inner">
        <div className="alert-top">
          <div className="alert-label">
            <div className="alert-ico amber">🔧</div>
            <span className="alert-type amber">Outage Alert!</span>
          </div>
          <span className="alert-time">09:00 AM</span>
        </div>
        <div className="alert-title">Critical Maintenance Required in your area</div>
        <div className="alert-body">Internet Service will be briefly unavailable from now till 15 mins</div>
        <div className="alert-footer">
          <span className="eta-badge">ETA: Restored by 15 mins</span>
          <span className="no-action">No action needed</span>
        </div>
      </div>
    </div>

    <div className="section-lbl" style={{marginTop: '4px'}}>Recent</div>

    {/* Alert 2: Issue Resolved */}
    <div className="alert">
      <div className="alert-bar green"></div>
      <div className="alert-inner">
        <div className="alert-top">
          <div className="alert-label">
            <div className="alert-ico green">✅</div>
            <span className="alert-type green">Issue Resolved</span>
          </div>
          <span className="alert-time">09:15 AM</span>
        </div>
        <div className="alert-title">Service Fully Restored</div>
        <div className="alert-body">The internet issue in your area has been resolved. We apologise for any inconvenience.</div>
        <div className="alert-footer">
          <span className="resolved-badge">✓ Resolved</span>
          <span className="no-action">No action needed</span>
        </div>
      </div>
    </div>

    {/* Alert 3: Promotion */}
    <div className="alert">
      <div className="alert-bar blue"></div>
      <div className="alert-inner">
        <div className="alert-top">
          <div className="alert-label">
            <div className="alert-ico blue">🎁</div>
            <span className="alert-type blue">Promotion</span>
          </div>
          <span className="alert-time">09:17 AM</span>
        </div>
        <div className="alert-title">15GB Data Add-on credited</div>
        <div className="alert-body">As a thank-you for your patience, we've added 15GB of Data Add-on pack to your account.</div>
        <div className="alert-footer">
          <span className="promo-badge">🎉 Applied to your plan</span>
          <span className="no-action">No action needed</span>
        </div>
      </div>
    </div>

  </div>{/* /body */}

  {/* bottom nav */}
  <div className="bnav">
    <div className="bni active">
      <svg viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
      <span>Alerts</span>
    </div>
    <div className="bni">
      <svg viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
      <span>Home</span>
    </div>
    <div className="bni">
      <svg viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/></svg>
      <span>Support</span>
    </div>
    <div className="bni">
      <svg viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
      <span>Account</span>
    </div>
  </div>

</div>{/* /phone */}
    </div>
  )
}
