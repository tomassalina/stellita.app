import { useState, type CSSProperties, type ReactNode } from 'react'
import { YELLOW } from './shared'

/* The tabbed contract catalog from the design (Configurable / Existing / Custom).
   Reused by the home teaser and the /contracts page. Presentational + a single
   onAction for the Custom CTA. Light Stellita neobrutalist brand. */

function S({ children, color = '#222', w = 22 }: { children: ReactNode; color?: string; w?: number }) {
  return (
    <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

type Card = { name: string; blurb: string; soon?: boolean; icon: ReactNode }

const CONFIGURABLE: Card[] = [
  { name: 'Fungible Token', blurb: 'Token with name, symbol and supply. The MVP hello-world.', icon: <S color="#D9A400"><circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /></S> },
  { name: 'Non-Fungible Token (NFT)', blurb: 'Unique collectibles: galleries, art, items.', icon: <S><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.5-3.5L9 20" /></S> },
  { name: 'NFT with Royalties', blurb: 'NFTs where the creator earns on resales.', soon: true, icon: <S color="#a89f80"><circle cx="12" cy="12" r="10" /><path d="m9 9 6 6" /></S> },
  { name: 'Ownable', blurb: 'Simple access control: a single owner account.', icon: <S><circle cx="7.5" cy="15.5" r="4.5" /><path d="m10.5 12.5 7-7" /><path d="m16 7 2 2 3-3-2-2z" /></S> },
  { name: 'Role-Based Access Control', blurb: 'Distinct roles per privileged action.', soon: true, icon: <S color="#a89f80"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m8 8 8 8" /><path d="m16 8-8 8" /></S> },
  { name: 'Vault (SEP-56)', blurb: 'Tokenized shares of an asset pool; yield products.', soon: true, icon: <S color="#a89f80"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="10" y1="9" x2="10" y2="15" /><line x1="14" y1="9" x2="14" y2="15" /></S> },
  { name: 'Pausable', blurb: 'Pause/unpause functions for emergencies.', soon: true, icon: <S color="#a89f80"><circle cx="12" cy="12" r="10" /><line x1="10" y1="9" x2="10" y2="15" /><line x1="14" y1="9" x2="14" y2="15" /></S> },
  { name: 'Smart Account', blurb: 'Programmable auth (signers + policies).', soon: true, icon: <S color="#a89f80"><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.3 2.7-6 6-6" /><circle cx="17.5" cy="16.5" r="3" /></S> },
]

const EXISTING: { name: string; blurb: string; tint: string; icon: ReactNode; wide?: boolean; live?: boolean }[] = [
  { name: 'Soroswap', blurb: 'DEX + liquidity aggregator. Best-price swaps (XLM/USDC).', tint: '#EDE3FA', live: true, icon: <S color="#6a3fb0" w={18}><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></S> },
  { name: 'Blend', blurb: 'Lending / borrowing pools with backstop.', tint: '#D8F3E2', icon: <S color="#1f7a4d" w={18}><path d="M12 2s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /></S> },
  { name: 'Reflector', blurb: 'Price oracle (SEP-40). Read-only, low risk.', tint: '#FFF3C4', icon: <S color="#8a6a00" w={18}><path d="M2 12h3l2-7 4 14 3-9 2 4h6" /></S> },
  { name: 'DeFindex', blurb: 'Yield infrastructure: automated vault strategies.', tint: '#D9E6FA', icon: <S color="#2b5bab" w={18}><polygon points="12 2 22 8.5 12 15 2 8.5" /><polyline points="2 15.5 12 22 22 15.5" /></S> },
  { name: 'Trustless Work', blurb: 'Non-custodial milestone escrow in USDC.', tint: '#D9E6FA', icon: <S color="#2b5bab" w={18}><polygon points="12 2 20 7 20 17 12 22 4 17 4 7" /><path d="m9 12 2 2 4-4" /></S> },
  { name: 'USDC (Stellar Asset Contract)', blurb: 'The asset most flows touch. First-class citizen.', tint: '#F0EBDD', icon: <S color="#6b6659" w={18}><circle cx="12" cy="12" r="10" /><path d="M14.5 9.5a3 3 0 0 0-5 2.5 3 3 0 0 0 5 2.5" /></S> },
  { name: 'x402', blurb: 'HTTP-request payments / micropayments / agent payments.', tint: '#FFF3C4', wide: true, icon: <S color="#8a6a00" w={18}><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></S> },
]

const SOON = (
  <span style={{ fontSize: 10, fontWeight: 700, color: '#7a6a1a', background: '#FFF3C4', border: '1.5px solid #E8D98A', borderRadius: 999, padding: '3px 10px' }}>SOON</span>
)
const LIVE = (
  <span style={{ fontSize: 10, fontWeight: 800, color: '#222', background: YELLOW, border: '2px solid #222', borderRadius: 999, padding: '2px 10px' }}>LIVE</span>
)

function tabStyle(activeTab: boolean): CSSProperties {
  return {
    padding: '9px 16px',
    borderRadius: 10,
    fontSize: 14.5,
    fontWeight: 600,
    cursor: 'pointer',
    color: activeTab ? '#222' : '#8a8266',
    background: activeTab ? '#FFF3C4' : 'transparent',
    border: activeTab ? '2px solid #222' : '2px solid transparent',
    transition: 'background .15s ease, color .15s ease',
  }
}

export function ContractLibrary({ onCustom }: { onCustom: () => void }) {
  const [tab, setTab] = useState<'cfg' | 'ext' | 'cus'>('cfg')
  return (
    <div style={{ border: '2.5px solid #222', borderRadius: 22, background: '#fff', overflow: 'hidden', boxShadow: '6px 6px 0 #FFD700' }}>
      <div style={{ display: 'flex', gap: 6, padding: '16px 18px', borderBottom: '2px solid #222', background: '#FFFDF5' }}>
        <div onClick={() => setTab('cfg')} style={tabStyle(tab === 'cfg')}>Configurable</div>
        <div onClick={() => setTab('ext')} style={tabStyle(tab === 'ext')}>Existing</div>
        <div onClick={() => setTab('cus')} style={tabStyle(tab === 'cus')}>Custom</div>
      </div>

      {tab === 'cfg' && (
        <div style={{ padding: 26 }}>
          <div style={{ fontSize: 14.5, color: '#6b6659', marginBottom: 22, fontWeight: 500 }}>
            Audited OpenZeppelin contracts for Soroban. Configure, then deploy.
          </div>
          <div className="xlm-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {CONFIGURABLE.map((c) =>
              c.soon ? (
                <div key={c.name} style={{ border: '2px dashed #cfc7ac', borderRadius: 14, padding: 22, background: '#FBF8EC' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    {c.icon}
                    {SOON}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 7, color: '#8a8266' }}>{c.name}</div>
                  <div style={{ fontSize: 14.5, color: '#a89f80', lineHeight: 1.5, fontWeight: 500 }}>{c.blurb}</div>
                </div>
              ) : (
                <div key={c.name} className="xlm-card" style={{ border: '2px solid #222', borderRadius: 14, padding: 22, background: '#fff' }}>
                  <div style={{ marginBottom: 16 }}>{c.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 7 }}>{c.name}</div>
                  <div style={{ fontSize: 14.5, color: '#6b6659', lineHeight: 1.5, fontWeight: 500 }}>{c.blurb}</div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {tab === 'ext' && (
        <div style={{ padding: 26 }}>
          <div style={{ fontSize: 14.5, color: '#6b6659', marginBottom: 22, fontWeight: 500 }}>
            Connect to a live, audited protocol by its contract ID. Soroswap is live; more soon.
          </div>
          <div className="xlm-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {EXISTING.map((c) =>
              c.live ? (
                <div
                  key={c.name}
                  className="xlm-card"
                  style={{ border: '2px solid #222', borderRadius: 14, padding: 22, background: '#fff', gridColumn: c.wide ? '1 / -1' : undefined }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, border: '2px solid #222', background: c.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.icon}
                    </div>
                    {LIVE}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 7 }}>{c.name}</div>
                  <div style={{ fontSize: 14.5, color: '#6b6659', lineHeight: 1.5, fontWeight: 500 }}>{c.blurb}</div>
                </div>
              ) : (
                <div
                  key={c.name}
                  style={{ border: '2px dashed #cfc7ac', borderRadius: 14, padding: 22, background: '#FBF8EC', gridColumn: c.wide ? '1 / -1' : undefined }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, border: '2px solid #cfc7ac', background: '#F3ECD8', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
                      {c.icon}
                    </div>
                    {SOON}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 7, color: '#8a8266' }}>{c.name}</div>
                  <div style={{ fontSize: 14.5, color: '#a89f80', lineHeight: 1.5, fontWeight: 500 }}>{c.blurb}</div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {tab === 'cus' && (
        <div style={{ padding: '48px 26px 58px', textAlign: 'center' }}>
          <img
            src="/stellita/mascot-explaining.gif"
            alt="Stellita"
            width={90}
            style={{ display: 'block', margin: '0 auto 20px', imageRendering: 'pixelated' }}
          />
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 12 }}>Describe any contract in plain language</div>
          <div style={{ fontSize: 16, color: '#6b6659', maxWidth: 480, margin: '0 auto 26px', lineHeight: 1.55, fontWeight: 500 }}>
            We generate the Soroban code, compile it, and deploy it to testnet — so you can experiment with logic that no template covers.
          </div>
          <div
            onClick={onCustom}
            className="xlm-pill"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: YELLOW, color: '#222', fontWeight: 700, fontSize: 15, padding: '12px 24px', borderRadius: 12, border: '2px solid #222', boxShadow: '4px 4px 0 #222', cursor: 'pointer' }}
          >
            Generate a custom contract
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </div>
        </div>
      )}
    </div>
  )
}
