import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '../projects/store'
import { PromptInput } from '../components/PromptInput'
import { fetchTemplates, type TemplateSummary } from '../lib/backend'

/** Route "/app" — the build home inside the authed shell. */
export function BuildHome() {
  const navigate = useNavigate()
  const { createProject, openTemplate } = useProjects()
  const [templates, setTemplates] = useState<TemplateSummary[]>([])

  useEffect(() => {
    fetchTemplates()
      .then(setTemplates)
      .catch((err) => console.warn('[templates] failed to load:', err))
  }, [])

  const startWithPrompt = (text: string) => {
    navigate(`/projects/${createProject(text)}`)
  }

  const openTpl = async (t: TemplateSummary) => {
    try {
      const slug = await openTemplate(t.id)
      navigate(`/projects/${slug}`)
    } catch (err) {
      console.warn('[templates] failed to open:', err)
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-2xl -translate-y-8">
        <h1 className="mb-8 text-center text-3xl font-medium tracking-tight sm:text-4xl">
          What do you want to build?
        </h1>
        <PromptInput
          onSend={startWithPrompt}
          busy={false}
          autoFocus
          placeholder="Describe a Stellar app in plain language…"
        />
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => void openTpl(t)}
              className="rounded-full border border-zinc-800 px-3 py-1.5 text-[12.5px] text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
