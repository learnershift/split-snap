import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/App'
import './styles.css'

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/split-snap/sw.js', { scope: '/split-snap/' }).then((registration) => {
    registration.addEventListener('updatefound', () => {
      registration.installing?.addEventListener('statechange', () => {
        if (registration.waiting && navigator.serviceWorker.controller) {
          window.dispatchEvent(new Event('splitsnap:update-ready'))
        }
      })
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
