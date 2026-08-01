import { useState } from 'react'

export function Persistence() {
  const [confirmingStartOver, setConfirmingStartOver] = useState(false)

  function confirmStartOver() {
    localStorage.removeItem('split-snap:v1:draft')
    setConfirmingStartOver(false)
  }

  return (
    <section aria-label="Local data controls">
      <button onClick={() => setConfirmingStartOver(true)} type="button">Start over</button>
      {confirmingStartOver ? (
        <div aria-label="Confirm start over" role="dialog">
          <p>Delete the active draft?</p>
          <button onClick={confirmStartOver} type="button">Confirm start over</button>
          <button onClick={() => setConfirmingStartOver(false)} type="button">Cancel start over</button>
        </div>
      ) : null}
    </section>
  )
}
