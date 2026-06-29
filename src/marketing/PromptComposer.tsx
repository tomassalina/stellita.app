import { useState } from 'react'
import { YELLOW } from './shared'
import './marketing.css'

/* The landing hero prompt box, extracted so /app uses the IDENTICAL composer:
   dark card + textarea + model selector + mic + yellow send. */

function ModelSelector() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <div onClick={() => setOpen((o) => !o)} className="xlm-iconbtn" style={{ display: 'flex', alignItems: 'center', gap: 9, border: '1px solid #262626', borderRadius: 10, padding: '8px 13px', fontSize: 14, color: '#e4e4e4', cursor: 'pointer' }}>
        <svg width="15" height="15" viewBox="0 0 100 100"><line x1="24" y1="24" x2="76" y2="76" stroke="#F6F7F8" strokeWidth="15" strokeLinecap="square" /><line x1="76" y1="24" x2="24" y2="76" stroke={YELLOW} strokeWidth="15" strokeLinecap="square" /></svg>
        XLM Mini
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
      </div>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 15 }} />
          <div style={{ position: 'absolute', bottom: 'calc(100% + 10px)', left: 0, width: 248, background: '#101010', border: '1px solid #262626', borderRadius: 14, padding: 7, boxShadow: '0 16px 50px rgba(0,0,0,0.6)', zIndex: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 13px', borderRadius: 9, background: '#1a1a1a' }}>
              <div><div style={{ fontSize: 14.5, fontWeight: 600, color: '#fafafa' }}>XLM Mini</div><div style={{ fontSize: 12, color: '#8a8a8a' }}>Fast &amp; free on testnet</div></div>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={YELLOW} strokeWidth="2.4"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            {[['XLM Pro', 'Deeper reasoning'], ['XLM Max', 'Most capable']].map(([n, d]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 13px', borderRadius: 9, opacity: 0.5 }}>
                <div><div style={{ fontSize: 14.5, fontWeight: 600 }}>{n}</div><div style={{ fontSize: 12, color: '#7a7a7a' }}>{d}</div></div>
                <span style={{ fontSize: 11, color: '#8a8a8a', background: '#1f1f1f', borderRadius: 999, padding: '3px 10px' }}>Soon</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function PromptComposer({
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
    <div className="xlm-popin" style={{ position: 'relative', maxWidth: 760, margin: '0 auto', background: '#0c0c0c', border: '1px solid #242424', borderRadius: 18, padding: '22px 22px 16px', textAlign: 'left', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
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
        style={{ width: '100%', resize: 'none', background: 'transparent', border: 'none', outline: 'none', color: '#fafafa', fontSize: 18, lineHeight: 1.5, minHeight: 58, fontFamily: 'inherit' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <ModelSelector />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="xlm-iconbtn" style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #262626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9a9a9a', cursor: 'pointer' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
          </div>
          <div onClick={onSubmit} className="xlm-pill" style={{ width: 38, height: 38, borderRadius: 10, background: YELLOW, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0a0a', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
          </div>
        </div>
      </div>
    </div>
  )
}
