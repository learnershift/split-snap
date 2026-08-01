import { normalizeRational, type Rational } from './rational'

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
