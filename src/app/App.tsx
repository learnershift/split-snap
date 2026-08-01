import { useState } from 'react'

import { parseMoneyInput } from '../domain/decimal'
import { formatUnits } from '../domain/format'
import { sameParticipantName, trimToCodePointLimit } from '../domain/text'

type Participant = { id: string; name: string }
type Item = { id: string; description: string; amount: string }

export function App() {
  const [preTaxTotal, setPreTaxTotal] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [payerId, setPayerId] = useState('participant-1')
  const [monetaryLabel, setMonetaryLabel] = useState('')
  const [participants, setParticipants] = useState<Participant[]>([
    { id: 'participant-1', name: 'Person 1' },
    { id: 'participant-2', name: 'Person 2' },
  ])
  const [participantError, setParticipantError] = useState('')
  const [nameError, setNameError] = useState('')
  const [precision, setPrecision] = useState('0')
  const [items, setItems] = useState<Item[]>([])

  function calculateSplit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const hasBlankName = participants.some(({ name }) => name.trim() === '')
    const hasDuplicateName = participants.some(({ name }, index) =>
      participants.slice(index + 1).some(({ name: otherName }) => sameParticipantName(name, otherName)),
    )

    if (hasBlankName || hasDuplicateName) {
      setNameError('Enter unique participant names.')
      return
    }

    setNameError('')
    setResult(Number(preTaxTotal) / 2)
  }

  function addParticipant() {
    if (participants.length === 8) {
      setParticipantError('Use between 2 and 8 participants.')
      return
    }

    const number = participants.length + 1
    setParticipants([...participants, { id: `participant-${number}`, name: `Person ${number}` }])
    setParticipantError('')
  }

  function removeParticipant() {
    if (participants.length === 2) {
      setParticipantError('Use between 2 and 8 participants.')
      return
    }

    setParticipants(participants.slice(0, -1))
    setParticipantError('')
  }

  function updateParticipantName(index: number, value: string) {
    setParticipants(
      participants.map((participant, currentIndex) =>
        currentIndex === index ? { ...participant, name: trimToCodePointLimit(value, 40) } : participant,
      ),
    )
  }

  function moveParticipant(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= participants.length) return

    const reordered = [...participants]
    ;[reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]]
    setParticipants(reordered)
  }

  function addItem() {
    const number = items.length + 1
    setItems([...items, { id: `item-${number}`, description: '', amount: '' }])
  }

  function updateItem(index: number, field: 'description' | 'amount', value: string) {
    setItems(items.map((item, currentIndex) => currentIndex === index ? { ...item, [field]: value } : item))
  }

  const payer = participants.find((participant) => participant.id === payerId) as Participant
  const subtotalUnits = items.reduce((subtotal, item) => {
    const parsed = parseMoneyInput(item.amount, Number(precision))
    return parsed.ok ? subtotal + parsed.units : subtotal
  }, 0n)

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
          <legend>Items</legend>
          {items.map((item, index) => (
            <div key={item.id}>
              <label htmlFor={`item-${index + 1}-description`}>Item {index + 1} description</label>
              <input
                id={`item-${index + 1}-description`}
                onChange={(event) => updateItem(index, 'description', event.target.value)}
                value={item.description}
              />
              <label htmlFor={`item-${index + 1}-amount`}>Item {index + 1} amount</label>
              <input
                id={`item-${index + 1}-amount`}
                inputMode="decimal"
                onChange={(event) => updateItem(index, 'amount', event.target.value)}
                value={item.amount}
              />
            </div>
          ))}
          <button onClick={addItem} type="button">Add item</button>
          <p>Subtotal: {formatUnits(subtotalUnits, Number(precision))}</p>
        </fieldset>
        <fieldset>
          <legend>Participants</legend>
          {participants.map((participant, index) => (
            <div key={participant.id}>
              <label htmlFor={`participant-${index + 1}-name`}>Participant {index + 1} name</label>
              <input
                id={`participant-${index + 1}-name`}
                onChange={(event) => updateParticipantName(index, event.target.value)}
                value={participant.name}
              />
              {index < participants.length - 1 ? (
                <button onClick={() => moveParticipant(index, 1)} type="button">Move participant {index + 1} down</button>
              ) : null}
            </div>
          ))}
          <button onClick={addParticipant} type="button">Add participant</button>
          <button onClick={removeParticipant} type="button">Remove participant</button>
          {participantError ? <p role="alert">{participantError}</p> : null}
          {nameError ? <p role="alert">{nameError}</p> : null}
        </fieldset>
        <label htmlFor="payer">Payer</label>
        <select
          id="payer"
          onChange={(event) => setPayerId(event.target.selectedOptions[0].dataset.participantId!)}
          value={payer.name}
        >
          {participants.map((participant) => (
            <option data-participant-id={participant.id} key={participant.id} value={participant.name}>{participant.name}</option>
          ))}
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
          <p>Payer: {payer.name}</p>
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
