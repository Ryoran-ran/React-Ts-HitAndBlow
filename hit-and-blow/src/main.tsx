import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
// import App from './App.tsx'
import AppPlay from './game/play/Play.tsx'
import AppMenu from './game/menu/Menu.tsx'
import AppAchievement from './game/achievement/Achievement.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppMenu />} />
        <Route path="/play" element={<AppPlay />} />
        <Route path="/achievements" element={<AppAchievement />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
