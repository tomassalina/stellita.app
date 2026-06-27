import { PanelLeft } from 'lucide-react'

/** Platform top bar — sidebar trigger, network badge, wallet/deploy actions. */
export function TopBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 px-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        <span className="rounded-full border border-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
          testnet
        </span>
      </div>
      <div className="flex items-center gap-2 text-[13px]">
        <button className="rounded-full border border-zinc-800 px-3.5 py-1.5 text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-50">
          Connect wallet
        </button>
        <button className="rounded-full bg-zinc-50 px-3.5 py-1.5 font-medium text-black transition-colors hover:bg-white">
          Deploy
        </button>
      </div>
    </header>
  )
}
