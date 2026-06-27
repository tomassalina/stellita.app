import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { MarketingLanding } from './pages/MarketingLanding'
import { BuildHome } from './pages/BuildHome'
import { Editor } from './pages/Editor'
import { Profile } from './pages/Profile'

/** Public marketing landing at "/"; the authed app lives under the shell. */
function App() {
  return (
    <Routes>
      <Route path="/" element={<MarketingLanding />} />
      <Route element={<AppShell />}>
        <Route path="/app" element={<BuildHome />} />
        <Route path="/projects/:slug" element={<Editor />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
