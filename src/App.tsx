import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { TopBar } from './components/TopBar'
import { Sidebar } from './components/Sidebar'
import { Landing } from './pages/Landing'
import { Editor } from './pages/Editor'

/** Platform layout: collapsible sidebar + (top bar + routed body). */
function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-full bg-black text-zinc-50">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onToggleSidebar={() => setSidebarCollapsed((c) => !c)} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/projects/:slug" element={<Editor />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
