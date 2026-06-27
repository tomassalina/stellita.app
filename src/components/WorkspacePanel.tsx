import { useState } from 'react'
import {
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from '@codesandbox/sandpack-react'
import { Monitor, Smartphone, Download } from 'lucide-react'
import type { FileTree } from '../../shared/types'
import { SANDPACK_TEMPLATE, TAILWIND_CDN, sandpackTheme } from '../lib/project'
import { downloadProjectZip } from '../lib/export'

type Device = 'desktop' | 'mobile'

type Tab = 'preview' | 'code' | 'contract'
const TABS: { id: Tab; label: string }[] = [
  { id: 'preview', label: 'Preview' },
  { id: 'code', label: 'Code' },
  { id: 'contract', label: 'Contract' },
]

/** Cheap content hash so the Sandpack subtree remounts only when files change. */
function hashTree(tree: FileTree): number {
  const s = Object.entries(tree)
    .map(([k, v]) => `${k}\0${v}`)
    .join('\0')
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0
  return h
}

/**
 * Right column: live preview + code in one Sandpack instance.
 *
 * - Tailwind is injected via `externalResources` (the only thing that works in
 *   the classic bundler).
 * - The provider remounts (via `key`) when file content changes, so updates are
 *   always reflected.
 * - Default (light) theme — the generated apps are light, so we don't want a
 *   dark Sandpack chrome showing through.
 * - The `absolute inset-0` wrapper gives the iframe a concrete pixel box.
 */
export function WorkspacePanel({
  fileTree,
  projectName = 'stellar-app',
}: {
  fileTree: FileTree
  projectName?: string
}) {
  const [tab, setTab] = useState<Tab>('preview')
  const [device, setDevice] = useState<Device>('desktop')

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col">
      <nav className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-3 py-2.5 text-[13px]">
        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                tab === t.id
                  ? 'rounded-md bg-zinc-900 px-3 py-1.5 text-zinc-50'
                  : 'rounded-md px-3 py-1.5 text-zinc-500 transition-colors hover:text-zinc-300'
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {tab === 'preview' && (
            <div className="flex items-center rounded-md border border-zinc-800 p-0.5">
              <button
                onClick={() => setDevice('desktop')}
                title="Desktop"
                className={`rounded p-1.5 transition-colors ${device === 'desktop' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                title="Mobile"
                className={`rounded p-1.5 transition-colors ${device === 'mobile' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
          )}
          <button
            onClick={() => void downloadProjectZip(projectName, fileTree)}
            className="flex items-center gap-1.5 rounded-md border border-zinc-800 px-3 py-1.5 text-zinc-300 transition-colors hover:border-zinc-700 hover:text-zinc-50"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </nav>

      <div className="relative min-h-0 flex-1 bg-zinc-950">
        <div className="absolute inset-0">
          <SandpackProvider
            key={hashTree(fileTree)}
            template={SANDPACK_TEMPLATE}
            files={fileTree}
            theme={sandpackTheme}
            options={{ externalResources: [TAILWIND_CDN] }}
            style={{ height: '100%' }}
          >
            <div className="flex h-full flex-col">
              <div
                className={
                  tab === 'preview'
                    ? 'flex min-h-0 flex-1 justify-center bg-zinc-900/30'
                    : 'hidden'
                }
              >
                <div
                  className="h-full"
                  style={{ width: device === 'mobile' ? 390 : '100%' }}
                >
                  <SandpackPreview
                    showNavigator
                    showOpenInCodeSandbox={false}
                    showRefreshButton
                    style={{ height: '100%' }}
                  />
                </div>
              </div>
              <div className={tab === 'code' ? 'flex min-h-0 flex-1' : 'hidden'}>
                <SandpackFileExplorer style={{ height: '100%', width: 200 }} />
                <SandpackCodeEditor
                  readOnly
                  showLineNumbers
                  showTabs={false}
                  style={{ height: '100%', flex: 1 }}
                />
              </div>
            </div>
          </SandpackProvider>
        </div>

        {tab === 'contract' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black text-[13px] text-zinc-600">
            Deployed contracts appear here (Milestone 2).
          </div>
        )}
      </div>
    </section>
  )
}
