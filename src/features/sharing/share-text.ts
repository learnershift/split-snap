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
  const sanitize = (value: string) => Array.from(value, (character) => {
    const codePoint = character.codePointAt(0)!
    return codePoint <= 31 || codePoint === 127 ? ' ' : character
  }).join('')
  const safeLabel = sanitize(label)
  const safePayerName = sanitize(payerName)
  const amount = (units: bigint) => `${safeLabel} ${formatUnits(units, precision)}`
  const totalOwed = participants.reduce((total, participant) => total + participant.owedUnits, 0n)
  const participantLines = participants.map((participant) =>
    `- ${sanitize(participant.name)}: ${amount(participant.allocationUnits)}; owes ${safePayerName}: ${amount(participant.owedUnits)}${participant.name === payerName ? ' (payer)' : ''}`,
  )

  return [
    'SplitSnap',
    `Monetary label: ${safeLabel}`,
    `Precision: ${precision}`,
    `Payer: ${safePayerName}`,
    `Grand total: ${amount(grandTotalUnits)}`,
    'Allocations:',
    ...participantLines,
    `Total owed to ${safePayerName}: ${amount(totalOwed)}`,
    `Rounding: ${sanitize(roundingRecipientName)} received +${amount(1n)} because ${roundingReason === 'largest discarded remainder' ? `${sanitize(roundingRecipientName)} had the ${roundingReason}` : sanitize(roundingReason)}.`,
    '',
  ].join('\n')
}
