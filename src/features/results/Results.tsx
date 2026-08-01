import { formatUnits } from '../../domain/format'

export function Results({
  allocations,
  grandTotalUnits,
  owedUnits,
  payerName,
  precision,
}: {
  allocations: bigint[]
  grandTotalUnits: bigint
  owedUnits: bigint[]
  payerName: string
  precision: number
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
    </section>
  )
}
