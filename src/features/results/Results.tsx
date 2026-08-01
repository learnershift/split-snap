import { formatUnits } from '../../domain/format'

export function Results({
  allocations,
  grandTotalUnits,
  owedUnits,
  payerName,
  precision,
  recipientIndexes = [],
}: {
  allocations: bigint[]
  grandTotalUnits: bigint
  owedUnits: bigint[]
  payerName: string
  precision: number
  recipientIndexes?: number[]
}) {
  return (
    <section aria-label="Split result">
      <p>Grand total: {formatUnits(grandTotalUnits, precision)}</p>
      <p>Payer: {payerName}</p>
      {allocations.map((allocation, index) => (
        <div key={index}>
          <p>Person {index + 1} allocation: {formatUnits(allocation, precision)}</p>
          <p>Person {index + 1} owed: {formatUnits(owedUnits[index], precision)}</p>
        </div>
      ))}
      {recipientIndexes.map((index) => (
        <p key={`rounding-${index}`}>Rounding: Person {index + 1} received +1 unit.</p>
      ))}
    </section>
  )
}
