export type ShareParseResult = { ok: true; value: bigint } | { ok: false; code: 'share_positive_integer' }

export function parseShare(value: string): ShareParseResult {
  if (!/^[1-9]\d*$/.test(value)) {
    return { ok: false, code: 'share_positive_integer' }
  }

  return { ok: true, value: BigInt(value) }
}
