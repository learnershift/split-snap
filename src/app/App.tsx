import { useState } from 'react'

import { sameParticipantName, trimToCodePointLimit } from '../domain/text'

export function App() {
  const [preTaxTotal, setPreTaxTotal] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [payer, setPayer] = useState('Person 1')
  const [monetaryLabel, setMonetaryLabel] = useState('')
  const [participantNames, setParticipantNames] = useState(['Person 1', 'Person 2'])
  const [participantError, setParticipantError] = useState('')
  const [nameError, setNameError] = useState('')
  const [precision, setPrecision] = useState('0')

  function calculateSplit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const hasBlankName = participantNames.some((name) => name.trim() === '')
    const hasDuplicateName = participantNames.some((name, index) =>
      participantNames.slice(index + 1).some((otherName) => sameParticipantName(name, otherName)),
    )

    if (hasBlankName || hasDuplicateName) {
      setNameError('Enter unique participant names.')
      return
    }

    setNameError('')
    setResult(Number(preTaxTotal) / 2)
  }

  function addParticipant() {
    if (participantNames.length === 8) {
      setParticipantError('Use between 2 and 8 participants.')
      return
    }

    setParticipantNames([...participantNames, `Person ${participantNames.length + 1}`])
    setParticipantError('')
  }

  function removeParticipant() {
    if (participantNames.length === 2) {
      setParticipantError('Use between 2 and 8 participants.')
      return
    }

    setParticipantNames(participantNames.slice(0, -1))
    setParticipantError('')
  }

  function updateParticipantName(index: number, value: string) {
    setParticipantNames(
      participantNames.map((name, currentIndex) =>
        currentIndex === index ? trimToCodePointLimit(value, 40) : name,
      ),
    )
  }

  return (
    <main aria-label="SplitSnap bill">
      <h1>SplitSnap</h1>
      <form aria-label="Bill details" onSubmit={calculateSplit}>
        <p>Enter a bill to calculate an exact split.</p>
        <label htmlFor="pre-tax-total">Pre-tax total</label>
        <input
          id="pre-tax-total"
          inputMode="decimal"
          onChange={(event) => setPreTaxTotal(event.target.value)}
          value={preTaxTotal}
        />
        <fieldset>
          <legend>Participants</legend>
          {participantNames.map((name, index) => (
            <div key={index}>
              <label htmlFor={`participant-${index + 1}-name`}>Participant {index + 1} name</label>
              <input
                id={`participant-${index + 1}-name`}
                onChange={(event) => updateParticipantName(index, event.target.value)}
                value={name}
              />
            </div>
          ))}
          <button onClick={addParticipant} type="button">Add participant</button>
          <button onClick={removeParticipant} type="button">Remove participant</button>
          {participantError ? <p role="alert">{participantError}</p> : null}
          {nameError ? <p role="alert">{nameError}</p> : null}
        </fieldset>
        <label htmlFor="payer">Payer</label>
        <select id="payer" onChange={(event) => setPayer(event.target.value)} value={payer}>
          <option>Person 1</option>
          <option>Person 2</option>
        </select>
        <label htmlFor="monetary-label">Monetary label</label>
        <input
          id="monetary-label"
          onChange={(event) => setMonetaryLabel(trimToCodePointLimit(event.target.value, 12))}
          value={monetaryLabel}
        />
        <label htmlFor="decimal-precision">Decimal precision</label>
        <select id="decimal-precision" onChange={(event) => setPrecision(event.target.value)} value={precision}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <section aria-label="Split settings">
          <p>Payer: {payer}</p>
          <p>Monetary label: {monetaryLabel}</p>
          <p>Decimal precision: {precision}</p>
        </section>
        <button type="submit">Calculate split</button>
        {result !== null ? (
          <output aria-live="polite" role="status">
            <p>Person 1: {result}</p>
            <p>Person 2: {result}</p>
          </output>
        ) : null}
      </form>
    </main>
  )
}
