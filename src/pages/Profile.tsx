import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/store'
import { useProjects } from '../projects/store'
import { api } from '../lib/backend'
import { PlanBadge } from '../components/PlanBadge'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

interface UsageDay {
  day: string
  count: number
}

/** Route "/profile" — account overview: plan, credits, and daily usage. */
export function Profile() {
  const navigate = useNavigate()
  const { user, logout, credits } = useAuth()
  const { projects } = useProjects()
  const [usage, setUsage] = useState<UsageDay[]>([])

  useEffect(() => {
    api<{ days: UsageDay[] }>('/auth/usage')
      .then(({ days }) => setUsage(days ?? []))
      .catch(() => setUsage([]))
  }, [])

  if (!user) return null

  const peak = Math.max(1, ...usage.map((d) => d.count))

  return (
    <main className="flex flex-1 justify-center overflow-y-auto px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#222] bg-[#FFF3C4] text-lg font-semibold text-[#D9A400]">
            {initials(user.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-[#222222]">{user.name}</h1>
              {credits && <PlanBadge plan={credits.plan} />}
            </div>
            <p className="text-[13.5px] text-[#8a8266]">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-xl border-2 border-[#222] bg-white p-4">
            <p className="text-2xl font-semibold text-[#222222]">{projects.length}</p>
            <p className="text-[12.5px] text-[#8a8266]">Projects</p>
          </div>
          <div className="rounded-xl border-2 border-[#222] bg-white p-4">
            <p className="text-2xl font-semibold text-[#222222]">
              {credits?.unlimited ? '∞' : (credits?.remaining ?? '—')}
            </p>
            <p className="text-[12.5px] text-[#8a8266]">
              {credits?.unlimited
                ? 'Credits'
                : `of ${credits?.limit ?? '—'} credits today`}
            </p>
          </div>
          <div className="rounded-xl border-2 border-[#222] bg-white p-4">
            <p className="text-2xl font-semibold text-[#222222]">testnet</p>
            <p className="text-[12.5px] text-[#8a8266]">Network</p>
          </div>
        </div>

        {/* Daily usage history */}
        <div className="mt-8">
          <h2 className="mb-3 text-[13px] font-medium uppercase tracking-wide text-[#8a8266]">
            Usage (last 30 days)
          </h2>
          {usage.length === 0 ? (
            <p className="text-[13px] text-[#a89f80]">No prompts yet.</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {usage.map((d) => (
                <div key={d.day} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-[12px] tabular-nums text-[#8a8266]">
                    {d.day}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full border border-[#222] bg-[#FFF9E0]">
                    <div
                      className="h-full rounded-full bg-[#FFD700]"
                      style={{ width: `${(d.count / peak) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right text-[12px] tabular-nums text-[#222222]">
                    {d.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            logout()
            navigate('/')
          }}
          className="mt-8 rounded-lg border-2 border-[#222] bg-white px-4 py-2 text-[13.5px] font-medium text-[#6b6659] transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:text-[#222222] hover:shadow-[3px_3px_0_#222]"
        >
          Sign out
        </button>
      </div>
    </main>
  )
}
