import { TemplatesGallery } from '../marketing/TemplatesGallery'

/** Route "/app/templates" — the templates gallery inside the authed shell
 *  (sidebar provided by AppShell). Cards open the shared preview at /p/:token. */
export function AppTemplates() {
  return (
    <main className="h-full overflow-y-auto bg-[#FFFDF5] px-8 py-14 text-[#222222] sm:px-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight sm:text-4xl">Templates</h1>
        <p className="mb-9 max-w-2xl text-[15px] leading-relaxed text-[#6b6659]">
          Start from a ready-made Stellar dApp wired to audited contracts. Preview
          one and clone it to make it yours.
        </p>
        <TemplatesGallery />
      </div>
    </main>
  )
}
