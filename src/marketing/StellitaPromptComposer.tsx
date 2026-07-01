import { useState } from 'react'
import './marketing.css'

/* Stellita-branded landing hero prompt box. Same behavior contract as the app's
   PromptComposer (value / onChange / onSubmit / placeholder, Enter-to-submit,
   Shift+Enter for newline) but restyled for the neobrutalist Stellita brand:
   cream card, hard yellow offset shadow, pixel mascot model selector, yellow
   send button. Kept separate from PromptComposer.tsx because that component is
   shared with the app (/app) which must stay Stellita. */

const MASCOT = '/stellita/mascot.png'

function ModelSelector() {
  const [open, setOpen] = useState(false)
  const [model] = useState('Stellita Mini')
  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen((o) => !o)}
        className="st-softfill"
        style={{ display: 'flex', alignItems: 'center', gap: 9, border: '2px solid #222', borderRadius: 11, padding: '8px 13px', fontSize: 14, fontWeight: 600, color: '#222', cursor: 'pointer', background: '#FFFDF5' }}
      >
        <img src={MASCOT} alt="" width={18} height={18} className="st-pixelated" style={{ display: 'block' }} />
        {model}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 15 }} />
          <div style={{ position: 'absolute', bottom: 'calc(100% + 10px)', left: 0, width: 256, background: '#fff', border: '2.5px solid #222', borderRadius: 14, padding: 7, boxShadow: '5px 5px 0 #222', zIndex: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 13px', borderRadius: 9, background: '#FFF3C4' }}>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: '#222' }}>Stellita Mini</div>
                <div style={{ fontSize: 12, color: '#8a8266' }}>Fast &amp; free on testnet</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            {[
              ['Stellita Pro', 'Deeper reasoning'],
              ['Stellita Max', 'Most capable'],
            ].map(([n, d]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 13px', borderRadius: 9, opacity: 0.5 }}>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}>{n}</div>
                  <div style={{ fontSize: 12, color: '#8a8266' }}>{d}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#7a6a1a', background: '#FFF3C4', border: '1.5px solid #E8D98A', borderRadius: 999, padding: '3px 10px' }}>SOON</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function StellitaPromptComposer({
  value,
  onChange,
  onSubmit,
  placeholder = 'Describe a contract or dApp… e.g. "an NFT collection with royalties"',
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  placeholder?: string
}) {
  return (
    <div className="st-pop" style={{ position: 'relative', maxWidth: 760, margin: '0 auto', background: '#fff', border: '2.5px solid #222', borderRadius: 20, padding: '22px 22px 16px', textAlign: 'left', boxShadow: '6px 6px 0 #FFD700' }}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSubmit()
          }
        }}
        rows={2}
        placeholder={placeholder}
        style={{ width: '100%', resize: 'none', background: 'transparent', border: 'none', outline: 'none', color: '#222', fontSize: 18, lineHeight: 1.5, minHeight: 58, fontWeight: 500, fontFamily: 'inherit' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <ModelSelector />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="st-softfill" style={{ width: 40, height: 40, borderRadius: 11, border: '2px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', cursor: 'pointer', background: '#FFFDF5' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
          </div>
          <div onClick={onSubmit} className="st-lift st-lift-dark" style={{ width: 40, height: 40, borderRadius: 11, background: '#FFD700', border: '2px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222', cursor: 'pointer', boxShadow: '3px 3px 0 #222' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
          </div>
        </div>
      </div>
    </div>
  )
}
