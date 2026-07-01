import { useState } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FilePlus,
  FolderPlus,
  Trash2,
} from 'lucide-react'
import type { FileTree as FileTreeMap } from '../../shared/types'

interface TreeNode {
  name: string
  path: string
  dir: boolean
  children: TreeNode[]
}

const isPlaceholder = (rel: string) => /(^|\/)\.(git)?keep$/.test(rel)

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = { name: '', path: '', dir: true, children: [] }
  const insert = (parts: string[], isFile: boolean) => {
    let node = root
    parts.forEach((part, i) => {
      const dir = !(i === parts.length - 1 && isFile)
      let child = node.children.find((c) => c.name === part)
      if (!child) {
        child = { name: part, path: `${node.path}/${part}`, dir, children: [] }
        node.children.push(child)
      }
      node = child
    })
  }
  for (const full of paths) {
    const rel = full.replace(/^\/+/, '')
    if (!rel) continue
    if (isPlaceholder(rel)) {
      const folder = rel.replace(/\/?\.(git)?keep$/, '')
      if (folder) insert(folder.split('/'), false)
    } else {
      insert(rel.split('/'), true)
    }
  }
  return root
}

const sortNodes = (nodes: TreeNode[]) =>
  [...nodes].sort((a, b) =>
    a.dir !== b.dir ? (a.dir ? -1 : 1) : a.name.localeCompare(b.name),
  )

type Menu = { x: number; y: number; node: TreeNode } | null
type NameModal = { kind: 'file' | 'folder'; base: string } | null

/**
 * Custom file explorer over our file tree: open files, and right-click to
 * create files/folders or delete. Folders are path-based; "new folder" drops a
 * hidden `.keep` placeholder so an empty folder still shows. Must live inside
 * SandpackProvider (uses it to open/highlight the active file).
 */
export function FileExplorer({
  fileTree,
  onCreateFile,
  onCreateFolder,
  onDelete,
}: {
  fileTree: FileTreeMap
  onCreateFile: (path: string) => void
  onCreateFolder: (folderPath: string) => void
  onDelete: (path: string) => void
}) {
  const { sandpack } = useSandpack()
  const root = buildTree(Object.keys(fileTree))
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [menu, setMenu] = useState<Menu>(null)
  const [modal, setModal] = useState<NameModal>(null)

  const toggle = (path: string) =>
    setCollapsed((s) => {
      const next = new Set(s)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })

  const openMenu = (e: React.MouseEvent, node: TreeNode) => {
    e.preventDefault()
    e.stopPropagation()
    setMenu({ x: e.clientX, y: e.clientY, node })
  }

  const renderNode = (node: TreeNode, depth: number) => {
    const pad = { paddingLeft: 8 + depth * 12 }
    if (node.dir) {
      const open = !collapsed.has(node.path)
      return (
        <div key={node.path}>
          <button
            onClick={() => toggle(node.path)}
            onContextMenu={(e) => openMenu(e, node)}
            style={pad}
            className="flex w-full items-center gap-1.5 py-1 pr-2 text-left text-[12.5px] text-[#6b6659] hover:bg-[#FFF3C4]"
          >
            {open ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#8a8266]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#8a8266]" />
            )}
            <Folder className="h-3.5 w-3.5 shrink-0 text-[#8a8266]" />
            <span className="truncate">{node.name}</span>
          </button>
          {open &&
            sortNodes(node.children).map((c) => renderNode(c, depth + 1))}
        </div>
      )
    }
    const active = sandpack.activeFile === node.path
    return (
      <button
        key={node.path}
        onClick={() => sandpack.setActiveFile(node.path)}
        onContextMenu={(e) => openMenu(e, node)}
        style={pad}
        className={`flex w-full items-center gap-1.5 py-1 pr-2 text-left text-[12.5px] hover:bg-[#FFF3C4] ${
          active ? 'bg-[#FFD700] text-[#222222]' : 'text-[#6b6659]'
        }`}
      >
        <File className="h-3.5 w-3.5 shrink-0 text-[#a89f80]" />
        <span className="truncate">{node.name}</span>
      </button>
    )
  }

  return (
    <div
      className="relative h-full w-52 shrink-0 overflow-y-auto border-r-2 border-[#222222] bg-[#FFFDF5] py-1"
      onContextMenu={(e) => openMenu(e, root)}
    >
      {sortNodes(root.children).map((c) => renderNode(c, 0))}

      {menu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenu(null)} />
          <div
            className="fixed z-50 w-40 rounded-lg border-2 border-[#222222] bg-white p-1"
            style={{ top: menu.y, left: menu.x, boxShadow: '4px 4px 0 #222' }}
          >
            <button
              onClick={() => {
                setModal({ kind: 'file', base: menu.node.dir ? menu.node.path : '' })
                setMenu(null)
              }}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-[#222222] hover:bg-[#FFF3C4]"
            >
              <FilePlus className="h-3.5 w-3.5" /> New file
            </button>
            <button
              onClick={() => {
                setModal({ kind: 'folder', base: menu.node.dir ? menu.node.path : '' })
                setMenu(null)
              }}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-[#222222] hover:bg-[#FFF3C4]"
            >
              <FolderPlus className="h-3.5 w-3.5" /> New folder
            </button>
            {menu.node.path && (
              <button
                onClick={() => {
                  onDelete(menu.node.path)
                  setMenu(null)
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-red-600 hover:bg-[#FFF3C4]"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            )}
          </div>
        </>
      )}

      {modal && (
        <NameModal
          kind={modal.kind}
          base={modal.base}
          onClose={() => setModal(null)}
          onSubmit={(name) => {
            const clean = name.replace(/^\/+|\/+$/g, '').trim()
            if (clean) {
              const full = `${modal.base}/${clean}`
              if (modal.kind === 'file') onCreateFile(full)
              else onCreateFolder(full)
            }
            setModal(null)
          }}
        />
      )}
    </div>
  )
}

function NameModal({
  kind,
  base,
  onClose,
  onSubmit,
}: {
  kind: 'file' | 'folder'
  base: string
  onClose: () => void
  onSubmit: (name: string) => void
}) {
  const [value, setValue] = useState('')
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border-2 border-[#222222] bg-white p-5"
        style={{ boxShadow: '6px 6px 0 #222' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[15px] font-medium text-[#222222]">
          New {kind} {base && <span className="text-[#8a8266]">in {base}/</span>}
        </h2>
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit(value)
            if (e.key === 'Escape') onClose()
          }}
          placeholder={kind === 'file' ? 'Button.tsx' : 'components'}
          className="mt-4 w-full select-text rounded-lg border-2 border-[#222222] bg-white px-3 py-2 text-[14px] text-[#222222] outline-none focus:border-[#D9A400]"
        />
        <div className="mt-5 flex justify-end gap-2 text-[13px]">
          <button
            onClick={onClose}
            className="rounded-lg px-3.5 py-1.5 text-[#6b6659] hover:text-[#222222]"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(value)}
            disabled={!value.trim()}
            className="rounded-lg border-2 border-[#222222] bg-[#FFD700] px-3.5 py-1.5 font-medium text-[#222222] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            style={{ boxShadow: '3px 3px 0 #222' }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
