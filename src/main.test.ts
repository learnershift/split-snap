import { expect, it, vi } from 'vitest'

it('registers an app-owned worker and checks it again when the window regains focus', async () => {
  const original = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker')
  const waitingWorker = { postMessage: vi.fn() } as unknown as ServiceWorker
  const registration = Object.assign(new EventTarget(), {
    waiting: waitingWorker,
    installing: new EventTarget() as ServiceWorker,
    update: vi.fn(() => Promise.resolve()),
  }) as unknown as ServiceWorkerRegistration
  const serviceWorker = Object.assign(new EventTarget(), {
    register: vi.fn(() => Promise.resolve(registration)),
    getRegistration: vi.fn(() => Promise.resolve(registration)),
  }) as unknown as ServiceWorkerContainer

  Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: serviceWorker })
  document.body.innerHTML = '<div id="root"></div>'
  vi.resetModules()
  await import('./main')
  await Promise.resolve()

  expect(serviceWorker.register).toHaveBeenCalledWith('/split-snap/sw.js', { scope: '/split-snap/' })
  window.dispatchEvent(new Event('focus'))
  expect(registration.update).toHaveBeenCalled()
  window.dispatchEvent(new Event('splitsnap:accept-update'))
  await Promise.resolve()
  expect(waitingWorker.postMessage).toHaveBeenCalledWith('SKIP_WAITING')

  if (original) Object.defineProperty(navigator, 'serviceWorker', original)
  else delete (navigator as unknown as { serviceWorker?: ServiceWorkerContainer }).serviceWorker
})
