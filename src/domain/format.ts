export function formatUnits(units: bigint, precision: number): string {
  const digits = units.toString()

  if (precision === 0) {
    return digits
  }

  const padded = digits.padStart(precision + 1, '0')
  return `${padded.slice(0, -precision)}.${padded.slice(-precision)}`
}
