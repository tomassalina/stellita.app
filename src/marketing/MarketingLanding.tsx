import { useState, type ReactNode } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/store'
import { useProjects } from '../projects/store'
import { LoginModal } from '../auth/LoginModal'
import { TEMPLATES, type StaticTemplate } from '../lib/templates'
import { Nav, Footer, Eyebrow, Glow, YELLOW } from './shared'
import { ContractLibrary } from './ContractLibrary'
import { PromptComposer } from './PromptComposer'
import './marketing.css'
import { useMarketingSeo } from './seo'

/** Public XLM Code landing — faithful to the Claude Design doc. Keeps the real
 *  auth + project flow (prompt → login → create; chips → open template). */
export function MarketingLanding() {
  useMarketingSeo({
    title: 'XLM Code — Build on Stellar without writing Rust',
    description:
      'Describe a contract or dApp in plain language. XLM Code generates audited Soroban smart contracts, deploys them to Stellar testnet, and wires up a working frontend — no Rust, no setup.',
    path: '/',
  })
  const navigate = useNavigate()
  const { user } = useAuth()
  const { createProject } = useProjects()
  const [showLogin, setShowLogin] = useState(false)
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')

  const enter = () => (user ? navigate('/app') : setShowLogin(true))

  const submitPrompt = () => {
    const text = prompt.trim()
    if (!text) return enter()
    if (user) navigate(`/projects/${createProject(text)}`)
    else {
      setPendingPrompt(text)
      setShowLogin(true)
    }
  }

  // Clicking a template opens its shared read-only preview (/p/:token), where
  // "Sign in" → "Clone" lives — same flow as a shared project. Static, no fetch.
  const openTemplate = (t: StaticTemplate) => {
    navigate(`/p/${t.token}`)
  }

  const handleLoginClose = () => {
    setShowLogin(false)
    if (pendingPrompt !== null) {
      const text = pendingPrompt
      setPendingPrompt(null)
      navigate(`/projects/${createProject(text)}`)
    } else {
      navigate('/app')
    }
  }

  // Logged-in users never see the public landing.
  if (user) return <Navigate to="/app" replace />

  return (
    <div className="xlm-marketing" style={{ height: '100%', overflowY: 'auto' }}>
      <Nav active="home" signedIn={!!user} onSignIn={enter} />

      {/* HERO */}
      <section style={{ position: 'relative', padding: '64px 32px 80px', textAlign: 'center', overflow: 'hidden' }}>
        <Glow style={{ top: -120, left: '50%', transform: 'translateX(-50%)', width: 780, height: 400, background: 'radial-gradient(50% 50% at 50% 50%, rgba(253,218,36,0.11), transparent 70%)' }} />
        <div style={{ position: 'relative', maxWidth: 880, margin: '0 auto' }}>
          <div className="xlm-fadeup" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, border: '1px solid #262626', background: '#0c0c0c', borderRadius: 999, padding: '7px 16px', fontSize: 13, color: '#cfcfcf', marginBottom: 36 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: YELLOW, boxShadow: `0 0 8px ${YELLOW}` }} />
            Build on Stellar without writing a single line of Rust
          </div>
          <h1 className="xlm-h1 xlm-fadeup" style={{ fontSize: 68, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.0, margin: '0 0 40px' }}>
            What do you want to<br />build on Stellar?
          </h1>

          {/* prompt box — identical composer to /app */}
          <PromptComposer value={prompt} onChange={setPrompt} onSubmit={submitPrompt} />

          {/* quick chips → static templates → /p/:token (no fetch, no flicker) */}
          <div className="xlm-fadeup" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 26 }}>
            {TEMPLATES.map((t, i) => (
              <div key={t.token} onClick={() => openTemplate(t)} className="xlm-chip" style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #242424', background: '#0a0a0a', borderRadius: 999, padding: '10px 18px', fontSize: 14, color: '#d4d4d4', cursor: 'pointer' }}>
                <ChipIcon kind={t.kind} highlight={i === 0} />
                {t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTRACT TEASER */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '50px 32px 30px' }}>
        <div style={{ marginBottom: 36 }}>
          <Eyebrow>THE CONTRACT LIBRARY</Eyebrow>
          <h2 className="xlm-h2" style={{ fontSize: 46, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 16px', lineHeight: 1.05 }}>
            Deploy audited contracts.<br />Write zero Rust.
          </h2>
          <p style={{ fontSize: 19, color: '#9a9a9a', maxWidth: 680, margin: 0, lineHeight: 1.55 }}>
            Pick a battle-tested OpenZeppelin contract, connect to a live protocol, or describe your own — we compile and deploy it to Stellar testnet.
          </p>
        </div>
        <ContractLibrary onCustom={enter} />
      </section>

      {/* BENTO */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '70px 32px 40px' }}>
        <div style={{ marginBottom: 40 }}>
          <Eyebrow>WHY XLM CODE</Eyebrow>
          <h2 className="xlm-h2" style={{ fontSize: 46, fontWeight: 700, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.05 }}>Everything you need to ship on Stellar</h2>
        </div>
        <div className="xlm-grid-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
          <div className="xlm-bento xlm-bento-tall" style={{ gridRow: 'span 2', border: '1px solid #1f1f1f', borderRadius: 22, padding: 38, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 420, background: 'radial-gradient(120% 90% at 0% 100%, rgba(253,218,36,0.08), transparent 60%)' }}>
            <h3 style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 18px' }}>Prompt.<br />Deploy.<br />Done.</h3>
            <p style={{ fontSize: 16, color: '#9a9a9a', lineHeight: 1.55, margin: 0 }}>Generate a working Soroban smart contract in minutes and deploy it to Stellar testnet in seconds.</p>
          </div>
          <BentoCard title="Audited by default" body="Every base contract is an audited OpenZeppelin implementation. You build on code that's already battle-tested." icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="1.7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>} />
          <div className="xlm-bento" style={{ border: '1px solid #1f1f1f', borderRadius: 22, padding: 32, overflow: 'hidden' }}>
            <h3 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 10px' }}>Plug into live protocols</h3>
            <p style={{ fontSize: 15, color: '#8a8a8a', lineHeight: 1.55, margin: '0 0 22px' }}>Compose with Soroswap, Blend, Reflector, USDC and more — by contract ID.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
              {['#cbb6f5', '#7dd6a8', YELLOW, '#9ec5ff', '#cfcfcf'].map((c, i) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 10, background: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                </div>
              ))}
            </div>
          </div>
          <BentoCard title="One-click testnet deploy" body="Go live on Stellar testnet instantly. No CLI, no toolchain, no funding dance — keys and faucet are handled." icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fafafa" strokeWidth="1.7"><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" /></svg>} />
          <BentoCard title="Start from templates" body="Token dashboards, NFT minters and swap UIs — ready to fork and make your own." icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fafafa" strokeWidth="1.7"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>} />
        </div>
      </section>

      {/* MARQUEE */}
      <section style={{ padding: '70px 0 30px', borderTop: '1px solid #131313', borderBottom: '1px solid #131313', marginTop: 60 }}>
        <div style={{ textAlign: 'center', fontSize: 14, color: '#7a7a7a', letterSpacing: '0.04em', marginBottom: 38 }}>Composable with the protocols you already trust</div>
        <div style={{ overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)', maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)' }}>
          <div style={{ display: 'flex', gap: 72, width: 'max-content', animation: 'xlmMarquee 28s linear infinite', fontSize: 28, fontWeight: 600, color: '#454545', whiteSpace: 'nowrap', padding: '0 36px' }}>
            {[...Array(2)].flatMap((_, r) => ['Soroswap', 'Blend', 'Reflector', 'DeFindex', 'Trustless Work', 'USDC', 'x402', 'OpenZeppelin', 'Soroban'].map((n) => <span key={`${r}-${n}`}>{n}</span>))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '130px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <Glow style={{ bottom: -160, left: '50%', transform: 'translateX(-50%)', width: 820, height: 420 }} />
        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <h2 className="xlm-cta-h2" style={{ fontSize: 60, fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.04, margin: '0 0 22px' }}>Start building<br />on Stellar</h2>
          <p style={{ fontSize: 20, color: '#9a9a9a', lineHeight: 1.55, margin: '0 0 40px' }}>Experiment freely. Everything runs on testnet — deploy fearlessly, break nothing.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <div onClick={enter} className="xlm-pill" style={{ background: YELLOW, color: '#0a0a0a', fontWeight: 600, fontSize: 17, padding: '16px 36px', borderRadius: 999, cursor: 'pointer' }}>Get Started</div>
            <div onClick={() => navigate('/faq')} className="xlm-soft" style={{ border: '1px solid #2a2a2a', color: '#fafafa', fontWeight: 500, fontSize: 17, padding: '16px 36px', borderRadius: 999, cursor: 'pointer' }}>Read the FAQ</div>
          </div>
        </div>
      </section>

      <Footer />

      {showLogin && <LoginModal onClose={handleLoginClose} />}
    </div>
  )
}

function BentoCard({ title, body, icon }: { title: string; body: string; icon: ReactNode }) {
  return (
    <div className="xlm-bento" style={{ border: '1px solid #1f1f1f', borderRadius: 22, padding: 32 }}>
      <div style={{ width: 42, height: 42, borderRadius: 11, border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>{icon}</div>
      <h3 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 10px' }}>{title}</h3>
      <p style={{ fontSize: 15, color: '#8a8a8a', lineHeight: 1.55, margin: 0 }}>{body}</p>
    </div>
  )
}

function ChipIcon({ kind, highlight }: { kind: string | null; highlight?: boolean }) {
  const c = highlight ? YELLOW : '#9a9a9a'
  if (kind === 'nft') return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.5-3.5L9 20" /></svg>
  if (kind === 'swap') return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /></svg>
}

