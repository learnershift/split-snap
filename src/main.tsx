import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/App'
import './styles.css'

if ('serviceWorker' in navigator) {
  let waitingWorker: ServiceWorker | undefined
  navigator.serviceWorker.register('/split-snap/sw.js', { scope: '/split-snap/' }).then((registration) => {
    registration.addEventListener('updatefound', () => {
      registration.installing?.addEventListener('statechange', () => {
        if (registration.waiting && navigator.serviceWorker.controller) {
          waitingWorker = registration.waiting
          window.dispatchEvent(new Event('splitsnap:update-ready'))
        }
      })
    })
  })
  window.addEventListener('splitsnap:accept-update', () => waitingWorker?.postMessage('SKIP_WAITING'))
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (sessionStorage.getItem('split-snap:update-reloaded') !== '1') {
      sessionStorage.setItem('split-snap:update-reloaded', '1')
      location.reload()
    }
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
