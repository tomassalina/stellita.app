/** Plan tier pill with a distinct look per tier. */
const STYLES: Record<string, { label: string; cls: string }> = {
  hacker: { label: 'Hacker', cls: 'border-[#222] bg-white text-[#6b6659]' },
  builder: { label: 'Builder', cls: 'border-[#222] bg-sky-100 text-sky-700' },
  studio: { label: 'Studio', cls: 'border-[#222] bg-violet-100 text-violet-700' },
  admin: {
    label: 'Admin',
    cls: 'border-[#222] bg-[#FFD700] text-[#222222]',
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
      className={`inline-flex items-center rounded-full border-2 px-2 py-0.5 text-[11px] font-semibold ${s.cls} ${className}`}
    >
      {s.label}
    </span>
  )
}
