export function parseDecimalToUnits(value: string, precision: number): bigint {
  const parts = value.replace(',', '.').split('.')
  const whole = parts[0]
  const fraction = parts[1] ?? ''

  return BigInt(`${whole}${fraction.padEnd(precision, '0')}`)
}

export type MoneyParseResult = { ok: true; units: bigint } | { ok: false; code: 'amount_invalid' }

export function parseMoneyInput(value: string, precision: number): MoneyParseResult {
  if (!/^\d+(?:[.,]\d+)?$/.test(value)) {
    return { ok: false, code: 'amount_invalid' }
  }

  return { ok: true, units: parseDecimalToUnits(value, precision) }
}
