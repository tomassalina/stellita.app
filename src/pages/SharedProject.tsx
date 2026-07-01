import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { useAuth } from '../auth/store'
import { useProjects } from '../projects/store'
import { LoginModal } from '../auth/LoginModal'
import { ChatPanel } from '../components/ChatPanel'
import { WorkspacePanel } from '../components/WorkspacePanel'
import type { Version } from '../projects/store'
import { fetchShared } from '../lib/backend'
import { useFreighterBridge } from '../wallet/freighterBridge'
import { Logo, Wordmark } from '../marketing/shared'
import type { ChatMessage, DeployedContract, FileTree } from '../../shared/types'

type Loaded = {
  name: string
  files: FileTree
  contracts: DeployedContract[]
  versions: Version[]
  messages: ChatMessage[]
}

/** Public read-only view of a shared project at /p/:token. Looks like the app —
 *  chat on the left (locked: "Sign in to code") + workspace on the right. Anyone
 *  can view code/contracts/console/versions; sign in + clone to edit. */
export function SharedProject() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cloneSharedProject } = useProjects()
  const [data, setData] = useState<Loaded | null>(null)
  const [error, setError] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [cloning, setCloning] = useState(false)
  const [view, setView] = useState<FileTree | null>(null)
  const [gen, setGen] = useState(1)
  const [resizing, setResizing] = useState(false)
  const [params] = useSearchParams()
  const autoCloned = useRef(false)
  // Answer Freighter requests forwarded from the preview iframe — same bridge the
  // authed shell uses, so wallet connect works on the shared page too.
  useFreighterBridge()

  useEffect(() => {
    if (!token) return
    fetchShared(token)
      .then((d) => {
        const files = (d.project.current_files ?? d.versions.at(-1)?.files ?? {}) as FileTree
        const versions: Version[] = (d.versions ?? []).map((v) => ({
          id: v.id,
          label: v.label ?? 'Version',
          summary: v.summary ?? '',
          fileTree: v.files ?? {},
          createdAt: new Date(v.created_at).getTime(),
        }))
        const messages: ChatMessage[] = (d.messages ?? []).map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
          createdAt: new Date(m.created_at).getTime(),
        }))
        setData({ name: d.project.name, files, contracts: (d.contracts ?? []) as DeployedContract[], versions, messages })
        setView(files)
      })
      .catch(() => setError('This shared project could not be found.'))
  }, [token])

  const doClone = async () => {
    if (!token) return
    setCloning(true)
    try {
      navigate(`/projects/${await cloneSharedProject(token)}`)
    } catch {
      setCloning(false)
      setError('Could not clone this project.')
    }
  }

  const clone = () => {
    if (!user) {
      setShowLogin(true)
      return
    }
    void doClone()
  }

  // Returning from Google OAuth lands here with ?clone=1 + a session → finish the
  // clone the user started before the redirect. Fires once.
  useEffect(() => {
    if (user && params.get('clone') === '1' && token && !autoCloned.current) {
      autoCloned.current = true
      void doClone()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, params, token])

  const openVersion = (id: string) => {
    const v = data?.versions.find((x) => x.id === id)
    if (!v) return
    setView(v.fileTree)
    setGen((g) => g + 1)
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#FFFDF5] text-[#6b6659]">
        <p className="text-[14px]">{error}</p>
        <button
          onClick={() => navigate('/')}
          style={{ boxShadow: '3px 3px 0 #222' }}
          className="rounded-lg border-2 border-[#222] bg-white px-4 py-2 text-[13px] text-[#222222] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          Go home
        </button>
      </div>
    )
  }

  if (!data) {
    return <div className="flex h-full items-center justify-center bg-[#FFFDF5] text-[13px] text-[#8a8266]">Loading shared project…</div>
  }

  return (
    <div className="flex h-full flex-col bg-[#FFFDF5] text-[#222222]">
      <header className="flex h-12 shrink-0 items-center justify-between border-b-2 border-[#222] bg-white px-4">
        <div onClick={() => navigate('/')} className="flex cursor-pointer items-center gap-2.5">
          <Logo size={20} />
          <Wordmark size={16} />
          <span className="ml-2 rounded-full border-2 border-[#222] px-2 py-0.5 text-[10.5px] uppercase tracking-wide text-[#6b6659]">
            Shared · read-only
          </span>
        </div>
        <span className="truncate text-[13px] text-[#8a8266]">{data.name}</span>
      </header>

      <PanelGroup direction="horizontal" className="relative min-h-0 flex-1">
        {resizing && <div className="fixed inset-0 z-50 cursor-col-resize select-none" />}
        <Panel defaultSize={34} minSize={22} maxSize={50}>
          <ChatPanel
            projectName={data.name}
            onRename={() => {}}
            messages={data.messages}
            busy={false}
            error={null}
            activity={[]}
            streamingMessage=""
            filePaths={Object.keys(view ?? data.files)}
            onSend={() => {}}
            onRunActions={async () => {}}
            onSkipActions={() => {}}
            readOnly
            signedIn={!!user}
            onClone={clone}
            cloning={cloning}
          />
        </Panel>
        <PanelResizeHandle
          onDragging={setResizing}
          className="w-1 bg-[#222] transition-colors hover:bg-[#FFD700]/70 data-[resize-handle-state=drag]:bg-[#FFD700]"
        />
        <Panel defaultSize={66} minSize={30}>
          <div className={`h-full ${resizing ? 'pointer-events-none' : ''}`}>
            <WorkspacePanel
              fileTree={view ?? data.files}
              projectName={data.name}
              contracts={data.contracts}
              versions={data.versions}
              onOpenVersion={openVersion}
              readOnly
              generation={gen}
            />
          </div>
        </Panel>
      </PanelGroup>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onAuthed={() => void doClone()}
          googleNext={`/p/${token}?clone=1`}
        />
      )}
    </div>
  )
}
