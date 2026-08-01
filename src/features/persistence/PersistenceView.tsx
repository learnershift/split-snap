import { useState } from 'react'

export function Persistence() {
  const [confirmingStartOver, setConfirmingStartOver] = useState(false)
  const [confirmingDeleteAll, setConfirmingDeleteAll] = useState(false)

  function confirmStartOver() {
    localStorage.removeItem('split-snap:v1:draft')
    setConfirmingStartOver(false)
  }

  function confirmDeleteAll() {
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index)
      if (key?.startsWith('split-snap:')) localStorage.removeItem(key)
    }
    setConfirmingDeleteAll(false)
  }

  return (
    <section aria-label="Local data controls">
      <button onClick={() => setConfirmingStartOver(true)} type="button">Start over</button>
      <button onClick={() => setConfirmingDeleteAll(true)} type="button">Delete all local data</button>
      {confirmingStartOver ? (
        <div aria-label="Confirm start over" role="dialog">
          <p>Delete the active draft?</p>
          <button onClick={confirmStartOver} type="button">Confirm start over</button>
          <button onClick={() => setConfirmingStartOver(false)} type="button">Cancel start over</button>
        </div>
      ) : null}
      {confirmingDeleteAll ? (
        <div aria-label="Confirm delete all local data" role="dialog">
          <p>Delete all SplitSnap local data?</p>
          <button onClick={confirmDeleteAll} type="button">Confirm delete all local data</button>
          <button onClick={() => setConfirmingDeleteAll(false)} type="button">Cancel delete all local data</button>
        </div>
      ) : null}
    </section>
  )
}
