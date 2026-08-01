import { useState } from 'react'

export function App() {
  const [preTaxTotal, setPreTaxTotal] = useState('')
  const [result, setResult] = useState<number | null>(null)

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
