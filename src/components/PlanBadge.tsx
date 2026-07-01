/** Plan tier pill with a distinct look per tier. */
const STYLES: Record<string, { label: string; cls: string }> = {
  hacker: { label: 'Hacker', cls: 'border-zinc-700 bg-zinc-800/60 text-zinc-300' },
  builder: { label: 'Builder', cls: 'border-sky-500/30 bg-sky-500/10 text-sky-300' },
  studio: { label: 'Studio', cls: 'border-violet-500/30 bg-violet-500/10 text-violet-300' },
  admin: {
    label: 'Admin',
    cls: 'border-[#FDDA24]/40 bg-[#FDDA24]/12 text-[#FDDA24]',
  },
}

export function PlanBadge({
  plan,
  className = '',
}: {
  plan?: string | null
  className?: string
}) {
  const s = STYLES[plan ?? 'hacker'] ?? STYLES['hacker']
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${s.cls} ${className}`}
    >
      {s.label}
    </span>
  )
}
