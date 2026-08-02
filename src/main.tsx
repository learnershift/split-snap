import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './app/App'
import './styles.css'

if ('serviceWorker' in navigator) {
  let waitingWorker: ServiceWorker | undefined
  let acceptingUpdate = false
  navigator.serviceWorker.register('/split-snap/sw.js', { scope: '/split-snap/' }).then((registration) => {
    const announceWaiting = () => {
      if (registration.waiting) {
        waitingWorker = registration.waiting
        window.__splitSnapUpdateReady = true
        window.dispatchEvent(new Event('splitsnap:update-ready'))
      }
    }
    announceWaiting()
    registration.addEventListener('updatefound', () => {
      registration.installing?.addEventListener('statechange', () => {
        announceWaiting()
      })
    })
    window.addEventListener('focus', () => {
      void registration.update()
    })
  })
  window.addEventListener('splitsnap:accept-update', async () => {
    acceptingUpdate = true
    const registration = await navigator.serviceWorker.getRegistration('/split-snap/')
    ;(waitingWorker ?? registration?.waiting)?.postMessage('SKIP_WAITING')
  })
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (acceptingUpdate && sessionStorage.getItem('split-snap:update-reloaded') !== '1') {
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
