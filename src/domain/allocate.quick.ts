import { normalizeRational, type Rational } from './rational'

export type QuickDecomposition = {
  baseUnits: bigint[]
  discardedRemainders: Rational[]
  remainingUnits: bigint
}

export function decomposeQuickEntitlements(entitlements: Rational[], grandTotalUnits: bigint): QuickDecomposition {
  const baseUnits = entitlements.map(({ numerator, denominator }) => numerator / denominator)
  const discardedRemainders = entitlements.map(({ numerator, denominator }) =>
    normalizeRational(numerator % denominator, denominator),
  )
  const remainingUnits = grandTotalUnits - baseUnits.reduce((total, units) => total + units, 0n)

  return { baseUnits, discardedRemainders, remainingUnits }
}

export function reconcileQuickEntitlements({
  baseUnits,
  discardedRemainders,
  remainingUnits,
}: QuickDecomposition) {
  const recipients = discardedRemainders
    .map((remainder, index) => ({ remainder, index }))
    .sort((left, right) => {
      const comparison = left.remainder.numerator * right.remainder.denominator
        - right.remainder.numerator * left.remainder.denominator
      return comparison === 0n ? left.index - right.index : comparison > 0n ? -1 : 1
    })
  const allocations = [...baseUnits]
  const recipientIndexes: number[] = []
  let undistributed = remainingUnits
  let position = 0

  while (undistributed > 0n) {
    const recipientIndex = recipients[position].index
    allocations[recipientIndex] += 1n
    recipientIndexes.push(recipientIndex)
    undistributed -= 1n
    position += 1
  }

  return { allocations, recipientIndexes }
}
