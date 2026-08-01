export type ShareParseResult = { ok: true; value: bigint } | { ok: false; code: 'share_positive_integer' }

export function parseShare(value: string): ShareParseResult {
  if (!/^[1-9]\d*$/.test(value)) {
    return { ok: false, code: 'share_positive_integer' }
  }

  return { ok: true, value: BigInt(value) }
}

export function validateQuickSubtotal(subtotalUnits: bigint, fixedAdditionUnits: bigint) {
  void fixedAdditionUnits
  return subtotalUnits > 0n
    ? { ok: true as const }
    : { ok: false as const, message: 'Enter a pre-tax total greater than 0.' }
}
