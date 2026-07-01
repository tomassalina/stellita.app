import { useState } from 'react'
import { Loader2, AlertTriangle, Copy, Check } from 'lucide-react'

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
  const [copied, setCopied] = useState(false)

  const copyName = async () => {
    try {
      await navigator.clipboard.writeText(projectName)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable (insecure context / denied) — the user can still
      // type the name manually.
    }
  }

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
        className="w-full max-w-md rounded-xl border-2 border-[#222] bg-white p-5"
        style={{ boxShadow: '6px 6px 0 #222' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-[#B3261E]">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-[15px] font-medium">Delete project</h2>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-[#6b6659]">
          This permanently deletes{' '}
          <span className="text-[#222222]">{projectName}</span> — its files,
          versions, messages and contract records. This can't be undone.
        </p>

        <label className="mt-4 block">
          <span className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[12px] text-[#8a8266]">
            Type
            <span className="inline-flex items-center gap-1 rounded-md border-2 border-[#222] bg-[#FFF9E0] px-1.5 py-0.5">
              <code className="select-all font-mono text-[12.5px] text-[#222222]">{projectName}</code>
              <button
                type="button"
                onClick={() => void copyName()}
                title="Copy project name"
                aria-label="Copy project name"
                className="text-[#8a8266] transition-colors hover:text-[#222222]"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </span>
            to confirm
          </span>
          <input
            autoFocus
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder={projectName}
            className={`w-full select-text rounded-lg border-2 bg-white px-3 py-2 text-[14px] text-[#222222] outline-none ${
              nameInput && !nameOk
                ? 'border-[#B3261E] focus:border-[#B3261E]'
                : 'border-[#222] focus:border-[#D9A400]'
            }`}
          />
        </label>

        <label className="mt-3 block">
          <span className="mb-1 block text-[12px] text-[#8a8266]">
            Type <code className="font-mono text-[#222222]">delete</code> to confirm
          </span>
          <input
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && ready) void confirm()
              if (e.key === 'Escape') onClose()
            }}
            placeholder="delete"
            className={`w-full select-text rounded-lg border-2 bg-white px-3 py-2 text-[14px] text-[#222222] outline-none ${
              wordInput && !wordOk
                ? 'border-[#B3261E] focus:border-[#B3261E]'
                : 'border-[#222] focus:border-[#D9A400]'
            }`}
          />
        </label>

        {error && (
          <p className="mt-3 text-[12.5px] text-[#B3261E]">{error}</p>
        )}

        <div className="mt-5 flex justify-end gap-2 text-[13px]">
          <button
            onClick={onClose}
            className="rounded-lg px-3.5 py-1.5 text-[#8a8266] hover:text-[#222222]"
          >
            Cancel
          </button>
          <button
            onClick={() => void confirm()}
            disabled={!ready}
            style={{ boxShadow: ready ? '3px 3px 0 #222' : undefined }}
            className="flex items-center gap-1.5 rounded-lg border-2 border-[#222] bg-[#FF6B6B] px-3.5 py-1.5 font-medium text-[#222222] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {deleting ? 'Deleting…' : 'Delete project'}
          </button>
        </div>
      </div>
    </div>
  )
}
