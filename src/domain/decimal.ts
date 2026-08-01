export function parseDecimalToUnits(value: string, precision: number): bigint {
  const parts = value.replace(',', '.').split('.')
  const whole = parts[0]
  const fraction = parts[1] ?? ''

  return BigInt(`${whole}${fraction.padEnd(precision, '0')}`)
}
