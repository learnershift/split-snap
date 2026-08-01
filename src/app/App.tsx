import { useState } from 'react'

export function App() {
  const [preTaxTotal, setPreTaxTotal] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [payer, setPayer] = useState('Person 1')
  const [monetaryLabel, setMonetaryLabel] = useState('')
  const [precision, setPrecision] = useState('0')

  function calculateSplit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(Number(preTaxTotal) / 2)
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
          <p>Person 1</p>
          <p>Person 2</p>
        </fieldset>
        <label htmlFor="payer">Payer</label>
        <select id="payer" onChange={(event) => setPayer(event.target.value)} value={payer}>
          <option>Person 1</option>
          <option>Person 2</option>
        </select>
        <label htmlFor="monetary-label">Monetary label</label>
        <input
          id="monetary-label"
          onChange={(event) => setMonetaryLabel(event.target.value)}
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
