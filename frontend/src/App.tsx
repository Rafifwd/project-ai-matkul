import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { SessionProvider } from './session'
import Shell from './components/layout/Shell'
import Foot from './components/layout/Foot'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import CareerPage from './pages/CareerPage'
import MapPage from './pages/MapPage'
import ValidatePage from './pages/ValidatePage'
import EnginePage from './pages/EnginePage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

function NotFound() {
  return (
    <div className="mx-auto max-w-sheet px-5 py-24 md:px-10">
      <p className="label">404</p>
      <h1 className="display mt-4 text-[clamp(2.6rem,7vw,5rem)]">Halaman tidak ada.</h1>
      <a href="/" className="link-quiet mt-6 inline-block text-[13px]">
        ← Beranda
      </a>
    </div>
  )
}

export default function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="grain flex min-h-screen flex-col">
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-[13px] focus:text-[color:var(--paper)]"
          >
            Lewati ke konten
          </a>
          <Shell />
          <main id="main" className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/catalog/:name" element={<CareerPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/validate" element={<ValidatePage />} />
              <Route path="/engine" element={<EnginePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Foot />
        </div>
      </BrowserRouter>
    </SessionProvider>
  )
}
