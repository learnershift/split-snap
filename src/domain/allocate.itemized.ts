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
