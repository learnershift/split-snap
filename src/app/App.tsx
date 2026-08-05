import { useEffect, useRef, useState } from 'react'

import { parseMoneyInput } from '../domain/decimal'
import { formatUnits } from '../domain/format'
import { sameParticipantName, trimToCodePointLimit } from '../domain/text'
import { validateItemizedSubtotal, validateQuickSubtotal } from '../domain/validate'
import { calculateItemizedSplit } from '../domain/allocate.itemized'
import { calculateQuickSplit } from '../domain/allocate.quick'
import { Persistence } from '../features/persistence/PersistenceView'
import { restoreDraft, saveDraft } from '../features/persistence/persistence'
import { Sharing } from '../features/sharing/Sharing'
import { formatShareText } from '../features/sharing/share-text'

type Participant = { id: string; name: string; share: string }
type Item = { id: string; description: string; amount: string; participants: { included: boolean; share: string }[] }
type ItemizedResult = { allocations: bigint[]; grandTotalUnits: bigint; recipientIndexes: number[] }

function loadDraft() {
  const bytes = localStorage.getItem('split-snap:v1:draft')
  if (bytes === null) return { inputs: null, error: '' }
  const restored = restoreDraft(bytes)
  return restored.ok ? { inputs: restored.inputs, error: '' } : { inputs: null, error: 'Saved draft needs recovery before it can be used.' }
}

