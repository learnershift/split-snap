import { normalizeRational, type Rational } from './rational'
import { addFixedAdditions, calculatePercentageAddition } from './additions'
import { decomposeQuickEntitlements, reconcileQuickEntitlements } from './allocate.quick'

export type ItemParticipant = { included: boolean; share: bigint }

export function allocateItemEntitlements(itemUnits: bigint, participants: ItemParticipant[]): bigint[] {
  const includedShares = participants.reduce(
    (total, participant) => total + (participant.included ? participant.share : 0n),
    0n,
  )

  return participants.map((participant) =>
    participant.included ? (itemUnits * participant.share) / includedShares : 0n,
  )
}

export function allocateItemRationalEntitlements(itemUnits: bigint, participants: ItemParticipant[]): Rational[] {
  const includedShares = participants.reduce(
    (total, participant) => total + (participant.included ? participant.share : 0n),
    0n,
  )

  return participants.map((participant) =>
    participant.included
      ? normalizeRational(itemUnits * participant.share, includedShares)
      : normalizeRational(0n, 1n),
  )
}

export function calculateItemizedSplit({
  items,
  taxPercentage,
  fixedTipUnits,
}: {
  items: { units: bigint; participants: ItemParticipant[] }[]
  taxPercentage: bigint
  fixedTipUnits: bigint
}) {
  const subtotalUnits = items.reduce((subtotal, item) => subtotal + item.units, 0n)
  const entitlementTotals = items.reduce<Rational[]>(
    (totals, item) => allocateItemRationalEntitlements(item.units, item.participants).map((entitlement, index) => {
      const total = totals[index] ?? normalizeRational(0n, 1n)
      return normalizeRational(
        total.numerator * entitlement.denominator + entitlement.numerator * total.denominator,
        total.denominator * entitlement.denominator,
      )
    }),
    [],
  )
  const taxUnits = calculatePercentageAddition(subtotalUnits, taxPercentage)
  const { grandTotalUnits } = addFixedAdditions(subtotalUnits, taxUnits, fixedTipUnits)
  const entitlements = entitlementTotals.map((entitlement) =>
    normalizeRational(entitlement.numerator * grandTotalUnits, entitlement.denominator * subtotalUnits),
  )
  const reconciliation = reconcileQuickEntitlements(decomposeQuickEntitlements(entitlements, grandTotalUnits))

  return { subtotalUnits, taxUnits, tipUnits: fixedTipUnits, grandTotalUnits, ...reconciliation }
}
