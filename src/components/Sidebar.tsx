import { Link, NavLink } from 'react-router-dom'
import { Plus, MessageSquare, Sparkles } from 'lucide-react'
import { useProjects } from '../projects/store'
import { useAuth } from '../auth/store'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * v0-style collapsible sidebar: brand → home, new project, project history, and
 * the user profile pinned bottom-left. Collapses to an icon rail.
 */
export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const { projects } = useProjects()
  const { user } = useAuth()

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 transition-[width] duration-200 ${
        collapsed ? 'w-14' : 'w-64'
      }`}
    >
      {/* Brand → home */}
      <Link
        to="/app"
        className="flex h-14 items-center gap-2.5 px-4 hover:bg-zinc-900/50"
        title="Stellarable — home"
      >
        <Sparkles className="h-5 w-5 shrink-0 text-violet-400" />
        {!collapsed && (
          <span className="text-[15px] font-medium tracking-tight">
            Stellarable
          </span>
        )}
      </Link>

      {/* New project */}
      <div className="px-2 py-2">
        <Link
          to="/app"
          className={`flex items-center gap-2 rounded-md border border-zinc-800 px-2.5 py-2 text-[13px] text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-50 ${
            collapsed ? 'justify-center' : ''
          }`}
          title="New project"
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && <span>New project</span>}
        </Link>
      </div>

      {/* History */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2">
        {!collapsed && (
          <p className="px-2.5 py-2 text-[11px] font-medium uppercase tracking-wide text-zinc-600">
            Projects
          </p>
        )}
        <nav className="flex flex-col gap-0.5">
          {projects.map((p) => (
            <NavLink
              key={p.slug}
              to={`/projects/${p.slug}`}
              title={p.name}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-2.5 py-2 text-[13px] transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-zinc-50'
                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{p.name}</span>}
            </NavLink>
          ))}
          {!collapsed && projects.length === 0 && (
            <p className="px-2.5 py-2 text-[12.5px] text-zinc-600">
              No projects yet.
            </p>
          )}
        </nav>
      </div>

      {/* User profile (bottom-left) */}
      {user && (
        <div className="border-t border-zinc-800 p-2">
          <NavLink
            to="/profile"
            title={user.name}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors ${
                isActive ? 'bg-zinc-900' : 'hover:bg-zinc-900/50'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-[11px] font-semibold text-violet-300">
              {initials(user.name)}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-[13px] text-zinc-200">{user.name}</p>
                <p className="truncate text-[11px] text-zinc-500">
                  {user.email}
                </p>
              </div>
            )}
          </NavLink>
        </div>
      )}
    </aside>
  )
}
