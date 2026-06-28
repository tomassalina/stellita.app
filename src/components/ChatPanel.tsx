import { useEffect, useRef, useState } from 'react'
import { Check, FilePlus2, FilePen, Trash2, Pencil, Copy } from 'lucide-react'
import type { ChatMessage } from '../../shared/types'
import type { Activity } from '../lib/api'
import { PromptInput } from './PromptInput'

/** Left column: header (chat name) + conversation history + live activity + input. */
export function ChatPanel({
  projectName,
  onRename,
  messages,
  busy,
  error,
  activity,
  streamingMessage,
  filePaths,
  onSend,
}: {
  projectName: string
  onRename: (name: string) => void
  messages: ChatMessage[]
  busy: boolean
  error: string | null
  activity: Activity[]
  streamingMessage: string
  filePaths: string[]
  onSend: (text: string) => void
}) {
  const endRef = useRef<HTMLDivElement>(null)
  const [renaming, setRenaming] = useState(false)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, busy, activity, streamingMessage])

  return (
    <section className="flex h-full flex-col">
      {/* Header — same height as the workspace tabs row */}
      <header className="flex shrink-0 items-center border-b border-zinc-800 px-3 py-2.5">
        <button
          onClick={() => setRenaming(true)}
          title="Rename chat"
          className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] text-zinc-200 transition-colors hover:bg-zinc-900"
        >
          <span className="truncate font-medium">{projectName}</span>
          <Pencil className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
        </button>
      </header>

      {renaming && (
        <RenameModal
          current={projectName}
          onClose={() => setRenaming(false)}
          onSave={(name) => {
            onRename(name)
            setRenaming(false)
          }}
        />
      )}

      <div className="flex-1 select-text space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <Message key={i} {...m} />
        ))}
        {busy && (
          <ThinkingTrace activity={activity} message={streamingMessage} />
        )}
        {error && (
          <div className="rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-[13px] text-red-300">
            {error}
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="border-t border-zinc-800 p-4">
        <PromptInput onSend={onSend} busy={busy} filePaths={filePaths} />
      </div>
    </section>
  )
}

function Message({ role, content, files, versionName }: ChatMessage) {
  const isUser = role === 'user'
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const long = content.length > 300 || content.split('\n').length > 6

  return (
    <div className={isUser ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={`group relative max-w-[85%] rounded-2xl px-3.5 py-2 text-[13.5px] ${
          isUser
            ? 'rounded-br-sm bg-zinc-100 text-black'
            : 'rounded-bl-sm bg-zinc-900 text-zinc-200'
        }`}
      >
        {!isUser && versionName && (
          <div className="mb-1 text-[11px] font-medium text-zinc-500">
            {versionName}
          </div>
        )}
        <div
          className={`whitespace-pre-wrap ${
            long && !expanded ? 'max-h-28 overflow-hidden' : ''
          }`}
        >
          {content}
        </div>
        {long && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className={`mt-1 text-[12px] font-medium ${
              isUser ? 'text-zinc-500 hover:text-black' : 'text-zinc-500 hover:text-zinc-200'
            }`}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
        {files && files.length > 0 && <FileOpsTrace ops={files} />}

        {/* Copy (appears on hover) */}
        <button
          onClick={() => {
            void navigator.clipboard?.writeText(content)
            setCopied(true)
            setTimeout(() => setCopied(false), 1200)
          }}
          title="Copy message"
          className={`absolute -top-2 right-2 rounded-md border p-1 opacity-0 transition-opacity group-hover:opacity-100 ${
            isUser
              ? 'border-zinc-300 bg-zinc-100 text-zinc-500 hover:text-black'
              : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-100'
          }`}
        >
          {copied ? (
            <Check className="h-3 w-3 text-emerald-400" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  )
}

/** Static (persisted) list of files touched in a turn — stays in the chat. */
function FileOpsTrace({ ops }: { ops: NonNullable<ChatMessage['files']> }) {
  return (
    <ul className="mt-2 space-y-1 border-t border-zinc-800 pt-2">
      {ops.map((a, i) => {
        const Icon = OP_ICON[a.op]
        return (
          <li
            key={i}
            className="flex items-center gap-1.5 text-[12px] text-zinc-500"
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <span>{VERB[a.op]}</span>
            <code className="truncate text-zinc-400">{a.path}</code>
          </li>
        )
      })}
    </ul>
  )
}

const VERB: Record<Activity['op'], string> = {
  create: 'Creating',
  edit: 'Editing',
  delete: 'Deleting',
}
const OP_ICON = { create: FilePlus2, edit: FilePen, delete: Trash2 }

/** v0-style live trace: streaming message + a list of files being touched. */
function ThinkingTrace({
  activity,
  message,
}: {
  activity: Activity[]
  message: string
}) {
  return (
    <div className="flex flex-col gap-2">
      {message && (
        <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-zinc-900 px-3.5 py-2 text-[13.5px] whitespace-pre-wrap text-zinc-200">
          {message}
        </div>
      )}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5">
        {activity.length === 0 ? (
          <div className="flex items-center gap-2 text-[12.5px] text-zinc-500">
            <Spinner />
            Thinking…
          </div>
        ) : (
          <ul className="space-y-1.5">
            {activity.map((a, i) => {
              const last = i === activity.length - 1
              const Icon = OP_ICON[a.op]
              return (
                <li key={i} className="flex items-center gap-2 text-[12.5px]">
                  {last ? (
                    <Spinner />
                  ) : (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  )}
                  <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                  <span className="text-zinc-500">{VERB[a.op]}</span>
                  <code className="truncate text-zinc-300">{a.path}</code>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <span className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-300" />
  )
}

/** Centered modal to rename the current chat/project. */
function RenameModal({
  current,
  onClose,
  onSave,
}: {
  current: string
  onClose: () => void
  onSave: (name: string) => void
}) {
  const [value, setValue] = useState(current)
  const save = () => {
    if (value.trim()) onSave(value)
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[15px] font-medium">Rename chat</h2>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') onClose()
          }}
          className="mt-4 w-full select-text rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-[14px] text-zinc-100 outline-none focus:border-zinc-600"
        />
        <div className="mt-5 flex justify-end gap-2 text-[13px]">
          <button
            onClick={onClose}
            className="rounded-lg px-3.5 py-1.5 text-zinc-400 hover:text-zinc-100"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!value.trim()}
            className="rounded-lg bg-zinc-50 px-3.5 py-1.5 font-medium text-black transition-colors hover:bg-white disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
