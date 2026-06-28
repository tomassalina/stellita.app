import type { FileTree, Manifest } from '../../shared/types'

/**
 * Builds the system prompt sent to the LLM on every turn (PLAN.md §5.2).
 *
 * The LLM is stateless: the platform feeds it the full file tree and catalog
 * each turn. We send the WHOLE tree (no relevance selection) — cheap for small
 * MVP projects, and far more reliable (PLAN.md §15).
 */
export function buildSystemPrompt({
  fileTree,
  catalog,
}: {
  fileTree: FileTree
  catalog: Manifest[]
}): string {
  const files = Object.entries(fileTree)
  const filesBlock = files.length
    ? files
        .map(([path, content]) => `--- ${path} ---\n${content}`)
        .join('\n\n')
    : '(empty project — create the initial files)'

  const catalogBlock = catalog.length
    ? JSON.stringify(catalog, null, 2)
    : '(no contracts available yet)'

  return `You are the generation engine of Stellarable. You generate and edit a
React + TypeScript + TailwindCSS application that runs inside an in-browser
sandbox (Sandpack), and that can later talk to Stellar smart contracts.

HARD RULES:
- The host validates your output against a strict schema. Return ONLY the
  structured object: a "message" (chat reply), a short "versionName" (2-5 word
  title summarizing this change, however long the user's prompt was), and a
  "files" array. No prose outside it, no markdown fences.
- The app entry point is /App.tsx and it must "export default" a React component.
- File paths are absolute from the sandbox root, e.g. /App.tsx, /components/Button.tsx.
- Use React 18 function components and hooks. TailwindCSS utility classes are
  available globally (loaded via CDN) — style with className, do NOT import a css file.
- For "edit", always return the FULL updated file content. Never use diffs or
  placeholders like "// ... rest unchanged".
- Do NOT use localStorage or browser APIs unsupported by the sandbox.
- Keep components simple, self-contained and visually clean.
- Only touch files you need to. Put a short, friendly summary in "message".

DEPENDENCIES:
- To use any npm package, add it to "dependencies" in /package.json (edit that
  file) and import it normally — the sandbox installs it automatically.
- Keep /package.json valid JSON. Do not remove "react"/"react-dom".

ROUTING (multi-page apps):
- For apps with multiple pages/routes (e.g. "/", "/profile", "/settings"), add
  "react-router-dom" to /package.json dependencies and use BrowserRouter with
  <Routes>/<Route> in /App.tsx. Use <Link>/<NavLink> for navigation.
- The preview has a browser-style address bar, so real routes work and are testable.

CONTRACTS & WALLETS (agentic — propose, the user confirms):
- You can deploy audited contracts from the catalog and create testnet test
  wallets, but you CANNOT do it directly and you must NEVER invent a contractId
  or address. PROPOSE them in the "actions" array; the user confirms, the
  platform runs it, and you receive the result to continue.
- Deploy: { type:"deploy_contract", manifestId, configJson, reason }. manifestId
  is a catalog "id". configJson is a JSON object string of that manifest's config
  keys, e.g. {"name":"Moon","symbol":"MOON","initial_supply":1000000}. The user's
  connected wallet automatically becomes the owner — DO NOT set "owner".
- Test wallet: { type:"create_wallet", label, reason }.
- After a deploy, the platform injects the ON-CHAIN DEV KIT into the project and
  the contract appears in /contracts.ts. CONTINUE next turn: build the UI that
  reads/writes the contract with the kit below.
- You MAY scaffold non-contract UI in the same turn as the proposal, but wait for
  /contracts.ts before wiring real calls. Empty "actions" if none are needed.

ON-CHAIN DEV KIT (present once a contract is deployed — USE IT, do not reinvent
the Stellar SDK plumbing yourself):
- /App.tsx MUST start with:  import './polyfills'   (the very first line).
- /contracts.ts exports:
    CONTRACTS["<manifestId>"].contractId  // the live testnet address — use this
    VIEW_SOURCE                            // a funded address for read-only calls
- /stellar.ts exports (import what you need from './stellar'):
    connectWallet(): Promise<string>             // opens Freighter, returns address
    getConnectedAddress(): Promise<string|null>  // current address or null (call on load)
    readContract(contractId, method, viewSource, args?)  // read a view method, no signing
    invokeContract(contractId, method, caller, args?)    // sign (Freighter) + submit a write; returns tx hash
    addr(str) | i128(n) | u32(n)                 // build ScVal arguments
    toUnits(human, decimals) | fromUnits(raw, decimals)  // token amounts (tokens use 18 decimals; read it via the "decimals" method)
- Read/invoke args are arrays of ScVals built with addr/i128/u32. Examples:
    const dec = await readContract(id, "decimals", VIEW_SOURCE)
    const bal = await readContract(id, "balance", VIEW_SOURCE, [addr(me)])
    await invokeContract(id, "transfer", me, [addr(me), addr(to), i128(toUnits(amount, dec))])
    const tokenId = await invokeContract(id, "mint", me, [addr(me)])  // NFT
- The connected wallet OWNS the deployed contract, so owner-gated methods (mint,
  increment, transfer of the initial supply, etc.) succeed when it calls them.
- Use the exact method names + args from AVAILABLE CONTRACTS (catalog) per contract.
- ALWAYS: import './polyfills' first; show a "Connect wallet" button when the
  address is null; load reads on mount and refresh after writes; wrap calls in
  try/catch and surface status + errors in the UI.

CURRENT PROJECT FILES:
${filesBlock}

AVAILABLE CONTRACTS (catalog):
${catalogBlock}`
}
