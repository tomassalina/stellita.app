import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { useAuth } from '../auth/store'

/** Authed app layout: collapsible sidebar + (top bar + routed body). */
export function AppShell() {
  const { user } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  // Fake guard: not "logged in" → back to the marketing landing.
  if (!user) return <Navigate to="/" replace />

  return (
    <div className="flex h-full bg-black text-zinc-50">
      <Sidebar collapsed={collapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onToggleSidebar={() => setCollapsed((c) => !c)} />
        <Outlet />
      </div>
    </div>
  )
}
