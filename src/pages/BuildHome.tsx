import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '../projects/store'
import { PromptComposer } from '../marketing/PromptComposer'
import { TEMPLATES } from '../lib/templates'

/** Route "/app" — the build home inside the authed shell. Uses the SAME prompt
 *  composer as the landing hero, with static template badges. */
export function BuildHome() {
  const navigate = useNavigate()
  const { createProject } = useProjects()
  const [prompt, setPrompt] = useState('')

  const submitPrompt = () => {
    const text = prompt.trim()
    if (!text) return
    navigate(`/projects/${createProject(text)}`)
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-2xl -translate-y-8">
        <h1 className="mb-8 text-center text-3xl font-medium tracking-tight sm:text-4xl">
          What do you want to build?
        </h1>
        <PromptComposer value={prompt} onChange={setPrompt} onSubmit={submitPrompt} />
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          {TEMPLATES.map((t) => (
            <button
              key={t.token}
              onClick={() => navigate(`/p/${t.token}`)}
              className="rounded-full border border-zinc-800 px-4 py-2 text-[13px] text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-50"
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}
