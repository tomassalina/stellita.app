import { useState } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'

/** Normalize for the name match: trim, case-insensitive, accent-insensitive. */
function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining accent marks
    .trim()
    .toLowerCase()
}

/**
 * Destructive delete guard. The user must type BOTH:
 *   1. the project name (trim + case/accent-insensitive), and
 *   2. the word "delete" (case-insensitive)
 * before the action is enabled.
 */
export function DeleteProjectModal({
  projectName,
  onClose,
  onConfirm,
}: {
  projectName: string
  onClose: () => void
  onConfirm: () => void | Promise<void>
}) {
  const [nameInput, setNameInput] = useState('')
  const [wordInput, setWordInput] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const nameOk = normalize(nameInput) === normalize(projectName)
  const wordOk = wordInput.trim().toLowerCase() === 'delete'
  const ready = nameOk && wordOk && !deleting

  const confirm = async () => {
    if (!ready) return
    setDeleting(true)
    setError('')
    try {
      await onConfirm()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete the project')
      setDeleting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-red-300">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-[15px] font-medium">Delete project</h2>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
          This permanently deletes{' '}
          <span className="text-zinc-200">{projectName}</span> — its files,
          versions, messages and contract records. This can't be undone.
        </p>

        <label className="mt-4 block">
          <span className="mb-1 block text-[12px] text-zinc-500">
            Type the project name to confirm
          </span>
          <input
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder={projectName}
            className={`w-full select-text rounded-lg border bg-zinc-900 px-3 py-2 text-[14px] text-zinc-100 outline-none ${
              nameInput && !nameOk
                ? 'border-red-900/70 focus:border-red-700'
                : 'border-zinc-800 focus:border-zinc-600'
            }`}
          />
        </label>

        <label className="mt-3 block">
          <span className="mb-1 block text-[12px] text-zinc-500">
            Type <code className="text-zinc-300">delete</code> to confirm
          </span>
          <input
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && ready) void confirm()
              if (e.key === 'Escape') onClose()
            }}
            placeholder="delete"
            className={`w-full select-text rounded-lg border bg-zinc-900 px-3 py-2 text-[14px] text-zinc-100 outline-none ${
              wordInput && !wordOk
                ? 'border-red-900/70 focus:border-red-700'
                : 'border-zinc-800 focus:border-zinc-600'
            }`}
          />
        </label>

        {error && (
          <p className="mt-3 text-[12.5px] text-red-400">{error}</p>
        )}

        <div className="mt-5 flex justify-end gap-2 text-[13px]">
          <button
            onClick={onClose}
            className="rounded-lg px-3.5 py-1.5 text-zinc-400 hover:text-zinc-100"
          >
            Cancel
          </button>
          <button
            onClick={() => void confirm()}
            disabled={!ready}
            className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3.5 py-1.5 font-medium text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {deleting ? 'Deleting…' : 'Delete project'}
          </button>
        </div>
      </div>
    </div>
  )
}
