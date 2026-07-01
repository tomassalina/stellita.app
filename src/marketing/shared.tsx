import type { CSSProperties, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export const YELLOW = '#FFD700'

/** The Stellita mark: the pixel star mascot. Rendered pixelated. */
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <img
      src="/stellita/mascot.png"
      alt="Stellita"
      width={size}
      height={size}
      style={{ display: 'block', imageRendering: 'pixelated' }}
    />
  )
}

/** "STELLITA.APP" wordmark — STELLITA bold, ".APP" in accent-dark. */
export function Wordmark({ size = 19 }: { size?: number }) {
  return (
    <span style={{ fontSize: size, fontWeight: 800, letterSpacing: '-0.01em', color: '#222222' }}>
      STELLITA<span style={{ color: '#D9A400' }}>.APP</span>
    </span>
  )
}

type NavKey = 'home' | 'templates' | 'contracts' | 'pricing' | 'faq'

const NAV_LINKS: { key: NavKey; label: string; to: string }[] = [
  { key: 'contracts', label: 'Contracts', to: '/contracts' },
  { key: 'templates', label: 'Templates', to: '/templates' },
  { key: 'pricing', label: 'Pricing', to: '/pricing' },
  { key: 'faq', label: 'FAQ', to: '/faq' },
]

/** Sticky top nav, shared across the marketing pages. */
export function Nav({
  active,
  signedIn,
  onSignIn,
}: {
  active: NavKey
  signedIn: boolean
  onSignIn: () => void
}) {
  const navigate = useNavigate()
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 60,
        height: 68,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid #161616',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          height: '100%',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer' }}
        >
          <Logo />
          <Wordmark />
        </div>
        <div className="xlm-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 30, fontSize: 15 }}>
          {NAV_LINKS.map((l) => (
            <span
              key={l.key}
              className="xlm-navlink"
              onClick={() => navigate(l.to)}
              style={l.key === active ? { color: '#fff' } : undefined}
            >
              {l.label}
            </span>
          ))}
        </div>
        <div
          onClick={onSignIn}
          className="xlm-pill"
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#0a0a0a',
            background: YELLOW,
            padding: '9px 22px',
            borderRadius: 999,
            cursor: 'pointer',
          }}
        >
          {signedIn ? 'Go to app' : 'Sign In'}
        </div>
      </div>
    </nav>
  )
}

/** Eyebrow label used above section headings. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 13, letterSpacing: '0.18em', color: YELLOW, fontWeight: 500, marginBottom: 16 }}>
      {children}
    </div>
  )
}

/** Soft radial glow used behind hero / CTA. */
export function Glow({ style }: { style?: CSSProperties }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        background: `radial-gradient(50% 50% at 50% 50%, rgba(253,218,36,0.12), transparent 70%)`,
        animation: 'xlmGlow 6s ease-in-out infinite',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}

export function Footer() {
  const navigate = useNavigate()
  const col: { title: string; links: { label: string; to: string }[] }[] = [
    { title: 'Product', links: [{ label: 'Contracts', to: '/contracts' }, { label: 'Pricing', to: '/pricing' }, { label: 'FAQ', to: '/#faq' }] },
    { title: 'Build', links: [{ label: 'Open the app', to: '/app' }, { label: 'Templates', to: '/app' }] },
  ]
  return (
    <footer style={{ borderTop: '1px solid #131313', padding: '56px 32px 48px' }}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 40,
          justifyContent: 'space-between',
        }}
      >
        <div style={{ maxWidth: 320 }}>
          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', marginBottom: 14 }}
          >
            <Logo />
            <Wordmark />
          </div>
          <p style={{ fontSize: 14, color: '#7a7a7a', lineHeight: 1.6, margin: 0 }}>
            Build on Stellar without writing a single line of Rust. Prompt, deploy, done.
          </p>
        </div>
        {col.map((c) => (
          <div key={c.title}>
            <div style={{ fontSize: 12, letterSpacing: '0.14em', color: '#6e6e6e', marginBottom: 16, textTransform: 'uppercase' }}>
              {c.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {c.links.map((l) => (
                <span key={l.label} className="xlm-navlink" style={{ fontSize: 14.5 }} onClick={() => navigate(l.to)}>
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1280, margin: '40px auto 0', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', fontSize: 13, color: '#5a5a5a' }}>
        <span>© {2026} Stellita · Runs on Stellar testnet.</span>
        <span>
          Created by{' '}
          <a
            href="https://www.instagram.com/lasoftwarefactory/"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#7a7a7a', textDecoration: 'none' }}
          >
            lasoftwarefactory
          </a>
        </span>
      </div>
    </footer>
  )
}
