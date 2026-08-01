import { normalizeRational, type Rational } from './rational'

export function decomposeQuickEntitlements(entitlements: Rational[], grandTotalUnits: bigint) {
  const baseUnits = entitlements.map(({ numerator, denominator }) => numerator / denominator)
  const discardedRemainders = entitlements.map(({ numerator, denominator }) =>
    normalizeRational(numerator % denominator, denominator),
  )
  const remainingUnits = grandTotalUnits - baseUnits.reduce((total, units) => total + units, 0n)

  return { baseUnits, discardedRemainders, remainingUnits }
}
