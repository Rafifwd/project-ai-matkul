import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import CareersPage from './pages/CareersPage'
import CareerDetailPage from './pages/CareerDetailPage'
import DiscoverPage from './pages/DiscoverPage'
import ValidatePage from './pages/ValidatePage'
import ModelInfoPage from './pages/ModelInfoPage'

export default function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:name" element={<CareerDetailPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/validate" element={<ValidatePage />} />
            <Route path="/model" element={<ModelInfoPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
