import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { SplashScreen } from './components/SplashScreen'
import { AppStoreProvider } from './data/store'
import { ContactPage } from './pages/ContactPage'
import { GalleryPage } from './pages/GalleryPage'
import { HomePage } from './pages/HomePage'
import { ReviewsPage } from './pages/ReviewsPage'

const SPLASH_SESSION_KEY = 'og-autospa-splash-seen'

function readSplashSeen(): boolean {
  try {
    return sessionStorage.getItem(SPLASH_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export default function App() {
  const [showSplash, setShowSplash] = useState(() => !readSplashSeen())

  return (
    <AppStoreProvider>
      {showSplash && (
        <SplashScreen
          onDone={() => {
            try {
              sessionStorage.setItem(SPLASH_SESSION_KEY, '1')
            } catch {
              /* ignore */
            }
            setShowSplash(false)
          }}
        />
      )}
      {!showSplash && (
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </AppStoreProvider>
  )
}
