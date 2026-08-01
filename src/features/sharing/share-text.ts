import { formatUnits } from '../../domain/format'

type ShareParticipant = { name: string; allocationUnits: bigint; owedUnits: bigint }

export function formatShareText({
  label,
  precision,
  payerName,
  grandTotalUnits,
  participants,
  roundingRecipientName,
  roundingReason,
}: {
  label: string
  precision: number
  payerName: string
  grandTotalUnits: bigint
  participants: ShareParticipant[]
  roundingRecipientName: string
  roundingReason: string
}) {
  const amount = (units: bigint) => `${label} ${formatUnits(units, precision)}`
  const totalOwed = participants.reduce((total, participant) => total + participant.owedUnits, 0n)
  const participantLines = participants.map((participant) =>
    `- ${participant.name}: ${amount(participant.allocationUnits)}; owes ${payerName}: ${amount(participant.owedUnits)}${participant.name === payerName ? ' (payer)' : ''}`,
  )

  return [
    'SplitSnap',
    `Monetary label: ${label}`,
    `Precision: ${precision}`,
    `Payer: ${payerName}`,
    `Grand total: ${amount(grandTotalUnits)}`,
    'Allocations:',
    ...participantLines,
    `Total owed to ${payerName}: ${amount(totalOwed)}`,
    `Rounding: ${roundingRecipientName} received +${amount(1n)} because ${roundingReason === 'largest discarded remainder' ? `${roundingRecipientName} had the ${roundingReason}` : roundingReason}.`,
    '',
  ].join('\n')
}