export function App() {
  const [loadedDraft] = useState(loadDraft)
  const restoredDraft = loadedDraft.inputs
  const [preTaxTotal, setPreTaxTotal] = useState(() => restoredDraft ? formatUnits(restoredDraft.preTaxTotalUnits, restoredDraft.precision) : '')
  const [result, setResult] = useState<number | ItemizedResult | null>(null)
  const [mode, setMode] = useState(restoredDraft?.mode ?? 'quick')
  const [taxPercentage, setTaxPercentage] = useState(restoredDraft?.taxPercentage ?? '0')
  const [fixedTip, setFixedTip] = useState(restoredDraft?.fixedTip ?? '0')
  const [payerId, setPayerId] = useState(restoredDraft?.payerId ?? 'participant-1')
  const [monetaryLabel, setMonetaryLabel] = useState(() => restoredDraft?.monetaryLabel ?? '')
  const [participants, setParticipants] = useState<Participant[]>(() => restoredDraft && restoredDraft.participants.length >= 2
    ? restoredDraft.participants.map((name, index) => ({ id: `participant-${index + 1}`, name, share: restoredDraft.participantShares?.[index] ?? '1' }))
    : [{ id: 'participant-1', name: 'Person 1', share: '1' }, { id: 'participant-2', name: 'Person 2', share: '1' }])
  const [participantError, setParticipantError] = useState('')
  const [nameError, setNameError] = useState('')
  const [shareError, setShareError] = useState('')
  const [calculationError, setCalculationError] = useState('')
  const [precision, setPrecision] = useState(() => String(restoredDraft?.precision ?? 0))
  const [items, setItems] = useState<Item[]>(() => restoredDraft?.items?.map((item, index) => ({ ...item, id: `item-${index + 1}` })) ?? [])
  const [focusParticipantId, setFocusParticipantId] = useState<string | null>(null)
  const [updateReady, setUpdateReady] = useState(() => window.__splitSnapUpdateReady === true)
  const [updateError, setUpdateError] = useState('')
  const [draftError] = useState(loadedDraft.error)
  const draftHasBeenEdited = useRef(false)

  function markDraftEdited() {
    draftHasBeenEdited.current = true
  }

  function acceptUpdate() {
    const parsedTotal = parseMoneyInput(preTaxTotal, Number(precision))
    if (!parsedTotal.ok || !saveDraft(localStorage, {
      monetaryLabel,
      precision: Number(precision),
      participants: participants.map(({ name }) => name),
      participantShares: participants.map(({ share }) => share),
      preTaxTotalUnits: parsedTotal.units,
      mode, payerId, taxPercentage, fixedTip, items: items.map(({ description, amount, participants: itemParticipants }) => ({ description, amount, participants: itemParticipants })),
    }).ok) {
      setUpdateError('Unable to save draft. Update remains pending.')
      return
    }
    window.dispatchEvent(new Event('splitsnap:accept-update'))
  }

  useEffect(() => {
    if (!draftHasBeenEdited.current) return
    const parsedTotal = parseMoneyInput(preTaxTotal, Number(precision))
    if (!parsedTotal.ok) return
    saveDraft(localStorage, {
      monetaryLabel,
      precision: Number(precision),
      participants: participants.map(({ name }) => name),
      participantShares: participants.map(({ share }) => share),
      preTaxTotalUnits: parsedTotal.units,
      mode, payerId, taxPercentage, fixedTip, items: items.map(({ description, amount, participants: itemParticipants }) => ({ description, amount, participants: itemParticipants })),
    })
  }, [monetaryLabel, participants, preTaxTotal, precision, mode, payerId, taxPercentage, fixedTip, items])

  useEffect(() => {
    const showUpdate = () => setUpdateReady(true)
    window.addEventListener('splitsnap:update-ready', showUpdate)
    return () => window.removeEventListener('splitsnap:update-ready', showUpdate)
  }, [])

  useEffect(() => {
    if (!focusParticipantId) return
    document.getElementById(`${focusParticipantId}-name`)?.focus()
    setFocusParticipantId(null)
  }, [focusParticipantId])

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
    if (mode === 'itemized') {
      if (items.some((item) => item.participants.some((participant) => participant.included && !/^[1-9]\d*$/.test(participant.share)))) {
        setShareError('Enter a positive integer share for every included person.')
        return
      }
      setShareError('')
      const itemizedItems = items.map((item) => {
        const parsedAmount = parseMoneyInput(item.amount, Number(precision))
        return {
          units: parsedAmount.ok ? parsedAmount.units : 0n,
          participants: item.participants.map((participant) => ({ included: participant.included, share: BigInt(participant.share || '0') })),
        }
      })
      const tip = parseMoneyInput(fixedTip, Number(precision))
      const subtotal = itemizedItems.reduce((total, item) => total + item.units, 0n)
      const subtotalValidation = validateItemizedSubtotal(subtotal, tip.ok ? tip.units : 0n)
      if (!subtotalValidation.ok) {
        setCalculationError(subtotalValidation.message ?? 'Add or update items so the pre-tax subtotal is greater than 0.')
        return
      }
      setCalculationError('')
      const split = calculateItemizedSplit({ items: itemizedItems, taxPercentage: BigInt(taxPercentage || '0'), fixedTipUnits: tip.ok ? tip.units : 0n })
      setResult({ allocations: split.allocations, grandTotalUnits: split.grandTotalUnits, recipientIndexes: split.recipientIndexes })
      return
    }
    const subtotal = parseMoneyInput(preTaxTotal, Number(precision))
    const tip = parseMoneyInput(fixedTip, Number(precision))
    if (!subtotal.ok) {
      setCalculationError('Enter a pre-tax total greater than 0.')
      return
    }
    if (!tip.ok) return
    const subtotalValidation = validateQuickSubtotal(subtotal.units, tip.units)
    if (!subtotalValidation.ok) {
      setCalculationError(subtotalValidation.message)
      return
    }
    setCalculationError('')
    if (participants.some((participant) => !/^[1-9]\d*$/.test(participant.share))) {
      setShareError('Enter a positive integer share for every participant.')
      return
    }
    setShareError('')
    const split = calculateQuickSplit({
      subtotalUnits: subtotal.units,
      shares: participants.map((participant) => BigInt(participant.share || '0')),
      taxPercentage: BigInt(taxPercentage || '0'),
      fixedTipUnits: tip.units,
    })
    setResult({ allocations: split.allocations, grandTotalUnits: split.grandTotalUnits, recipientIndexes: split.recipientIndexes })
  }

  function addParticipant() {
    if (participants.length === 8) {
      setParticipantError('Use between 2 and 8 participants.')
      return
    }

    const number = participants.length + 1
    setParticipants([...participants, { id: `participant-${number}`, name: `Person ${number}`, share: '1' }])
    setItems(items.map((item) => ({ ...item, participants: [...item.participants, { included: true, share: '1' }] })))
    setResult(null)
    setParticipantError('')
    setFocusParticipantId(`participant-${number}`)
  }

  function removeParticipant() {
    if (participants.length === 2) {
      setParticipantError('Use between 2 and 8 participants.')
      return
    }

    const remaining = participants.slice(0, -1)
    setParticipants(remaining)
    setResult(null)
    setParticipantError('')
    setFocusParticipantId(remaining[remaining.length - 1].id)
  }

  function updateParticipantName(index: number, value: string) {
    markDraftEdited()
    setParticipants(
      participants.map((participant, currentIndex) =>
        currentIndex === index ? { ...participant, name: trimToCodePointLimit(value, 40) } : participant,
      ),
    )
    setResult(null)
  }

  function moveParticipant(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= participants.length) return

    const reordered = [...participants]
    ;[reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]]
    setParticipants(reordered)
    setResult(null)
  }

  function addItem() {
    markDraftEdited()
    const number = items.length + 1
    setItems([...items, { id: `item-${number}`, description: '', amount: '', participants: participants.map(() => ({ included: true, share: '1' })) }])
    setResult(null)
  }

  function updateItem(index: number, field: 'description' | 'amount', value: string) {
    markDraftEdited()
    setItems(items.map((item, currentIndex) => currentIndex === index ? { ...item, [field]: value } : item))
    setResult(null)
  }

  function updateItemParticipant(itemIndex: number, participantIndex: number, field: 'included' | 'share', value: boolean | string) {
    markDraftEdited()
    setItems(items.map((item, currentItemIndex) => currentItemIndex !== itemIndex ? item : {
      ...item,
      participants: item.participants.map((participant, currentParticipantIndex) => currentParticipantIndex !== participantIndex ? participant : { ...participant, [field]: value }),
    }))
    setResult(null)
  }

  function resetActiveBill() {
    setPreTaxTotal('')
    setMode('quick')
    setTaxPercentage('0')
    setFixedTip('0')
    setPayerId('participant-1')
    setMonetaryLabel('')
    setPrecision('0')
    setParticipants([{ id: 'participant-1', name: 'Person 1', share: '1' }, { id: 'participant-2', name: 'Person 2', share: '1' }])
    setItems([])
    setResult(null)
    setNameError('')
    setShareError('')
    draftHasBeenEdited.current = false
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
        {draftError ? <p role="alert">{draftError}</p> : null}
        <p>Enter a bill to calculate an exact split.</p>
        <label htmlFor="mode">Mode</label>
        <select id="mode" onChange={(event) => { markDraftEdited(); setMode(event.target.value); setResult(null) }} value={mode}>
          <option value="quick">Quick</option><option value="itemized">Itemized</option>
        </select>
        <label htmlFor="pre-tax-total">Pre-tax total</label>
        <input
          id="pre-tax-total"
          inputMode="decimal"
          onChange={(event) => { markDraftEdited(); setPreTaxTotal(event.target.value); setResult(null) }}
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
              {mode === 'itemized' ? item.participants.map((itemParticipant, participantIndex) => (
                <span key={participants[participantIndex].id}>
                  <label htmlFor={`item-${index + 1}-include-${participantIndex + 1}`}>Item {index + 1} include {participants[participantIndex].name}</label>
                  <input checked={itemParticipant.included} id={`item-${index + 1}-include-${participantIndex + 1}`} onChange={(event) => updateItemParticipant(index, participantIndex, 'included', event.target.checked)} type="checkbox" />
                  <label htmlFor={`item-${index + 1}-share-${participantIndex + 1}`}>Item {index + 1} share {participants[participantIndex].name}</label>
                  <input id={`item-${index + 1}-share-${participantIndex + 1}`} inputMode="numeric" onChange={(event) => updateItemParticipant(index, participantIndex, 'share', event.target.value)} value={itemParticipant.share} />
                </span>
              )) : null}
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
              {mode === 'quick' ? (
                <>
                  <label htmlFor={`participant-${index + 1}-quick-share`}>Quick share {participant.name}</label>
                  <input
                    id={`participant-${index + 1}-quick-share`}
                    inputMode="numeric"
                    onChange={(event) => {
                      markDraftEdited()
                      setParticipants(participants.map((current, currentIndex) =>
                        currentIndex === index ? { ...current, share: event.target.value } : current,
                      ))
                      setResult(null)
                    }}
                    value={participant.share}
                  />
                </>
              ) : null}
              {index < participants.length - 1 ? (
                <button onClick={() => moveParticipant(index, 1)} type="button">Move participant {index + 1} down</button>
              ) : null}
            </div>
          ))}
          <button onClick={addParticipant} type="button">Add participant</button>
          <button onClick={removeParticipant} type="button">Remove participant</button>
          {participantError ? <p role="alert">{participantError}</p> : null}
          {nameError ? <p role="alert">{nameError}</p> : null}
          {shareError ? <p role="alert">{shareError}</p> : null}
          {calculationError ? <p role="alert">{calculationError}</p> : null}
        </fieldset>
        <label htmlFor="payer">Payer</label>
        <select
          id="payer"
          onChange={(event) => { markDraftEdited(); setPayerId(event.target.selectedOptions[0].dataset.participantId!); setResult(null) }}
          value={payer.name}
        >
          {participants.map((participant) => (
            <option data-participant-id={participant.id} key={participant.id} value={participant.name}>{participant.name}</option>
          ))}
        </select>
        <label htmlFor="monetary-label">Monetary label</label>
        <input
          id="monetary-label"
          onChange={(event) => { markDraftEdited(); setMonetaryLabel(trimToCodePointLimit(event.target.value, 12)); setResult(null) }}
          value={monetaryLabel}
        />
        <label htmlFor="decimal-precision">Decimal precision</label>
        <select id="decimal-precision" onChange={(event) => { markDraftEdited(); setPrecision(event.target.value); setResult(null) }} value={precision}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
        <label htmlFor="tax-percentage">Tax percentage</label>
        <input id="tax-percentage" inputMode="numeric" onChange={(event) => { markDraftEdited(); setTaxPercentage(event.target.value); setResult(null) }} value={taxPercentage} />
        <label htmlFor="fixed-tip">Fixed tip</label>
        <input id="fixed-tip" inputMode="decimal" onChange={(event) => { markDraftEdited(); setFixedTip(event.target.value); setResult(null) }} value={fixedTip} />
        <section aria-label="Split settings">
          <p>Payer: {payer.name}</p>
          <p>Monetary label: {monetaryLabel}</p>
          <p>Decimal precision: {precision}</p>
        </section>
        <Persistence onStartOver={resetActiveBill} />
        {updateReady ? (
          <section aria-label="Update ready" role="dialog">
            <p>Update ready. Keep the current version until you choose to update.</p>
            <button onClick={() => { setUpdateReady(false); setUpdateError('') }} type="button">Keep current version</button>
            <button onClick={acceptUpdate} type="button">Update now</button>
          </section>
        ) : null}
        {updateError ? <p role="alert">{updateError}</p> : null}
        <button type="submit">Calculate split</button>
        {result !== null ? (
          <output aria-live="polite" role="status">
            {typeof result === 'number' ? <><p>Person 1: {result}</p><p>Person 2: {result}</p></> : <>
              <p>Payer: {payer.name}</p>
              {result.allocations.map((allocation, index) => <div key={participants[index].id}><p>{participants[index].name}: {formatUnits(allocation, Number(precision))}</p><p>{participants[index].name} owed: {formatUnits(index === participants.findIndex((participant) => participant.id === payerId) ? 0n : allocation, Number(precision))}</p></div>)}
              <p>Grand total: {formatUnits(result.grandTotalUnits, Number(precision))}</p>
              {result.recipientIndexes.map((index) => <p key={`rounding-${participants[index].id}`}>Rounding: {participants[index].name} received +1 unit.</p>)}
            </>}
          </output>
        ) : null}
        {result !== null && typeof result === 'object' ? <Sharing text={formatShareText({
          label: monetaryLabel,
          precision: Number(precision),
          payerName: payer.name,
          grandTotalUnits: result.grandTotalUnits,
          participants: result.allocations.map((allocation, index) => ({ name: participants[index].name, allocationUnits: allocation, owedUnits: index === participants.findIndex((participant) => participant.id === payerId) ? 0n : allocation })),
          roundingRecipientName: participants[result.recipientIndexes[0]]?.name ?? payer.name,
          roundingReason: 'largest discarded remainder',
        })} /> : null}
      </form>
    </main>
  )
}
